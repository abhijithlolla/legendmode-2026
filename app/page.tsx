"use client";
import { useEffect, useMemo, useState } from "react";
import HabitList from "@/components/HabitList";
import ScoreCard from "@/components/ScoreCard";
import PowerUps from "@/components/PowerUps";
import Calendar from "@/components/Calendar";
import Charts from "@/components/Charts";
import { BASE_MAX, DayEntry, HABITS, POWER_UPS, PowerPurchase, PowerUp } from "@/lib/habits";
import { fmt } from "@/lib/date";
import { levelFromPoints, scoreDay } from "@/lib/scoring";
import { load, save } from "@/lib/storage";

export default function Home() {
  const todayKey = fmt(new Date());
  const [selected, setSelected] = useState<string>(todayKey);
  const [days, setDays] = useState<Record<string, DayEntry>>({});
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [powerPurchases, setPowerPurchases] = useState<PowerPurchase[]>([]);

  // load from localStorage
  useEffect(() => {
    const p = load();
    setDays(p.days);
    setTotalPoints(p.totalPoints);
    setStreakDays(p.streakDays);
    setPowerPurchases(p.powerPurchases);
  }, []);

  // persist to localStorage
  useEffect(() => {
    save({ days, totalPoints, streakDays, powerPurchases });
  }, [days, totalPoints, streakDays, powerPurchases]);

  const entry = days[selected] ?? {
    date: selected,
    completed: Object.fromEntries(HABITS.map((h) => [h.id, false])) as Record<string, boolean>,
    basePoints: 0,
    pass: false,
    perfect: false,
    scoreWithBonuses: 0,
  } as DayEntry;

  const availablePoints = useMemo(() => {
    const spent = powerPurchases.reduce((s, p) => s + p.cost, 0);
    return Math.max(0, totalPoints - spent);
  }, [totalPoints, powerPurchases]);

  function recomputeFor(dateKey: string, completed: Record<string, boolean>) {
    // streak counts consecutive pass days up to today
    const current = scoreDay(dateKey, completed, streakDays);
    const newDays = { ...days, [dateKey]: current };

    // recompute streak based on up-to-today chain
    let newStreak = 0;
    let cursor = new Date();
    while (true) {
      const key = fmt(cursor);
      const e = newDays[key];
      if (e?.pass) newStreak += 1;
      else break;
      cursor.setDate(cursor.getDate() - 1);
    }

    // recompute total points (cumulative scoreWithBonuses)
    const newTotal = Object.values(newDays).reduce((s, e) => s + e.scoreWithBonuses, 0);

    setDays(newDays);
    setStreakDays(newStreak);
    setTotalPoints(newTotal);
  }

  function toggleHabit(id: string) {
    const completed = { ...entry.completed, [id]: !entry.completed[id] };
    recomputeFor(selected, completed);
  }

  function setAll(val: boolean) {
    const completed = Object.fromEntries(HABITS.map((h) => [h.id, val])) as Record<string, boolean>;
    recomputeFor(selected, completed);
  }

  function purchase(power: PowerUp) {
    if (availablePoints < power.cost) return;
    const rec: PowerPurchase = { id: crypto.randomUUID(), date: fmt(new Date()), powerUpId: power.id, cost: power.cost };
    setPowerPurchases((arr) => [...arr, rec]);
  }

  const level = levelFromPoints(totalPoints);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-[#1a1a1a]/80 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Legend Mode 2026</h1>
          <div className="text-sm text-zinc-400">Be consistent. Become a legend.</div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-4 space-y-4">
        <ScoreCard
          date={selected}
          basePoints={entry.basePoints}
          pass={entry.pass}
          perfect={entry.perfect}
          dayScore={entry.scoreWithBonuses}
          totalPoints={totalPoints}
          availablePoints={availablePoints}
          streakDays={streakDays}
          level={level}
        />

        <Calendar selected={selected} onSelect={setSelected} />

        <div className="rounded-2xl border border-zinc-800 p-4 bg-zinc-900/50">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm text-zinc-400">10 Daily Habits</div>
            <div className="flex gap-2">
              <button onClick={() => setAll(true)} className="rounded-lg border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800">All</button>
              <button onClick={() => setAll(false)} className="rounded-lg border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800">None</button>
            </div>
          </div>
          <HabitList completed={entry.completed} onToggle={toggleHabit} />
        </div>

        <Charts days={days} />

        <PowerUps availablePoints={availablePoints} onPurchase={purchase} />

        <footer className="py-8 text-center text-xs text-zinc-500">PWA ready • Install from browser menu to home screen</footer>
      </main>
    </div>
  );
}
