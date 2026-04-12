"use client";

import { useEffect, useState } from "react";

export default function Topbar() {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
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
      {/* Left — fixed title */}
      <div className="flex items-center gap-4">
        <span className="block w-1 h-6 rounded-full bg-green-400/80" />
        <span className="text-lg tracking-[0.2em] uppercase text-white/80 font-semibold">
          Volatility Engine
        </span>
      </div>

      {/* Right — live clock + market status */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
          </span>
          <span className="text-xs tracking-widest uppercase text-green-400/80">
            Market Open
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