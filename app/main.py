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

from app.core.database import create_db_tables, get_async_session, engine
from contextlib import asynccontextmanager

from app.routers import stocks, volatility, auth
import app.schema.models  # Ensure models are registered for table creation


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_db_tables()

    try:
        yield
    finally:
        await engine.dispose()


app = FastAPI(
    title="VolatilityEngine API",
    description="Stock volatility prediction using historical price data",
    version="1.0.0",
    lifespan=lifespan,
    debubg = True,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stocks.router)
app.include_router(volatility.router)
app.include_router(auth.router)

if __name__ == "__main__":
    uvicorn.run(app, host='127.0.0.1', port=8000)