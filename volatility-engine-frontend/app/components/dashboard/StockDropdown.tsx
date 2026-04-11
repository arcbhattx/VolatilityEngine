import { useState } from "react";

type Props = {
  stocks: string[];
  selected: string;
  setSelected: (s: string) => void;
};

export function StockDropdown({ stocks, selected, setSelected }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-white/60 hover:text-white text-sm transition-colors"
      >
        <span className="text-white font-medium">{selected}</span>
        <span className="text-white/30">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-3 bg-black border border-white/10 z-10 min-w-[120px]">
          {stocks.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSelected(s);
                setOpen(false);
              }}
              className={`block w-full px-4 py-2 text-left text-sm transition-colors
                ${s === selected ? "text-white" : "text-white/40 hover:text-white"}`}
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
