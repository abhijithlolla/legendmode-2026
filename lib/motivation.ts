import { DayEntry } from "./habits";

export function getMantra(streakDays: number, today?: DayEntry, recentPassCount?: number): string {
  // Priority: perfect today > pass today > large streak > climb messages
  if (today?.perfect) return "Legend Mode: Flawless execution.";
  if (today?.pass) return "Locked in. Keep the momentum.";
  if (streakDays >= 30) return "You are inevitable. 30-day force.";
  if (streakDays >= 14) return "Two weeks strong. Double down.";
  if (streakDays >= 7) return "One week conquered. Aim higher.";
  if (streakDays >= 3) return "Streak online. Don’t break it.";
  if ((recentPassCount ?? 0) >= 2) return "Climbing back. One more great day.";
  return "Small wins today. Legend tomorrow.";
}

export function countRecentPasses(entries: DayEntry[], take: number = 3): number {
  return entries
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-take)
    .filter((e) => e.pass).length;
}
