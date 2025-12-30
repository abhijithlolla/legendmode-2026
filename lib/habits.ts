export type Habit = {
  id: string;
  name: string;
  points: number;
  star?: boolean; // highlights "No Smoking"
};

export const HABITS: Habit[] = [
  { id: "body", name: "Body Transformation (workout/10k steps)", points: 15 },
  { id: "wake", name: "6AM Wake-up", points: 10 },
  { id: "boundary", name: "Work-Life Boundary (no work after 8PM)", points: 10 },
  { id: "nosmoke", name: "No Smoking", points: 20, star: true },
  { id: "mind", name: "Mental Strength (meditation)", points: 10 },
  { id: "protein", name: "Physical Strength (protein)", points: 10 },
  { id: "family", name: "Family Time (30min no phone)", points: 10 },
  { id: "finance", name: "Financial Discipline (log expenses)", points: 5 },
  { id: "relationship", name: "Relationship (wife convo)", points: 5 },
  { id: "sunlight", name: "Morning Sunlight", points: 5 },
];

export const BASE_MAX = HABITS.reduce((s, h) => s + h.points, 0); // 100

export type DayEntry = {
  date: string; // YYYY-MM-DD
  completed: Record<string, boolean>; // habitId -> done
  basePoints: number; // sum of completed habit points (max 100)
  pass: boolean; // base >= 80
  perfect: boolean; // all 10
  scoreWithBonuses: number; // with perfect bonus and streak multiplier
};

export type PowerUp = {
  id: string;
  name: string;
  cost: number;
  description: string;
};

export const POWER_UPS: PowerUp[] = [
  { id: "cheat", name: "Cheat Meal", cost: 100, description: "Enjoy a guilt-free meal." },
  { id: "late", name: "Late Start", cost: 150, description: "Start late without penalty." },
  { id: "skip", name: "Weekend Skip", cost: 200, description: "Skip a weekend day." },
  { id: "smokeReset", name: "Smoke Reset", cost: 300, description: "Reset smoking counter." },
];

export type PowerPurchase = { id: string; date: string; powerUpId: string; cost: number };
