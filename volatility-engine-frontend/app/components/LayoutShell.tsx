"use client";

import { useState, ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

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
    <div className="flex h-screen w-screen bg-black text-white overflow-hidden">
      <Sidebar
        activeId={activePage}
        onNavigate={setActivePage}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out min-w-0 gap-5">
        <Topbar title={title} />

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
