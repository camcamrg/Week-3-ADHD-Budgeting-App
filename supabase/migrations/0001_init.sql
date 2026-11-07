-- Momentum — initial schema (MVP #1)
-- Two tables: profiles (user basics + money settings) and items (the unified List).
-- Row-Level Security is turned ON for both; policies are added in 0002_rls_policies.sql.

-- 1. PROFILES ---------------------------------------------------------------
-- One row per user. `id` matches the Supabase Auth user, so a profile is
-- automatically tied to whoever signed in.
create table if not exists public.profiles (
  id                  uuid        primary key references auth.users (id) on delete cascade,
  display_name        text,
  monthly_income      numeric(12, 2),            -- take-home income
  current_balance     numeric(12, 2),            -- money available right now
  reminder_lead_days  integer     not null default 3,  -- how far ahead to nudge
  created_at          timestamptz not null default now()
);

-- 2. ITEMS ------------------------------------------------------------------
-- The unified List: bills AND tasks live here, told apart by `type`.
create table if not exists public.items (
  id            uuid        primary key default gen_random_uuid(),
  user_id       uuid        not null references auth.users (id) on delete cascade,
  type          text        not null check (type in ('bill', 'task')),
  title         text        not null,
  amount        numeric(12, 2),          -- bills only; null for tasks
  due_date      date,
  first_step    text,                    -- a visible first step (tasks)
  is_done       boolean     not null default false,  -- paid / completed
  is_recurring  boolean     not null default false,
  recurs_every  text        check (recurs_every in ('day', 'week', 'month', 'year')),
  created_at    timestamptz not null default now()
);

-- Index so "show my List, soonest first" stays fast as items pile up.
create index if not exists items_user_due_idx
  on public.items (user_id, due_date);

-- 3. LOCK BOTH TABLES -------------------------------------------------------
-- Turn on Row-Level Security. Until policies exist (next migration), these
-- tables are default-deny: nobody can read or write. That is intentional.
alter table public.profiles enable row level security;
alter table public.items    enable row level security;
