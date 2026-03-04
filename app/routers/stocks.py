from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from services.stock_prices import get_daily_prices
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Union
import json

from models.ticker import Ticker
from dependencies.auth import get_current_user
from core.database import get_async_session
from models.user import User

router = APIRouter(
    prefix="/stocks"
)
@router.get("/prices")
async def get_stocks_prices(
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(get_current_user)
):
    tickers = db.query(Ticker).filter(Ticker.user_id == current_user.id).all()
    ticker_list = [t.symbol for t in tickers]

    if not ticker_list:
        return JSONResponse(content=[])

    df = get_daily_prices(ticker=ticker_list)
    df = df.reset_index()
    df["Date"] = df["Date"].dt.strftime("%Y-%m-%d")
    return JSONResponse(content=json.loads(df.to_json(orient="records")))