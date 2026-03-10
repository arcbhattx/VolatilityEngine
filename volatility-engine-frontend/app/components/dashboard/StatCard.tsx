type Props = {
  label: string;
  value: string;
  sub?: string;
  up?: boolean;
};

export default function StatCard({ label, value, sub, up }: Props) {
  return (
    <div className="flex flex-col gap-1 bg-[#111] px-6 py-4 rounded-lg border border-white/10">
      <span className="text-white/70 text-xs uppercase tracking-wider">
        {label}
      </span>

      <span className="text-white text-2xl font-semibold">
        {value}
      </span>

      {sub && (
        <span
          className={`text-sm ${
            up ? "text-green-400" : "text-red-400"
          }`}
        >
          {sub}
        </span>
      )}
    </div>
  );
}