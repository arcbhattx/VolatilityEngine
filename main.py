import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Choose stock
ticker_symbol = "AAPL"

ticker_list = ["AAPL", "MSFT", "GOOG"]

data_frame = yf.download(ticker_symbol, period="1y")

data_frame.to_csv('datasets/output.csv')


'''
# Compute daily log returns
data["Returns"] = np.log(data["Close"] / data["Close"].shift(1))

# Compute 30-day rolling volatility
data["Volatility"] = data["Returns"].rolling(30).std()

print(data.tail())

# Plot price and volatility
plt.figure()
data["Close"].plot(title=f"{ticker_symbol} Price")

plt.figure()
data["Volatility"].plot(title=f"{ticker_symbol} 30-Day Volatility")

plt.show()

'''