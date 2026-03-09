"use client";
import { useState, useMemo, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";
import useStockPrices from "../api-hooks/dashboard";

const AXIS_STYLE = {
  tickLabelStyle: { fill: "rgba(255,255,255,0.2)", fontSize: 10, fontFamily: "inherit" },
  labelStyle: { fill: "rgba(255,255,255,0.2)" },
  stroke: "rgba(255,255,255,0.06)",
};

function StatCard({ label, value, sub, up }: { label: string; value: string; sub?: string; up?: boolean }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-white/25 text-[10px] tracking-[0.35em] uppercase">{label}</span>
      <span className="text-white text-[22px] font-light tracking-tight">{value}</span>
      {sub && (
        <span className={`text-[11px] ${up ? "text-white/50" : "text-white/30"}`}>{sub}</span>
      )}
    </div>
  );
}

function generateVolSeries(prices: number[]) {
  if (prices.length < 2) return Array(prices.length).fill(0);
  return prices.map((_, i) => {
    if (i < 2) return 0;
    const window = prices.slice(Math.max(0, i - 30), i);
    const mean = window.reduce((a, b) => a + b, 0) / window.length;
    const variance = window.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / window.length;
    return +((Math.sqrt(variance) / mean) * 100).toFixed(2);
  });
}

function computeReturns(prices: number[]) {
  return prices.map((p, i) => {
    if (i === 0) return 0;
    return +((p - prices[i - 1]) / prices[i - 1] * 100).toFixed(3);
  });
}

type ChartTab = "price" | "volatility" | "returns";

const chartSx = {
  "& .MuiAreaElement-root": { fill: "rgba(255,255,255,0.04)" },
  "& .MuiLineElement-root": { strokeWidth: 1.5 },
  "& .MuiChartsLegend-root": { display: "none" },
  "& .MuiChartsAxis-line": { stroke: "rgba(255,255,255,0.06)" },
  "& .MuiChartsGrid-line": { stroke: "rgba(255,255,255,0.04)" },
  backgroundColor: "transparent",
};

export default function Dashboard() {
  const { prices: rawPrices, loading: apiLoading, error } = useStockPrices();
  const { token, loading } = useAuth();
  const router = useRouter();

  const [selected, setSelected] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeChart, setActiveChart] = useState<ChartTab>("price");

  const stocks = useMemo(() => {
    if (!rawPrices.length) return [];
    return Object.keys(rawPrices[0]).filter(k => k !== "Date");
  }, [rawPrices]);

  const labels = useMemo(() => rawPrices.map(r => r.Date as string), [rawPrices]);

  useEffect(() => {
    if (stocks.length && !selected) setSelected(stocks[0]);
  }, [stocks]);

  useEffect(() => {
    if (!loading && !token) router.push("/login");
  }, [token, loading, router]);

  const priceSeries = useMemo(
    () => rawPrices.map(r => r[selected] as number),
    [rawPrices, selected]
  );

  const volSeries = useMemo(() => generateVolSeries(priceSeries), [priceSeries]);
  const returnSeries = useMemo(() => computeReturns(priceSeries), [priceSeries]);

  const latestPrice = priceSeries.at(-1) ?? 0;
  const prevPrice = priceSeries.at(-2) ?? latestPrice;
  const dayChange = prevPrice ? ((latestPrice - prevPrice) / prevPrice) * 100 : 0;
  const isUp = dayChange >= 0;
  const hv30 = volSeries.at(-1) ?? 0;

  const chartTabs: { id: ChartTab; label: string }[] = [
    { id: "price", label: "Price" },
    { id: "volatility", label: "Rolling Vol" },
    { id: "returns", label: "Daily Returns" },
  ];

  if (loading || apiLoading) {
    return (
      <main className="min-h-screen bg-[#080808] flex items-center justify-center">
        <span className="text-white/20 text-[11px] tracking-[0.4em] uppercase">Loading...</span>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#080808] flex items-center justify-center">
        <span className="text-white/30 text-[11px] tracking-[0.3em]">Error: {error}</span>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white font-sans">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-12 py-8">
        <span className="text-[12px] tracking-[0.4em] uppercase font-light">Volatility Engine</span>
        <div className="flex items-center gap-10">
          {["Markets", "Analytics", "Signals"].map(item => (
            <a key={item} href="#"
              className="text-white/30 text-[11px] tracking-[0.2em] uppercase no-underline hover:text-white transition-colors duration-300"
            >{item}</a>
          ))}
          <button className="px-5 py-2 border border-white/20 bg-transparent text-white text-[11px] tracking-[0.2em] uppercase cursor-pointer hover:border-white/40 transition-colors">
            Get Started
          </button>
        </div>
      </nav>

      <div className="h-px bg-white/[0.06] mx-12" />

      {/* Page title + dropdown */}
      <section className="px-12 pt-10 pb-8">
        <p className="text-white/25 text-[10px] tracking-[0.4em] uppercase mb-6">
          Dashboard — Volatility Analytics
        </p>
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-4">
            <h1 className="text-[clamp(2.5rem,6vw,5rem)] font-light tracking-tight leading-none">
              {selected}
            </h1>
            <span className={`text-sm font-light ${isUp ? "text-white/50" : "text-white/30"}`}>
              {isUp ? "+" : ""}{dayChange.toFixed(2)}%
            </span>
          </div>

          {/* Dropdown */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className="bg-transparent border border-white/15 text-white px-6 py-2.5 text-[11px] tracking-[0.3em] uppercase cursor-pointer flex items-center gap-4 hover:border-white/30 transition-colors"
            >
              {selected}
              <span className="text-white/30 text-[9px]">{dropdownOpen ? "▲" : "▼"}</span>
            </button>
            {dropdownOpen && (
              <div className="absolute top-[calc(100%+4px)] right-0 min-w-40 bg-[#0f0f0f] border border-white/10 z-50">
                {stocks.map(s => (
                  <button key={s}
                    className={`block w-full text-left px-5 py-2.5 text-[11px] tracking-[0.3em] uppercase bg-transparent border-none cursor-pointer transition-all hover:text-white hover:bg-white/[0.04] ${s === selected ? "text-white" : "text-white/40"}`}
                    onClick={() => { setSelected(s); setDropdownOpen(false); }}
                  >{s}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="px-12 pb-8 flex gap-14 flex-wrap items-center">
        <StatCard label="Price" value={`$${latestPrice.toFixed(2)}`} />
        <StatCard
          label="HV 30D"
          value={`${hv30.toFixed(1)}%`}
          sub={`${isUp ? "+" : ""}${dayChange.toFixed(2)}%`}
          up={isUp}
        />
        <div className="ml-auto flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white/35 inline-block" />
          <span className="text-white/25 text-[10px] tracking-[0.35em] uppercase">Live</span>
        </div>
      </section>

      <div className="h-px bg-white/[0.06] mx-12" />

      {/* Chart section */}
      <section className="px-12 pb-12">
        {/* Chart tabs */}
        <div className="flex border-b border-white/[0.06] mb-8">
          {chartTabs.map(t => (
            <button key={t.id}
              onClick={() => setActiveChart(t.id)}
              className={`bg-transparent border-none cursor-pointer text-[10px] tracking-[0.25em] uppercase px-4 py-2 transition-all border-b border-transparent -mb-px
                ${activeChart === t.id ? "text-white border-b-white/40" : "text-white/25 hover:text-white/60"}`}
            >{t.label}</button>
          ))}
        </div>

        {activeChart === "price" && (
          <LineChart
            xAxis={[{ data: labels, scaleType: "band", tickLabelInterval: (_, i) => i % 15 === 0, ...AXIS_STYLE }]}
            yAxis={[{ ...AXIS_STYLE, tickFormatter: (v: number) => `$${v}` }]}
            series={[{ data: priceSeries, label: selected, color: "rgba(255,255,255,0.7)", showMark: false, area: true }]}
            height={320}
            sx={{ ...chartSx, "& .MuiChartsTooltip-root": { background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 0 } }}
            grid={{ horizontal: true }}
          />
        )}

        {activeChart === "volatility" && (
          <LineChart
            xAxis={[{ data: labels, scaleType: "band", tickLabelInterval: (_, i) => i % 15 === 0, ...AXIS_STYLE }]}
            yAxis={[{ ...AXIS_STYLE, tickFormatter: (v: number) => `${v.toFixed(1)}%` }]}
            series={[{ data: volSeries, label: "30D HV", color: "rgba(255,255,255,0.55)", showMark: false, area: true }]}
            height={320}
            sx={chartSx}
            grid={{ horizontal: true }}
          />
        )}

        {activeChart === "returns" && (
          <BarChart
            xAxis={[{ data: labels, scaleType: "band", tickLabelInterval: (_, i) => i % 15 === 0, ...AXIS_STYLE }]}
            yAxis={[{ ...AXIS_STYLE, tickFormatter: (v: number) => `${v}%` }]}
            series={[{ data: returnSeries, label: "Daily Return", color: "rgba(255,255,255,0.4)" }]}
            height={320}
            sx={chartSx}
            grid={{ horizontal: true }}
          />
        )}
      </section>

      <div className="h-px bg-white/[0.06] mx-12" />

      {/* Stock comparison strip */}
      <section className="px-12 py-8">
        <p className="text-white/20 text-[10px] tracking-[0.4em] uppercase mb-6">All Instruments</p>
        <div className="grid gap-px bg-white/[0.06]" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}>
          {stocks.map(s => {
            const latest = rawPrices.at(-1)?.[s] as number ?? 0;
            const prev = rawPrices.at(-2)?.[s] as number ?? latest;
            const chg = prev ? ((latest - prev) / prev) * 100 : 0;
            const up = chg >= 0;
            const active = s === selected;
            return (
              <div key={s}
                onClick={() => setSelected(s)}
                className={`px-6 py-5 cursor-pointer transition-colors duration-200 border-b
                  ${active ? "bg-white/[0.05] border-white/30" : "bg-[#080808] border-transparent hover:bg-white/[0.03]"}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-[11px] tracking-[0.2em] uppercase ${active ? "text-white" : "text-white/50"}`}>{s}</span>
                  <span className={`text-[10px] ${up ? "text-white/45" : "text-white/25"}`}>
                    {up ? "+" : ""}{chg.toFixed(2)}%
                  </span>
                </div>
                <div className="text-[18px] font-light text-white mb-1">${latest.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="h-px bg-white/[0.06] mx-12" />

      {/* Footer */}
      <footer className="px-12 py-6 flex justify-between items-center">
        <span className="text-white/20 text-[10px] tracking-[0.3em] uppercase">© 2026 Volatility Engine</span>
        <span className="text-white/15 text-[11px]">Not financial advice.</span>
      </footer>
    </main>
  );
}