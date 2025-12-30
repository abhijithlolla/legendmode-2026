export function fmt(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function parseDay(key: string): Date {
  return new Date(key + "T00:00:00");
}

export function addDays(d: Date, delta: number): Date {
  const n = new Date(d);
  n.setDate(n.getDate() + delta);
  return n;
}

export function startOfWeek(d: Date): Date {
  const n = new Date(d);
  const day = n.getDay(); // 0 Sun
  const diff = (day + 6) % 7; // make Monday start
  n.setDate(n.getDate() - diff);
  n.setHours(0, 0, 0, 0);
  return n;
}
