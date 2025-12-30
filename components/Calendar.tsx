"use client";
import { addDays, fmt, parseDay, startOfWeek } from "@/lib/date";

type Props = {
  selected: string; // YYYY-MM-DD
  onSelect: (date: string) => void;
};

export default function Calendar({ selected, onSelect }: Props) {
  const today = new Date();
  const start = addDays(startOfWeek(today), -7); // show last week + this week
  const days: string[] = Array.from({ length: 14 }).map((_, i) => fmt(addDays(start, i)));

  return (
    <div className="rounded-2xl border border-zinc-800 p-3 bg-zinc-900/50">
      <div className="mb-2 text-sm text-zinc-400">Calendar</div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const isSelected = d === selected;
          const label = new Date(d).getDate();
          return (
            <button
              key={d}
              onClick={() => onSelect(d)}
              className={`h-10 rounded-xl border text-sm ${
                isSelected
                  ? "border-[color:var(--accent-pass)] bg-[color:var(--accent-pass)]/10 text-[color:var(--accent-pass)]"
                  : "border-zinc-700 hover:bg-zinc-800"
              }`}
              title={d}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
