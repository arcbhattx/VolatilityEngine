type ChartTab = "price" | "volatility" | "returns";

type Props = {
  active: ChartTab;
  setActive: (tab: ChartTab) => void;
};

export default function ChartTabs({ active, setActive }: Props) {
  const tabs: { id: ChartTab; label: string }[] = [
    { id: "price", label: "Price" },
    { id: "volatility", label: "Volatility" },
    { id: "returns", label: "Returns" },
  ];

  return (
    <div className="flex gap-6 border-b border-white/10 mb-6">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => setActive(t.id)}
          className={`pb-2 text-sm ${
            active === t.id
              ? "text-white border-b-2 border-white"
              : "text-white/60 hover:text-white"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
