from datetime import datetime, timedelta
from functools import lru_cache

from fastapi import APIRouter, HTTPException
from app.schema.volatility_models import VolatilityResponse
from app.ml.predict import load_predictor, predict_volatility
from app.services.stock_prices import get_prices

router = APIRouter(prefix="/volatility", tags=["volatility"])

@lru_cache(maxsize=20)
def _cached_predictor(ticker: str):
    return load_predictor(ticker)

@router.get("/{ticker}", response_model=VolatilityResponse)
async def get_volatility(ticker: str):
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

    try:
        result = predict_volatility(predictor, df)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    return VolatilityResponse(
        ticker=ticker,
        as_of=datetime.today().strftime("%Y-%m-%d"),
        **result,
    )

@router.get("/{ticker}/historical", response_model=list[dict])
async def get_historical_volatility_predictions(ticker: str):
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
    min_window = 60

    for i in range(min_window, len(df)):
        window_df = df.iloc[:i]
        date = df.index[i - 1]

        try:
            prediction = predict_volatility(predictor, window_df)
            results.append({
                "date": date.strftime("%Y-%m-%d") if hasattr(date, "strftime") else str(date),
                "predicted_vol_30": prediction.get("vol_30d") * 100,
                "predicted_vol_60": prediction.get("vol_60d") * 100,
                "predicted_vol_90": prediction.get("vol_90d") * 100,
            })
        except ValueError:
            continue

    return results