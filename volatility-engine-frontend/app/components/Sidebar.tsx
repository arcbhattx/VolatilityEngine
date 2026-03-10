"use client";

import SidebarItem from "./SidebarItem";

// Icons
const Icon = ({ d, size = 15 }: { d: string; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const Icons = {
  dashboard: "M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z",
  analytics: "M3 3v18h18M7 16l4-4 4 4 4-6",
  signals: "M22 12h-4l-3 9L9 3l-3 9H2",
  markets:
    "M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z",
  watchlist:
    "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  settings:
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
  collapse: "M15 18l-6-6 6-6",
  expand: "M9 18l6-6-6-6",
};

const NAV_MAIN = [
  { id: "dashboard", label: "Dashboard", icon: <Icon d={Icons.dashboard} /> },
  { id: "analytics", label: "Analytics", icon: <Icon d={Icons.analytics} /> },
  { id: "signals", label: "Signals", icon: <Icon d={Icons.signals} />, badge: 3 },
  { id: "markets", label: "Markets", icon: <Icon d={Icons.markets} /> },
  { id: "watchlist", label: "Watchlist", icon: <Icon d={Icons.watchlist} />, badge: 7 },
];

const NAV_BOTTOM = [{ id: "settings", label: "Settings", icon: <Icon d={Icons.settings} /> }];

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
  const W = collapsed ? 64 : 220;

  return (
    <aside
      style={{
        width: W,
        minWidth: W,
        height: "100vh",
        background: "#080808",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
        transition: "width 0.25s ease",
      }}
    >
      {/* Header */}
      <div
        style={{
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: collapsed ? "0 10px" : "0 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 22,
              height: 22,
              border: "1px solid rgba(255,255,255,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ fontSize: 10, color: "#fff" }}>V</span>
          </div>

          {!collapsed && (
            <span
              style={{
                marginLeft: 12,
                fontSize: 11,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "#fff",
              }}
            >
              Volatility Engine
            </span>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <Icon d={collapsed ? Icons.expand : Icons.collapse} size={14} />
        </button>
      </div>

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

      <div style={{ paddingBottom: 10 }}>
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