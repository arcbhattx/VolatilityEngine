// Mock data for Guest Mode

export const DEMO_TICKERS = ["AAPL", "MSFT", "GOOG"];

export const MOCK_PRICES = [
  { Date: "2026-03-01", AAPL: 250.2, MSFT: 410.5, GOOG: 165.2 },
  { Date: "2026-03-02", AAPL: 252.5, MSFT: 412.1, GOOG: 166.8 },
  { Date: "2026-03-03", AAPL: 251.8, MSFT: 409.8, GOOG: 164.5 },
  { Date: "2026-03-04", AAPL: 253.4, MSFT: 411.2, GOOG: 167.1 },
  { Date: "2026-03-05", AAPL: 255.1, MSFT: 415.6, GOOG: 168.4 },
  { Date: "2026-03-06", AAPL: 257.3, MSFT: 418.2, GOOG: 170.1 },
  { Date: "2026-03-07", AAPL: 256.4, MSFT: 416.5, GOOG: 169.2 },
  { Date: "2026-03-08", AAPL: 258.9, MSFT: 420.3, GOOG: 171.5 },
  { Date: "2026-03-09", AAPL: 260.1, MSFT: 422.1, GOOG: 172.8 },
  { Date: "2026-03-10", AAPL: 262.4, MSFT: 425.8, GOOG: 174.2 },
];

export const MOCK_RETURNS = MOCK_PRICES.map((curr, i, arr) => {
  if (i === 0) return { Date: curr.Date, AAPL: 0, MSFT: 0, GOOG: 0 };
  const prev = arr[i - 1];
  return {
    Date: curr.Date,
    AAPL: (curr.AAPL - prev.AAPL) / prev.AAPL,
    MSFT: (curr.MSFT - prev.MSFT) / prev.MSFT,
    GOOG: (curr.GOOG - prev.GOOG) / prev.GOOG,
  };
});

export const MOCK_REALIZED_VOL = MOCK_PRICES.map((row) => ({
  Date: row.Date,
  AAPL: 18.5 + Math.random() * 2,
  MSFT: 15.2 + Math.random() * 2,
  GOOG: 20.1 + Math.random() * 2,
}));

export const MOCK_VOLATILITY_STATS: Record<string, any> = {
  AAPL: {
    ticker: "AAPL",
    vol_30d: 0.1842,
    vol_60d: 0.1912,
    vol_90d: 0.1885,
    as_of: "2026-03-10",
  },
  MSFT: {
    ticker: "MSFT",
    vol_30d: 0.1524,
    vol_60d: 0.1612,
    vol_90d: 0.1585,
    as_of: "2026-03-10",
  },
  GOOG: {
    ticker: "GOOG",
    vol_30d: 0.2015,
    vol_60d: 0.2112,
    vol_90d: 0.2085,
    as_of: "2026-03-10",
  },
};

export const MOCK_HISTORICAL_PREDICTIONS = (ticker: string) => {
    const stats = MOCK_VOLATILITY_STATS[ticker];
    return MOCK_PRICES.map(row => ({
        date: row.Date,
        predicted_vol_30: stats.vol_30d * 100 + (Math.random() * 2 - 1),
        predicted_vol_60: stats.vol_60d * 100 + (Math.random() * 2 - 1),
        predicted_vol_90: stats.vol_90d * 100 + (Math.random() * 2 - 1),
    }));
}
