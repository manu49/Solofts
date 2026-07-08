# 🚀 UNACCOMPANIED — Full Setup Guide

Complete step-by-step instructions: Supabase → Local Dev → Vercel → iOS path.

---

## Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Clone & Local Setup](#2-clone--local-setup)
3. [Supabase Setup (Database + Auth)](#3-supabase-setup)
4. [Local Development](#4-local-development)
5. [Vercel Deployment](#5-vercel-deployment)
6. [Custom Domain](#6-custom-domain)
7. [Anthropic AI Key (Trip Architect)](#7-anthropic-ai-key)
8. [Google OAuth](#8-google-oauth)
9. [Post-Deploy Checklist](#9-post-deploy-checklist)
10. [iOS App Path](#10-ios-app-path)
11. [Architecture Reference](#11-architecture-reference)

---

## 1. Prerequisites

Install these before starting:

```bash
# Node.js v18+
node --version   # should be >= 18

# Git
git --version

# npm (comes with Node)
npm --version
```

You will need accounts at:
- [github.com](https://github.com) — already have the repo
- [supabase.com](https://supabase.com) — free tier is enough to start
- [vercel.com](https://vercel.com) — free tier works
- [console.anthropic.com](https://console.anthropic.com) — for AI trip planning

---

## 2. Clone & Local Setup

```bash
# Clone the repo
git clone https://github.com/manu49/Solofts.git
cd Solofts

# Install root deps
npm install

# Install web app deps
cd apps/web
npm install

# Copy env file
cp .env.example .env.local
```

You'll fill in `.env.local` in step 3 and 7.

---

## 3. Supabase Setup

### 3a. Create a Project

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **New Project**
3. Name it `unaccompanied` (or anything)
4. Choose a strong database password — **save it somewhere safe**
5. Pick a region close to your users (e.g. `us-east-1` for US)
6. Click **Create new project** — wait ~2 min

### 3b. Run the Database Migrations

1. In the Supabase dashboard, go to **SQL Editor** → **New Query**
2. Open `supabase/migrations/001_initial_schema.sql` from this repo
3. Paste the entire contents and click **Run**
4. Open `supabase/migrations/002_seed_data.sql`
5. Paste and click **Run** — this seeds gear items

> ✅ You should see tables: `profiles`, `stories`, `safety_reports`, `gear_items`, `gear_reviews`, `trip_plans`, `encounters`, and a view: `city_safety_scores`

### 3c. Add the Materialized View Refresh Function

In SQL Editor, run this additional snippet:

```sql
-- Function to refresh safety scores (called after each new report)
create or replace function public.refresh_city_safety_scores()
returns void language plpgsql security definer
as $$
begin
  refresh materialized view concurrently public.city_safety_scores;
end;
$$;

-- Grant execution to authenticated users
grant execute on function public.refresh_city_safety_scores() to authenticated;
```

### 3d. Get Your API Keys

1. In Supabase dashboard → **Project Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** (secret!) → `SUPABASE_SERVICE_ROLE_KEY`

### 3e. Configure Auth

1. Supabase dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL**: `http://localhost:3000` (for dev) / your production URL later
3. Add to **Redirect URLs**:
   ```
   http://localhost:3000/api/auth/callback
   https://your-domain.com/api/auth/callback
   ```

### 3f. Fill in .env.local

Edit `apps/web/.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
NEXT_PUBLIC_APP_URL=http://localhost:3000
ANTHROPIC_API_KEY=sk-ant-...   # fill in step 7
```

---

## 4. Local Development

```bash
# From the repo root
cd apps/web
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the full landing page.

**Test the key flows:**
- `/` — Landing page with animated hero
- `/stories` — Story library with filters
- `/safety` — Safety intelligence page
- `/gear` — Solo Stack gear rankings
- `/plan` — AI trip architect
- `/auth/signup` — Create an account
- `/dashboard` — Member dashboard (requires auth)

---

## 5. Vercel Deployment

### 5a. Install Vercel CLI

```bash
npm install -g vercel
vercel login
```

### 5b. Link the Project

```bash
# From repo root
vercel link
# If prompted for the project directory/root, choose: apps/web
# → Select: Link to existing project? No (create new)
# → Project name: unaccompanied (or your choice)
# → Root Directory: apps/web
# → Detected framework: Next.js ✓
```

### 5c. Add Environment Variables

```bash
# Add each env var as a Vercel secret
vercel env add NEXT_PUBLIC_SUPABASE_URL
# paste the API URL, e.g. https://your-project-ref.supabase.co
# Do NOT paste the Supabase dashboard URL. Select: Production + Preview + Development

vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add OPENAI_API_KEY

# For APP_URL, add after you have your Vercel domain:
vercel env add NEXT_PUBLIC_APP_URL
# value: https://your-app.vercel.app
```

Or do this in the Vercel dashboard: **Project → Settings → Environment Variables**. Do not set these values to placeholders like `@supabase_url`; paste the actual values.

### 5d. Deploy

```bash
# Deploy to production
vercel --prod
```

Vercel will build and give you a URL like `https://unaccompanied-xxxx.vercel.app`.

### 5e. Update Supabase with Production URL

1. Supabase → **Authentication** → **URL Configuration**
2. Update **Site URL** to your Vercel URL
3. Add to **Redirect URLs**: `https://your-app.vercel.app/api/auth/callback`

### 5f. Future Deploys via GitHub (recommended)

1. Push to `main` → Vercel auto-deploys
2. In Vercel dashboard → **Settings** → **Git** → connect to `github.com/manu49/Solofts`
3. Set **Root Directory**: `apps/web` (this is where the Next.js `package.json` lives)

---

## 6. Custom Domain

1. Buy a domain (e.g. `unaccompanied.com`) at Namecheap, Cloudflare, etc.
2. In Vercel dashboard → **Project → Settings → Domains**
3. Add your domain → follow DNS instructions (usually CNAME or A record)
4. DNS propagation takes 5 min – 48 hours
5. Update Supabase redirect URLs with the new domain

---

## 7. OpenAI API Key

The **Trip Architect** (`/plan`) uses OpenAI to generate real itineraries.

1. Go to [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create an API key
3. Copy the key (starts with `sk-...`)
4. Add to `apps/web/.env.local`:
   ```env
   OPENAI_API_KEY=sk-...
   ```
5. Add to Vercel:
   ```bash
   vercel env add OPENAI_API_KEY
   ```

> **Cost:** depends on OpenAI model usage and generated token volume.

---


## 8. Auth Redirect URLs

Supabase email verification and magic links must be allowed to return to the app callback route. In Supabase Dashboard → **Authentication** → **URL Configuration**:

1. Set **Site URL** to your deployed app URL, for example:
   ```
   https://your-app.vercel.app
   ```
2. Add these **Redirect URLs** for local and deployed auth callbacks:
   ```
   http://localhost:3000/api/auth/callback
   https://your-app.vercel.app/api/auth/callback
   ```

If these URLs are missing or point at a stale deployment, the verification email can land on a 404 or fail before the app can exchange the Supabase confirmation code.

---

## 9. Google OAuth

Optional but strongly recommended — users can sign up with one click.

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. **New Project** → name it `unaccompanied`
3. **APIs & Services** → **OAuth consent screen**:
   - User Type: External
   - App name: UNACCOMPANIED
   - Support email: your email
4. **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**
   - Application type: Web application
   - Authorized redirect URIs:
     ```
     https://xxxx.supabase.co/auth/v1/callback
     ```
     (find your Supabase project URL in Project Settings → API)
5. Copy **Client ID** and **Client Secret**
6. Supabase dashboard → **Authentication** → **Providers** → **Google**
7. Toggle Enable → paste Client ID + Client Secret → Save

---

## 10. Post-Deploy Checklist

Run through this after every deployment:

- [ ] Landing page loads at `/`
- [ ] Signup at `/auth/signup` works and the verification email redirects to `/api/auth/callback`, then `/dashboard`
- [ ] Login at `/auth/login` works
- [ ] Google OAuth redirects correctly
- [ ] Dashboard at `/dashboard` shows after login
- [ ] Stories page loads at `/stories`
- [ ] Submit a story at `/stories/new` (requires login)
- [ ] Safety page loads at `/safety`
- [ ] Gear page loads at `/gear`
- [ ] Trip Architect at `/plan` returns a real AI itinerary
- [ ] Sign out works and redirects to `/`

---

## 10. iOS App Path

The entire app is built in **Next.js** which makes the iOS transition smooth. Two options:

### Option A: Capacitor (Recommended for speed — 2–4 weeks)

Wraps the existing Next.js web app in a native shell. Fastest path.

```bash
# Install Capacitor
cd apps/web
npm install @capacitor/core @capacitor/cli @capacitor/ios

# Initialize
npx cap init "UNACCOMPANIED" "com.unaccompanied.app"

# Build the web app
npm run build

# Add iOS platform
npx cap add ios

# Sync
npx cap sync

# Open in Xcode
npx cap open ios
```

**Then in Xcode:**
1. Set Bundle ID: `com.unaccompanied.app`
2. Set your Apple Developer Team
3. Add app icons and splash screen
4. Archive → App Store Connect

### Option B: React Native / Expo (Recommended for long-term — 6–8 weeks)

Create a proper native app that shares API and auth logic with the web app.

```bash
# New Expo app in the monorepo
npx create-expo-app apps/mobile --template blank-typescript

# Shared packages can live in packages/
# - packages/api    (Supabase client)
# - packages/types  (TypeScript types)
```

**Which to choose?**
- **Capacitor**: Ship in 2–4 weeks, same codebase, some native limitations
- **React Native**: 6–8 weeks, full native UX, scales better long-term

For your MVP, **Capacitor** is the right call. Validate with real users, then build native if needed.

---

## 11. Architecture Reference

```
┌─────────────────────────────────────────────────────────┐
│                  UNACCOMPANIED Platform                  │
├──────────────┬──────────────────┬───────────────────────┤
│  Frontend    │    Backend       │    Data               │
│              │                  │                       │
│  Next.js 14  │  Supabase        │  PostgreSQL           │
│  React 18    │  (BaaS)          │  - profiles           │
│  TypeScript  │                  │  - stories            │
│  Tailwind    │  Auth:           │  - safety_reports     │
│              │  - Email/Pass    │  - gear_items         │
│  Pages:      │  - Magic link    │  - trip_plans         │
│  /           │  - Google OAuth  │  - encounters         │
│  /stories    │                  │                       │
│  /safety     │  API Routes:     │  Materialized View:   │
│  /gear       │  /api/stories    │  city_safety_scores   │
│  /plan       │  /api/safety     │                       │
│  /dashboard  │  /api/gear       │  Row Level Security   │
│  /auth/*     │  /api/plan       │  on all tables        │
├──────────────┴──────────────────┴───────────────────────┤
│              Deployment                                   │
│  Vercel (web) ←── GitHub main branch auto-deploy        │
│  Supabase (db+auth) — hosted Postgres                   │
├──────────────────────────────────────────────────────────┤
│              AI Layer                                     │
│  Anthropic claude-sonnet-4-6 → /api/plan route          │
│  → Generates personalized solo itineraries              │
└──────────────────────────────────────────────────────────┘
```

### Environment Variables Quick Reference

| Variable | Where to get it | Required |
|----------|----------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API | ✅ |
| `NEXT_PUBLIC_APP_URL` | Your domain / Vercel URL | ✅ |
| `ANTHROPIC_API_KEY` | console.anthropic.com | ✅ for /plan |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | mapbox.com | Optional |

---

## Troubleshooting

**Build fails on Vercel:**
```bash
# Test build locally first
cd apps/web && npm run build
```

**Supabase auth not working:**
- Check redirect URLs include both `localhost` and production domain
- Ensure `NEXT_PUBLIC_APP_URL` matches your actual URL exactly

**`city_safety_scores` view errors:**
- Make sure you ran the `refresh_city_safety_scores` function SQL (step 3c)
- The view requires at least 1 safety report to return data

**TypeScript errors on deploy:**
- Run `cd apps/web && npm run lint` locally to catch issues before pushing

---

*Built by a woman who refused to wait. For every woman who won't either.* 🌍

---

## 12. Monitor Created Profiles

Profiles are stored in the `public.profiles` table and are created automatically when Supabase Auth inserts a new user. To monitor profiles created by the webapp:

1. Open **Supabase Dashboard → SQL Editor → New Query**.
2. Open [`docs/profile-monitoring.sql`](./docs/profile-monitoring.sql).
3. Run query **1** to see the latest created profiles, query **2** for daily signup counts, and query **3** to catch auth users missing a profile.

A minimal query for the latest profiles is:

```sql
select
  id,
  username,
  full_name,
  profession,
  home_country,
  joined_at,
  updated_at
from public.profiles
order by joined_at desc
limit 50;
```
