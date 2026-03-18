// SidebarItem.tsx
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
      className={`
        relative w-full flex items-center gap-3
        ${collapsed ? "justify-center px-0 py-3" : "justify-start px-4 py-2.5"}
        group transition-colors duration-150 cursor-pointer border-none
        ${active ? "text-white" : "text-white/40 hover:text-white/70"}
      `}
    >
      {/* Active indicator bar */}
      {active && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-5 rounded-r-full bg-green-400" />
      )}

      {/* Active / hover background */}
      <span
        className={`
          absolute inset-x-2 inset-y-0.5 rounded-md transition-colors duration-150
          ${active ? "bg-white/[0.06]" : "bg-transparent group-hover:bg-white/[0.03]"}
        `}
      />

      {/* Icon */}
      <span className="relative z-10 shrink-0">{icon}</span>

      {/* Label */}
      {!collapsed && (
        <span className="relative z-10 text-[12px] tracking-wide font-medium whitespace-nowrap">
          {label}
        </span>
      )}

      {/* Badge */}
      {!collapsed && badge !== undefined && (
        <span className="relative z-10 ml-auto text-[10px] font-semibold tabular-nums px-1.5 py-0.5 rounded-md bg-white/[0.07] text-white/50">
          {badge}
        </span>
      )}
    </button>
  );
}