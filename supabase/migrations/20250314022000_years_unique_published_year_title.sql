-- Zákaz dvou publikovaných ročníků se stejným rokem nebo názvem

-- Unikátní rok mezi publikovanými ročníky (year not null)
create unique index if not exists years_published_year_unique
  on public.years (year)
  where status = 'publikováno' and year is not null;

-- Unikátní název mezi publikovanými ročníky (title not null)
create unique index if not exists years_published_title_unique
  on public.years (title)
  where status = 'publikováno' and title is not null;

