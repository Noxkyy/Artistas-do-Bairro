-- Real Supabase Auth + user profiles + artist profiles.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '',
  phone text,
  city text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.artist_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  display_name text not null,
  category_id text references public.categories(id) on delete set null,
  bio text not null default '',
  city text not null default '',
  price integer not null default 0 check (price >= 0),
  photo_url text not null default '',
  cover_url text not null default '',
  status text not null default 'pending' check (status in ('pending','approved','rejected','suspended')),
  verified boolean not null default false,
  online boolean not null default false,
  response_time text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, phone)
  values (new.id, coalesce(new.raw_user_meta_data->>'name',''), new.raw_user_meta_data->>'phone')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
drop trigger if exists artist_profiles_set_updated_at on public.artist_profiles;
create trigger artist_profiles_set_updated_at before update on public.artist_profiles for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.artist_profiles enable row level security;

drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile" on public.profiles for select to authenticated using (auth.uid() = id);
drop policy if exists "users update own profile" on public.profiles;
create policy "users update own profile" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "artists read approved profiles" on public.artist_profiles;
create policy "artists read approved profiles" on public.artist_profiles for select to anon, authenticated using (status = 'approved' or auth.uid() = user_id);
drop policy if exists "users create own artist profile" on public.artist_profiles;
create policy "users create own artist profile" on public.artist_profiles for insert to authenticated with check (auth.uid() = user_id);
drop policy if exists "artists update own profile" on public.artist_profiles;
create policy "artists update own profile" on public.artist_profiles for update to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

grant select, update on public.profiles to authenticated;
grant select on public.artist_profiles to anon, authenticated;
grant insert, update on public.artist_profiles to authenticated;

create index if not exists artist_profiles_status_idx on public.artist_profiles(status);
create index if not exists artist_profiles_category_idx on public.artist_profiles(category_id);
create index if not exists artist_profiles_user_idx on public.artist_profiles(user_id);
