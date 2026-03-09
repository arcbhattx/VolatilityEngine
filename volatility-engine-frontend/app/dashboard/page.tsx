"use client";
import { useState, useMemo, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { BarChart } from "@mui/x-charts/BarChart";
import { useAuth } from "../context/authContext";
import { useRouter } from "next/navigation";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const STOCKS = ["AAPL", "TSLA", "NVDA", "MSFT", "AMZN", "BTC-USD", "META", "GOOG"];

const STATS: Record<string, { price: string; hv30: string; iv: string; beta: string; change: string; up: boolean }> = {
  AAPL:    { price: "213.42", hv30: "18.4%", iv: "22.1%", beta: "1.21", change: "+1.3%", up: true },
  TSLA:    { price: "178.90", hv30: "62.3%", iv: "71.5%", beta: "2.34", change: "−3.8%", up: false },
  NVDA:    { price: "884.55", hv30: "44.7%", iv: "52.8%", beta: "1.98", change: "+2.1%", up: true },
  MSFT:    { price: "415.20", hv30: "21.2%", iv: "24.0%", beta: "0.89", change: "+0.4%", up: true },
  AMZN:    { price: "192.80", hv30: "29.1%", iv: "33.4%", beta: "1.15", change: "+0.7%", up: true },
  "BTC-USD":{ price: "67,430", hv30: "58.9%", iv: "74.2%", beta: "—", change: "−1.2%", up: false },
  META:    { price: "520.18", hv30: "35.6%", iv: "41.3%", beta: "1.44", change: "+1.9%", up: true },
  GOOG:    { price: "175.30", hv30: "24.8%", iv: "28.7%", beta: "1.05", change: "+0.6%", up: true },
};

function generatePriceSeries(seed: number, days = 90) {
  let price = 100 + seed * 13;
  return Array.from({ length: days }, (_, i) => {
    price = price * (1 + (Math.sin(i * seed) * 0.015 + (Math.random() - 0.495) * 0.022));
    return +price.toFixed(2);
  });
}

function generateVolSeries(seed: number, days = 90) {
  return Array.from({ length: days }, (_, i) =>
    +(18 + Math.abs(Math.sin(i * 0.3 + seed) * 25) + Math.random() * 6).toFixed(2)
  );
}

function generateReturnSeries(days = 90) {
  return Array.from({ length: days }, () =>
    +((Math.random() - 0.49) * 4).toFixed(3)
  );
}

const LABELS = Array.from({ length: 90 }, (_, i) => {
  const d = new Date(2025, 0, 1);
  d.setDate(d.getDate() + i);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
});

// ─── Chart theme helpers ──────────────────────────────────────────────────────

const AXIS_STYLE = {
  tickLabelStyle: { fill: "rgba(255,255,255,0.2)", fontSize: 10, fontFamily: "inherit" },
  labelStyle: { fill: "rgba(255,255,255,0.2)" },
  stroke: "rgba(255,255,255,0.06)",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub, up }: { label: string; value: string; sub?: string; up?: boolean }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase" }}>
        {label}
      </span>
      <span style={{ color: "#fff", fontSize: 22, fontWeight: 300, letterSpacing: "-0.01em" }}>{value}</span>
      {sub && (
        <span style={{ fontSize: 11, color: up ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.28)" }}>{sub}</span>
      )}
    </div>
  );
}

type ChartTab = "price" | "volatility" | "returns";

export default function Dashboard() {

  const { token, loading} = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState("AAPL");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeChart, setActiveChart] = useState<ChartTab>("price");

  const seed = STOCKS.indexOf(selected) + 1;
  const prices = useMemo(() => generatePriceSeries(seed), [seed]);
  const vols = useMemo(() => generateVolSeries(seed), [seed]);
  const returns_ = useMemo(() => generateReturnSeries(), [seed]);
  const stat = STATS[selected];

    useEffect(() => {
    if (!loading && !token) {
      router.push("/login");
    }
  }, [token, loading, router]);



  const chartTabs: { id: ChartTab; label: string }[] = [
    { id: "price", label: "Price" },
    { id: "volatility", label: "Rolling Vol" },
    { id: "returns", label: "Daily Returns" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "#080808", color: "#fff", fontFamily: "inherit" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .tab-btn { background: transparent; border: none; cursor: pointer; color: rgba(255,255,255,0.25); font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase; padding: 6px 0; transition: color 0.2s; }
        .tab-btn:hover, .tab-btn.active { color: #fff; }
        .chart-tab { background: transparent; border: none; cursor: pointer; font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; padding: 7px 16px; color: rgba(255,255,255,0.25); transition: all 0.2s; border-bottom: 1px solid transparent; }
        .chart-tab:hover { color: rgba(255,255,255,0.6); }
        .chart-tab.active { color: #fff; border-bottom-color: rgba(255,255,255,0.4); }
        .stock-opt { padding: 10px 20px; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; color: rgba(255,255,255,0.4); cursor: pointer; transition: all 0.15s; background: transparent; border: none; width: 100%; text-align: left; font-family: inherit; }
        .stock-opt:hover { color: #fff; background: rgba(255,255,255,0.04); }
      `}</style>

      {/* Navbar */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "32px 48px" }}>
        <span style={{ fontSize: 12, letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 300 }}>
          Volatility Engine
        </span>
        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {["Markets", "Analytics", "Signals"].map((item) => (
            <a key={item} href="#" style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", transition: "color 0.3s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#fff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
            >{item}</a>
          ))}
          <button style={{ padding: "8px 20px", border: "1px solid rgba(255,255,255,0.2)", background: "transparent", color: "#fff", fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}>
            Get Started
          </button>
        </div>
      </nav>

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 48px" }} />

      {/* Page title + dropdown */}
      <section style={{ padding: "40px 48px 32px" }}>
        <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 24 }}>
          Dashboard — Volatility Analytics
        </p>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
            <h1 style={{ fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1 }}>
              {selected}
            </h1>
            <span style={{ fontSize: 14, color: stat.up ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.28)", fontWeight: 300 }}>
              {stat.change}
            </span>
          </div>

          {/* Dropdown */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              style={{
                background: "transparent", border: "1px solid rgba(255,255,255,0.15)",
                color: "#fff", padding: "10px 24px", fontSize: 11, letterSpacing: "0.3em",
                textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 16, fontFamily: "inherit"
              }}
            >
              {selected}
              <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 9 }}>{dropdownOpen ? "▲" : "▼"}</span>
            </button>
            {dropdownOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 4px)", right: 0, minWidth: 160,
                background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.1)",
                zIndex: 50
              }}>
                {STOCKS.map(s => (
                  <button key={s} className="stock-opt"
                    style={{ color: s === selected ? "#fff" : undefined }}
                    onClick={() => { setSelected(s); setDropdownOpen(false); }}
                  >{s}</button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section style={{ padding: "0 48px 32px", display: "flex", gap: 56, flexWrap: "wrap" }}>
        <StatCard label="Price" value={`$${stat.price}`} />
        <StatCard label="HV 30D" value={stat.hv30} sub={stat.change} up={stat.up} />
        <StatCard label="Impl. Vol" value={stat.iv} />
        <StatCard label="Beta" value={stat.beta} />
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.35)", display: "inline-block" }} />
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 10, letterSpacing: "0.35em", textTransform: "uppercase" }}>Live</span>
        </div>
      </section>

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 48px" }} />

      {/* Chart section */}
      <section style={{ padding: "0 48px 48px" }}>
        {/* Chart tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 32 }}>
          {chartTabs.map(t => (
            <button key={t.id} className={`chart-tab ${activeChart === t.id ? "active" : ""}`}
              onClick={() => setActiveChart(t.id)}
            >{t.label}</button>
          ))}
        </div>

        {/* Charts */}
        {activeChart === "price" && (
          <LineChart
            xAxis={[{ data: LABELS, scaleType: "band", tickLabelInterval: (_, i) => i % 15 === 0, ...AXIS_STYLE }]}
            yAxis={[{ ...AXIS_STYLE, tickFormatter: (v: number) => `$${v}` }]}
            series={[{
              data: prices,
              label: selected,
              color: "rgba(255,255,255,0.7)",
              showMark: false,
              area: true,
            }]}
            height={320}
            sx={{
              "& .MuiAreaElement-root": { fill: "rgba(255,255,255,0.04)" },
              "& .MuiLineElement-root": { strokeWidth: 1.5 },
              "& .MuiChartsLegend-root": { display: "none" },
              "& .MuiChartsAxis-line": { stroke: "rgba(255,255,255,0.06)" },
              "& .MuiChartsGrid-line": { stroke: "rgba(255,255,255,0.04)" },
              "& .MuiChartsTooltip-root": { background: "#111", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 0 },
              backgroundColor: "transparent",
            }}
            grid={{ horizontal: true }}
          />
        )}

        {activeChart === "volatility" && (
          <LineChart
            xAxis={[{ data: LABELS, scaleType: "band", tickLabelInterval: (_, i) => i % 15 === 0, ...AXIS_STYLE }]}
            yAxis={[{ ...AXIS_STYLE, tickFormatter: (v: number) => `${v}%` }]}
            series={[{
              data: vols,
              label: "30D HV",
              color: "rgba(255,255,255,0.55)",
              showMark: false,
              area: true,
            }]}
            height={320}
            sx={{
              "& .MuiAreaElement-root": { fill: "rgba(255,255,255,0.04)" },
              "& .MuiLineElement-root": { strokeWidth: 1.5 },
              "& .MuiChartsLegend-root": { display: "none" },
              "& .MuiChartsAxis-line": { stroke: "rgba(255,255,255,0.06)" },
              "& .MuiChartsGrid-line": { stroke: "rgba(255,255,255,0.04)" },
              backgroundColor: "transparent",
            }}
            grid={{ horizontal: true }}
          />
        )}

        {activeChart === "returns" && (
          <BarChart
            xAxis={[{ data: LABELS, scaleType: "band", tickLabelInterval: (_, i) => i % 15 === 0, ...AXIS_STYLE }]}
            yAxis={[{ ...AXIS_STYLE, tickFormatter: (v: number) => `${v}%` }]}
            series={[{
              data: returns_,
              label: "Daily Return",
              color: "rgba(255,255,255,0.4)",
            }]}
            height={320}
            sx={{
              "& .MuiChartsLegend-root": { display: "none" },
              "& .MuiChartsAxis-line": { stroke: "rgba(255,255,255,0.06)" },
              "& .MuiChartsGrid-line": { stroke: "rgba(255,255,255,0.04)" },
              backgroundColor: "transparent",
            }}
            grid={{ horizontal: true }}
          />
        )}
      </section>

      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 48px" }} />

      {/* Stock comparison strip */}
      <section style={{ padding: "32px 48px" }}>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, letterSpacing: "0.4em", textTransform: "uppercase", marginBottom: 24 }}>
          All Instruments
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 1, background: "rgba(255,255,255,0.06)" }}>
          {STOCKS.map(s => {
            const st = STATS[s];
            const active = s === selected;
            return (
              <div key={s}
                onClick={() => setSelected(s)}
                style={{
                  padding: "20px 24px", background: active ? "rgba(255,255,255,0.05)" : "#080808",
                  cursor: "pointer", transition: "background 0.2s",
                  borderBottom: active ? "1px solid rgba(255,255,255,0.3)" : "1px solid transparent"
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLDivElement).style.background = "#080808"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: active ? "#fff" : "rgba(255,255,255,0.5)" }}>{s}</span>
                  <span style={{ fontSize: 10, color: st.up ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.25)" }}>{st.change}</span>
                </div>
                <div style={{ fontSize: 18, fontWeight: 300, color: "#fff", marginBottom: 4 }}>${st.price}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: "0.1em" }}>HV {st.hv30}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 48px" }} />
      <footer style={{ padding: "24px 48px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 10, letterSpacing: "0.3em", textTransform: "uppercase" }}>
          © 2026 Volatility Engine
        </span>
        <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 11 }}>Not financial advice.</span>
      </footer>
    </main>
  );
}