"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "../Topbar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Define routes that should not show the sidebar/topbar
  const isAuthPage = pathname?.includes("/signin") || pathname?.includes("/signup");

  if (isAuthPage) {
    return <>{children}</>;
  }

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
