from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.services.stock_prices import get_prices

import json
import numpy as np
import pandas as pd

router = APIRouter(prefix="/stocks")

# Hardcode your tickers here instead of pulling from DB per user
TICKERS = ["AAPL", "MSFT", "NVDA"]  # ← edit this list

@router.get("/prices")
async def get_stocks_prices():
    df = get_prices(ticker=TICKERS)
    df = df["Close"]
    if isinstance(df, pd.Series):
        df = df.to_frame()
    df = df.reset_index()
    df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")
    return JSONResponse(content=json.loads(df.to_json(orient="records")))

@router.get("/returns")
async def get_stock_returns():
    df = get_prices(ticker=TICKERS)
    df = df.pct_change().dropna()
    df = df["Close"]
    if isinstance(df, pd.Series):
        df = df.to_frame()
    df = df.reset_index()
    df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")
    return JSONResponse(content=json.loads(df.to_json(orient="records")))

@router.get("/realized-volatility")
async def get_realized_volatility():
    df = get_prices(ticker=TICKERS)
    df = df["Close"]
    if isinstance(df, pd.Series):
        df = df.to_frame()

    log_returns = np.log(df / df.shift(1)).dropna()
    rolling_vol = log_returns.rolling(window=30).std() * np.sqrt(252) * 100
    rolling_vol = rolling_vol.dropna().reset_index()
    rolling_vol["Date"] = rolling_vol["Date"].dt.strftime("%Y-%m-%d")

    return JSONResponse(content=json.loads(rolling_vol.to_json(orient="records")))
