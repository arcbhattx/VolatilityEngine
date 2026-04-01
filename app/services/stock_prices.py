import yfinance as yf
import pandas as pd
from datetime import datetime, timedelta
from typing import Union


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
    """
    if isinstance(end, str):
        end = datetime.strptime(end, "%Y-%m-%d")

    if isinstance(start, str):
        start = datetime.strptime(start, "%Y-%m-%d")

    if end is None:
        end = datetime.today()

    if start is None:
        start = end - timedelta(days=lookback_days) 

    # yfinance `end` is exclusive, so add one day to include the end date
    end_exclusive = end + timedelta(days=1)

    tickers = [ticker] if isinstance(ticker, str) else ticker

    raw_df: pd.DataFrame = yf.download(
        tickers=tickers,
        start=start.strftime("%Y-%m-%d"),
        end=end_exclusive.strftime("%Y-%m-%d"),
        auto_adjust=auto_adjust,
        progress=False,
        multi_level_index= True,
    )

    if raw_df.empty:
        raise ValueError(
            f"No data returned for {ticker} between {start.date()} and {end.date()}. "
            "Check that the ticker symbol is valid and the date range contains trading days."
        )
    
    # converts timezone data if exists
    raw_df.index = raw_df.index.tz_localize(None) if raw_df.index.tz is not None else raw_df.index

    # Only narrow columns if caller explicitly requests a single column
    if price_col is not None:
        if len(tickers) == 1:
            raw_df= raw_df[[price_col]]
        else:
            raw_df = raw_df[price_col]

    return raw_df