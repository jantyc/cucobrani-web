-- Admin users: explicit list of emails allowed to access /admin
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text
);

alter table public.admin_users enable row level security;

-- Authenticated users (admin UI) can read the list
drop policy if exists "admin_users_select" on public.admin_users;
create policy "admin_users_select" on public.admin_users
  for select
  using (auth.role() = 'authenticated');

-- Only authenticated users can modify the list (managed via SQL/CLI or future admin UI)
drop policy if exists "admin_users_all" on public.admin_users;
create policy "admin_users_all" on public.admin_users
  for all
  using (auth.role() = 'authenticated');

