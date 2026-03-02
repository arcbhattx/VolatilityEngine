"""
VolatilityEngine - FastAPI Backend
Analyzes historical price data and forecasts short-term volatility.
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

from schema.models import VolatilityResponse, PriceHistoryResponse, MarketSummaryResponse, CompareResponse

app = FastAPI(
    title="VolatilityEngine API",
    description="Stock volatility prediction using historical price data",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _annualized_vol(returns: pd.Series, window: int) -> float:
    """Rolling std of log returns, annualized."""
    return float(returns.rolling(window).std().iloc[-1] * np.sqrt(252) * 100)


def _risk_label(vol: float) -> str:
    if vol < 15:
        return "LOW"
    elif vol < 30:
        return "MEDIUM"
    elif vol < 50:
        return "HIGH"
    return "EXTREME"


def _fetch_history(ticker: str, period: str = "6mo") -> pd.DataFrame:
    tk = yf.Ticker(ticker)
    df = tk.history(period=period)
    if df.empty:
        raise HTTPException(status_code=404, detail=f"No data found for ticker '{ticker}'")
    df["log_return"] = np.log(df["Close"] / df["Close"].shift(1))
    return df


def _predict_next7d_vol(returns: pd.Series) -> tuple[float, float]:
    """
    Simple EWMA-based 7-day forecast.
    Returns (predicted_vol_pct, confidence_0_to_1).
    """
    lam = 0.94
    ewma_var = returns.ewm(alpha=1 - lam, adjust=False).var()
    predicted = float(np.sqrt(ewma_var.iloc[-1] * 7) * 100)  # 7-day horizon
    # Confidence based on data density (more data = higher confidence, capped)
    confidence = min(0.95, 0.5 + len(returns) / 1000)
    return round(predicted, 2), round(confidence, 2)


# ─── Routes ──────────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "service": "VolatilityEngine API"}


@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@app.get("/volatility/{ticker}", response_model=VolatilityResponse, tags=["Volatility"])
def get_volatility(
    ticker: str,
    period: str = Query(default="6mo", description="Data period: 1mo, 3mo, 6mo, 1y, 2y"),
):
    """
    Core endpoint. Returns historical volatility metrics, risk level,
    and a 7-day forward volatility forecast for a given ticker.
    """
    ticker = ticker.upper()
    df = _fetch_history(ticker, period)
    returns = df["log_return"].dropna()

    hv_30d = _annualized_vol(returns, 30)
    hv_7d  = _annualized_vol(returns, 7)
    avg_ret = float(returns.mean() * 100)

    # Max drawdown
    roll_max = df["Close"].cummax()
    drawdown = (df["Close"] - roll_max) / roll_max
    max_dd = float(drawdown.min() * 100)

    pred_vol, confidence = _predict_next7d_vol(returns)

    return VolatilityResponse(
        ticker=ticker,
        period=period,
        current_price=round(float(df["Close"].iloc[-1]), 2),
        historical_volatility_30d=round(hv_30d, 2),
        historical_volatility_7d=round(hv_7d, 2),
        avg_daily_return=round(avg_ret, 4),
        max_drawdown=round(max_dd, 2),
        risk_level=_risk_label(hv_30d),
        predicted_7d_volatility=pred_vol,
        confidence=confidence,
    )


@app.get("/history/{ticker}", response_model=PriceHistoryResponse, tags=["Price History"])
def get_price_history(
    ticker: str,
    period: str = Query(default="6mo"),
):
    """
    Returns OHLCV data, daily log returns, and rolling 30-day volatility
    for charting in the frontend.
    """
    ticker = ticker.upper()
    df = _fetch_history(ticker, period)

    rolling_vol = (
        df["log_return"]
        .rolling(30)
        .std()
        .mul(np.sqrt(252) * 100)
        .round(2)
    )

    return PriceHistoryResponse(
        ticker=ticker,
        dates=[d.strftime("%Y-%m-%d") for d in df.index],
        closes=[round(float(c), 2) for c in df["Close"]],
        volumes=[int(v) for v in df["Volume"]],
        daily_returns=[round(float(r) * 100, 4) for r in df["log_return"].fillna(0)],
        rolling_volatility_30d=[
            round(float(v), 2) if not np.isnan(v) else None
            for v in rolling_vol
        ],
    )


@app.get("/summary/{ticker}", response_model=MarketSummaryResponse, tags=["Market Info"])
def get_market_summary(ticker: str):
    """
    Returns fundamental and descriptive info for a ticker
    (company name, sector, market cap, beta, P/E, 52-week range).
    """
    ticker = ticker.upper()
    tk = yf.Ticker(ticker)
    info = tk.info

    if not info or "shortName" not in info:
        raise HTTPException(status_code=404, detail=f"Ticker '{ticker}' not found")

    return MarketSummaryResponse(
        ticker=ticker,
        company_name=info.get("shortName", "N/A"),
        sector=info.get("sector", "N/A"),
        industry=info.get("industry", "N/A"),
        market_cap=info.get("marketCap"),
        beta=info.get("beta"),
        pe_ratio=info.get("trailingPE"),
        fifty_two_week_high=info.get("fiftyTwoWeekHigh", 0),
        fifty_two_week_low=info.get("fiftyTwoWeekLow", 0),
    )


@app.get("/compare", response_model=CompareResponse, tags=["Comparison"])
def compare_tickers(
    tickers: str = Query(..., description="Comma-separated list of tickers, e.g. AAPL,MSFT,TSLA"),
    period: str = Query(default="6mo"),
):
    """
    Compares volatility across multiple tickers and returns a
    correlation matrix of their daily returns.
    """
    ticker_list = [t.strip().upper() for t in tickers.split(",")]
    if len(ticker_list) < 2 or len(ticker_list) > 10:
        raise HTTPException(status_code=400, detail="Provide between 2 and 10 tickers")

    returns_dict: dict[str, pd.Series] = {}
    vols: dict[str, float] = {}
    risks: dict[str, str] = {}

    for t in ticker_list:
        try:
            df = _fetch_history(t, period)
            ret = df["log_return"].dropna()
            returns_dict[t] = ret
            vol = _annualized_vol(ret, 30)
            vols[t] = round(vol, 2)
            risks[t] = _risk_label(vol)
        except HTTPException:
            vols[t] = 0.0
            risks[t] = "N/A"

    # Correlation matrix (align on common dates)
    ret_df = pd.DataFrame(returns_dict).dropna()
    corr = ret_df.corr().round(4).to_dict()

    return CompareResponse(
        tickers=ticker_list,
        volatilities_30d=vols,
        risk_levels=risks,
        correlations=corr,
    )


@app.get("/momentum/{ticker}", tags=["Features"])
def get_momentum_features(
    ticker: str,
    period: str = Query(default="6mo"),
):
    """
    Returns engineered time-series features used for ML-style analysis:
    momentum windows, volume shifts, and return z-scores.
    """
    ticker = ticker.upper()
    df = _fetch_history(ticker, period)

    features = pd.DataFrame(index=df.index)
    features["close"] = df["Close"]
    features["return_1d"] = df["log_return"]
    features["return_5d"] = df["Close"].pct_change(5)
    features["return_20d"] = df["Close"].pct_change(20)
    features["momentum_rsi_proxy"] = (
        df["log_return"].rolling(14).mean() / df["log_return"].rolling(14).std()
    )
    features["volume_change_5d"] = df["Volume"].pct_change(5)
    features["volatility_7d"] = df["log_return"].rolling(7).std() * np.sqrt(252) * 100
    features["volatility_30d"] = df["log_return"].rolling(30).std() * np.sqrt(252) * 100
    features["z_score_return"] = (
        (df["log_return"] - df["log_return"].rolling(30).mean())
        / df["log_return"].rolling(30).std()
    )

    features = features.dropna().tail(60)  # Last 60 trading days

    return {
        "ticker": ticker,
        "feature_count": len(features.columns),
        "rows": len(features),
        "data": [
            {**{"date": str(idx.date())}, **row.to_dict()}
            for idx, row in features.iterrows()
        ],
    }

if __name__ == "__main__":
    uvicorn.run(app,port=8000)