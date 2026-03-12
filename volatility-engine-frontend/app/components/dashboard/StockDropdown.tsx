type Props = {
  stocks: string[];
  selected: string;
  setSelected: (s: string) => void;
};

import { useState } from "react";

export default function StockDropdown({
  stocks,
  selected,
  setSelected,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="border border-white/20 px-5 py-2 rounded-md text-white"
      >
        {selected}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-[#111] border border-white/10 rounded-md">
          {stocks.map((s) => (
            <button
              key={s}
              onClick={() => {
                setSelected(s);
                setOpen(false);
              }}
              className="block px-4 py-2 text-left text-white/80 hover:bg-white/10 w-full"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
