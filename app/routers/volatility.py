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

