"use client";
import { HABITS, Habit } from "@/lib/habits";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  completed: Record<string, boolean>;
  onToggle: (id: string) => void;
};

export default function HabitList({ completed, onToggle }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3">
      {HABITS.map((h: Habit, idx: number) => (
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: idx * 0.05 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          key={h.id}
          onClick={() => onToggle(h.id)}
          className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-300
          ${completed[h.id] ? "bg-[color:var(--accent-pass)]/10 border-[color:var(--accent-pass)]/50 shadow-[0_0_15px_-5px_var(--accent-pass)]" : "border-white/5 glass-card-hover"}`}
        >
          <div>
            <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mb-0.5">
              {h.star ? "⭐ " : ""}{h.points} points
            </div>
            <div className="font-semibold text-zinc-100">{h.name}</div>
          </div>
          <div className="relative flex items-center justify-center h-6 w-6">
            <div
              className={`absolute inset-0 rounded-full border-2 transition-all duration-500
              ${completed[h.id] ? "bg-[color:var(--accent-pass)] border-[color:var(--accent-pass)] scale-110" : "border-zinc-700 scale-100"}`}
            />
            {completed[h.id] && (
              <motion.svg
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                className="relative z-10 w-4 h-4 text-[#1a1a1a]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={4}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </motion.svg>
            )}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
