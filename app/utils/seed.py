from models.ticker import Ticker
from sqlalchemy.ext.asyncio import AsyncSession


DEFAULT_TICKERS = ["AAPL", "TSLA", "NVDA", "MSFT", "AMZN", "META", "GOOG"]

async def seed_default_tickers(user_id: int, db: AsyncSession):
    tickers = [Ticker(symbol=symbol, user_id=user_id) for symbol in DEFAULT_TICKERS]
    db.add_all(tickers)
    await db.commit()