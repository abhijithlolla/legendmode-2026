import { createClient } from "@supabase/supabase-js";

// Use only publishable env vars. Do NOT include service role keys here.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const key = process.env.NEXT_PUBLIC_SUPABASE_KEY || "";

export const supabase = url && key ? createClient(url, key) : undefined;
