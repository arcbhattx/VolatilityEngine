"use client";

import { useState, useMemo, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";

import Navbar from "../components/Navbar";
import StatCard from "../components/dashboard/StatCard";
import ChartTabs from "../components/dashboard/ChartTabs";
import StockDropdown from "../components/dashboard/StockDropdown";

import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import useStockPrices from "../api-hooks/dashboard";
import useVolatility from "../api-hooks/volatility";

type ChartTab = "price" | "volatility" | "returns";

function generateVolSeries(prices: number[]) {
  if (prices.length < 2) return Array(prices.length).fill(0);

  return prices.map((_, i) => {
    if (i < 2) return 0;

    const window = prices.slice(Math.max(0, i - 30), i);
    const mean = window.reduce((a, b) => a + b, 0) / window.length;

    const variance =
      window.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / window.length;

    return +((Math.sqrt(variance) / mean) * 100).toFixed(2);
  });
}

function computeReturns(prices: number[]) {
  return prices.map((p, i) => {
    if (i === 0) return 0;
    return +(((p - prices[i - 1]) / prices[i - 1]) * 100).toFixed(3);
  });
}

export default function Dashboard() {
  const { prices: rawPrices } = useStockPrices();

  const { token, loading } = useAuth();
  const router = useRouter();

  const [selected, setSelected] = useState("");
  const [activeChart, setActiveChart] = useState<ChartTab>("price");
  const { data: volatilityData, apiLoading } = useVolatility(selected);

  const stocks = useMemo(() => {
    if (!rawPrices.length) return [];
    return Object.keys(rawPrices[0]).filter((k) => k !== "Date");
  }, [rawPrices]);

  const labels = useMemo(() => rawPrices.map((r) => r.Date as string), [rawPrices]);

  useEffect(() => {
    if (stocks.length && !selected) setSelected(stocks[0]);
  }, [stocks]);

  useEffect(() => {
    if (!loading && !token) router.push("/login");
  }, [token]);

  const priceSeries = rawPrices.map((r) => r[selected] as number);
  const volSeries = generateVolSeries(priceSeries);
  const returnSeries = computeReturns(priceSeries);

  const latestPrice = priceSeries.at(-1) ?? 0;
  const prevPrice = priceSeries.at(-2) ?? latestPrice;

  const change = prevPrice ? ((latestPrice - prevPrice) / prevPrice) * 100 : 0;

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#080808] text-white">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">

      <section className="px-12 flex justify-between items-center">
        <div>
          <h1 className="text-5xl font-semibold">{selected}</h1>
          <p className="text-white/70 text-lg">
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

      <section className="px-12 flex gap-6 pb-10">
        <StatCard label="Price" value={`$${latestPrice.toFixed(2)}`} />

        <StatCard
          label="30D Volatility"
          value={
            apiLoading
              ? "Loading..."
              : `${volatilityData?.vol_30d.toFixed(2)}%`
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
          <LineChart
            height={350}
            xAxis={[{ data: labels, scaleType: "band" }]}
            series={[{ data: priceSeries }]}
          />
        )}

        {activeChart === "volatility" && (
          <LineChart
            height={350}
            xAxis={[{ data: labels, scaleType: "band" }]}
            series={[{ data: volSeries }]}
          />
        )}

        {activeChart === "returns" && (
          <BarChart
            height={350}
            xAxis={[{ data: labels, scaleType: "band" }]}
            series={[{ data: returnSeries }]}
          />
        )}
      </section>

    </main>
  );
}