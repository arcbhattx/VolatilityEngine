"use client";

import { useState, useMemo, useEffect } from "react";
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

import StatCard from "../components/dashboard/StatCard";
import ChartTabs from "../components/dashboard/ChartTabs";
import StockDropdown from "../components/dashboard/StockDropdown";

import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import {
  useStockPrices,
  useStockReturns,
  useRealizedVolatility,
} from "../api-hooks/stocks";
import useVolatility from "../api-hooks/volatility";

type ChartTab = "price" | "volatility" | "returns";

function tickEvery<T>(arr: T[], n = 20): (T | "")[] {
  return arr.map((v, i) => (i % n === 0 ? v : ""));
}

const CHART_STYLE = { background: "transparent" } as const;

const TOOLTIP_STYLE = {
  backgroundColor: "#111",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "6px",
  color: "#fff",
  fontSize: 12,
};

export default function Dashboard() {
  const { prices: rawPrices } = useStockPrices();
  const { returns: rawReturns } = useStockReturns();
  const { realizedVol: rawVol } = useRealizedVolatility();
  const { token, loading } = useAuth();
  const router = useRouter();

  const [selected, setSelected] = useState("");
  const [activeChart, setActiveChart] = useState<ChartTab>("price");
  const { data: volatilityData, apiLoading } = useVolatility(selected);

  const stocks = useMemo(() => {
    if (!rawPrices.length) return [];
    return Object.keys(rawPrices[0]).filter((k) => k !== "Date");
  }, [rawPrices]);

  const labels = useMemo(
    () => rawPrices.map((r) => r.Date as string),
    [rawPrices],
  );

  useEffect(() => {
    if (stocks.length && !selected) setSelected(stocks[0]);
  }, [stocks]);

  useEffect(() => {
    if (!loading && !token) router.push("/login");
  }, [token]);

  const priceSeries = rawPrices.map((r) => r[selected] as number);

  const latestPrice = priceSeries.at(-1) ?? 0;
  const prevPrice = priceSeries.at(-2) ?? latestPrice;
  const change = prevPrice ? ((latestPrice - prevPrice) / prevPrice) * 100 : 0;

  const priceData = labels.map((date, i) => ({ date, value: priceSeries[i] }));

  const volData = rawVol.map((r) => ({
    date: r.Date as string,
    value: +(r[selected] as number).toFixed(2),
  }));

  const returnData = rawReturns.map((r) => ({
    date: r.Date as string,
    value: +((r[selected] as number) * 100).toFixed(3),
  }));

  const sparseLabels = tickEvery(labels, 20);
  const sparseVolLabels = tickEvery(
    volData.map((r) => r.date),
    20,
  );
  const sparseReturnLabels = tickEvery(
    returnData.map((r) => r.date),
    20,
  );

  const priceColor = change >= 0 ? "#22c55e" : "#ef4444";

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#080808] text-white">
        Loading...
      </div>
    );
  }

  return (
    <main className="bg-black text-white">
      <section className="px-12 flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-semibold">{selected}</h1>
          <p
            className={`text-lg ${change >= 0 ? "text-green-400" : "text-red-400"}`}
          >
            {change > 0 ? "+" : ""}
            {change.toFixed(2)}%
          </p>
        </div>
        <StockDropdown
          stocks={stocks}
          selected={selected}
          setSelected={setSelected}
        />
      </section>

      <section className="px-12 flex gap-6 pb-10 mt-2">
        <StatCard label="Price" value={`$${latestPrice.toFixed(2)}`} />
        <StatCard
          label="30D Volatility"
          value={
            apiLoading ? "Loading..." : `${volatilityData?.vol_30d.toFixed(2)}%`
          }
        />
        <StatCard
          label="Daily Change"
          value={`${change.toFixed(2)}%`}
          up={change > 0}
        />
      </section>

      <section className="px-12 pb-12">
        <ChartTabs active={activeChart} setActive={setActiveChart} />

        {activeChart === "price" && (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={priceData} style={CHART_STYLE}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="date"
                ticks={sparseLabels.filter(Boolean) as string[]}
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={["auto", "auto"]}
                tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v}`}
                width={60}
              />
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={
                  ((v: number) => [`$${v.toFixed(2)}`, "Price"]) as any
                }
                labelStyle={{ color: "rgba(255,255,255,0.5)", marginBottom: 4 }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={priceColor}
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 4, fill: priceColor }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeChart === "volatility" && (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={volData} style={CHART_STYLE}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
              />
              <XAxis
                dataKey="date"
                ticks={sparseVolLabels.filter(Boolean) as string[]}
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
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={
                  ((v: number) => [
                    `${v.toFixed(2)}%`,
                    "Realized Volatility",
                  ]) as any
                }
                labelStyle={{ color: "rgba(255,255,255,0.5)", marginBottom: 4 }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#f59e0b"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 4, fill: "#f59e0b" }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}

        {activeChart === "returns" && (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={returnData}
              style={CHART_STYLE}
              barCategoryGap="20%"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.04)"
                vertical={false}
              />
              <XAxis
                dataKey="date"
                ticks={sparseReturnLabels.filter(Boolean) as string[]}
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
              <Tooltip
                contentStyle={TOOLTIP_STYLE}
                formatter={
                  ((v: number) => [`${v.toFixed(3)}%`, "Return"]) as any
                }
                labelStyle={{ color: "rgba(255,255,255,0.5)", marginBottom: 4 }}
              />
              <Bar dataKey="value" radius={[2, 2, 0, 0]} fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </section>
    </main>
  );
}
