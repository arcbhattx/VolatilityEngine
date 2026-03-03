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
        borderLeft: active ? "1px solid rgba(255,255,255,0.5)" : "1px solid transparent",
        cursor: "pointer",
        transition: "all 0.18s ease",
        position: "relative",
        fontFamily: "inherit",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
          (e.currentTarget as HTMLButtonElement).style.borderLeftColor = "rgba(255,255,255,0.15)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          (e.currentTarget as HTMLButtonElement).style.borderLeftColor = "transparent";
        }
      }}
    >
      {/* Icon */}
      <span
        style={{
          color: active ? "#fff" : "rgba(255,255,255,0.3)",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          fontSize: 15,
          transition: "color 0.18s",
        }}
      >
        {icon}
      </span>

      {/* Label */}
      {!collapsed && (
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: active ? "#fff" : "rgba(255,255,255,0.3)",
            fontWeight: 400,
            flex: 1,
            textAlign: "left",
            transition: "color 0.18s",
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      )}

      {/* Badge */}
      {!collapsed && badge !== undefined && (
        <span
          style={{
            fontSize: 9,
            letterSpacing: "0.1em",
            color: "rgba(255,255,255,0.25)",
            background: "rgba(255,255,255,0.07)",
            padding: "2px 7px",
            borderRadius: 2,
            flexShrink: 0,
          }}
        >
          {badge}
        </span>
      )}

      {/* Collapsed badge dot */}
      {collapsed && badge !== undefined && (
        <span
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.4)",
          }}
        />
      )}
    </button>
  );
}