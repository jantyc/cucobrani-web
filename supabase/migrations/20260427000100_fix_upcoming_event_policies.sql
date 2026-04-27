-- Fix produkčního problému "column user_id does not exist" na admin stránce Nadcházející ročník.
-- Příčina: stará/odlišná RLS policy na tabulce upcoming_event mohla odkazovat na neexistující sloupec user_id.
-- Řešení: smazat všechny existující policies pro upcoming_event a vytvořit aktuální, jednoduché a kompatibilní.

alter table if exists public.upcoming_event enable row level security;

do $$
declare
  policy_record record;
begin
  for policy_record in
    select policyname
    from pg_policies
    where schemaname = 'public'
      and tablename = 'upcoming_event'
  loop
    execute format(
      'drop policy if exists %I on public.upcoming_event',
      policy_record.policyname
    );
  end loop;
end $$;

create policy "upcoming_event_select"
  on public.upcoming_event
  for select
  using (true);

create policy "upcoming_event_all"
  on public.upcoming_event
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
