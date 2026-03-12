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
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: collapsed ? "12px 0" : "12px 16px",
        justifyContent: collapsed ? "center" : "flex-start",
        background: active ? "rgba(255,255,255,0.06)" : "transparent",
        border: "none",
        cursor: "pointer",
        color: "#fff",
      }}
      title={collapsed ? label : undefined}
    >
      <span>{icon}</span>
      {!collapsed && <span>{label}</span>}
      {!collapsed && badge !== undefined && (
        <span style={{ marginLeft: "auto" }}>{badge}</span>
      )}
    </button>
  );
}
