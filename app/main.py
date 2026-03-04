"""
VolatilityEngine - FastAPI Backend
Analyzes historical price data and forecasts short-term volatility.
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

import yfinance as yf
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

from routers import stocks


app = FastAPI(
    title="VolatilityEngine API",
    description="Stock volatility prediction using historical price data",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stocks.router)

if __name__ == "__main__":
    uvicorn.run(app,port=8000)