"use client";

import { useEffect, useState } from "react";

interface TopbarProps {
  title: string;
}

export default function Topbar({ title }: TopbarProps) {
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
        })
      );
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="h-14 flex items-center justify-between px-8 bg-black border-b border-white/[0.06]">
      {/* Left — page title */}
      <div className="flex items-center gap-3">
        {/* Accent pip */}
        <span className="block w-[3px] h-4 rounded-full bg-green-400/80" />
        <span className="text-[11px] tracking-[0.25em] uppercase text-white/60 font-medium">
          {title}
        </span>
      </div>

      {/* Right — live clock + market status */}
      <div className="flex items-center gap-6">
        {/* Market status badge */}
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-400" />
          </span>
          <span className="text-[10px] tracking-widest uppercase text-green-400/80">
            Market Open
          </span>
        </div>

        {/* Divider */}
        <span className="w-px h-4 bg-white/[0.08]" />

        {/* Clock */}
        <div className="flex items-center gap-2 text-[11px] tabular-nums">
          <span className="text-white/25">{date}</span>
          <span className="text-white/60 font-medium">{time}</span>
        </div>
      </div>
    </header>
  );
}