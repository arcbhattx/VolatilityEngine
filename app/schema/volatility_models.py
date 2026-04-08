from pydantic import BaseModel

class VolatilityResponse(BaseModel):
    ticker: str
    vol_5d: float
    vol_10d: float
    vol_15d: float
    vol_20d: float
    vol_25d: float
    vol_30d: float
    vol_35d: float
    vol_40d: float
    vol_45d: float
    vol_50d: float
    vol_55d: float
    vol_60d: float
    vol_65d: float
    vol_70d: float
    vol_75d: float
    vol_80d: float
    vol_85d: float
    vol_90d: float
    as_of: str