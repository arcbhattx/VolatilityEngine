import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler

def compute_features(df: pd.DataFrame, price_col: str = "Close") -> pd.DataFrame:
    """
    From price series, compute:
        - log return: daily log return
        - realized_vol: rolling annnualized volitility
    """

    df = df[[price_col]].copy()
    df["log_return"] = np.log(df[price_col] / df[price_col].shift(1))

    trading_days = 252
    df["realized_vol_5d"]  = df["log_return"].rolling(5).std()  * np.sqrt(trading_days)
    df["realized_vol_21d"] = df["log_return"].rolling(21).std() * np.sqrt(trading_days)
    df["realized_vol_63d"] = df["log_return"].rolling(63).std() * np.sqrt(trading_days)

    df.dropna(inplace=True)

    return df

def build_sequences(
        df: pd.DataFrame,
        feature_cols: list[str],
        target_col: str,
        lookback: int = 63,
        horizons: list[int] = [30, 60, 90]

) -> tuple[np.ndarray, np.ndarray, MinMaxScaler, MinMaxScaler]:
    
    """
    Build (X, y) sequences for multi-horizon vol forecasting.

    X shape: (n_samples, lookback, n_features)
    y shape: (n_samples, len(horizons))  — one col per horizon

    Returns X, y, feature_scaler, target_scaler
    """
    
    feature_scaler = MinMaxScaler()
    target_scaler = MinMaxScaler()

    features = feature_scaler.fit_transform(df[feature_cols].values)
    targets = target_scaler.fit_transform(df[target_col].values.reshape(-1,1))

    max_horizon = max(horizons)
    X, y = [], []

    for i in range(lookback, len(features) - max_horizon):
        X.append(features[i-lookback:i])

        # for each horizon h, use the mean vol over the next h days as target
        row = [
            float(np.mean(targets[i:i+h]))
            for h in horizons
        ]
        y.append(row)

    
    return np.array(X), np.array(y), feature_scaler, target_scaler