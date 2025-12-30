"use client";

type Props = {
  value: number; // 0-100
  pass: boolean;
  perfect?: boolean;
};

export default function ProgressBar({ value, pass, perfect }: Props) {
  const pct = Math.max(0, Math.min(100, value));
  const color = perfect
    ? "from-yellow-400 to-yellow-600"
    : pass
    ? "from-[color:var(--accent-pass)] to-emerald-400"
    : "from-zinc-500 to-zinc-400";
  return (
    <div className="w-full">
      <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
        <div
          className={`h-2 bg-gradient-to-r ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="mt-1 text-[10px] text-zinc-400">{pct}/100</div>
    </div>
  );
}
