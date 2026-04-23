-- Bucket pro obrázek/PDF programu ročníku (veřejné čtení, zápis jen authenticated)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'year-program',
  'year-program',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- RLS: všichni mohou číst, přihlášení mohou nahrávat a mazat
drop policy if exists "year_program_public_read" on storage.objects;
create policy "year_program_public_read"
  on storage.objects for select
  using (bucket_id = 'year-program');

drop policy if exists "year_program_authenticated_insert" on storage.objects;
create policy "year_program_authenticated_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'year-program');

drop policy if exists "year_program_authenticated_update" on storage.objects;
create policy "year_program_authenticated_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'year-program');

drop policy if exists "year_program_authenticated_delete" on storage.objects;
create policy "year_program_authenticated_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'year-program');

