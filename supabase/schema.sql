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

-- Goal Edit Lock & Audit Logging System
-- Tracks goal edits and locks goals to prevent concurrent modifications

create table if not exists public.goal_edits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  goal_id text not null,
  old_value jsonb,
  new_value jsonb not null,
  change_type text not null, -- 'create', 'update', 'delete'
  edited_at timestamp with time zone default now(),
  edited_by uuid not null
);

-- Audit log for detailed tracking of all changes
create table if not exists public.goal_audit_log (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  action text not null, -- 'create', 'update', 'delete', 'lock', 'unlock'
  entity_type text not null, -- 'goal', 'day_entry', etc.
  entity_id text not null,
  details jsonb,
  ip_address text,
  user_agent text,
  timestamp timestamp with time zone default now()
);

-- Edit locks to prevent concurrent modifications
create table if not exists public.goal_edit_locks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  goal_id text not null,
  locked_at timestamp with time zone default now(),
  lock_until timestamp with time zone not null,
  locked_by uuid not null,
  unique (user_id, goal_id)
);

-- Enable RLS on new tables
alter table public.goal_edits enable row level security;
alter table public.goal_audit_log enable row level security;
alter table public.goal_edit_locks enable row level security;

-- RLS Policies for goal_edits
create policy if not exists "goal_edits_select_own"
  on public.goal_edits for select
  using (user_id = auth.uid());

create policy if not exists "goal_edits_insert_own"
  on public.goal_edits for insert with check (user_id = auth.uid());

-- RLS Policies for goal_audit_log
create policy if not exists "goal_audit_log_select_own"
  on public.goal_audit_log for select
  using (user_id = auth.uid());

create policy if not exists "goal_audit_log_insert_own"
  on public.goal_audit_log for insert with check (user_id = auth.uid());

-- RLS Policies for goal_edit_locks
create policy if not exists "goal_edit_locks_select_own"
  on public.goal_edit_locks for select
  using (user_id = auth.uid());

create policy if not exists "goal_edit_locks_manage_own"
  on public.goal_edit_locks for insert with check (user_id = auth.uid())
  , update using (user_id = auth.uid())
  , delete using (user_id = auth.uid());

-- Indexes for performance
create index if not exists goal_edits_user_goal_idx on public.goal_edits(user_id, goal_id);
create index if not exists goal_audit_log_user_idx on public.goal_audit_log(user_id, timestamp);
create index if not exists goal_edit_locks_user_goal_idx on public.goal_edit_locks(user_id, goal_id);
