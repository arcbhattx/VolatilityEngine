"use client";

import { ReactNode } from "react";

interface SidebarItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  badge?: string | number;
  onClick?: () => void;
}

export default function SidebarItem({
  icon,
  label,
  active = false,
  collapsed = false,
  badge,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      title={collapsed ? label : undefined}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: collapsed ? "12px 0" : "11px 20px",
        justifyContent: collapsed ? "center" : "flex-start",
        background: active ? "rgba(255,255,255,0.06)" : "transparent",
        border: "none",
        cursor: "pointer",
      }}
    >
      <span style={{ color: active ? "#fff" : "rgba(255,255,255,0.4)" }}>
        {icon}
      </span>

      {!collapsed && (
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
      )}

      {!collapsed && badge !== undefined && <span>{badge}</span>}
    </button>
  );
}