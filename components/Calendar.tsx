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
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <button
          className="p-2 rounded-xl hover:bg-white/5 transition-colors text-zinc-500 hover:text-white"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-200">{monthLabel}</div>
        <button
          className="p-2 rounded-xl hover:bg-white/5 transition-colors text-zinc-500 hover:text-white"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekdays.map((w) => (
          <div key={w} className="py-2 text-[9px] font-black uppercase tracking-widest text-zinc-600 text-center">
            {w[0]}
          </div>
        ))}
        {grid.map((d) => {
          const key = fmt(d);
          const inMonth = d.getMonth() === cursor.getMonth();
          const isSelected = key === selected;
          const entry = days[key];
          const pass = entry?.pass;
          const hasAny = entry && (entry.basePoints ?? 0) > 0;

          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center transition-all duration-300 relative group
                ${isSelected ? "bg-white/10 ring-1 ring-white/20" : "hover:bg-white/5"}
                ${!inMonth && "opacity-20"}`}
            >
              <span className={`text-[10px] font-bold ${isSelected ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"}`}>
                {d.getDate()}
              </span>
              {hasAny && (
                <div className={`mt-1 h-1 w-1 rounded-full 
                  ${pass ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"}`}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
