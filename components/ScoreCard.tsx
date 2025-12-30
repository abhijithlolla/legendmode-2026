"use client";
import { Level } from "@/lib/scoring";

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
    <div className="rounded-2xl border border-zinc-800 p-4 bg-zinc-900/50">
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
        <div className="rounded-xl bg-zinc-800/60 p-3">
          <div className="text-zinc-400">Cumulative</div>
          <div className="text-yellow-400 font-semibold">{totalPoints}</div>
        </div>
        <div className="rounded-xl bg-zinc-800/60 p-3">
          <div className="text-zinc-400">Available</div>
          <div className="text-[color:var(--accent-pass)] font-semibold">{availablePoints}</div>
        </div>
        <div className="rounded-xl bg-zinc-800/60 p-3">
          <div className="text-zinc-400">Streak</div>
          <div className="font-semibold">{streakDays}d</div>
        </div>
      </div>
      <div className="mt-3 rounded-xl bg-zinc-800/60 p-3 text-sm">
        <div className="text-zinc-400">Level</div>
        <div className="font-semibold">{level.name} • {level.threshold}+ pts</div>
      </div>
    </div>
  );
}
