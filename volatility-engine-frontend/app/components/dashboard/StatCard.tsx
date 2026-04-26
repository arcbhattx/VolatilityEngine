import React from "react";

type Props = {
  label: string;
  value: string;
  sub?: string;
  up?: boolean;
  badge?: {
    label: string;
    color: string;
  };
};

export function StatCard({ label, value, sub, up, badge }: Props) {
  return (
    <div className="group relative bg-[#09090b] border border-white/[0.04] hover:border-white/[0.08] p-4 rounded-xl transition-all duration-300">
      <div className="flex justify-between items-start mb-1">
        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 group-hover:text-zinc-400 transition-colors">
          {label}
        </span>
        {badge && (
          <span className={`text-[9px] px-2 py-0.5 border rounded-full font-bold tracking-widest ${badge.color}`}>
            {badge.label}
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-xl font-semibold tracking-tight text-white group-hover:text-green-400 transition-colors">
          {value}
        </span>
        {sub && (
          <span className={`text-[11px] font-medium ${up ? "text-green-400" : "text-red-400"}`}>
            {sub}
          </span>
        )}
      </div>
      
      {/* Subtle corner accent */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-green-500/5 to-transparent rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}
