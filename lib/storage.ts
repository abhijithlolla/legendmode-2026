import { DayEntry, PowerPurchase } from "./habits";

const DAYS_KEY = "legendmode.days.v1";
const POWER_KEY = "legendmode.powers.v1";
const TOTAL_KEY = "legendmode.totalPoints.v1";
const STREAK_KEY = "legendmode.streak.v1";
const SYNCED_KEY = "legendmode.lastSyncedAt.v1";

export type Persisted = {
  days: Record<string, DayEntry>;
  totalPoints: number;
  streakDays: number;
  powerPurchases: PowerPurchase[];
  lastSyncedAt?: string | null;
};

export function load(): Persisted {
  if (typeof window === "undefined")
    return { days: {}, totalPoints: 0, streakDays: 0, powerPurchases: [], lastSyncedAt: null };
  try {
    const days = JSON.parse(localStorage.getItem(DAYS_KEY) || "{}") as Record<string, DayEntry>;
    const totalPoints = parseInt(localStorage.getItem(TOTAL_KEY) || "0", 10) || 0;
    const streakDays = parseInt(localStorage.getItem(STREAK_KEY) || "0", 10) || 0;
    const powerPurchases = JSON.parse(localStorage.getItem(POWER_KEY) || "[]") as PowerPurchase[];
    const lastSyncedAt = localStorage.getItem(SYNCED_KEY);
    return { days, totalPoints, streakDays, powerPurchases, lastSyncedAt };
  } catch {
    return { days: {}, totalPoints: 0, streakDays: 0, powerPurchases: [], lastSyncedAt: null };
  }
}

export function save(p: Persisted) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DAYS_KEY, JSON.stringify(p.days));
  localStorage.setItem(TOTAL_KEY, String(p.totalPoints));
  localStorage.setItem(STREAK_KEY, String(p.streakDays));
  localStorage.setItem(POWER_KEY, JSON.stringify(p.powerPurchases));
  if (p.lastSyncedAt) localStorage.setItem(SYNCED_KEY, p.lastSyncedAt);
}
