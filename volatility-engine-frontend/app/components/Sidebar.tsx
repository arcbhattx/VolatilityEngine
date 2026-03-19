// Sidebar.tsx
"use client";

import SidebarItem from "./SidebarItem";
import {
  BarChart2,
  Activity,
  Signal,
  Globe,
  Star,
  Settings,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const NAV_MAIN = [
  { id: "dashboard", label: "Dashboard", icon: <BarChart2 size={15} /> },
  { id: "analytics", label: "Analytics", icon: <Activity size={15} /> },
  { id: "signals", label: "Signals", icon: <Signal size={15} />, badge: 3 },
  { id: "markets", label: "Markets", icon: <Globe size={15} /> },
  { id: "watchlist", label: "Watchlist", icon: <Star size={15} />, badge: 7 },
];

const NAV_BOTTOM = [
  { id: "settings", label: "Settings", icon: <Settings size={15} /> },
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
  return (
    <aside
      className={`
        ${collapsed ? "w-[60px]" : "w-[220px]"}
        h-screen bg-black flex flex-col
        border-r border-white/[0.06]
        transition-[width] duration-300 ease-in-out
        shrink-0 overflow-hidden
      `}
    >
      {/* Header */}
      <div className="h-14 flex items-center justify-between px-3 border-b border-white/[0.06]">
        {/* Wordmark */}
        <div
          className={`flex items-center gap-2 transition-all duration-300 overflow-hidden ${
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          }`}
        >
          {/* Small accent pip matching topbar */}
          <span className="block w-[3px] h-3.5 rounded-full bg-green-400/80 shrink-0" />
          <span className="text-[11px] tracking-[0.25em] uppercase text-white/70 font-medium whitespace-nowrap">
            Volatility Engine
          </span>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`
            flex items-center justify-center w-7 h-7 rounded-md
            text-white/50 hover:text-white hover:bg-white/[0.06]
            transition-colors duration-150 cursor-pointer shrink-0
            ${collapsed ? "mx-auto" : "ml-auto"}
          `}
        >
          {collapsed ? (
            <PanelLeftOpen size={16} />
          ) : (
            <PanelLeftClose size={16} />
          )}
        </button>
      </div>

      {/* Section label */}
      {!collapsed && (
        <div className="px-4 pt-5 pb-1">
          <span className="text-[9px] tracking-[0.3em] uppercase text-white/20 font-semibold">
            Menu
          </span>
        </div>
      )}

      {/* Main nav */}
      <nav className="flex-1 pt-1 px-1.5">
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

      {/* Divider */}
      <div className="mx-3 h-px bg-white/[0.05] mb-2" />

      {/* Bottom nav */}
      <div className="pb-3 px-1.5">
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
