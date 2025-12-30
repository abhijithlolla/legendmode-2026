-- Legend Mode 2026 Supabase schema (RLS via JWT auth)
-- NOTE: Apply via Supabase SQL editor or CLI. Do NOT store service role keys in .env.

create table if not exists public.profiles (
  id uuid primary key default auth.uid(),
  email text,
  created_at timestamp with time zone default now()
);

create table if not exists public.day_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  date text not null, -- YYYY-MM-DD
  completed jsonb not null default '{}',
  base_points int not null default 0,
  pass boolean not null default false,
  perfect boolean not null default false,
  score_with_bonuses int not null default 0,
  inserted_at timestamp with time zone default now(),
  unique (user_id, date)
);

create table if not exists public.power_purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  date text not null,
  power_up_id text not null,
  cost int not null,
  inserted_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.day_entries enable row level security;
alter table public.power_purchases enable row level security;
alter table public.profiles enable row level security;

-- Policies (owner-only based on auth.uid())
create policy if not exists "day_entries_select_own"
  on public.day_entries for select
  using (user_id = auth.uid());

create policy if not exists "day_entries_modify_own"
  on public.day_entries for insert with check (user_id = auth.uid())
  , update using (user_id = auth.uid())
  , delete using (user_id = auth.uid());

create policy if not exists "power_purchases_select_own"
  on public.power_purchases for select
  using (user_id = auth.uid());

create policy if not exists "power_purchases_modify_own"
  on public.power_purchases for insert with check (user_id = auth.uid())
  , update using (user_id = auth.uid())
  , delete using (user_id = auth.uid());

create policy if not exists "profiles_self"
  on public.profiles for all
  using (id = auth.uid())
  with check (id = auth.uid());

-- Helpful index
create index if not exists day_entries_user_date_idx on public.day_entries(user_id, date);
create index if not exists power_purchases_user_date_idx on public.power_purchases(user_id, date);
