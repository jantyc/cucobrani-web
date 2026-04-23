-- Naplnění fotogalerie pro demo ročník 2025 z již nahraných souborů v bucketu year-gallery.

do $$
declare
  v_year_id uuid;
begin
  select id
  into v_year_id
  from public.years
  where year = 2025
  limit 1;

  if v_year_id is null then
    raise notice 'Ročník 2025 neexistuje, seed galerie se přeskočí.';
    return;
  end if;

  -- Smažeme existující záznamy galerie pro tento ročník (aby seed byl deterministický)
  delete from public.year_gallery
  where year_id = v_year_id;

  -- Vložíme tři demo fotky z bucketu year-gallery/2025
  insert into public.year_gallery (year_id, sort_order, storage_path)
  values
    (v_year_id, 0, '2025/about-1.png'),
    (v_year_id, 1, '2025/about-2.png'),
    (v_year_id, 2, '2025/about-3.png');
end $$;

