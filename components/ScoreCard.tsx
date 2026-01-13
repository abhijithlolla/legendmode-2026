"use client";
import { Level } from "@/lib/scoring";
import { motion } from "framer-motion";

type Props = {
  date: string;
  basePoints: number;
  pass: boolean;
  perfect: boolean;
  dayScore: number;
  totalPoints: number;
  availablePoints: number;
  streakDays: number;
  level: Level;
};

export default function ScoreCard({
  date,
  basePoints,
  pass,
  perfect,
  dayScore,
  totalPoints,
  availablePoints,
  streakDays,
  level,
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-3xl p-6 glass-surface space-y-6"
    >
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">Mission Protocol</div>
        <div className="text-[10px] font-bold text-emerald-400 tabular-nums">{date}</div>
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Total Score</div>
          <div className="text-4xl font-black text-white tracking-tighter neon-glow">
            {totalPoints.toLocaleString()}
            <span className="text-zinc-600 text-lg ml-1 font-medium">pts</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">Level Progress</div>
          <div className="text-xs font-bold text-zinc-200">{level.name.split(' ')[1]} {level.name.split(' ')[0]}</div>
        </div>
      </div>

      {/* Progress Bar HUD */}
      <div className="space-y-2">
        <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
          <span className="text-zinc-500">Daily Efficiency</span>
          <span className={pass ? "text-emerald-400" : "text-amber-500"}>{basePoints}%</span>
        </div>
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${basePoints}%` }}
            className={`h-full ring-1 ring-inset ring-white/20 shadow-[0_0_10px_rgba(16,185,129,0.2)] 
              ${pass ? "bg-emerald-500" : "bg-amber-500"}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4">
          <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Available Repo</div>
          <div className="text-lg font-black text-emerald-100 tabular-nums">{availablePoints}</div>
        </div>
        <div className="rounded-2xl bg-white/[0.02] border border-white/5 p-4">
          <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Current Streak</div>
          <div className="text-lg font-black text-amber-100 tabular-nums">{streakDays}d</div>
        </div>
      </div>

      {perfect && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center justify-between"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Perfect Execution</span>
          <span className="text-xs font-black text-emerald-400">+50 BONUS</span>
        </motion.div>
      )}
    </motion.div>
  );
}
