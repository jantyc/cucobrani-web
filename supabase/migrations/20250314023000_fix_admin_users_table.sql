-- Re-create admin_users table with expected structure (id, email, name).
-- This migration is idempotent in the sense that it always leaves the table
-- in the desired shape, but stávající data v admin_users budou ztracena.

drop table if exists public.admin_users cascade;

create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text
);

alter table public.admin_users enable row level security;

drop policy if exists "admin_users_select" on public.admin_users;
create policy "admin_users_select" on public.admin_users
  for select
  using (auth.role() = 'authenticated');

drop policy if exists "admin_users_all" on public.admin_users;
create policy "admin_users_all" on public.admin_users
  for all
  using (auth.role() = 'authenticated');

