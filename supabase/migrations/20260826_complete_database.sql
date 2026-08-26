-- Artistas do Bairro — database foundation
-- Safe to run once. Uses public-read / public-insert policies for the
-- demonstrative marketplace flows; private account data stays isolated.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.categories (
  id text primary key,
  label text not null,
  short_label text not null,
  artist_count integer not null default 0 check (artist_count >= 0),
  icon text not null,
  blurb text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.artists (
  id text primary key,
  name text not null,
  role text not null,
  city text not null,
  state text,
  rating numeric(2,1) not null default 0 check (rating >= 0 and rating <= 5),
  reviews integer not null default 0 check (reviews >= 0),
  price integer not null default 0 check (price >= 0),
  photo_url text not null,
  cover_url text not null,
  verified boolean not null default false,
  online boolean not null default false,
  bio text not null default '',
  projects integer not null default 0 check (projects >= 0),
  response_time text not null default '',
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.artist_categories (
  artist_id text not null references public.artists(id) on delete cascade,
  category_id text not null references public.categories(id) on delete cascade,
  primary key (artist_id, category_id)
);

create table if not exists public.artist_tags (
  id uuid primary key default gen_random_uuid(),
  artist_id text not null references public.artists(id) on delete cascade,
  tag text not null,
  unique (artist_id, tag)
);

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  artist_id text not null references public.artists(id) on delete cascade,
  image_url text not null,
  caption text not null default '',
  sort_order integer not null default 0,
  is_featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.artist_skills (
  id uuid primary key default gen_random_uuid(),
  artist_id text not null references public.artists(id) on delete cascade,
  label text not null,
  score integer not null check (score between 0 and 100),
  sort_order integer not null default 0,
  unique (artist_id, label)
);

create table if not exists public.artist_testimonials (
  id uuid primary key default gen_random_uuid(),
  artist_id text not null references public.artists(id) on delete cascade,
  reviewer_name text not null,
  reviewer_role text not null default '',
  body text not null,
  stars integer not null default 5 check (stars between 1 and 5),
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.artist_inquiries (
  id uuid primary key default gen_random_uuid(),
  artist_id text not null references public.artists(id) on delete cascade,
  artist_name_snapshot text not null,
  requester_name text not null check (char_length(requester_name) between 2 and 120),
  requester_email text not null,
  requester_phone text not null,
  message text not null check (char_length(message) between 5 and 2000),
  status text not null default 'pending' check (status in ('pending','contacted','accepted','declined','completed','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.artist_applications (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  phone text,
  city text,
  category_id text references public.categories(id) on delete set null,
  portfolio_url text,
  message text,
  status text not null default 'pending' check (status in ('pending','reviewing','approved','rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text not null default 'footer',
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists newsletter_subscribers_email_lower_idx
  on public.newsletter_subscribers (lower(email));

create table if not exists public.demo_accounts (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  phone text not null,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  visitor_key text not null,
  artist_id text not null references public.artists(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (visitor_key, artist_id)
);

create index if not exists artists_city_idx on public.artists (city);
create index if not exists artists_published_idx on public.artists (is_published) where is_published = true;
create index if not exists artists_rating_idx on public.artists (rating desc);
create index if not exists artist_categories_category_idx on public.artist_categories (category_id, artist_id);
create index if not exists artist_tags_artist_idx on public.artist_tags (artist_id);
create index if not exists portfolio_items_artist_sort_idx on public.portfolio_items (artist_id, sort_order);
create index if not exists artist_skills_artist_sort_idx on public.artist_skills (artist_id, sort_order);
create index if not exists artist_testimonials_artist_idx on public.artist_testimonials (artist_id, created_at desc);
create index if not exists artist_inquiries_artist_status_idx on public.artist_inquiries (artist_id, status, created_at desc);
create index if not exists artist_applications_status_idx on public.artist_applications (status, created_at desc);
create index if not exists newsletter_subscribers_active_idx on public.newsletter_subscribers (is_active, created_at desc);
create index if not exists demo_accounts_created_idx on public.demo_accounts (created_at desc);
create index if not exists favorites_visitor_idx on public.favorites (visitor_key, created_at desc);

-- Updated-at triggers
 drop trigger if exists categories_set_updated_at on public.categories;
 create trigger categories_set_updated_at before update on public.categories for each row execute function public.set_updated_at();
 drop trigger if exists artists_set_updated_at on public.artists;
 create trigger artists_set_updated_at before update on public.artists for each row execute function public.set_updated_at();
 drop trigger if exists inquiries_set_updated_at on public.artist_inquiries;
 create trigger inquiries_set_updated_at before update on public.artist_inquiries for each row execute function public.set_updated_at();
 drop trigger if exists applications_set_updated_at on public.artist_applications;
 create trigger applications_set_updated_at before update on public.artist_applications for each row execute function public.set_updated_at();
 drop trigger if exists newsletter_set_updated_at on public.newsletter_subscribers;
 create trigger newsletter_set_updated_at before update on public.newsletter_subscribers for each row execute function public.set_updated_at();

-- RLS
alter table public.categories enable row level security;
alter table public.artists enable row level security;
alter table public.artist_categories enable row level security;
alter table public.artist_tags enable row level security;
alter table public.portfolio_items enable row level security;
alter table public.artist_skills enable row level security;
alter table public.artist_testimonials enable row level security;
alter table public.artist_inquiries enable row level security;
alter table public.artist_applications enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.demo_accounts enable row level security;
alter table public.favorites enable row level security;

-- Recreate public-read policies for catalog data.
drop policy if exists "catalog categories are readable" on public.categories;
create policy "catalog categories are readable" on public.categories for select to anon, authenticated using (true);

drop policy if exists "published artists are readable" on public.artists;
create policy "published artists are readable" on public.artists for select to anon, authenticated using (is_published = true);

drop policy if exists "artist categories are readable" on public.artist_categories;
create policy "artist categories are readable" on public.artist_categories for select to anon, authenticated using (true);

drop policy if exists "artist tags are readable" on public.artist_tags;
create policy "artist tags are readable" on public.artist_tags for select to anon, authenticated using (true);

drop policy if exists "portfolio is readable" on public.portfolio_items;
create policy "portfolio is readable" on public.portfolio_items for select to anon, authenticated using (true);

drop policy if exists "skills are readable" on public.artist_skills;
create policy "skills are readable" on public.artist_skills for select to anon, authenticated using (true);

drop policy if exists "published testimonials are readable" on public.artist_testimonials;
create policy "published testimonials are readable" on public.artist_testimonials for select to anon, authenticated using (is_published = true);

-- Public intake forms. No update/delete access is granted to the browser.
drop policy if exists "public can create artist inquiries" on public.artist_inquiries;
create policy "public can create artist inquiries" on public.artist_inquiries for insert to anon, authenticated with check (true);

drop policy if exists "public can create artist applications" on public.artist_applications;
create policy "public can create artist applications" on public.artist_applications for insert to anon, authenticated with check (true);

drop policy if exists "public can subscribe newsletter" on public.newsletter_subscribers;
create policy "public can subscribe newsletter" on public.newsletter_subscribers for insert to anon, authenticated with check (char_length(email) between 5 and 320);

drop policy if exists "public can create demo accounts" on public.demo_accounts;
create policy "public can create demo accounts" on public.demo_accounts for insert to anon, authenticated with check (true);

drop policy if exists "visitors can read own favorites" on public.favorites;
create policy "visitors can read own favorites" on public.favorites for select to anon, authenticated using (true);

drop policy if exists "visitors can save favorites" on public.favorites;
create policy "visitors can save favorites" on public.favorites for insert to anon, authenticated with check (true);

drop policy if exists "visitors can remove favorites" on public.favorites;
create policy "visitors can remove favorites" on public.favorites for delete to anon, authenticated using (true);

-- Seed catalog categories matching the current frontend.
insert into public.categories (id, label, short_label, artist_count, icon, blurb, sort_order) values
('fotografia','Fotografia','Fotos',486,'Camera','Casamento, retrato, moda, produto e gastronômica.',1),
('video','Vídeo & Cinema','Vídeo',312,'Clapperboard','Publicidade, clipes, eventos, drone e colorização.',2),
('design','Design Gráfico','Design',398,'PenTool','Branding, editorial, UI e identidade visual.',3),
('ilustracao','Ilustração','Ilustra',207,'Palette','Editorial, character design e arte sob encomenda.',4),
('musica','Música & Áudio','Música',174,'Music','Produção, trilha original, mixagem e DJ sets.',5),
('motion','Motion & 3D','3D',129,'Boxes','Animação, VFX, modelagem e archviz.',6)
on conflict (id) do update set label = excluded.label, short_label = excluded.short_label, artist_count = excluded.artist_count, icon = excluded.icon, blurb = excluded.blurb, sort_order = excluded.sort_order;
