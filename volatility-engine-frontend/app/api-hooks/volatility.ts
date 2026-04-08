import { useState, useEffect } from "react";

interface VolatilityData {
  ticker: string;
  vol_30d: number;
  vol_60d: number;
  vol_90d: number;
  as_of: string;
}

export function useVolatility(ticker: string) {
  const [predictedVolatility, setData] = useState<VolatilityData | null>(null);
  const [apiLoading, setApiLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) return;

    async function fetchVolatility() {
      try {
        setApiLoading(true);

        const response = await fetch(
          `http://127.0.0.1:8000/volatility/${ticker}`,
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status}`);
        }

        const json: VolatilityData = await response.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setApiLoading(false);
      }
    }

    fetchVolatility();
  }, [ticker]);

  return { predictedVolatility, apiLoading, error };
}
