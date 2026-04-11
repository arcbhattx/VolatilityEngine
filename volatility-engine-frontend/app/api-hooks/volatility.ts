import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { MOCK_VOLATILITY_STATS, MOCK_HISTORICAL_PREDICTIONS } from "./mockData";

interface VolatilityData {
  ticker: string;
  vol_30d: number;
  vol_60d: number;
  vol_90d: number;
  as_of: string;
}

interface HistoricalPrediction {
  date: string;
  predicted_vol_30: number;
  predicted_vol_60: number;
  predicted_vol_90: number;
}

export function useVolatility(ticker: string) {
  const [predictedVolatility, setData] = useState<VolatilityData | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isGuest } = useAuth();

  useEffect(() => {
    if (!ticker) return;

    if (isGuest) {
      setData(MOCK_VOLATILITY_STATS[ticker] || null);
      setApiLoading(false);
      return;
    }

    async function fetchVolatility() {
      try {
        setApiLoading(true);
        const response = await fetch(
          `http://127.0.0.1:8000/volatility/${ticker}`,
        );
        if (!response.ok)
          throw new Error(`Failed to fetch: ${response.status}`);
        const json: VolatilityData = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setApiLoading(false);
      }
    }

    fetchVolatility();
  }, [ticker, isGuest]);

  return { predictedVolatility, apiLoading, error };
}

export function useHistoricalVolatility(ticker: string) {
  const [historicalPredictions, setData] = useState<HistoricalPrediction[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isGuest } = useAuth();

  useEffect(() => {
    if (!ticker) return;

    if (isGuest) {
      setData(MOCK_HISTORICAL_PREDICTIONS(ticker));
      setApiLoading(false);
      return;
    }

    async function fetchHistorical() {
      try {
        setApiLoading(true);
        const response = await fetch(
          `http://127.0.0.1:8000/volatility/${ticker}/historical`,
        );
        if (!response.ok)
          throw new Error(`Failed to fetch: ${response.status}`);
        const json: HistoricalPrediction[] = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setApiLoading(false);
      }
    }

    fetchHistorical();
  }, [ticker, isGuest]);

  return { historicalPredictions, apiLoading, error };
}
