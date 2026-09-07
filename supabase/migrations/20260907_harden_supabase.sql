-- Artistas do Bairro — Supabase hardening and performance pass
-- Designed for the schema created by the 2026-08-26 migrations.

create extension if not exists pg_trgm;
create schema if not exists private;

-- --------------------------------------------------------------------------
-- Least-privilege defaults for future objects in the exposed public schema.
-- --------------------------------------------------------------------------
alter default privileges in schema public revoke all on tables from anon, authenticated;
alter default privileges in schema public revoke all on sequences from anon, authenticated;
alter default privileges in schema public revoke execute on functions from public, anon, authenticated;

-- Keep internal helper functions out of the public API surface.
create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;
revoke all on function private.is_admin() from public, anon, authenticated;
grant execute on function private.is_admin() to authenticated;

-- Never expose the auth trigger helper as a callable API function.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', ''),
    new.raw_user_meta_data ->> 'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
revoke all on function public.handle_new_user() from public, anon, authenticated;

-- --------------------------------------------------------------------------
-- Data quality and automatic timestamps.
-- --------------------------------------------------------------------------
drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists artists_set_updated_at on public.artists;
create trigger artists_set_updated_at
before update on public.artists
for each row execute function public.set_updated_at();

drop trigger if exists inquiries_set_updated_at on public.artist_inquiries;
create trigger inquiries_set_updated_at
before update on public.artist_inquiries
for each row execute function public.set_updated_at();

drop trigger if exists applications_set_updated_at on public.artist_applications;
create trigger applications_set_updated_at
before update on public.artist_applications
for each row execute function public.set_updated_at();

drop trigger if exists newsletter_set_updated_at on public.newsletter_subscribers;
create trigger newsletter_set_updated_at
before update on public.newsletter_subscribers
for each row execute function public.set_updated_at();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists artist_profiles_set_updated_at on public.artist_profiles;
create trigger artist_profiles_set_updated_at
before update on public.artist_profiles
for each row execute function public.set_updated_at();

create or replace function public.normalize_public_emails()
returns trigger
language plpgsql
as $$
begin
  new.email := lower(btrim(new.email));
  return new;
end;
$$;

drop trigger if exists newsletter_normalize_email on public.newsletter_subscribers;
create trigger newsletter_normalize_email
before insert or update of email on public.newsletter_subscribers
for each row execute function public.normalize_public_emails();

drop trigger if exists applications_normalize_email on public.artist_applications;
create trigger applications_normalize_email
before insert or update of email on public.artist_applications
for each row execute function public.normalize_public_emails();

alter table public.newsletter_subscribers
  drop constraint if exists newsletter_subscribers_email_length_check;
alter table public.newsletter_subscribers
  add constraint newsletter_subscribers_email_length_check
  check (char_length(email) between 5 and 320);

alter table public.artist_applications
  drop constraint if exists artist_applications_email_length_check;
alter table public.artist_applications
  add constraint artist_applications_email_length_check
  check (char_length(email) between 5 and 320);

alter table public.artist_inquiries
  drop constraint if exists artist_inquiries_email_length_check;
alter table public.artist_inquiries
  add constraint artist_inquiries_email_length_check
  check (char_length(requester_email) between 5 and 320);

alter table public.artist_inquiries
  drop constraint if exists artist_inquiries_message_trim_check;
alter table public.artist_inquiries
  add constraint artist_inquiries_message_trim_check
  check (char_length(btrim(message)) >= 5);

-- --------------------------------------------------------------------------
-- Artist moderation: owners can edit their profile, but never self-approve
-- or self-verify. Those fields belong to an admin workflow.
-- --------------------------------------------------------------------------
create or replace function public.protect_artist_moderation_fields()
returns trigger
language plpgsql
as $$
begin
  if not private.is_admin() then
    if tg_op = 'INSERT' then
      new.status := 'pending';
      new.verified := false;
    else
      new.status := old.status;
      new.verified := old.verified;
    end if;
  end if;
  return new;
end;
$$;

revoke all on function public.protect_artist_moderation_fields() from public, anon, authenticated;

drop trigger if exists protect_artist_moderation_fields on public.artist_profiles;
create trigger protect_artist_moderation_fields
before insert or update on public.artist_profiles
for each row execute function public.protect_artist_moderation_fields();

-- --------------------------------------------------------------------------
-- Catalog visibility: unpublished artists must never leak through child rows.
-- --------------------------------------------------------------------------
drop policy if exists "artist categories are readable" on public.artist_categories;
create policy "published artist categories are readable"
on public.artist_categories
for select to anon, authenticated
using (
  exists (
    select 1
    from public.artists a
    where a.id = artist_categories.artist_id
      and a.is_published = true
  )
);

drop policy if exists "artist tags are readable" on public.artist_tags;
create policy "published artist tags are readable"
on public.artist_tags
for select to anon, authenticated
using (
  exists (
    select 1
    from public.artists a
    where a.id = artist_tags.artist_id
      and a.is_published = true
  )
);

drop policy if exists "portfolio is readable" on public.portfolio_items;
create policy "published portfolio is readable"
on public.portfolio_items
for select to anon, authenticated
using (
  exists (
    select 1
    from public.artists a
    where a.id = portfolio_items.artist_id
      and a.is_published = true
  )
);

drop policy if exists "skills are readable" on public.artist_skills;
create policy "published skills are readable"
on public.artist_skills
for select to anon, authenticated
using (
  exists (
    select 1
    from public.artists a
    where a.id = artist_skills.artist_id
      and a.is_published = true
  )
);

drop policy if exists "published testimonials are readable" on public.artist_testimonials;
create policy "published testimonials are readable"
on public.artist_testimonials
for select to anon, authenticated
using (
  is_published = true
  and exists (
    select 1
    from public.artists a
    where a.id = artist_testimonials.artist_id
      and a.is_published = true
  )
);

-- --------------------------------------------------------------------------
-- Public forms: insert only, with basic business invariants. Everything else
-- stays private and is intended for an admin/backend workflow.
-- --------------------------------------------------------------------------
drop policy if exists "public can create artist inquiries" on public.artist_inquiries;
create policy "public can create artist inquiries"
on public.artist_inquiries
for insert to anon, authenticated
with check (
  char_length(btrim(requester_name)) between 2 and 120
  and char_length(btrim(requester_email)) between 5 and 320
  and char_length(btrim(requester_phone)) between 5 and 40
  and char_length(btrim(message)) between 5 and 2000
  and exists (
    select 1
    from public.artists a
    where a.id = artist_inquiries.artist_id
      and a.is_published = true
  )
);

drop policy if exists "public can create artist applications" on public.artist_applications;
create policy "public can create artist applications"
on public.artist_applications
for insert to anon, authenticated
with check (
  char_length(btrim(email)) between 5 and 320
  and (category_id is null or exists (
    select 1
    from public.categories c
    where c.id = artist_applications.category_id
  ))
);

drop policy if exists "public can subscribe newsletter" on public.newsletter_subscribers;
create policy "public can subscribe newsletter"
on public.newsletter_subscribers
for insert to anon, authenticated
with check (char_length(email) between 5 and 320);

drop policy if exists "public can create demo accounts" on public.demo_accounts;
create policy "public can create demo accounts"
on public.demo_accounts
for insert to anon, authenticated
with check (
  char_length(btrim(email)) between 5 and 320
  and char_length(btrim(phone)) between 5 and 40
);

revoke all on public.artist_inquiries from anon, authenticated;
revoke all on public.artist_applications from anon, authenticated;
revoke all on public.newsletter_subscribers from anon, authenticated;
revoke all on public.demo_accounts from anon, authenticated;
grant insert on public.artist_inquiries to anon, authenticated;
grant insert on public.artist_applications to anon, authenticated;
grant insert on public.newsletter_subscribers to anon, authenticated;
grant insert on public.demo_accounts to anon, authenticated;

drop policy if exists "admin read inquiries" on public.artist_inquiries;
create policy "admin read inquiries"
on public.artist_inquiries
for select to authenticated
using ((select private.is_admin()));

drop policy if exists "admin update inquiries" on public.artist_inquiries;
create policy "admin update inquiries"
on public.artist_inquiries
for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "admin read applications" on public.artist_applications;
create policy "admin read applications"
on public.artist_applications
for select to authenticated
using ((select private.is_admin()));

drop policy if exists "admin update applications" on public.artist_applications;
create policy "admin update applications"
on public.artist_applications
for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "admin read newsletter" on public.newsletter_subscribers;
create policy "admin read newsletter"
on public.newsletter_subscribers
for select to authenticated
using ((select private.is_admin()));

drop policy if exists "admin update newsletter" on public.newsletter_subscribers;
create policy "admin update newsletter"
on public.newsletter_subscribers
for update to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

-- --------------------------------------------------------------------------
-- Catalog administration. Public/regular users get read-only published data;
-- only admins can mutate the source-of-truth catalog.
-- --------------------------------------------------------------------------
revoke all on public.categories from anon, authenticated;
revoke all on public.artists from anon, authenticated;
revoke all on public.artist_categories from anon, authenticated;
revoke all on public.artist_tags from anon, authenticated;
revoke all on public.portfolio_items from anon, authenticated;
revoke all on public.artist_skills from anon, authenticated;
revoke all on public.artist_testimonials from anon, authenticated;
grant select on public.categories, public.artists, public.artist_categories, public.artist_tags, public.portfolio_items, public.artist_skills, public.artist_testimonials to anon, authenticated;

drop policy if exists "admin manage categories" on public.categories;
create policy "admin manage categories"
on public.categories
for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "admin manage artists" on public.artists;
create policy "admin manage artists"
on public.artists
for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "admin manage artist categories" on public.artist_categories;
create policy "admin manage artist categories"
on public.artist_categories
for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "admin manage artist tags" on public.artist_tags;
create policy "admin manage artist tags"
on public.artist_tags
for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "admin manage portfolio" on public.portfolio_items;
create policy "admin manage portfolio"
on public.portfolio_items
for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "admin manage skills" on public.artist_skills;
create policy "admin manage skills"
on public.artist_skills
for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "admin manage testimonials" on public.artist_testimonials;
create policy "admin manage testimonials"
on public.artist_testimonials
for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

-- --------------------------------------------------------------------------
-- Authenticated artist profiles: keep owner CRUD, add admin moderation.
-- --------------------------------------------------------------------------
revoke all on public.profiles from anon, authenticated;
grant select, update on public.profiles to authenticated;

revoke all on public.artist_profiles from anon, authenticated;
grant select on public.artist_profiles to anon, authenticated;
grant insert, update on public.artist_profiles to authenticated;

drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile"
on public.profiles
for select to authenticated
using ((select auth.uid()) = id);

drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile"
on public.profiles
for update to authenticated
using ((select auth.uid()) = id)
with check ((select auth.uid()) = id);

drop policy if exists "admin manage profiles" on public.profiles;
create policy "admin manage profiles"
on public.profiles
for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

drop policy if exists "artists read approved profiles" on public.artist_profiles;
create policy "artists read approved profiles"
on public.artist_profiles
for select to anon, authenticated
using (
  status = 'approved'
  or (select auth.uid()) = user_id
  or (select private.is_admin())
);

drop policy if exists "users create own artist profile" on public.artist_profiles;
create policy "users create own artist profile"
on public.artist_profiles
for insert to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "artists update own profile" on public.artist_profiles;
create policy "artists update own profile"
on public.artist_profiles
for update to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "admin manage artist profiles" on public.artist_profiles;
create policy "admin manage artist profiles"
on public.artist_profiles
for all to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

-- --------------------------------------------------------------------------
-- Secure favorites for authenticated users. The legacy visitor_key table is
-- intentionally no longer reachable through the client Data API.
-- --------------------------------------------------------------------------
create table if not exists public.user_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  artist_id text not null references public.artists(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique(user_id, artist_id)
);
alter table public.user_favorites enable row level security;
revoke all on public.user_favorites from anon, authenticated;
grant select, insert, delete on public.user_favorites to authenticated;

drop policy if exists "users read own favorites" on public.user_favorites;
create policy "users read own favorites"
on public.user_favorites
for select to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "users save own favorites" on public.user_favorites;
create policy "users save own favorites"
on public.user_favorites
for insert to authenticated
with check (
  (select auth.uid()) = user_id
  and exists (
    select 1
    from public.artists a
    where a.id = user_favorites.artist_id
      and a.is_published = true
  )
);

drop policy if exists "users remove own favorites" on public.user_favorites;
create policy "users remove own favorites"
on public.user_favorites
for delete to authenticated
using ((select auth.uid()) = user_id);

revoke all on public.favorites from anon, authenticated;

-- --------------------------------------------------------------------------
-- Indexes for the catalog/detail pages and the new RLS predicates.
-- --------------------------------------------------------------------------
create index if not exists artist_categories_artist_idx
  on public.artist_categories(artist_id, category_id);
create index if not exists artist_tags_artist_idx
  on public.artist_tags(artist_id, tag);
create index if not exists portfolio_items_public_order_idx
  on public.portfolio_items(artist_id, is_featured desc, sort_order);
create index if not exists artist_skills_public_order_idx
  on public.artist_skills(artist_id, sort_order);
create index if not exists testimonials_public_order_idx
  on public.artist_testimonials(artist_id, is_published, created_at desc);
create index if not exists artist_inquiries_created_idx
  on public.artist_inquiries(created_at desc);
create index if not exists artist_applications_created_idx
  on public.artist_applications(created_at desc);
create index if not exists newsletter_email_lower_idx
  on public.newsletter_subscribers(lower(email));
create index if not exists newsletter_created_idx
  on public.newsletter_subscribers(created_at desc);
create index if not exists demo_accounts_email_lower_idx
  on public.demo_accounts(lower(email));
create index if not exists artists_search_trgm_idx
  on public.artists using gin (
    (coalesce(name, '') || ' ' || coalesce(role, '') || ' ' || coalesce(city, ''))
    gin_trgm_ops
  );
create index if not exists user_favorites_user_created_idx
  on public.user_favorites(user_id, created_at desc);

-- Initial backfill without destroying the seeded counts when no live artist
-- relationships exist yet.
update public.categories c
set artist_count = stats.artist_count
from (
  select ac.category_id, count(*)::integer as artist_count
  from public.artist_categories ac
  join public.artists a on a.id = ac.artist_id
  where a.is_published = true
  group by ac.category_id
) stats
where c.id = stats.category_id;

-- Keep category counts synchronized with the live artist catalog.
create or replace function public.refresh_category_artist_count(p_category_id text)
returns void
language sql
as $$
  update public.categories c
  set artist_count = (
    select count(*)::integer
    from public.artist_categories ac
    join public.artists a on a.id = ac.artist_id
    where ac.category_id = p_category_id
      and a.is_published = true
  )
  where c.id = p_category_id;
$$;
revoke all on function public.refresh_category_artist_count(text) from public, anon, authenticated;

create or replace function public.refresh_category_counts_from_artist(p_artist_id text)
returns trigger
language plpgsql
as $$
begin
  if tg_op in ('DELETE', 'UPDATE') then
    update public.categories c
    set artist_count = (
      select count(*)::integer
      from public.artist_categories ac
      join public.artists a on a.id = ac.artist_id
      where ac.category_id = c.id
        and a.is_published = true
    )
    where exists (
      select 1 from public.artist_categories ac
      where ac.artist_id = old.id and ac.category_id = c.id
    );
  end if;

  if tg_op in ('INSERT', 'UPDATE') then
    update public.categories c
    set artist_count = (
      select count(*)::integer
      from public.artist_categories ac
      join public.artists a on a.id = ac.artist_id
      where ac.category_id = c.id
        and a.is_published = true
    )
    where exists (
      select 1 from public.artist_categories ac
      where ac.artist_id = new.id and ac.category_id = c.id
    );
  end if;

  return coalesce(new, old);
end;
$$;
revoke all on function public.refresh_category_counts_from_artist(text) from public, anon, authenticated;

create or replace function public.refresh_category_count_from_link()
returns trigger
language plpgsql
as $$
begin
  if tg_op <> 'INSERT' then
    perform public.refresh_category_artist_count(old.category_id);
  end if;
  if tg_op <> 'DELETE' then
    perform public.refresh_category_artist_count(new.category_id);
  end if;
  return coalesce(new, old);
end;
$$;
revoke all on function public.refresh_category_count_from_link() from public, anon, authenticated;

drop trigger if exists artist_categories_refresh_count on public.artist_categories;
create trigger artist_categories_refresh_count
after insert or update or delete on public.artist_categories
for each row execute function public.refresh_category_count_from_link();

drop trigger if exists artists_refresh_category_counts on public.artists;
create trigger artists_refresh_category_counts
after insert or update of is_published or delete on public.artists
for each row execute function public.refresh_category_counts_from_artist(id);

-- The legacy favorites table remains only as historical data. It has no Data API
-- grants now, eliminating the previous cross-visitor read/write surface.
comment on table public.favorites is
  'Legacy visitor-key favorites. Client Data API access revoked; use public.user_favorites for authenticated favorites.';
comment on table public.user_favorites is
  'Authenticated favorites protected by owner-scoped RLS.';
