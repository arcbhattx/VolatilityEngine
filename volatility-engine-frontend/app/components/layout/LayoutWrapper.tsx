"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "../Topbar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "pl-20" : "pl-64"}`}
      >
        <Topbar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
