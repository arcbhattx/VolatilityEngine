import yfinance as yf
import pandas as pd
import numpy as np
import os

# List of stock tickers
ticker_list = ["AAPL", "MSFT", "GOOG"]

# Create output folder if it doesn't exist
output_folder = "datasets"
os.makedirs(output_folder, exist_ok=True)

# Loop through each ticker
for ticker_symbol in ticker_list:
    # Download historical data (1 month daily)
    df = yf.download(ticker_symbol, period="1mo", progress=True)
    
    # Compute daily log returns
    df["Returns"] = np.log(df["Close"] / df["Close"].shift(1))
    
    # Compute 5-day rolling volatility (you can adjust)
    df["Volatility"] = df["Returns"].rolling(5).std()
    
    # Save to CSV
    output_file = os.path.join(output_folder, f"{ticker_symbol}_output.csv")
    df.to_csv(output_file)
    
    print(f"Saved {ticker_symbol} data to {output_file}")