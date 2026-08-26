-- Keeps the first demo API (artist_name) compatible with the normalized schema.
alter table if exists public.artist_inquiries
  add column if not exists artist_name text;

alter table if exists public.artist_inquiries
  alter column artist_name drop not null;

create or replace function public.sync_inquiry_artist_name()
returns trigger
language plpgsql
as $$
begin
  if new.artist_name is null then
    new.artist_name = new.artist_name_snapshot;
  end if;
  if new.artist_name_snapshot is null then
    new.artist_name_snapshot = new.artist_name;
  end if;
  return new;
end;
$$;

drop trigger if exists inquiries_sync_artist_name on public.artist_inquiries;
create trigger inquiries_sync_artist_name
before insert or update on public.artist_inquiries
for each row execute function public.sync_inquiry_artist_name();
