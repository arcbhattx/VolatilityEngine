"""
Training VolatilityLSTM and save models to -> app/ml/models

"""

import argparse
import os
import pickle
from pathlib import Path

import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import DataLoader, TensorDataset

from app.ml.model import VolatilityLSTM
from app.ml.preprocessing import compute_features, build_sequences

MODELS_DIR = Path(__file__).parent / "models"
MODELS_DIR.mkdir(exist_ok=True)

FEATURE_COLS = ["log_return", "realized_vol_5d", "realized_vol_21d", "realized_vol_63d"]
TARGET_COL   = "realized_vol_21d"
HORIZONS     = [30, 60, 90]
LOOKBACK     = 63

def train(
        ticker: str,
        epochs: int = 100,
        batch_size: int = 32,
        lr: float = 1e-3,
        hidden_size: int = 128,
        num_layers: int = 2,
        dropout: float = 0.2,
        val_split: float = 0.15
):
    from app.services.stock_prices import get_prices
    from datetime import datetime, timedelta

    print(f"Fetching price data for {ticker}...")
    df_raw = get_prices(
        ticker=ticker,
        start=datetime.today() - timedelta(days=365 * 5),
        end=datetime.today(),
    )

    df = compute_features(df_raw)
    X, y, feat_scaler, tgt_scaler = build_sequences(
        df, FEATURE_COLS, TARGET_COL, lookback=LOOKBACK, horizons=HORIZONS
    )

    n_val = int(len(X) * val_split)
    X_train, X_val = X[:-n_val], X[-n_val:]
    y_train, y_val = y[:-n_val], y[-n_val:]

    
    # needs to be in tensor form for training.
    to_tensor = lambda a: torch.tensor(a, dtype=torch.float32)


    train_dl = DataLoader(
        TensorDataset(to_tensor(X_train), to_tensor(y_train)),
        batch_size=batch_size, shuffle=True,
    )
    val_dl = DataLoader(
        TensorDataset(to_tensor(X_val), to_tensor(y_val)),
        batch_size=batch_size,
    )


    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model = VolatilityLSTM(
        input_size=len(FEATURE_COLS),
        hidden_size=hidden_size,
        num_layers=num_layers,
        n_horizons=len(HORIZONS),
        dropout=dropout,
    ).to(device)

    optimizer = torch.optim.Adam(model.parameters(), lr=lr)
    criterion = nn.MSELoss()

    scheduler = torch.optim.lr_scheduler.ReduceLROnPlateau(
        optimizer, patience=10, factor=0.5
    )

    best_val_loss = float("inf")
    model_path = MODELS_DIR / f"{ticker}_lstm.pt"

    for epoch in range(1, epochs+1):
        model.train()
        train_loss = 0.0
        for xb, yb in train_dl:
            xb, yb = xb.to(device), yb.to(device)
            optimizer.zero_grad()
            loss = criterion(model(xb), yb)
            loss.backward()
            nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)
            optimizer.step()
            train_loss += loss.item() * len(xb)

        model.eval()
        val_loss = 0.0
        with torch.no_grad():
            for xb, yb in val_dl:
                xb,yb = xb.to(device), yb.to(device)
                val_loss += criterion(model(xb), yb).item() * len(xb)
        
        train_loss /= len(X_train)
        val_loss   /= len(X_val)
        scheduler.step(val_loss)


        if epoch % 10 == 0 or epoch == 1:
            print(f"Epoch {epoch:>4}/{epochs}  train={train_loss:.6f}  val={val_loss:.6f}")

        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), model_path)

    print(f"\nBest val loss: {best_val_loss:.6f}  ->  saved to {model_path}")

    with open(MODELS_DIR / f"{ticker}_scalers.pkl", "wb") as f:
        pickle.dump({"features": feat_scaler, "target": tgt_scaler}, f)

    print("Scalers saved.")
    return model


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--ticker",      default="AAPL")
    parser.add_argument("--epochs",      type=int,   default=100)
    parser.add_argument("--batch_size",  type=int,   default=32)
    parser.add_argument("--lr",          type=float, default=1e-3)
    parser.add_argument("--hidden_size", type=int,   default=128)
    parser.add_argument("--num_layers",  type=int,   default=2)
    parser.add_argument("--dropout",     type=float, default=0.2)
    args = parser.parse_args()

    train(
        ticker=args.ticker,
        epochs=args.epochs,
        batch_size=args.batch_size,
        lr=args.lr,
        hidden_size=args.hidden_size,
        num_layers=args.num_layers,
        dropout=args.dropout,
    )



