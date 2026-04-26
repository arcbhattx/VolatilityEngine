"use client";

import React from "react";
import { 
  Menu, 
  LayoutDashboard, 
  LineChart, 
  Activity, 
  Bell, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import SidebarItem from "./SidebarItem";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  return (
    <aside 
      className={`
        fixed left-0 top-0 h-screen bg-black border-r border-white/[0.06] flex flex-col transition-all duration-300 z-40
        ${collapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Header Section (Logo + Toggle) */}
      <div className={`h-20 flex items-center border-b border-white/[0.04] px-4 ${collapsed ? "justify-center" : "justify-between"}`}>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-green-400 rounded-full flex-shrink-0" />
          {!collapsed && (
            <span className="text-xs font-bold tracking-[0.3em] uppercase text-white/90">
              VOL-ENG
            </span>
          )}
        </div>

        <button 
          onClick={() => setCollapsed(!collapsed)}
          className={`
            p-1.5 rounded-md hover:bg-white/[0.06] text-zinc-500 hover:text-white transition-colors
            ${collapsed ? "absolute inset-0 w-full h-full opacity-0 z-10" : ""}
          `}
          title={collapsed ? "Expand" : "Collapse"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 space-y-1 pt-2">
        <SidebarItem 
          icon={LayoutDashboard} 
          label="Dashboard" 
          active={true} 
          collapsed={collapsed} 
        />
        <SidebarItem 
          icon={LineChart} 
          label="Analytics" 
          collapsed={collapsed} 
        />
        <SidebarItem 
          icon={Activity} 
          label="Predictor" 
          collapsed={collapsed} 
        />
        <SidebarItem 
          icon={Bell} 
          label="Alerts" 
          collapsed={collapsed} 
        />
      </nav>

      {/* Bottom Items */}
      <div className="px-3 pb-6 space-y-1 border-t border-white/[0.04] pt-4">
        <SidebarItem 
          icon={Settings} 
          label="Settings" 
          collapsed={collapsed} 
        />
        <div className={`mt-4 px-3 flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex-shrink-0" />
           {!collapsed && (
             <div className="flex flex-col">
               <span className="text-sm font-medium text-white">Guest User</span>
               <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Premium</span>
             </div>
           )}
        </div>
      </div>
    </aside>
  );
}
