-- Ročník 2017: při importu byly prohozeny sloupce sample_number (číslo vzorku) a points (body).
-- Podmínka zajistí idempotenci: opraví jen řádky, kde jsou hodnoty stále prohozené.
update public.year_results_white wr
set
  sample_number = wr.points,
  points = wr.sample_number
from public.years y
where wr.year_id = y.id
  and y.year = 2017
  and wr.sample_number ~ '^\d+([.,]\d+)?$'
  and wr.points ~ '^\d+([.,]\d+)?$'
  and replace(wr.sample_number, ',', '.')::numeric >= 50
  and replace(wr.points, ',', '.')::numeric <= 50;

update public.year_results_red wr
set
  sample_number = wr.points,
  points = wr.sample_number
from public.years y
where wr.year_id = y.id
  and y.year = 2017
  and wr.sample_number ~ '^\d+([.,]\d+)?$'
  and wr.points ~ '^\d+([.,]\d+)?$'
  and replace(wr.sample_number, ',', '.')::numeric >= 50
  and replace(wr.points, ',', '.')::numeric <= 50;
