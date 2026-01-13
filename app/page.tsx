"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import HabitList from "@/components/HabitList";
import ScoreCard from "@/components/ScoreCard";
import PowerUps from "@/components/PowerUps";
import Calendar from "@/components/Calendar";
import Charts from "@/components/Charts";
import AuthPanel from "@/components/AuthPanel";
import { BASE_MAX, DayEntry, HABITS, POWER_UPS, PowerPurchase, PowerUp } from "@/lib/habits";
import { fmt } from "@/lib/date";
import { levelFromPoints, scoreDay } from "@/lib/scoring";
import { load, save } from "@/lib/storage";
import { pullDays, pullPurchases, pushDay, pushPurchase, autoSync } from "@/lib/sync";
import { supabase } from "@/lib/supabase";
import ProgressBar from "@/components/ProgressBar";
import { countRecentPasses, getMantra } from "@/lib/motivation";
import AmbientBackground from "@/components/AmbientBackground";
import { BentoGrid, BentoItem } from "@/components/BentoGrid";

export default function Home() {
  const router = useRouter();
  const todayKey = fmt(new Date());
  const [selected, setSelected] = useState<string>(todayKey);
  const [days, setDays] = useState<Record<string, DayEntry>>({});
  const [totalPoints, setTotalPoints] = useState<number>(0);
  const [streakDays, setStreakDays] = useState<number>(0);
  const [powerPurchases, setPowerPurchases] = useState<PowerPurchase[]>([]);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<string>("");
  const [minimalMode, setMinimalMode] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  // load from localStorage
  useEffect(() => {
    const p = load();
    setDays(p.days);
    setTotalPoints(p.totalPoints);
    setStreakDays(p.streakDays);
    setPowerPurchases(p.powerPurchases);
    setLastSyncedAt(p.lastSyncedAt ?? null);
    setMinimalMode(p.minimalMode ?? false);
  }, []);

  // Optional auth: check if user is signed in but don't force redirect
  useEffect(() => {
    let unsub: (() => void) | undefined;
    if (!supabase) {
      setAuthChecked(true);
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      setAuthChecked(true);
      // User can use the app whether signed in or not
    });
    const sub = supabase.auth.onAuthStateChange((_e, session) => {
      // Just update state, don't force redirect
    });
    unsub = () => sub.data.subscription.unsubscribe();
    return () => {
      unsub?.();
    };
  }, [router]);

  // Auto-sync with Supabase on app load
  useEffect(() => {
    68
    return;

    const syncData = async () => {
      try {
        if (!authChecked) return;
        const synced = await autoSync(days, powerPurchases);
        setDays(synced.days);
        setPowerPurchases(synced.purchases);
        setLastSyncedAt(new Date().toISOString());
      } catch (error) {
        console.error("Auto-sync on load failed:", error);
      }
    };

    syncData();
  }, [authChecked]);

  // persist to localStorage
  useEffect(() => {
    save({ days, totalPoints, streakDays, powerPurchases, lastSyncedAt, minimalMode });
  }, [days, totalPoints, streakDays, powerPurchases, lastSyncedAt, minimalMode]);

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
    const prev = days[dateKey];
    const prevPass = prev?.pass ?? false;
    const prevPerfect = prev?.perfect ?? false;
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

    // background push if signed in
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) pushDay(dateKey, current).catch(() => { });
      });
    }

    // celebratory confetti for milestones
    if (current.perfect && !prevPerfect) {
      void confettiMega();
    } else if (current.pass && !prevPass) {
      void confettiBurst();
    }
  }

  function toggleHabit(id: string) {
    const nowTrue = !entry.completed[id];
    const completed = { ...entry.completed, [id]: nowTrue };
    if (nowTrue) {
      void confettiBurst(0.8);
    }
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
    // background push if signed in
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) pushPurchase(rec).catch(() => { });
      });
    }
  }

  const level = levelFromPoints(totalPoints);
  const recentPassCount = countRecentPasses(Object.values(days));
  const mantra = getMantra(streakDays, entry, recentPassCount);
  const compact = minimalMode;

  // Removed auth gate - users can now use the app without signing in


  return (
    <div className="min-h-screen relative overflow-hidden text-zinc-100">
      <AmbientBackground />

      {/* Immersive Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-black/20 backdrop-blur-2xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-black font-bold shadow-lg shadow-emerald-500/20"
            >
              LM
            </motion.div>
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xl font-bold tracking-tight text-gradient"
              >
                Legend Mode 2026
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xs text-zinc-500 font-medium"
              >
                {mantra}
              </motion.p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="hidden sm:flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 neon-glow-amber"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
              STREAK: {streakDays}d
            </motion.span>
            <button
              onClick={() => setMinimalMode((v) => !v)}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:bg-white/10 hover:text-white transition-all active:scale-95"
            >
              {minimalMode ? "Expand" : "Compact"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <BentoGrid>
          {/* Header/Status Area */}
          <BentoItem colSpan={3} className="flex flex-col justify-between">
            <AuthPanel />
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-400/70">Core Disciplines</h2>
                <div className="flex gap-2">
                  <button onClick={() => setAll(true)} className="text-[10px] font-bold uppercase text-zinc-500 hover:text-white transition-colors">Select All</button>
                  <button onClick={() => setAll(false)} className="text-[10px] font-bold uppercase text-zinc-500 hover:text-white transition-colors">Reset</button>
                </div>
              </div>
              <HabitList completed={entry.completed} onToggle={toggleHabit} />
            </div>
          </BentoItem>

          {/* HUD Area */}
          <BentoItem colSpan={1} className="flex flex-col gap-6">
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
          </BentoItem>

          {/* Timeline / Calendar */}
          <BentoItem colSpan={1} className="flex flex-col gap-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Timeline</h3>
            <Calendar selected={selected} days={days} onSelect={setSelected} />
          </BentoItem>

          {/* Charts/Analytics */}
          {!compact && (
            <BentoItem colSpan={2}>
              <Charts days={days} />
            </BentoItem>
          )}

          {/* PowerUps & Sync */}
          <BentoItem colSpan={1} className="flex flex-col gap-4">
            <PowerUps availablePoints={availablePoints} onPurchase={purchase} />

            <div
              className="mt-auto glass-surface rounded-2xl p-4 flex items-center justify-between group cursor-pointer border-emerald-500/10 hover:border-emerald-500/30 transition-colors"
              onClick={() => setSyncStatus("Syncing...")}
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                </div>
                <div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">Cloud Status</div>
                  <div className="text-[11px] font-semibold text-zinc-300">
                    {syncStatus || (lastSyncedAt ? `Updated ${new Date(lastSyncedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : "Local Only")}
                  </div>
                </div>
              </div>
            </div>
          </BentoItem>
        </BentoGrid>

        <footer className="mt-20 py-8 border-t border-white/5 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-600">
            Legend Mode 2026 • Professional Discipline Protocol
          </p>
        </footer>
      </main>
    </div>
  );
}
