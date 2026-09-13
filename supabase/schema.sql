-- DevPulse username/password authentication + cross-device data storage.
-- This version does NOT use Supabase Auth, email sign-in, email verification,
-- SMTP, or fake email addresses.
-- Run this entire file in the Supabase SQL Editor.

create table if not exists public.app_accounts (
  id uuid primary key default gen_random_uuid(),
  username text not null unique check (username ~ '^[a-z0-9_]{3,24}$'),
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.app_sessions (
  id uuid primary key default gen_random_uuid(),
  account_id uuid not null references public.app_accounts(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.app_user_data (
  account_id uuid primary key references public.app_accounts(id) on delete cascade,
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists app_sessions_account_id_idx on public.app_sessions(account_id);
create index if not exists app_sessions_expires_at_idx on public.app_sessions(expires_at);

-- These tables are accessed only by the Next.js server using the Supabase
-- service-role key. They are not exposed to the browser.
alter table public.app_accounts enable row level security;
alter table public.app_sessions enable row level security;
alter table public.app_user_data enable row level security;

revoke all on public.app_accounts from anon, authenticated;
revoke all on public.app_sessions from anon, authenticated;
revoke all on public.app_user_data from anon, authenticated;
grant all on public.app_accounts to service_role;
grant all on public.app_sessions to service_role;
grant all on public.app_user_data to service_role;

-- Remove any accidental browser policies if this script is rerun.
drop policy if exists "app accounts browser access" on public.app_accounts;
drop policy if exists "app sessions browser access" on public.app_sessions;
drop policy if exists "app data browser access" on public.app_user_data;

-- Optional cleanup for expired sessions. Safe to run manually as needed.
create or replace function public.cleanup_expired_app_sessions()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.app_sessions where expires_at <= now();
$$;

revoke all on function public.cleanup_expired_app_sessions() from public, anon, authenticated;
grant execute on function public.cleanup_expired_app_sessions() to service_role;
