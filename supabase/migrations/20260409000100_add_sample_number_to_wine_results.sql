-- Přidá číslo vzorku do tabulek výsledků vín (bílá/červená)
alter table public.year_results_white
  add column if not exists sample_number text;

alter table public.year_results_red
  add column if not exists sample_number text;
