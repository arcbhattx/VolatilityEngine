"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

export default function SidebarItem({
  icon: Icon,
  label,
  active,
  collapsed,
  onClick,
}: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-4 px-3 py-2.5 rounded-md transition-all duration-200 group
        ${active ? "bg-white/[0.08] text-white" : "text-zinc-500 hover:text-white hover:bg-white/[0.04]"}
        ${collapsed ? "justify-center" : ""}
      `}
    >
      <div className="relative flex items-center justify-center">
        <Icon 
          size={18} 
          className={`transition-colors duration-200 ${active ? "text-green-400" : "group-hover:text-white"}`} 
        />
        {active && (
          <span className="absolute -left-[18px] w-1 h-4 bg-green-400 rounded-full" />
        )}
      </div>
      
      {!collapsed && (
        <span className="text-sm font-medium tracking-tight whitespace-nowrap opacity-100 transition-opacity duration-200">
          {label}
        </span>
      )}
      
      {collapsed && (
        <div className="absolute left-16 px-2 py-1 bg-zinc-900 text-white text-[10px] rounded border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </button>
  );
}
