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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4 glass-card"
    >
      <div className="text-xs text-zinc-400">{date}</div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span className="text-lg font-semibold">{basePoints}/100</span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            pass ? "bg-[color:var(--accent-pass)]/20 text-[color:var(--accent-pass)]" : "bg-zinc-800 text-zinc-300"
          }`}
        >
          {pass ? "PASS" : "KEEP GOING"}
        </span>
        {perfect && (
          <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs font-medium text-yellow-400">
            Perfect +50
          </span>
        )}
        <span className="ml-auto text-sm text-zinc-300">Day Score: <span className="text-yellow-400">{dayScore}</span></span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
        <motion.div whileHover={{ scale: 1.02 }} className="rounded-xl bg-white/5 p-3 border border-white/5">
          <div className="text-zinc-400">Cumulative</div>
          <div className="text-yellow-400 font-semibold">{totalPoints}</div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="rounded-xl bg-white/5 p-3 border border-white/5">
          <div className="text-zinc-400">Available</div>
          <div className="text-[color:var(--accent-pass)] font-semibold">{availablePoints}</div>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="rounded-xl bg-white/5 p-3 border border-white/5">
          <div className="text-zinc-400">Streak</div>
          <div className="font-semibold">{streakDays}d</div>
        </motion.div>
      </div>
      <motion.div whileHover={{ scale: 1.01 }} className="mt-3 rounded-xl bg-white/5 p-3 text-sm border border-white/5">
        <div className="text-zinc-400">Level</div>
        <div className="font-semibold">{level.name} • {level.threshold}+ pts</div>
      </motion.div>
    </motion.div>
  );
}
