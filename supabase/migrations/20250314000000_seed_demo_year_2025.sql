-- Seed demo ročníku 2025 (XXXVIII) pro testování adminu i veřejného webu.
-- Idempotentní blok: při opakovaném spuštění jen aktualizuje data daného ročníku.

do $$
declare
  v_year_id uuid;
begin
  -- Najdeme nebo vytvoříme ročník 2025
  select id
  into v_year_id
  from public.years
  where year = 2025
  limit 1;

  if v_year_id is null then
    insert into public.years (
      year,
      edition,
      title,
      name,
      status,
      program_title,
      program_author,
      program_description,
      program_image_url,
      program_pdf_url
    )
    values (
      2025,
      'XXXVIII',
      'XXXVIII. ročník Čůčobraní – 2025',
      'XXXVIII. ročník Čůčobraní – 2025',
      'publikováno',
      'Program večera: Čůčobraní 2025',
      'Zpracoval organizační tým Čůčobraní',
      'Slavnostní zahájení, degustace soutěžních vzorků, vyhlášení výsledků a volná zábava dle referenčního programu.',
      'https://example.com/program-2025.jpg',
      'https://example.com/program-2025.pdf'
    )
    returning id into v_year_id;
  else
    update public.years
    set
      edition = 'XXXVIII',
      title = 'XXXVIII. ročník Čůčobraní – 2025',
      name = 'XXXVIII. ročník Čůčobraní – 2025',
      status = 'publikováno',
      program_title = 'Program večera: Čůčobraní 2025',
      program_author = 'Zpracoval organizační tým Čůčobraní',
      program_description = 'Slavnostní zahájení, degustace soutěžních vzorků, vyhlášení výsledků a volná zábava dle referenčního programu.',
      program_image_url = 'https://example.com/program-2025.jpg',
      program_pdf_url = 'https://example.com/program-2025.pdf'
    where id = v_year_id;
  end if;

  -- Vymažeme předchozí výsledky tohoto ročníku
  delete from public.year_results_queen where year_id = v_year_id;
  delete from public.year_results_audience where year_id = v_year_id;
  delete from public.year_results_worst where year_id = v_year_id;
  delete from public.year_results_white where year_id = v_year_id;
  delete from public.year_results_red where year_id = v_year_id;

  -- Královna sklepa
  insert into public.year_results_queen (year_id, name, wine, points)
  values (v_year_id, 'Anna Vinařová', 'Ryzlink rýnský, pozdní sběr 2023', '94');

  -- Cena diváků
  insert into public.year_results_audience (year_id, name, wine, points)
  values (v_year_id, 'Petr Hroznový', 'Muškát moravský, kabinetní 2023', '92');

  -- Sračka roku
  insert into public.year_results_worst (year_id, name, wine, points)
  values (v_year_id, 'Jarda Sudový', 'Tajemná směs z garáže', '53');

  -- Bílá vína – top 5
  insert into public.year_results_white (year_id, position, name, wine, points)
  values
    (v_year_id, 1, 'Anna Vinařová', 'Ryzlink rýnský, pozdní sběr 2023', '94'),
    (v_year_id, 2, 'Jan Novák',      'Veltlínské zelené, kabinetní 2023', '92'),
    (v_year_id, 3, 'Petra Veselá',   'Pálava, výběr z hroznů 2022', '90'),
    (v_year_id, 4, 'Marek Hrozen',   'Rulandské bílé, pozdní sběr 2022', '89'),
    (v_year_id, 5, 'Lucie Sudová',   'Chardonnay, pozdní sběr 2023', '88');

  -- Červená vína – top 5
  insert into public.year_results_red (year_id, position, name, wine, points)
  values
    (v_year_id, 1, 'Karel Červený',  'Frankovka, pozdní sběr 2021', '93'),
    (v_year_id, 2, 'Jiří Sklepník',  'Svatovavřinecké, kabinetní 2022', '91'),
    (v_year_id, 3, 'Ondřej Sud',     'Modrý Portugal, pozdní sběr 2021', '89'),
    (v_year_id, 4, 'Eva Hrozínková', 'Zweigeltrebe, jakostní 2022', '88'),
    (v_year_id, 5, 'Tomáš Morava',   'Cabernet Moravia, pozdní sběr 2020', '87');
end $$;


