import sys
import os
from datetime import datetime, timedelta

project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if project_root not in sys.path:
    sys.path.append(project_root)

from app.services.stock_prices import get_prices

ticker_list = ["AAPL", "TSLA", "NVDA", "MSFT", "AMZN", "META", "GOOG"]

start_date = datetime.today() - timedelta(days=365*3)
end_date = datetime.today()

historical_data_frame = get_prices(
    ticker=ticker_list,
    start=start_date,
    end=end_date
)

data_dir = os.path.join(project_root, "data")
os.makedirs(data_dir, exist_ok=True)

output_path = os.path.join(data_dir, "historical_data.csv")
historical_data_frame.to_csv(output_path)

print(f"Saved historical data for {len(ticker_list)} tickers to {output_path}")