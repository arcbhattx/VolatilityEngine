from datetime import datetime, timedelta
from functools import lru_cache

from fastapi import APIRouter, HTTPException, Depends
from schema.volatility_models import VolatilityResponse
from sqlalchemy.ext.asyncio import AsyncSession

from ml.predict import load_predictor, predict_volatility
from services.stock_prices import get_prices

from core.database import get_async_session
from models.user import User
from dependencies.auth import get_current_user

router = APIRouter(prefix="/volatility", tags=["volatility"])


@lru_cache(maxsize=20)
def _cached_predictor(ticker: str):
    """Cache predictors in memory so we don't reload from disk each request."""
    return load_predictor(ticker)

@router.get("/{ticker}", response_model=VolatilityResponse)
async def get_volatility(
    ticker: str,
    ):

    """
    Return 30/60/90-day forward volatility forecast for a ticker.

    """

    ticker = ticker.upper()

    try:
        predictor = _cached_predictor(ticker)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    
    # fetch ~6 months of recent prices for feature computation
    df = get_prices(
        ticker=ticker,
        start=datetime.today() - timedelta(days=365),
        end=datetime.today(),
    )

    try:
        result = predict_volatility(predictor, df)
        print(result)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    return VolatilityResponse(
        ticker=ticker,
        as_of=datetime.today().strftime("%Y-%m-%d"),
        **result,
    )

@router.get("/{ticker}/historical", response_model=list[dict])
async def get_historical_volatility_predictions(ticker: str):
    """
    Return predicted volatility for every date in history (rolling window).
    """
    ticker = ticker.upper()

    try:
        predictor = _cached_predictor(ticker)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

    df = get_prices(
        ticker=ticker,
        start=datetime.today() - timedelta(days=365),
        end=datetime.today(),
    )

    results = []
    min_window = 60  # minimum rows needed to compute features

    for i in range(min_window, len(df)):
        window_df = df.iloc[:i]
        date = df.index[i - 1]  # or df.iloc[i - 1]["Date"] if Date is a column

        try:
            prediction = predict_volatility(predictor, window_df)
            results.append({
                "date": date.strftime("%Y-%m-%d") if hasattr(date, "strftime") else str(date),
                "predicted_vol_30": prediction.get("vol_30d") * 100,
                "predicted_vol_60": prediction.get("vol_60d") * 100,
                "predicted_vol_90": prediction.get("vol_90d") * 100,
            })
        except ValueError:
            continue  # skip windows where features can't be computed

    return results

