"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "../Topbar";
import { useAuth } from "../../api-hooks/auth";
import NewsSidebar from "./NewsSidebar";
import { Suspense } from "react";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [isChecking, setIsChecking] = useState(true);

  // Define routes that should not show the sidebars/topbar
  const isAuthPage = pathname?.includes("/signin") || pathname?.includes("/signup");

  useEffect(() => {
    // Basic auth check
    if (!isAuthPage && !isAuthenticated()) {
      router.push("/signin");
    } else {
      setIsChecking(false);
    }
  }, [isAuthPage, isAuthenticated, router]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  // Prevent flash of content while checking auth
  if (isChecking && !isAuthPage) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-400/20 border-t-green-400 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${collapsed ? "pl-20" : "pl-64"} pr-80`}
      >
        <Topbar />
        <main className="flex-1">
          <Suspense fallback={null}>
            {children}
          </Suspense>
        </main>
      </div>
      <Suspense fallback={null}>
        <NewsSidebar />
      </Suspense>
    </div>
  );
}
