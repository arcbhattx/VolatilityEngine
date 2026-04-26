"use client";

import { useEffect, useState } from "react";

export default function Topbar() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [isMarketOpen, setIsMarketOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      
      // Get time in NY timezone
      const nyTime = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        weekday: "short",
        hour12: false,
      }).formatToParts(now);

      const parts: Record<string, string> = {};
      nyTime.forEach(p => parts[p.type] = p.value);

      const weekday = parts.weekday;
      const hour = parseInt(parts.hour);
      const minute = parseInt(parts.minute);

      const isWeekday = !["Sat", "Sun"].includes(weekday);
      const totalMinutes = hour * 60 + minute;
      const openTime = 9 * 60 + 30; // 9:30
      const closeTime = 16 * 60;   // 16:00

      setIsMarketOpen(isWeekday && totalMinutes >= openTime && totalMinutes < closeTime);

      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }),
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="h-20 flex items-center justify-between px-10 bg-black border-b border-white/[0.06]">
      {/* Left — placeholder or dynamic breadcrumb */}
      <div className="flex items-center gap-4 text-zinc-500 text-xs tracking-widest uppercase">
        Dashboard / Home
      </div>

      {/* Right — live clock + market status */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            {isMarketOpen && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${isMarketOpen ? "bg-green-400" : "bg-zinc-600"}`} />
          </span>
          <span className={`text-xs tracking-widest uppercase ${isMarketOpen ? "text-green-400/80" : "text-zinc-500"}`}>
            {isMarketOpen ? "Market Open" : "Market Closed"}
          </span>
        </div>

        <span className="w-px h-5 bg-white/[0.08]" />

        <div className="flex items-center gap-3 text-sm tabular-nums">
          <span className="text-white/25">{date}</span>
          <span className="text-white/60 font-medium">{time}</span>
        </div>
      </div>
    </header>
  );
}