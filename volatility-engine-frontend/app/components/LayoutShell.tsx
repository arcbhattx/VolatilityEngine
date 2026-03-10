"use client";

import { useState, ReactNode } from "react";
import Sidebar from "./Sidebar";

function Topbar({ title }: { title: string }) {
  return (
    <header
      style={{
        height: 64,
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        padding: "0 36px",
        background: "#080808",
      }}
    >
      <span
        style={{
          fontSize: 11,
          letterSpacing: "0.3em",
          textTransform: "uppercase",
        }}
      >
        {title}
      </span>
    </header>
  );
}

const PAGE_TITLES: Record<string, string> = {
  dashboard: "Dashboard",
  analytics: "Analytics",
  signals: "Signals",
  markets: "Markets",
  watchlist: "Watchlist",
  settings: "Settings",
};

interface LayoutShellProps {
  children: ReactNode;
  defaultPage?: string;
}

export default function LayoutShell({
  children,
  defaultPage = "dashboard",
}: LayoutShellProps) {
  const [activePage, setActivePage] = useState(defaultPage);
  const [collapsed, setCollapsed] = useState(false);

  const title = PAGE_TITLES[activePage];

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        background: "#080808",
        color: "#fff",
      }}
    >
      <Sidebar
        activeId={activePage}
        onNavigate={setActivePage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          transition: "all 0.25s ease",
        }}
      >
        <Topbar title={title} />

        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: 40,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}