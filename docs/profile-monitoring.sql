-- SOLOFTS — Profile monitoring queries
-- Run these in Supabase Dashboard → SQL Editor.
-- The profiles table is populated by the on_auth_user_created trigger in
-- supabase/migrations/001_initial_schema.sql whenever a new auth.users row is created.

-- 1) Recent profiles created in the webapp
select
  p.id,
  p.username,
  p.full_name,
  p.profession,
  p.home_country,
  p.countries_visited,
  p.trips_count,
  p.joined_at,
  p.updated_at
from public.profiles as p
order by p.joined_at desc
limit 50;

-- 2) Daily profile signups for the last 30 days
select
  date_trunc('day', p.joined_at)::date as signup_date,
  count(*) as profiles_created
from public.profiles as p
where p.joined_at >= now() - interval '30 days'
group by signup_date
order by signup_date desc;

-- 3) Auth users that did not get a matching public profile
-- Use this to confirm the signup trigger is working.
select
  u.id,
  u.email,
  u.created_at as auth_created_at
from auth.users as u
left join public.profiles as p on p.id = u.id
where p.id is null
order by u.created_at desc;
