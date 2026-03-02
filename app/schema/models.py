from pydantic import BaseModel
from typing import Optional

class VolatilityResponse(BaseModel):
    ticker: str
    period: str
    current_price: float
    historical_volatility_30d: float   # annualized %
    historical_volatility_7d: float    # annualized %
    avg_daily_return: float
    max_drawdown: float
    risk_level: str                    # LOW / MEDIUM / HIGH / EXTREME
    predicted_7d_volatility: float
    confidence: float


class PriceHistoryResponse(BaseModel):
    ticker: str
    dates: list[str]
    closes: list[float]
    volumes: list[float]
    daily_returns: list[float]
    rolling_volatility_30d: list[Optional[float]]


class MarketSummaryResponse(BaseModel):
    ticker: str
    company_name: str
    sector: str
    industry: str
    market_cap: Optional[float]
    beta: Optional[float]
    pe_ratio: Optional[float]
    fifty_two_week_high: float
    fifty_two_week_low: float


class CompareResponse(BaseModel):
    tickers: list[str]
    volatilities_30d: dict[str, float]
    risk_levels: dict[str, str]
    correlations: dict[str, dict[str, float]]