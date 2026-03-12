-- Cucobrani: základní schéma
-- Tabulky pro roky a nadcházející události (admin: years, upcoming)

-- Rozšíření pro UUID
create extension if not exists "uuid-ossp";

-- Ročníky / roky
create table if not exists public.years (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Nadcházející události
create table if not exists public.upcoming (
  id uuid primary key default gen_random_uuid(),
  year_id uuid references public.years(id) on delete set null,
  title text not null,
  description text,
  event_date date,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.years enable row level security;
alter table public.upcoming enable row level security;

-- Veřejné čtení (anon i authenticated)
create policy "years_select" on public.years for select using (true);
create policy "upcoming_select" on public.upcoming for select using (true);

-- Zápis jen pro authenticated (později můžeš omezit na admin role)
create policy "years_all" on public.years for all using (auth.role() = 'authenticated');
create policy "upcoming_all" on public.upcoming for all using (auth.role() = 'authenticated');

-- Trigger pro updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger years_updated_at
  before update on public.years
  for each row execute function public.set_updated_at();
create trigger upcoming_updated_at
  before update on public.upcoming
  for each row execute function public.set_updated_at();
