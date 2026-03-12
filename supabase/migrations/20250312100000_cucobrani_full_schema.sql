-- Čůčobraní: plné schéma dle zadání
-- Nadcházející ročník (hero), archiv ročníků, výsledky, program, galerie

-- 1) Hero: jeden záznam pro nadcházející ročník
create table if not exists public.upcoming_event (
  id uuid primary key default gen_random_uuid(),
  text text not null default '',
  location text not null default '',
  "datetime" text not null default '',
  updated_at timestamptz default now()
);

-- Jediný řádek – vložíme výchozí
insert into public.upcoming_event (id, text, location, "datetime")
values (
  '00000000-0000-0000-0000-000000000001'::uuid,
  'XXXVIII. ROČNÍK ČŮČOBRANÍ SE KONÁ:',
  'Žďár nad Metují',
  '30. ledna 2027 od 16:00'
)
on conflict (id) do nothing;

alter table public.upcoming_event enable row level security;
create policy "upcoming_event_select" on public.upcoming_event for select using (true);
create policy "upcoming_event_all" on public.upcoming_event for all using (auth.role() = 'authenticated');
create trigger upcoming_event_updated_at
  before update on public.upcoming_event
  for each row execute function public.set_updated_at();

-- 2) Rozšíření tabulky years (year, edition, title, status, program, …)
alter table public.years
  add column if not exists year integer,
  add column if not exists edition text,
  add column if not exists title text,
  add column if not exists status text default 'draft' check (status in ('draft', 'publikováno')),
  add column if not exists program_title text,
  add column if not exists program_author text,
  add column if not exists program_description text,
  add column if not exists program_image_url text,
  add column if not exists program_pdf_url text;

-- 3) Výsledky soutěže – Královna sklepa (1 řádek na ročník)
create table if not exists public.year_results_queen (
  id uuid primary key default gen_random_uuid(),
  year_id uuid not null references public.years(id) on delete cascade,
  name text,
  wine text,
  points text,
  unique(year_id)
);

-- 4) Cena diváků (1 řádek na ročník)
create table if not exists public.year_results_audience (
  id uuid primary key default gen_random_uuid(),
  year_id uuid not null references public.years(id) on delete cascade,
  name text,
  wine text,
  points text,
  unique(year_id)
);

-- 5) Sračka roku (1 řádek na ročník)
create table if not exists public.year_results_worst (
  id uuid primary key default gen_random_uuid(),
  year_id uuid not null references public.years(id) on delete cascade,
  name text,
  wine text,
  points text,
  unique(year_id)
);

-- 6) Bílá vína (více řádků)
create table if not exists public.year_results_white (
  id uuid primary key default gen_random_uuid(),
  year_id uuid not null references public.years(id) on delete cascade,
  position int not null default 0,
  name text,
  wine text,
  points text
);

-- 7) Červená vína (více řádků)
create table if not exists public.year_results_red (
  id uuid primary key default gen_random_uuid(),
  year_id uuid not null references public.years(id) on delete cascade,
  position int not null default 0,
  name text,
  wine text,
  points text
);

-- 8) Fotogalerie ročníku
create table if not exists public.year_gallery (
  id uuid primary key default gen_random_uuid(),
  year_id uuid not null references public.years(id) on delete cascade,
  sort_order int not null default 0,
  storage_path text not null
);

-- RLS pro nové tabulky
alter table public.year_results_queen enable row level security;
alter table public.year_results_audience enable row level security;
alter table public.year_results_worst enable row level security;
alter table public.year_results_white enable row level security;
alter table public.year_results_red enable row level security;
alter table public.year_gallery enable row level security;

create policy "year_results_select" on public.year_results_queen for select using (true);
create policy "year_results_all" on public.year_results_queen for all using (auth.role() = 'authenticated');
create policy "year_results_audience_select" on public.year_results_audience for select using (true);
create policy "year_results_audience_all" on public.year_results_audience for all using (auth.role() = 'authenticated');
create policy "year_results_worst_select" on public.year_results_worst for select using (true);
create policy "year_results_worst_all" on public.year_results_worst for all using (auth.role() = 'authenticated');
create policy "year_results_white_select" on public.year_results_white for select using (true);
create policy "year_results_white_all" on public.year_results_white for all using (auth.role() = 'authenticated');
create policy "year_results_red_select" on public.year_results_red for select using (true);
create policy "year_results_red_all" on public.year_results_red for all using (auth.role() = 'authenticated');
create policy "year_gallery_select" on public.year_gallery for select using (true);
create policy "year_gallery_all" on public.year_gallery for all using (auth.role() = 'authenticated');

-- Indexy pro rychlejší dotazy
create index if not exists idx_year_results_white_year on public.year_results_white(year_id);
create index if not exists idx_year_results_red_year on public.year_results_red(year_id);
create index if not exists idx_year_gallery_year on public.year_gallery(year_id);
