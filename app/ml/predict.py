"""

Live Volatility Inference.

"""

import pickle
from dataclasses import dataclass
from pathlib import Path

import numpy as np
import pandas as pd
import torch

from app.ml.model import VolatilityLSTM
from app.ml.preprocessing import compute_features


MODELS_DIR   = Path(__file__).parent / "models"
FEATURE_COLS = ["log_return", "realized_vol_5d", "realized_vol_21d", "realized_vol_63d"]
HORIZONS     = [30, 60, 90]
LOOKBACK     = 63

@dataclass
class Predictor:
    model: VolatilityLSTM
    feat_scaler: object
    tgt_scaler: object
    device: torch.device

def load_predictor(ticker: str) -> Predictor:
    model_path  = MODELS_DIR / f"{ticker}_lstm.pt"
    scaler_path = MODELS_DIR / f"{ticker}_scalers.pkl"

    if not model_path.exists():
        raise FileNotFoundError(
            f"No trained model for {ticker}. Run: python -m app.ml.train --ticker {ticker}"
        )
    
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    model = VolatilityLSTM(
        input_size=len(FEATURE_COLS),
        n_horizons=len(HORIZONS),
    ).to(device)
    model.load_state_dict(torch.load(model_path, map_location=device))
    model.eval()

    with open(scaler_path, "rb") as f:
        scalers = pickle.load(f)

    return Predictor(
        model=model,
        feat_scaler=scalers["features"],
        tgt_scaler=scalers["target"],
        device=device,
    )

def predict_volatility(
        predictor: Predictor,
        price_df: pd.DataFrame,
        price_col: str = "Close",
) -> dict[str, float]:
      
    """
    Given a recent price DataFrame (must have at least LOOKBACK + 63 rows),
    return predicted annualized volatility for 30, 60, and 90-day horizons.

    """
    df = compute_features(price_df, price_col=price_col)

    if len(df) < LOOKBACK:
        raise ValueError(f"Need at least {LOOKBACK} rows after feature computation, got {len(df)}")
    
    features = predictor.feat_scaler.transform(df[FEATURE_COLS].values)
    sequence = features[-LOOKBACK:]
    x = torch.tensor(sequence,dtype=torch.float32).unsqueeze(0).to(predictor.device)

    with torch.no_grad():
        pred_scaled = predictor.model(x).cpu().numpy()

    pred_vol = predictor.tgt_scaler.inverse_transform(pred_scaled)[0]

    return {
        "vol_30d": round(float(pred_vol[0]), 4),
        "vol_60d": round(float(pred_vol[1]), 4),
        "vol_90d": round(float(pred_vol[2]), 4),
    }
    