import { useState, useEffect } from "react";
interface PriceRecord {
  Date: string;
  [ticker: string]: string | number;
}

export default function useStockPrices() {
  const [prices, setPrices] = useState<PriceRecord[]>([]);
  const [apiLoading, setApiLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    async function fetchPrices() {
      try {
        setApiLoading(true);
        const res = await fetch("http://127.0.0.1:8000/stocks/prices-test", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

        const data = await res.json();
        console.log(data)
        setPrices(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch prices");
      } finally {
        setApiLoading(false);
      }
    }

    fetchPrices();
  }, []);

  return { prices, apiLoading, error };
}