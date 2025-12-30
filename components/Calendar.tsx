"use client";
import { fmt } from "@/lib/date";
import { DayEntry } from "@/lib/habits";
import { useMemo, useState } from "react";

type Props = {
  selected: string; // YYYY-MM-DD
  days: Record<string, DayEntry>;
  onSelect: (date: string) => void;
};

function startOfMonth(d: Date) {
  const n = new Date(d.getFullYear(), d.getMonth(), 1);
  n.setHours(0, 0, 0, 0);
  return n;
}
function addDays(d: Date, delta: number) {
  const n = new Date(d);
  n.setDate(n.getDate() + delta);
  return n;
}

export default function Calendar({ selected, days, onSelect }: Props) {
  const sel = new Date(selected);
  const [cursor, setCursor] = useState<Date>(new Date(sel.getFullYear(), sel.getMonth(), 1));

  const grid = useMemo(() => {
    const first = startOfMonth(cursor);
    const firstWeekday = (first.getDay() + 6) % 7; // Monday=0
    const start = addDays(first, -firstWeekday);
    return Array.from({ length: 42 }).map((_, i) => addDays(start, i));
  }, [cursor]);

  const monthLabel = cursor.toLocaleString(undefined, { month: "long", year: "numeric" });
  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="rounded-2xl border border-zinc-800 p-3 bg-zinc-900/50">
      <div className="mb-3 flex items-center justify-between">
        <button
          className="rounded-lg border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
        >
          Prev
        </button>
        <div className="text-sm font-medium">{monthLabel}</div>
        <button
          className="rounded-lg border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
        >
          Next
        </button>
      </div>

      <div className="mb-1 grid grid-cols-7 text-center text-xs text-zinc-400">
        {weekdays.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {grid.map((d) => {
          const key = fmt(d);
          const inMonth = d.getMonth() === cursor.getMonth();
          const isSelected = key === selected;
          const entry = days[key];
          const pass = entry?.pass;
          const hasAny = entry && (entry.basePoints ?? 0) > 0;
          const dotClass = pass
            ? "bg-[color:var(--accent-pass)]"
            : hasAny
            ? "bg-yellow-500"
            : "bg-zinc-700";
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`h-12 rounded-lg border text-sm flex items-center justify-center relative ${
                isSelected
                  ? "border-[color:var(--accent-pass)] bg-[color:var(--accent-pass)]/10 text-[color:var(--accent-pass)]"
                  : inMonth
                  ? "border-zinc-700 hover:bg-zinc-800"
                  : "border-zinc-800 text-zinc-500"
              }`}
              title={key}
            >
              {d.getDate()}
              <span className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${dotClass}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
