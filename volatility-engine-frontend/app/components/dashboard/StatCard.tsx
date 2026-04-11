type Props = {
  label: string;
  value: string;
  sub?: string;
  up?: boolean;
};

export function StatCard({ label, value, sub, up }: Props) {
  return (
    <div
      className="
        relative flex flex-col gap-1 bg-black px-6 py-4
        border border-white/10
        transition-all duration-300 ease-in-out
        hover:border-white/20
        group cursor-default
        hover:shadow-[0_0_24px_rgba(255,255,255,0.04)]
      "
    >
      {/* Subtle inner glow layer */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.03)_0%,transparent_70%)]" />

      <span className="text-white/70 text-xs uppercase tracking-wider">
        {label}
      </span>

      <span className="text-white text-2xl font-semibold">{value}</span>

      {sub && (
        <span className={`text-sm ${up ? "text-green-400" : "text-red-400"}`}>
          {sub}
        </span>
      )}
    </div>
  );
}
