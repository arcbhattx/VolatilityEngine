from fastapi import APIRouter
from services.stock_prices import get_daily_prices

router = APIRouter(
    prefix="/stocks"
)

@router.get("/")
async def get_stocks():

    ticker_list = ["PLUG", "NVDA", "ONDS", "AAL", "F"]

    get_daily_prices(ticker=ticker_list)