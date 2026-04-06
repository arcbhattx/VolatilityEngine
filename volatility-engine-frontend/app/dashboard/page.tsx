"use client";

import { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from "recharts";

import { ChartTab } from "../types/dashboard";

import { useStockPrices,
        useRealizedVolatility,
        useStockReturns,
 } from "../api-hooks/stocks";

const TOOLTIP_STYLE = {
  backgroundColor: "#111",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "6px",
  color: "#fff",
  fontSize: 12,
};

export default function Dashboard() {
  const {prices, apiLoading: pricesLoading} = useStockPrices();
  const {returns, apiLoading: returnsLoading} = useStockReturns();
  const {realizedVol, apiLoading: realizedVolLoading} = useRealizedVolatility();

  const tickers = useMemo(() => {
    if (!prices.length) return [];
    return Object.keys(prices[0]).filter((k) => k !== "Date");
  }, [prices])

  const [selectedTicker, setSelectedTicker] = useState<string>("");

  const activeTicker = selectedTicker || tickers[0];

  const [activeChart, setActiveChart] = useState<ChartTab>("price");

  const latestPrice = useMemo(() =>{
    if(!prices.length || !activeTicker) return null;
    const last = prices[prices.length - 1];
    return last[activeTicker] as number;
  }, [prices, activeTicker])

  const dailyChange = useMemo(() => {

    if(!returns.length || !activeChart) return null;
    const last = returns[returns.length - 1];
    return (last[activeTicker] as number) * 100;

  }, [returns, activeTicker])

  const realized30dVol = useMemo(() => {
  if (!realizedVol.length || !activeTicker) return null;
  
  // Search from the end for the last row that actually has a value
  for (let i = realizedVol.length - 1; i >= 0; i--) {
    const val = realizedVol[i][activeTicker];
    if (val !== undefined && val !== null) {
      return val as number;
    }
  }
  return null;
}, [realizedVol, activeTicker]);
  const priceChartData = useMemo(
    () => prices.map((row) => ({date:row.Date, value:row[activeTicker]})),
  [prices, activeTicker])

  const volChartData = useMemo(
    () => realizedVol.map((row) => ({data: row.Date, value: row[activeTicker]})),
   [realizedVol, activeTicker])
  
  const returnsChartData = useMemo( 
    () => 
      returns.map((row) =>({
        date: row.Date,
        value:(row[activeTicker] as number) * 100,
      })), 
      [returns, activeTicker])

  const isLoading = pricesLoading || returnsLoading || realizedVolLoading;

  const change = dailyChange ?? 0;
  const priceColor = change >= 0 ? "#22c55e" : "#ef4444";

  if (isLoading) {
    return (
      <main className="bg-black text-white min-h-screen flex items-center justify-center">
        <p className="text-zinc-400">Loading...</p>
      </main>
    );
  }
  return (
    <main className="bg-black text-white min-h-screen">

      <section className="px-12 pt-10 flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-semibold">{activeTicker}</h1>
          <p className={`text-lg ${change >= 0 ? "text-green-400" : "text-red-400"}`}>
            {change > 0 ? "+" : ""}{change.toFixed(2)}%
          </p>
        </div>

        <select
          value={activeTicker}
          onChange={(e) => setSelectedTicker(e.target.value)}
          className="bg-zinc-900 text-white px-4 py-2 rounded border border-zinc-700"
        >
          {tickers.map((t) => <option key={t}>{t}</option>)}
        </select>
      </section>

      <section className="px-12 flex gap-6 py-6">
        {[
          { label: "Price", value: latestPrice != null ? `$${latestPrice.toFixed(2)}` : "—" },
          { label: "30D Volatility", value: realized30dVol != null ? `${realized30dVol.toFixed(2)}%` : "—" },
          { label: "Daily Change", value: `${change >= 0 ? "+" : ""}${change.toFixed(2)}%` },
        ].map(({ label, value }) => (
          <div key={label} className="bg-zinc-900 rounded-xl px-6 py-4 flex-1">
            <p className="text-zinc-400 text-sm">{label}</p>
            <p className="text-2xl font-semibold mt-1">{value}</p>
          </div>
        ))}
      </section>

      {/* Chart tabs */}
      <section className="px-12 pb-12">
        <div className="flex gap-4 mb-4">
          {(["price", "volatility", "returns"] as ChartTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveChart(tab)}
              className={`capitalize px-4 py-1.5 rounded text-sm ${
                activeChart === tab
                  ? "bg-white text-black font-semibold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeChart === "price" && (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={priceChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={60} />
              <Tooltip contentStyle={TOOLTIP_STYLE}/>
              <Line type="monotone" dataKey="value" stroke={priceColor} strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeChart === "volatility" && (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={volChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} width={50} />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line type="monotone" dataKey="value" stroke="#f59e0b" strokeWidth={1.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeChart === "returns" && (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={returnsChartData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
              <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} width={50} />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" />
              <Tooltip contentStyle={TOOLTIP_STYLE}/>
              <Bar dataKey="value" radius={[2, 2, 0, 0]} fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>
    </main>
  );
}