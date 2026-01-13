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
const RocketBackground = dynamic(() => import("@/components/RocketBackground"), { ssr: false });
import { confettiBurst, confettiMega } from "@/lib/confetti";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";

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

  // Require auth: if Supabase is configured and user not signed in, redirect to /auth
  useEffect(() => {
    let unsub: (() => void) | undefined;
    if (!supabase) {
      // If Supabase isn't configured, skip gating to allow local-only mode
      setAuthChecked(true);
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.replace("/auth");
      }
      setAuthChecked(true);
    });
    const sub = supabase.auth.onAuthStateChange((_e, session) => {
      if (!session?.user) router.replace("/auth");
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

  if (supabase && !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-zinc-400">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <RocketBackground />
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#1a1a1a]/60 backdrop-blur-xl">
        <div className={`mx-auto max-w-3xl px-4 ${compact ? "py-2" : "py-3"} flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent"
            >
              Legend Mode 2026
            </motion.h1>
            <motion.span
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="rounded-full border border-orange-500/30 bg-orange-500/10 px-2 py-0.5 text-xs font-bold text-orange-400"
            >
              🔥 {streakDays}d
            </motion.span>
          </div>
          <button
            onClick={() => setMinimalMode((v) => !v)}
            className="rounded-lg border border-zinc-700 px-2 py-1 text-xs hover:bg-zinc-800"
            aria-label="Toggle minimal mode"
          >
            {minimalMode ? "Comfort" : "Minimal"}
          </button>
        </div>
        <div className="mx-auto max-w-3xl px-4 pb-2 text-xs text-zinc-400">{mantra}</div>
      </header>
      <main className={`mx-auto max-w-3xl px-4 ${compact ? "py-3 space-y-3" : "py-4 space-y-4"}`}>
        <AuthPanel />

        <div className="flex gap-2">
          <button
            onClick={async () => {
              // Pull from Supabase and merge
              setSyncStatus("Syncing...");
              const [remoteDays, remotePurch] = await Promise.all([pullDays(), pullPurchases()]);
              // naive merge: remote overwrites same dates; purchases concatenated (dedupe by id)
              const mergedDays = { ...days, ...remoteDays };
              const existing = new Map(powerPurchases.map((p) => [p.id, p]));
              for (const r of remotePurch) existing.set(r.id, r);
              const mergedPurch = Array.from(existing.values());

              // recompute totals from merged days
              const newTotal = Object.values(mergedDays).reduce((s, e) => s + e.scoreWithBonuses, 0);
              setDays(mergedDays);
              setTotalPoints(newTotal);
              setPowerPurchases(mergedPurch);
              const ts = new Date().toISOString();
              setLastSyncedAt(ts);
              setSyncStatus("Synced");
              setTimeout(() => setSyncStatus(""), 2000);
            }}
            className="rounded-lg border border-zinc-700 px-3 py-1 text-xs hover:bg-zinc-800"
          >
            Sync Now
          </button>
          {lastSyncedAt && (
            <div className="self-center text-xs text-zinc-400">
              Last synced: {new Date(lastSyncedAt).toLocaleString()}
            </div>
          )}
          {syncStatus && (
            <div className="self-center text-xs text-[color:var(--accent-pass)]">{syncStatus}</div>
          )}
        </div>

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
        <ProgressBar value={entry.basePoints} pass={entry.pass} perfect={entry.perfect} />

        <Calendar selected={selected} days={days} onSelect={setSelected} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`rounded-2xl ${compact ? "p-3" : "p-4"} glass-card`}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-medium text-zinc-400 uppercase tracking-widest text-[10px]">Daily Habits</div>
            <div className="flex gap-2">
              <button onClick={() => setAll(true)} className="rounded-lg border border-white/5 px-3 py-1 text-xs hover:bg-white/10 transition-colors">All</button>
              <button onClick={() => setAll(false)} className="rounded-lg border border-white/5 px-3 py-1 text-xs hover:bg-white/10 transition-colors">None</button>
            </div>
          </div>
          <HabitList completed={entry.completed} onToggle={toggleHabit} />
        </motion.div>

        {!compact && <Charts days={days} />}

        <PowerUps availablePoints={availablePoints} onPurchase={purchase} />

        <footer className="py-8 text-center text-xs text-zinc-500">PWA ready • Install from browser menu to home screen</footer>
      </main>
    </div>
  );
}
