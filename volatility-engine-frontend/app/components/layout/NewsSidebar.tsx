"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import { useStockNews } from "../../api-hooks/news";
import { Newspaper, ExternalLink, Clock } from "lucide-react";

export default function NewsSidebar() {
  const searchParams = useSearchParams();
  const ticker = searchParams.get("ticker") || "AAPL";
  const { news, loading, error } = useStockNews(ticker);

  if (!ticker) return null;

  return (
    <aside className="w-80 h-screen bg-black border-l border-white/[0.06] flex flex-col overflow-hidden fixed right-0 top-0 z-40">
      <div className="h-20 flex items-center px-6 border-b border-white/[0.04] shrink-0">
        <div className="flex items-center gap-3">
          <Newspaper size={18} className="text-green-400" />
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-white/90">
            Market News
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {loading ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-24 bg-white/[0.03] rounded-xl" />
                <div className="h-3 bg-white/[0.03] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : error || news.length === 0 ? (
          <div className="text-zinc-500 text-[10px] text-center py-20 px-6 uppercase tracking-widest leading-relaxed opacity-50">
            {error ? "News sync failed" : `No recent stories found for ${ticker}`}
          </div>
        ) : (
          news.map((item, idx) => (
            <a 
              key={idx} 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group block bg-[#09090b] border border-white/[0.02] hover:border-white/[0.08] p-4 rounded-xl transition-all duration-300"
            >
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-[10px] font-bold text-green-400 uppercase tracking-widest">
                    {item.publisher}
                  </span>
                  <ExternalLink size={12} className="text-zinc-600 group-hover:text-white transition-colors" />
                </div>
                
                <h3 className="text-xs font-medium text-white/80 group-hover:text-white line-clamp-3 leading-relaxed">
                  {item.title}
                </h3>
                
                <div className="flex items-center gap-1.5 mt-1">
                  <Clock size={10} className="text-zinc-600" />
                  <span className="text-[10px] text-zinc-600 uppercase">
                    {new Date(item.providerPublishTime * 1000).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </a>
          ))
        )}
      </div>
    </aside>
  );
}
