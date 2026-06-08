-- ============================================================
-- SOLOFTS — Initial Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================

-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- for full-text search

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
create table public.profiles (
  id            uuid references auth.users on delete cascade primary key,
  username      text unique not null,
  full_name     text,
  avatar_url    text,
  bio           text,
  profession    text,                          -- "Software Engineer", "Nurse", etc.
  home_country  text,
  countries_visited int default 0,
  trips_count   int default 0,
  joined_at     timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert with check (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- STORIES
-- ============================================================
create type story_tag as enum (
  'wild_solo', 'budget', 'first_timer', 'career_traveler',
  'road_trip', 'backpacking', 'luxury', 'adventure', 'digital_nomad'
);

create table public.stories (
  id            uuid default uuid_generate_v4() primary key,
  author_id     uuid references public.profiles(id) on delete cascade not null,
  title         text not null,
  body          text not null,
  destination   text not null,              -- "Kyoto, Japan"
  country       text not null,              -- "Japan"
  country_code  text,                       -- "JP"
  days_count    int,                        -- trip duration
  budget_usd    int,                        -- total budget in USD
  pto_days      int,                        -- PTO days used
  tags          story_tag[],
  cover_image   text,                       -- URL
  is_published  boolean default false,
  views         int default 0,
  likes         int default 0,
  created_at    timestamptz default now(),
  updated_at    timestamptz default now()
);

alter table public.stories enable row level security;

create policy "Published stories are public"
  on public.stories for select using (is_published = true);

create policy "Authors can see their own stories"
  on public.stories for select using (auth.uid() = author_id);

create policy "Authors can insert stories"
  on public.stories for insert with check (auth.uid() = author_id);

create policy "Authors can update own stories"
  on public.stories for update using (auth.uid() = author_id);

create policy "Authors can delete own stories"
  on public.stories for delete using (auth.uid() = author_id);

-- Full-text search index
create index stories_search_idx on public.stories
  using gin(to_tsvector('english', title || ' ' || body || ' ' || destination));

-- ============================================================
-- SAFETY REPORTS (crowdsourced safety scores)
-- ============================================================
create table public.safety_reports (
  id            uuid default uuid_generate_v4() primary key,
  author_id     uuid references public.profiles(id) on delete cascade not null,
  city          text not null,
  country       text not null,
  country_code  text,
  lat           float,
  lng           float,
  safety_score  int check (safety_score between 1 and 10) not null,
  -- Sub-scores
  transport_score   int check (transport_score between 1 and 10),
  accommodation_score int check (accommodation_score between 1 and 10),
  nighttime_score   int check (nighttime_score between 1 and 10),
  -- Notes
  notes         text,
  visited_at    date,                       -- when the traveler was there
  created_at    timestamptz default now()
);

alter table public.safety_reports enable row level security;

create policy "Safety reports are public"
  on public.safety_reports for select using (true);

create policy "Authenticated users can submit reports"
  on public.safety_reports for insert with check (auth.uid() = author_id);

-- Materialized view: aggregated safety scores per city
create materialized view public.city_safety_scores as
  select
    city,
    country,
    country_code,
    avg(lat) as lat,
    avg(lng) as lng,
    round(avg(safety_score)::numeric, 1) as avg_safety,
    round(avg(transport_score)::numeric, 1) as avg_transport,
    round(avg(accommodation_score)::numeric, 1) as avg_accommodation,
    round(avg(nighttime_score)::numeric, 1) as avg_nighttime,
    count(*) as report_count,
    max(created_at) as last_reported
  from public.safety_reports
  group by city, country, country_code;

create unique index city_safety_scores_idx on public.city_safety_scores(city, country);

-- ============================================================
-- GEAR ITEMS (community-ranked products)
-- ============================================================
create type gear_category as enum (
  'camera', 'safety', 'backpack', 'clothing', 'tech',
  'health', 'navigation', 'sleep', 'footwear', 'other'
);

create table public.gear_items (
  id            uuid default uuid_generate_v4() primary key,
  name          text not null,
  brand         text,
  category      gear_category not null,
  description   text,
  image_url     text,
  affiliate_url text,                       -- Amazon / brand affiliate link
  price_usd     int,
  avg_rating    float default 0,
  review_count  int default 0,
  upvotes       int default 0,
  created_at    timestamptz default now()
);

alter table public.gear_items enable row level security;
create policy "Gear is public" on public.gear_items for select using (true);

-- Gear reviews
create table public.gear_reviews (
  id          uuid default uuid_generate_v4() primary key,
  gear_id     uuid references public.gear_items(id) on delete cascade not null,
  author_id   uuid references public.profiles(id) on delete cascade not null,
  rating      int check (rating between 1 and 5) not null,
  review_text text,
  trip_type   text,
  created_at  timestamptz default now(),
  unique(gear_id, author_id)
);

alter table public.gear_reviews enable row level security;
create policy "Reviews are public" on public.gear_reviews for select using (true);
create policy "Auth users can review" on public.gear_reviews for insert
  with check (auth.uid() = author_id);

-- ============================================================
-- TRIP PLANS (AI-generated or manual)
-- ============================================================
create table public.trip_plans (
  id            uuid default uuid_generate_v4() primary key,
  author_id     uuid references public.profiles(id) on delete cascade not null,
  title         text not null,
  destination   text not null,
  days_count    int not null,
  budget_usd    int,
  pto_days      int,
  risk_level    text check (risk_level in ('low','medium','high')),
  fitness_level text check (fitness_level in ('easy','moderate','challenging')),
  itinerary     jsonb,                      -- full day-by-day plan
  is_public     boolean default false,
  ai_generated  boolean default false,
  created_at    timestamptz default now()
);

alter table public.trip_plans enable row level security;
create policy "Public plans are viewable" on public.trip_plans for select
  using (is_public = true);
create policy "Authors can manage own plans" on public.trip_plans for all
  using (auth.uid() = author_id);

-- ============================================================
-- STORY LIKES
-- ============================================================
create table public.story_likes (
  story_id  uuid references public.stories(id) on delete cascade,
  user_id   uuid references public.profiles(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (story_id, user_id)
);

alter table public.story_likes enable row level security;
create policy "Likes are public" on public.story_likes for select using (true);
create policy "Auth users can like" on public.story_likes for insert
  with check (auth.uid() = user_id);
create policy "Users can unlike" on public.story_likes for delete
  using (auth.uid() = user_id);

-- ============================================================
-- ENCOUNTER BOARD (trip overlap coordination)
-- ============================================================
create table public.encounters (
  id            uuid default uuid_generate_v4() primary key,
  author_id     uuid references public.profiles(id) on delete cascade not null,
  destination   text not null,
  country       text not null,
  arrive_date   date not null,
  depart_date   date not null,
  looking_for   text,                       -- "dinner buddy", "hiking partner", "safety check-in"
  is_active     boolean default true,
  created_at    timestamptz default now()
);

alter table public.encounters enable row level security;
create policy "Encounters are public" on public.encounters for select using (true);
create policy "Auth users can post encounters" on public.encounters for insert
  with check (auth.uid() = author_id);
create policy "Authors can manage encounters" on public.encounters for all
  using (auth.uid() = author_id);
