create table if not exists public.demo_accounts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  phone text not null,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.artist_inquiries (
  id uuid primary key default gen_random_uuid(),
  artist_id text not null,
  artist_name text not null,
  requester_name text not null,
  requester_email text not null,
  requester_phone text not null,
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.demo_accounts enable row level security;
alter table public.artist_inquiries enable row level security;
alter table public.newsletter_subscribers enable row level security;

drop policy if exists "anon can insert demo accounts" on public.demo_accounts;
create policy "anon can insert demo accounts" on public.demo_accounts for insert to anon, authenticated with check (true);

drop policy if exists "anon can insert artist inquiries" on public.artist_inquiries;
create policy "anon can insert artist inquiries" on public.artist_inquiries for insert to anon, authenticated with check (true);

drop policy if exists "anon can insert newsletter subscribers" on public.newsletter_subscribers;
create policy "anon can insert newsletter subscribers" on public.newsletter_subscribers for insert to anon, authenticated with check (true);

grant insert on public.demo_accounts to anon, authenticated;
grant insert on public.artist_inquiries to anon, authenticated;
grant insert on public.newsletter_subscribers to anon, authenticated;
