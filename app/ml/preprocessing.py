import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from arch import arch_model

def add_garch_feature(df: pd.DataFrame):
    """
        Garch Volatility Prediction
    """

    df = df.copy()

    returns = df["log_return"] * 100
    returns = returns.dropna()

    garch = arch_model(returns, vol='Garch', p=1, q=1)
    res = garch.fit(disp="off")

    garch_vol = res.conditional_volatility

    # Align index properly
    df["garch_vol"] = np.nan
    df.loc[garch_vol.index, "garch_vol"] = garch_vol.values

    df["garch_vol"] = df["garch_vol"].shift(1)

    return df

def compute_features(df: pd.DataFrame, price_col: str = "Close") -> pd.DataFrame:
    """
        From price series compute engineered features from OHLCV data.
    """

    df = df.copy()

    df["log_return"] = np.log(df[price_col] / df[price_col].shift(1))

    df["log_volume_change"] = np.log((df["Volume"] + 1) / (df["Volume"].shift(1) + 1)) # avoiding log 0 issues

    df["log_trading_range"] = np.log(df["High"]/df["Low"])
    df["close_open_return"] = np.log(df["Close"]/df["Open"])

    # Volatility features
    trading_days = 252
    df["realized_vol_5d"] = df["log_return"].rolling(5).std() * np.sqrt(trading_days)
    df["realized_vol_21d"] = df["log_return"].rolling(21).std() * np.sqrt(trading_days)
    df["realized_vol_63d"] = df["log_return"].rolling(63).std() * np.sqrt(trading_days)

    # Momentum Features
    df["ma_5"] = df["Close"].rolling(5).mean()
    df["ma_21"] = df["Close"].rolling(21).mean()
    df["ma_ratio"] = df["ma_5"] / df["ma_21"] #trend signal

    df["vol_change"] = df["realized_vol_21d"].pct_change()

    df = add_garch_feature(df)
    df["garch_vol"] = df["garch_vol"]


    df["daily_vol"] = df["log_return"].abs()

    df.dropna(inplace=True)

    return df

def build_sequences(
        df: pd.DataFrame,
        feature_cols: list[str],
        target_col: str,
        lookback: int = 63,
        horizons: list[int] = [30, 60, 90]

) -> tuple[np.ndarray, np.ndarray, StandardScaler, StandardScaler]:
    
    """
    Build (X, y) sequences for multi-horizon vol forecasting.

    X shape: (n_samples, lookback, n_features)
    y shape: (n_samples, len(horizons))  — one col per horizon

    Returns X, y, feature_scaler, target_scaler
    """
    
    feature_scaler = StandardScaler()
    target_scaler = StandardScaler()

    features = df[feature_cols].copy()

    # getting rid of outliers
    features = features.clip(
        lower=features.quantile(0.01),
        upper = features.quantile(0.99),
        axis=1
    )

    features_scaled = feature_scaler.fit_transform(features.values)

    raw_targets = df[target_col].values

    max_horizon = max(horizons)
    X, y = [], []

    for i in range(lookback, len(features_scaled) - max_horizon):

        start_X = i - lookback
        end_X = i

        past_window = features_scaled[start_X:end_X]

        future_targets = []

        for h in horizons:
            start_y = i
            end_y = i + h

            future_avg = np.mean(raw_targets[start_y:end_y]) 
            future_targets.append(float(future_avg))
        
        X.append(past_window)
        y.append(future_targets)

    
    X = np.array(X)
    y = np.array(y)

    y = target_scaler.fit_transform(y)

    
    return X, y, feature_scaler, target_scaler