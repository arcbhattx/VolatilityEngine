"use client";

import { usePathname } from "next/navigation";
import LayoutShell from "./LayoutShell";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Routes that should NOT use LayoutShell
  const noLayoutRoutes = ["/login", "/signup", "/"];

  if (noLayoutRoutes.includes(pathname)) {
    return <>{children}</>;
  }

  return <LayoutShell>{children}</LayoutShell>;
}