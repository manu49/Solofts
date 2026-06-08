# SOLOFTS — UNACCOMPANIED Setup Guide
## Complete Step-by-Step: Backend → Frontend → Deployment

---

## 🗂️ Project Structure

```
Solofts/
├── apps/
│   └── web/               ← Next.js 14 app (React, TypeScript, Tailwind)
│       ├── app/           ← App Router pages
│       ├── components/    ← Reusable UI components
│       ├── lib/           ← Supabase client, utilities
│       └── styles/        ← Global CSS
├── supabase/
│   └── migrations/        ← SQL schema + seed data
├── docs/
├── vercel.json            ← Vercel deployment config
└── SETUP.md               ← This file
```

---

## PART 1 — SUPABASE BACKEND SETUP

### Step 1: Create a Supabase Project

1. Go to **https://app.supabase.com** → Sign in (or create free account)
2. Click **"New Project"**
3. Settings:
   - **Name:** `solofts`
   - **Database Password:** generate a strong one — **save it somewhere safe**
   - **Region:** US East (closest to your users; or whichever you prefer)
4. Wait ~2 minutes for project to spin up

---

### Step 2: Run the Database Schema

1. In Supabase dashboard → go to **SQL Editor** (left sidebar, `</>` icon)
2. Click **"New Query"**
3. Copy-paste the entire contents of `supabase/migrations/001_initial_schema.sql`
4. Click **Run** (or Cmd+Enter)
5. You should see: `Success. No rows returned.`

Then run the seed data:
1. New query again
2. Copy-paste `supabase/migrations/002_seed_data.sql`
3. Run it — this seeds 10 gear items

---

### Step 3: Get Your API Keys

1. In Supabase → **Settings** (gear icon) → **API**
2. Copy these (you'll need them in every environment):
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role / secret key** → `SUPABASE_SERVICE_ROLE_KEY` (**never expose this client-side**)

---

### Step 4: Enable Authentication Providers

1. Supabase → **Authentication** → **Providers**
2. **Email** is enabled by default ✓
3. Enable **Google**:
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create/select a project → APIs & Services → Credentials
   - Create OAuth 2.0 Client ID (Web application type)
   - Authorized redirect URIs: `https://your-project-ref.supabase.co/auth/v1/callback`
   - Copy Client ID + Client Secret into Supabase Google provider settings
4. In Supabase → Authentication → **URL Configuration**:
   - Site URL: `http://localhost:3000` (dev) / `https://yourdomain.com` (prod)
   - Redirect URLs: add both `http://localhost:3000/api/auth/callback` and `https://yourdomain.com/api/auth/callback`

---

### Step 5: Storage Bucket (for story cover images)

1. Supabase → **Storage** → **New Bucket**
2. Name: `story-images`
3. Public: **Yes** (so images render in the app)
4. Run this in SQL Editor to set upload policy:

```sql
CREATE POLICY "Auth users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'story-images' AND auth.role() = 'authenticated');

CREATE POLICY "Images are public"
ON storage.objects FOR SELECT
USING (bucket_id = 'story-images');
```

---

## PART 2 — LOCAL DEVELOPMENT

### Step 6: Install Dependencies

```bash
# Clone the repo
git clone https://github.com/manu49/Solofts.git
cd Solofts

# Install Next.js app dependencies
cd apps/web
npm install
```

### Step 7: Create Your .env.local

```bash
# In apps/web/ directory
cp .env.example .env.local
```

Edit `.env.local` with your real values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 8: Run Dev Server

```bash
# From apps/web/
npm run dev
```

Open **http://localhost:3000** — you should see the full UNACCOMPANIED site.

---

## PART 3 — VERCEL DEPLOYMENT

### Step 9: Push to GitHub (if you haven't already)

```bash
# From repo root
git add .
git commit -m "feat: initial UNACCOMPANIED platform"
git push origin main
```

### Step 10: Import into Vercel

1. Go to **https://vercel.com** → Log in with GitHub
2. Click **"Add New Project"** → **"Import Git Repository"**
3. Find **manu49/Solofts** → click **Import**
4. Configure:
   - **Framework Preset:** Next.js (auto-detected)
   - **Root Directory:** `.` (root)
   - **Build Command:** `cd apps/web && npm install && npm run build`
   - **Output Directory:** `apps/web/.next`
   - **Install Command:** `cd apps/web && npm install`

### Step 11: Add Environment Variables in Vercel

In the Vercel project settings → **Environment Variables**, add all four:

| Name | Value | Environments |
|------|-------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | your supabase URL | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | your anon key | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | your service role key | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | `https://your-vercel-url.vercel.app` | Production |

### Step 12: Deploy

Click **Deploy**. Vercel builds and deploys in ~2 minutes.

Your site is live at: `https://solofts.vercel.app` (or your custom domain)

---

### Step 13: Update Supabase Auth URL for Production

1. Supabase → Authentication → URL Configuration
2. Update **Site URL** to: `https://your-vercel-url.vercel.app`
3. Add **Redirect URL**: `https://your-vercel-url.vercel.app/api/auth/callback`

---

## PART 4 — CUSTOM DOMAIN (Optional)

1. Vercel → Project → **Settings → Domains**
2. Add your domain (e.g. `unaccompanied.com`)
3. Follow DNS instructions (add CNAME record at your registrar)
4. Update `NEXT_PUBLIC_APP_URL` env var to your new domain
5. Update Supabase auth URLs too

---

## PART 5 — iOS APP PATH (Future)

This app is built with **Next.js** which gives you two paths to iOS:

### Option A: React Native (Recommended for full native feel)
- The Supabase backend works 100% with React Native
- Shared TypeScript types in `apps/web/lib/supabase/database.types.ts`
- Add `apps/mobile/` folder with Expo
- Install: `npx create-expo-app apps/mobile --template`
- Use the same Supabase client pattern

### Option B: Capacitor (Wrap web app)
```bash
cd apps/web
npm install @capacitor/core @capacitor/ios @capacitor/cli
npx cap init
npx cap add ios
npx cap build
npx cap open ios  # Opens in Xcode
```

---

## PART 6 — DATA ARCHITECTURE SUMMARY

```
Supabase (PostgreSQL)
├── profiles           ← user accounts + travel stats
├── stories            ← user-submitted travel stories
├── safety_reports     ← crowdsourced city safety scores
├── city_safety_scores ← materialized view (aggregated scores)
├── gear_items         ← product database (seeded)
├── gear_reviews       ← user reviews of gear
├── trip_plans         ← AI-generated + manual itineraries
└── encounters         ← trip overlap coordination board

Supabase Storage
└── story-images/      ← user-uploaded cover photos

Next.js API Routes
├── /api/stories       ← CRUD for stories
├── /api/safety        ← GET scores, POST reports
├── /api/gear          ← GET gear with reviews
└── /api/auth/callback ← OAuth redirect handler
```

---

## PART 7 — MONETIZATION TECH CHECKLIST

| Feature | Tech Needed | Status |
|---------|------------|--------|
| Affiliate links | Amazon Associates signup | Ready (links in gear DB) |
| Premium membership | Stripe + Supabase webhook | Add `stripe` npm package |
| AI trip planner | Anthropic API key | Add `ANTHROPIC_API_KEY` env var |
| Email newsletter | Resend or Mailchimp | Add on user signup trigger |
| Analytics | Vercel Analytics (free) | Enable in Vercel dashboard |

### To wire in real AI trip planning:
1. Add `ANTHROPIC_API_KEY` to your env vars
2. Install: `npm install @anthropic-ai/sdk`
3. Create `/api/plan/route.ts` that calls Claude with the user's trip params

---

## TROUBLESHOOTING

**"supabaseUrl is required"** → `.env.local` not found or not loaded. Make sure file is in `apps/web/` not root.

**Auth redirect loops** → Make sure redirect URLs in Supabase match exactly (including trailing slash).

**Build fails on Vercel** → Check that Build Command is `cd apps/web && npm install && npm run build`.

**Images not loading** → Add your domain to `next.config.js` `images.domains` array.

---

## QUICK REFERENCE

| Command | Where | What |
|---------|-------|------|
| `npm run dev` | `apps/web/` | Start local dev server |
| `npm run build` | `apps/web/` | Production build |
| `git push origin main` | root | Deploy to Vercel (auto) |
