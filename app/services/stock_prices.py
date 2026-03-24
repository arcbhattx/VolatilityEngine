import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
from typing import Union


def get_prices(
    ticker: Union[str, list[str]],
    start: Union[str, datetime, None] = None,
    end: Union[str, datetime, None] = None,
    lookback_days: int = 365,
    price_col: str = None,
    auto_adjust: bool = True,
) -> pd.DataFrame:
    """
    Fetch daily historical stock prices using yfinance.

    Args:
        ticker:        Single ticker symbol (e.g. "AAPL") or a list of symbols.
        start:         Start date as "YYYY-MM-DD" string or datetime. If None,
                       defaults to `lookback_days` before `end`.
        end:           End date as "YYYY-MM-DD" string or datetime. Defaults to today.
        lookback_days: Number of calendar days to look back when `start` is None.
                       Ignored if `start` is provided. Default: 365.
        price_col:     Which OHLCV column to return when a single price series is
                       needed. One of: "Open", "High", "Low", "Close", "Volume".
                       Set to None to return all columns. Default: "Close".
        auto_adjust:   Adjust prices for splits and dividends. Default: True.

    Returns:
        pd.DataFrame with a DatetimeIndex (timezone-naive, daily frequency).
        - Single ticker  → columns are OHLCV fields (or just `price_col`).
        - Multiple tickers → MultiIndex columns (field, ticker) or just
          (ticker,) when `price_col` is specified.

    Raises:
        ValueError: If no data is returned for the requested ticker(s) / range.

    Examples:
        # Single ticker, last 252 trading days of close prices
        prices = get_daily_prices("AAPL", lookback_days=252)

        # Multiple tickers, custom date range, all OHLCV columns
        prices = get_daily_prices(
            ["AAPL", "MSFT", "TSLA"],
            start="2022-01-01",
            end="2024-01-01",
            price_col=None,
        )

        # Feed close prices directly into a volatility calculation
        log_returns = np.log(prices / prices.shift(1)).dropna()
    """

    if end is None:
        end = datetime.today()

    if isinstance(end, str):
        end = datetime.strptime(end, "%Y-%m-%d")

    if start is None:
        start = end - timedelta(days=lookback_days)
    if isinstance(start, str):
        start = datetime.strptime(start, "%Y-%m-%d")

    # yfinance `end` is exclusive, so add one day to include the end date
    end_exclusive = end + timedelta(days=1)

    tickers = [ticker] if isinstance(ticker, str) else ticker

    raw: pd.DataFrame = yf.download(
        tickers=tickers,
        start=start.strftime("%Y-%m-%d"),
        end=end_exclusive.strftime("%Y-%m-%d"),
        auto_adjust=auto_adjust,
        progress=False,
        multi_level_index=len(tickers) > 1,  # flat cols for single ticker
    )

    if raw.empty:
        raise ValueError(
            f"No data returned for {ticker} between {start.date()} and {end.date()}. "
            "Check that the ticker symbol is valid and the date range contains trading days."
        )
    
    if isinstance(raw.columns, pd.MultiIndex):
        raw.columns = raw.columns.get_level_values(0)

    raw.index = raw.index.tz_localize(None) if raw.index.tz is not None else raw.index

    # Only narrow columns if caller explicitly requests a single column
    if price_col is not None:
        if len(tickers) == 1:
            raw = raw[[price_col]]
        else:
            raw = raw[price_col]

    return raw