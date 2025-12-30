import { BASE_MAX, DayEntry, HABITS } from "./habits";

export function isPerfect(completed: Record<string, boolean>): boolean {
  return HABITS.every((h) => completed[h.id]);
}

export function calcBasePoints(completed: Record<string, boolean>): number {
  return HABITS.reduce((sum, h) => sum + (completed[h.id] ? h.points : 0), 0);
}

export function streakMultiplier(streakDays: number): number {
  if (streakDays >= 30) return 3;
  if (streakDays >= 14) return 2;
  if (streakDays >= 7) return 1.5;
  if (streakDays >= 3) return 1.2;
  return 1;
}

export function scoreDay(
  date: string,
  completed: Record<string, boolean>,
  currentStreakDays: number
): DayEntry {
  const basePoints = calcBasePoints(completed);
  const pass = basePoints >= 80;
  const perfect = isPerfect(completed);
  const perfectBonus = perfect ? 50 : 0;
  const mult = streakMultiplier(currentStreakDays);
  const scoreWithBonuses = Math.round((basePoints + perfectBonus) * mult);

  return { date, completed, basePoints, pass, perfect, scoreWithBonuses };
}

export type Level = {
  id: string;
  name: string;
  threshold: number; // cumulative points required
};

export const LEVELS: Level[] = [
  { id: "seed", name: "🌱 Seed", threshold: 0 },
  { id: "sprout", name: "🌿 Sprout", threshold: 500 },
  { id: "warrior", name: "🛡️ Warrior", threshold: 2000 },
  { id: "champion", name: "🏆 Champion", threshold: 5000 },
  { id: "legend", name: "👑 Legend", threshold: 10000 },
];

export function levelFromPoints(total: number): Level {
  let current = LEVELS[0];
  for (const lvl of LEVELS) {
    if (total >= lvl.threshold) current = lvl;
  }
  return current;
}
