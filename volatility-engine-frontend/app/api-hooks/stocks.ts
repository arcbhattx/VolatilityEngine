import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { MOCK_PRICES, MOCK_RETURNS, MOCK_REALIZED_VOL } from "./mockData";

interface PriceRecord {
  Date: string;
  [ticker: string]: string | number;
}

interface ReturnRecord {
  Date: string;
  [ticker: string]: string | number;
}

const BASE_URL = "http://127.0.0.1:8000/stocks";
const getAuthHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("access_token")}`,
});

export function useStockPrices() {
  const [prices, setPrices] = useState<PriceRecord[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isGuest } = useAuth();

  useEffect(() => {
    if (isGuest) {
      setPrices(MOCK_PRICES);
      setApiLoading(false);
      return;
    }

    async function fetchPrices() {
      try {
        setApiLoading(true);
        const res = await fetch(`${BASE_URL}/prices`, {
          headers: getAuthHeader(),
        });
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        setPrices(await res.json());
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch prices");
      } finally {
        setApiLoading(false);
      }
    }
    fetchPrices();
  }, [isGuest]);

  return { prices, apiLoading, error };
}

export function useStockReturns() {
  const [returns, setReturns] = useState<ReturnRecord[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isGuest } = useAuth();

  useEffect(() => {
    if (isGuest) {
      setReturns(MOCK_RETURNS);
      setApiLoading(false);
      return;
    }

    async function fetchReturns() {
      try {
        setApiLoading(true);
        const res = await fetch(`${BASE_URL}/returns`, {
          headers: getAuthHeader(),
        });
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        setReturns(await res.json());
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch returns",
        );
      } finally {
        setApiLoading(false);
      }
    }
    fetchReturns();
  }, [isGuest]);

  return { returns, apiLoading, error };
}

export function useStockCumulativeReturns() {
  const [cumulativeReturns, setCumulativeReturns] = useState<ReturnRecord[]>(
    [],
  );
  const [apiLoading, setApiLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCumulativeReturns() {
      try {
        setApiLoading(true);
        const res = await fetch(`${BASE_URL}/cumulative-returns`, {
          headers: getAuthHeader(),
        });
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        setCumulativeReturns(await res.json());
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch cumulative returns",
        );
      } finally {
        setApiLoading(false);
      }
    }
    fetchCumulativeReturns();
  }, []);

  return { cumulativeReturns, apiLoading, error };
}

export function useRealizedVolatility() {
  const [realizedVol, setRealizedVol] = useState<ReturnRecord[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { isGuest } = useAuth();

  useEffect(() => {
    if (isGuest) {
      setRealizedVol(MOCK_REALIZED_VOL);
      setApiLoading(false);
      return;
    }

    async function fetchRealizedVol() {
      try {
        setApiLoading(true);
        const res = await fetch(`${BASE_URL}/realized-volatility`, {
          headers: getAuthHeader(),
        });
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);
        setRealizedVol(await res.json());
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch realized volatility",
        );
      } finally {
        setApiLoading(false);
      }
    }
    fetchRealizedVol();
  }, [isGuest]);

  return { realizedVol, apiLoading, error };
}
