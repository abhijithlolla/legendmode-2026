"use client";
import { DayEntry } from "@/lib/habits";

type Props = {
  days: Record<string, DayEntry>;
};

export default function Charts({ days }: Props) {
  const entries = Object.values(days)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14); // last 14

  const max = Math.max(100, ...entries.map((e) => e.basePoints));

  return (
    <div className="rounded-2xl border border-zinc-800 p-3 bg-zinc-900/50">
      <div className="mb-2 text-sm text-zinc-400">Last 14 Days (Base Points)</div>
      <div className="flex items-end gap-1 h-28">
        {entries.map((e) => {
          const h = Math.max(4, Math.round((e.basePoints / max) * 100));
          const color = e.pass ? "bg-[color:var(--accent-pass)]" : "bg-zinc-600";
          return (
            <div key={e.date} title={`${e.date}: ${e.basePoints}`}
              className={`w-2 rounded-t ${color}`}
              style={{ height: `${h}%` }} />
          );
        })}
      </div>
    </div>
  );
}
