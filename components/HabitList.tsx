"use client";
import { HABITS, Habit } from "@/lib/habits";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  completed: Record<string, boolean>;
  onToggle: (id: string) => void;
};

export default function HabitList({ completed, onToggle }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {HABITS.map((h: Habit, idx: number) => (
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.03 }}
          whileHover={{ y: -4, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          key={h.id}
          onClick={() => onToggle(h.id)}
          className={`group flex flex-col items-start gap-4 rounded-3xl border p-5 text-left glass-surface glass-interactive
          ${completed[h.id]
              ? "border-emerald-500/50 bg-emerald-500/5"
              : "border-white/5"}`}
        >
          <div className="flex w-full items-start justify-between">
            <div className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition-all duration-500
              ${completed[h.id]
                ? "bg-emerald-500 border-emerald-400 text-black shadow-lg shadow-emerald-500/40 rotate-[360deg]"
                : "bg-white/5 border-white/10 text-zinc-400"}`}
            >
              {completed[h.id] ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span className="text-[10px] font-bold">0{idx + 1}</span>
              )}
            </div>
            <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter
              ${completed[h.id] ? "bg-emerald-500/20 text-emerald-400" : "bg-zinc-800 text-zinc-500"}`}
            >
              {h.points} PTS
            </div>
          </div>

          <div>
            <div className="font-bold text-sm text-zinc-100 group-hover:text-white transition-colors">{h.name}</div>
            <div className="mt-1 text-[10px] text-zinc-500 font-medium uppercase tracking-widest leading-none">
              {h.star ? "🔥 Priority Discipline" : "Standard Task"}
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
