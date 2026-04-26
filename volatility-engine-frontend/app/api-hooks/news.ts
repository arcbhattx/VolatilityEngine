import { useState, useEffect } from "react";

export interface NewsItem {
  title: string;
  publisher: string;
  link: string;
  providerPublishTime: number;
  type: string;
  thumbnail: string | null;
}

const BASE_URL = "http://127.0.0.1:8000/news";

export function useStockNews(ticker: string) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) return;

    async function fetchNews() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${BASE_URL}/${ticker}`);
        if (!res.ok) throw new Error("Failed to fetch news");
        const data = await res.json();
        setNews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [ticker]);

  return { news, loading, error };
}
