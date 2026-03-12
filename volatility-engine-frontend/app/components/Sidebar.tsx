"use client";

import SidebarItem from "./SidebarItem";
import {
  BarChart2,
  Activity,
  Signal,
  Globe,
  Star,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const NAV_MAIN = [
  { id: "dashboard", label: "Dashboard", icon: <BarChart2 size={16} /> },
  { id: "analytics", label: "Analytics", icon: <Activity size={16} /> },
  { id: "signals", label: "Signals", icon: <Signal size={16} />, badge: 3 },
  { id: "markets", label: "Markets", icon: <Globe size={16} /> },
  { id: "watchlist", label: "Watchlist", icon: <Star size={16} />, badge: 7 },
];

const NAV_BOTTOM = [
  { id: "settings", label: "Settings", icon: <Settings size={16} /> },
];

interface SidebarProps {
  activeId?: string;
  onNavigate?: (id: string) => void;
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
}

export default function Sidebar({
  activeId = "dashboard",
  onNavigate,
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const width = collapsed ? 60 : 220;

  return (
    <aside
      style={{
        width,
        height: "100vh",
        background: "#080808",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        transition: "width 0.25s",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {!collapsed && <span style={{ color: "#fff" }}>Volatility Engine</span>}

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Main navigation */}
      <nav style={{ flex: 1, paddingTop: 16 }}>
        {NAV_MAIN.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            badge={item.badge}
            active={activeId === item.id}
            collapsed={collapsed}
            onClick={() => onNavigate?.(item.id)}
          />
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ paddingBottom: 16 }}>
        {NAV_BOTTOM.map((item) => (
          <SidebarItem
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={activeId === item.id}
            collapsed={collapsed}
            onClick={() => onNavigate?.(item.id)}
          />
        ))}
      </div>
    </aside>
  );
}
