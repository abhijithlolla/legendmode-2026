"use client";
import { HABITS, Habit } from "@/lib/habits";

type Props = {
  completed: Record<string, boolean>;
  onToggle: (id: string) => void;
};

export default function HabitList({ completed, onToggle }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {HABITS.map((h: Habit) => (
        <button
          key={h.id}
          onClick={() => onToggle(h.id)}
          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors
          ${completed[h.id] ? "bg-[color:var(--accent-pass)]/10 border-[color:var(--accent-pass)]" : "border-zinc-700 hover:bg-zinc-800"}`}
        >
          <div>
            <div className="text-sm text-zinc-400">{h.star ? "⭐" : ""} {h.points} pts</div>
            <div className="font-medium">{h.name}</div>
          </div>
          <div
            className={`h-5 w-5 rounded-full border ${completed[h.id] ? "bg-[color:var(--accent-pass)] border-[color:var(--accent-pass)]" : "border-zinc-500"}`}
          />
        </button>
      ))}
    </div>
  );
}
