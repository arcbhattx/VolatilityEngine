"use client";

import { useMemo, useState } from "react";
import { useAuth } from "../context/authContext";
import { DEMO_TICKERS } from "../api-hooks/mockData";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from "recharts";

import { FileDown, ImageDown } from "lucide-react";

import { useRef } from "react";
import { toPng } from "html-to-image";

import { ChartTab } from "../types/dashboard";

import { StatCard } from "../components/dashboard/StatCard";
import { StockDropdown } from "../components/dashboard/StockDropdown";
import { LoadingScreen } from "../components/reusable/LoadingScreen";

import {
  useStockPrices,
  useRealizedVolatility,
  useStockReturns,
} from "../api-hooks/stocks";

import {
  useVolatility,
  useHistoricalVolatility,
} from "../api-hooks/volatility";

const TOOLTIP_STYLE = {
  backgroundColor: "#111",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "6px",
  color: "#fff",
  fontSize: 12,
};

export default function Dashboard() {

  const chartRef = useRef<HTMLDivElement>(null);
  const { isGuest } = useAuth();
  const { prices, apiLoading: pricesLoading } = useStockPrices();
  const { returns, apiLoading: returnsLoading } = useStockReturns();
  const { realizedVol, apiLoading: realizedVolLoading } =
    useRealizedVolatility();

  const tickers = useMemo(() => {
    if (isGuest) return DEMO_TICKERS;
    if (!prices.length) return [];
    return Object.keys(prices[0]).filter((k) => k !== "Date");
  }, [prices, isGuest]);

  const [selectedTicker, setSelectedTicker] = useState<string>("");

  const activeTicker = selectedTicker || tickers[0];

  const { historicalPredictions, apiLoading: historicalVolLoading } =
    useHistoricalVolatility(activeTicker);

  const {
    predictedVolatility,
    apiLoading: predictedVolatilityLoading,
    error,
  } = useVolatility(activeTicker);

  const [activeChart, setActiveChart] = useState<ChartTab>("volatility");


  function exportPng() {
  if (!chartRef.current) return;
  toPng(chartRef.current).then((dataUrl) => {
    const link = document.createElement("a");
    link.download = `${activeTicker}-${activeChart}.png`;
    link.href = dataUrl;
    link.click();
  });
}

function exportCsv() {
  const data =
    activeChart === "price" ? priceChartData :
    activeChart === "volatility" ? volChartData :
    returnsChartData;

  const keys = Object.keys(data[0]);
  const rows = [keys.join(","), ...data.map((row) => keys.map((k) => (row as any)[k] ?? "").join(","))];
  const blob = new Blob([rows.join("\n")], { type: "text/csv" });
  const link = document.createElement("a");
  link.download = `${activeTicker}-${activeChart}.csv`;
  link.href = URL.createObjectURL(blob);
  link.click();
}
  function getVolRegime(vol: number): { label: string; color: string } {
    if (vol < 15)
      return { label: "LOW", color: "text-blue-400 border-blue-400/30" };
    if (vol < 25)
      return { label: "NORMAL", color: "text-green-400 border-green-400/30" };
    if (vol < 40)
      return { label: "ELEVATED", color: "text-amber-400 border-amber-400/30" };
    return { label: "EXTREME", color: "text-red-400 border-red-400/30" };
  }

  function getTermStructure(
    vol30: number,
    vol90: number,
  ): { label: string; desc: string; color: string } {
    const diff = vol90 - vol30;
    if (diff > 2)
      return {
        label: "CONTANGO",
        desc: "Vol curve rising — market expects increasing uncertainty",
        color: "text-amber-400 border-amber-400/30",
      };
    if (diff < -2)
      return {
        label: "BACKWARDATION",
        desc: "Vol curve falling — market expects conditions to calm",
        color: "text-blue-400 border-blue-400/30",
      };
    return {
      label: "FLAT",
      desc: "Vol curve flat — no strong directional expectation",
      color: "text-zinc-400 border-zinc-400/30",
    };
  }

  const termStructure = useMemo(() => {
    if (!predictedVolatility) return null;
    const vol30 = predictedVolatility.vol_30d * 100;
    const vol90 = predictedVolatility.vol_90d * 100;
    return getTermStructure(vol30, vol90);
  }, [predictedVolatility]);

  const latestPrice = useMemo(() => {
    if (!prices.length || !activeTicker) return null;
    const last = prices[prices.length - 1];
    return last[activeTicker] as number;
  }, [prices, activeTicker]);

  const dailyChange = useMemo(() => {
    if (!returns.length || !activeChart) return null;
    const last = returns[returns.length - 1];
    return (last[activeTicker] as number) * 100;
  }, [returns, activeTicker]);

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
    () => prices.map((row) => ({ date: row.Date, value: row[activeTicker] })),
    [prices, activeTicker],
  );

  const predictedCurve = useMemo(() => {
    if (!predictedVolatility) return [];

    return Object.entries(predictedVolatility)
      .filter(([key]) => key.startsWith("vol_"))
      .map(([key, value]) => ({
        horizon: parseInt(key.split("_")[1]),
        value: value * 100,
      }))
      .sort((a, b) => a.horizon - b.horizon);
  }, [predictedVolatility]);

  const volChartData = useMemo(() => {
    if (!realizedVol.length) return [];

    const predMap = new Map(
      historicalPredictions.map((p) => [
        p.date.split("T")[0],
        p.predicted_vol_30,
      ]),
    );

    const historical = realizedVol.map((row) => ({
      x: row.Date,
      realized: row[activeTicker],
      predicted: predMap.get((row.Date as string).split("T")[0]) ?? null,
    }));

    if (!predictedCurve.length) return historical;

    const lastDate = new Date(realizedVol[realizedVol.length - 1].Date);

    const future = predictedCurve.map((point) => {
      const futureDate = new Date(lastDate);
      futureDate.setDate(futureDate.getDate() + point.horizon);
      return {
        x: futureDate.toISOString().split("T")[0],
        realized: null,
        predicted: point.value,
      };
    });

    return [...historical, ...future];
  }, [realizedVol, activeTicker, predictedCurve, historicalPredictions]);

  const returnsChartData = useMemo(
    () =>
      returns.map((row) => ({
        date: row.Date,
        value: (row[activeTicker] as number) * 100,
      })),
    [returns, activeTicker],
  );

  const isLoading =
    pricesLoading ||
    returnsLoading ||
    realizedVolLoading ||
    historicalVolLoading;

  const change = dailyChange ?? 0;
  const priceColor = change >= 0 ? "#22c55e" : "#ef4444";
  const regime = realized30dVol ? getVolRegime(realized30dVol) : null;

  if (isLoading) {
    return (
      <main className="bg-black min-h-screen flex items-center justify-center">
        <LoadingScreen />
      </main>
    );
  }
  return (
    <main className="bg-black text-white min-h-screen">
      {isGuest && (
        <div className="bg-white/5 border-b border-white/10 px-12 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80 font-medium">
              Guest Mode • Demo Data Active
            </span>
          </div>
          <span className="text-[9px] text-white/20 uppercase tracking-widest">
            Sign in for historical data on all assets
          </span>
        </div>
      )}
      <section className="px-12 pt-10 flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-semibold">{activeTicker}</h1>
          <p
            className={`text-lg ${change >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            {change > 0 ? "+" : ""}
            {change.toFixed(2)}%
          </p>
        </div>

        <StockDropdown
          stocks={tickers}
          selected={activeTicker}
          setSelected={setSelectedTicker}
        />
      </section>

      <section className="px-12 flex gap-6 py-6">
        <div className="flex-1">
          <StatCard
            label="Price"
            value={latestPrice != null ? `$${latestPrice.toFixed(2)}` : "—"}
          />
        </div>

        <div className="flex-1 flex flex-col gap-2">
          <StatCard
            label="30D Volatility"
            value={
              realized30dVol != null ? `${realized30dVol.toFixed(2)}%` : "—"
            }
          />
          {regime && (
            <span
              className={`self-start text-xs px-2 py-0.5 border tracking-widest cursor-default ${regime.color}`}
              title={`${regime.label}: ${
                regime.label === "LOW"
                  ? "Realized vol below 15% — unusually calm market"
                  : regime.label === "NORMAL"
                    ? "Realized vol 15–25% — typical market conditions"
                    : regime.label === "ELEVATED"
                      ? "Realized vol 25–40% — heightened uncertainty"
                      : "Realized vol above 40% — extreme market stress"
              }`}
            >
              {regime.label}
            </span>
          )}
        </div>

        <div className="flex-1">
          <StatCard
            label="Daily Change"
            value={`${change >= 0 ? "+" : ""}${change.toFixed(2)}%`}
            sub={`${change >= 0 ? "+" : ""}${change.toFixed(2)}%`}
            up={change >= 0}
          />
        </div>
      </section>

      {/* Chart tabs */}
      <section className="px-12 pb-12">
        <div className="flex gap-4 mb-4">
          {(["volatility", "price", "returns"] as ChartTab[]).map((tab) => (
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


        {activeChart === "volatility" && termStructure && (
    <div className="flex items-center gap-3 mb-4">
      <span
        className={`text-xs px-2 py-0.5 border tracking-widest cursor-default ${termStructure.color}`}
        title={termStructure.desc}
      >
        {termStructure.label}
      </span>
      <span className="text-zinc-500 text-xs">{termStructure.desc}</span>
    </div>
  )}

  <div className="flex items-center gap-2 mb-3">
  <button onClick={exportCsv} title="Export as CSV" className="text-zinc-500 hover:text-white transition-colors">
    <FileDown size={15} />
  </button>
  <button onClick={exportPng} title="Export as PNG" className="text-zinc-500 hover:text-white transition-colors">
    <ImageDown size={15} />
  </button>
</div>

      <div ref={chartRef}>
        {activeChart === "price" && (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={priceChartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.2)"
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
                width={60}
              />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Line
                type="monotone"
                dataKey="value"
                stroke={priceColor}
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeChart === "volatility" && (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={volChartData}>
  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
  <XAxis dataKey="x" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} />
  <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} width={50} />
  <Tooltip contentStyle={TOOLTIP_STYLE} />
  <Legend
    verticalAlign="top"
    align="right"
    wrapperStyle={{ fontSize: 11, color: "rgba(255,255,255,0.4)", paddingBottom: 12 }}
  />
  <Line type="monotone" dataKey="realized" stroke="#f59e0b" strokeWidth={1.5} dot={false} name="Realized Vol" />
  <Line type="monotone" dataKey="predicted" stroke="#a78bfa" strokeWidth={2} dot={false} name="Predicted Vol" connectNulls />
</LineChart>
          </ResponsiveContainer>
        )}

        {activeChart === "returns" && (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={returnsChartData} barCategoryGap="20%">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                width={50}
              />
              <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" />
              <Tooltip contentStyle={TOOLTIP_STYLE} />
              <Bar dataKey="value" radius={[2, 2, 0, 0]} fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      </section>
    </main> 
  );
}
