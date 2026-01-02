import { supabase } from "./supabase";
import { DayEntry, PowerPurchase } from "./habits";

export async function pullDays(): Promise<Record<string, DayEntry>> {
  if (!supabase) return {};
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return {};
  const { data, error } = await supabase
    .from("day_entries")
    .select("date, completed, base_points, pass, perfect, score_with_bonuses")
    .eq("user_id", user.user.id)
    .limit(1000);
  if (error || !data) return {};
  const map: Record<string, DayEntry> = {};
  for (const r of data as any[]) {
    map[r.date] = {
      date: r.date,
      completed: r.completed || {},
      basePoints: r.base_points || 0,
      pass: !!r.pass,
      perfect: !!r.perfect,
      scoreWithBonuses: r.score_with_bonuses || 0,
    };
  }
  return map;
}

export async function pushDay(date: string, entry: DayEntry): Promise<void> {
  if (!supabase) return;
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return;
  const payload = {
    user_id: user.user.id,
    date: entry.date,
    completed: entry.completed,
    base_points: entry.basePoints,
    pass: entry.pass,
    perfect: entry.perfect,
    score_with_bonuses: entry.scoreWithBonuses,
  };
  await supabase.from("day_entries").upsert(payload, { onConflict: "user_id,date" });
}

export async function pullPurchases(): Promise<PowerPurchase[]> {
  if (!supabase) return [];
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return [];
  const { data, error } = await supabase
    .from("power_purchases")
    .select("id, date, power_up_id, cost")
    .eq("user_id", user.user.id)
    .order("date", { ascending: true })
    .limit(1000);
  if (error || !data) return [];
  return (data as any[]).map((r) => ({ id: r.id, date: r.date, powerUpId: r.power_up_id, cost: r.cost }));
}

export async function pushPurchase(p: PowerPurchase): Promise<void> {
  if (!supabase) return;
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) return;
  await supabase.from("power_purchases").insert({
    id: p.id,
    user_id: user.user.id,
    date: p.date,
    power_up_id: p.powerUpId,
    cost: p.cost,
  });
}

// Automatic sync: pull latest data from Supabase on app load
export async function autoSync(localDays: Record<string, DayEntry>, localPurchases: PowerPurchase[]): Promise<{ days: Record<string, DayEntry>; purchases: PowerPurchase[] }> {
  if (!supabase) {
    return { days: localDays, purchases: localPurchases };
  }

  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user.user) {
      return { days: localDays, purchases: localPurchases };
    }

    // Pull from Supabase
    const [remoteDays, remotePurchases] = await Promise.all([
      pullDays(),
      pullPurchases(),
    ]);

    // Merge strategy: remote data overwrites local for same dates (Supabase is source of truth)
    const mergedDays = { ...localDays, ...remoteDays };

    // For purchases, use Map to deduplicate by ID
    const purchaseMap = new Map<string, PowerPurchase>();
    for (const p of localPurchases) purchaseMap.set(p.id, p);
    for (const p of remotePurchases) purchaseMap.set(p.id, p);
    const mergedPurchases = Array.from(purchaseMap.values());

    return {
      days: mergedDays,
      purchases: mergedPurchases,
    };
  } catch (error) {
    // If sync fails, just use local data
    console.error("Auto-sync failed:", error);
    return { days: localDays, purchases: localPurchases };
  }
}
