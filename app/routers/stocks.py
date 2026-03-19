from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from services.stock_prices import get_prices
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Union
import json

from models.ticker import Ticker
from dependencies.auth import get_current_user
from core.database import get_async_session
from models.user import User

import numpy as np

router = APIRouter(
    prefix="/stocks"
)
@router.get("/prices")
async def get_stocks_prices(
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Ticker).where(Ticker.user_id == current_user.id))
    tickers = result.scalars().all()
    ticker_list = [t.symbol for t in tickers]

    if not ticker_list:
        return JSONResponse(content=[])

    df = get_prices(ticker=ticker_list)
    df = df.reset_index()
    df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")
    return JSONResponse(content=json.loads(df.to_json(orient="records")))

@router.get("/returns")
async def get_stock_returns(
        db: AsyncSession = Depends(get_async_session),
        current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Ticker).where(Ticker.user_id == current_user.id))
    tickers = result.scalars().all()
    ticker_list = [t.symbol for t in tickers]

    if not ticker_list:
        return JSONResponse(content=[])

    df = get_prices(ticker=ticker_list)
    df = df.pct_change().dropna()
    df = df.reset_index()
    df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")
    return JSONResponse(content=json.loads(df.to_json(orient="records")))

@router.get("/realized-volatility")
async def get_realized_volatility(
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(select(Ticker).where(Ticker.user_id == current_user.id))
    tickers = result.scalars().all()
    ticker_list = [t.symbol for t in tickers]

    if not ticker_list:
        return JSONResponse(content=[])

    df = get_prices(ticker=ticker_list)

    log_returns = np.log(df / df.shift(1)).dropna()

    rolling_vol = log_returns.rolling(window=30).std() * np.sqrt(252) * 100

    rolling_vol = rolling_vol.dropna()
    rolling_vol = rolling_vol.reset_index()
    rolling_vol["Date"] = rolling_vol["Date"].dt.strftime("%Y-%m-%d")
    
    return JSONResponse(content=json.loads(rolling_vol.to_json(orient="records")))
 

@router.get("/prices-test")
async def get_stocks_prices(
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    ticker_list = ["AAPL", "TSLA", "NVDA", "MSFT", "AMZN", "META", "GOOG"]

    df = get_prices(ticker=ticker_list, lookback_days=90)
    df = df.reset_index()
    df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")
    return JSONResponse(content=json.loads(df.to_json(orient="records")))

@router.get("/returns-test")
async def get_stock_returns_test(
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    ticker_list = ["AAPL", "TSLA", "NVDA", "MSFT", "AMZN", "META", "GOOG"]
    df = get_prices(ticker=ticker_list, lookback_days=90)
    df = df.pct_change().dropna()
    df = df.reset_index()
    df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")
    return JSONResponse(content=json.loads(df.to_json(orient="records")))