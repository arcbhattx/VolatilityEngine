from pydantic import BaseModel

class VolatilityResponse(BaseModel):
    ticker: str
    vol_30d: float
    vol_60d: float
    vol_90d: float
    as_of: str
