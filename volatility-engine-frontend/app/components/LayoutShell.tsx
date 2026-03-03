"use client";

import { useState, ReactNode } from "react";
import Sidebar from "./Sidebar";

// ─── Topbar ───────────────────────────────────────────────────────────────────

function Topbar({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header
      style={{
        height: 64,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 36px",
        background: "#080808",
        flexShrink: 0,
      }}
    >
      {/* Left: breadcrumb-style title */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
        <span
          style={{
            fontSize: 11,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#fff",
            fontWeight: 400,
          }}
        >
          {title}
        </span>
        {subtitle && (
          <>
            <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 11 }}>/</span>
            <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)" }}>
              {subtitle}
            </span>
          </>
        )}
      </div>

      {/* Right: live indicator + avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.35)",
              display: "inline-block",
              boxShadow: "0 0 6px rgba(255,255,255,0.2)",
            }}
          />
          <span
            style={{
              fontSize: 9,
              letterSpacing: "0.4em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            Live
          </span>
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.08)" }} />

        {/* Avatar */}
        <div
          style={{
            width: 28,
            height: 28,
            border: "1px solid rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.05em" }}>TR</span>
        </div>
      </div>
    </header>
  );
}

// ─── Page title mappings ──────────────────────────────────────────────────────

const PAGE_TITLES: Record<string, { title: string; subtitle?: string }> = {
  dashboard: { title: "Dashboard",  subtitle: "Overview" },
  analytics: { title: "Analytics",  subtitle: "Volatility" },
  signals:   { title: "Signals",    subtitle: "Real-Time" },
  markets:   { title: "Markets",    subtitle: "All Instruments" },
  watchlist: { title: "Watchlist",  subtitle: "Tracked" },
  settings:  { title: "Settings" },
};

// ─── LayoutShell ──────────────────────────────────────────────────────────────

interface LayoutShellProps {
  /** The page content to render in the main area */
  children: ReactNode;
  /** Override the active nav item (defaults to "dashboard") */
  defaultPage?: string;
}

export default function LayoutShell({ children, defaultPage = "dashboard" }: LayoutShellProps) {
  const [activePage, setActivePage] = useState(defaultPage);
  const { title, subtitle } = PAGE_TITLES[activePage] ?? { title: activePage };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: "#080808",
        color: "#fff",
        fontFamily: "'Inter', system-ui, sans-serif",
        overflow: "hidden",
      }}
    >
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
      `}</style>

      {/* Sidebar */}
      <Sidebar activeId={activePage} onNavigate={setActivePage} />

      {/* Main column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>

        {/* Topbar */}
        <Topbar title={title} subtitle={subtitle} />

        {/* Scrollable content area */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "hidden",
            background: "#080808",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}