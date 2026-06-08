# UNACCOMPANIED — Solo. Fearless. Free.

> The community platform for solo female travelers. Real stories, crowdsourced safety intelligence, crowd-ranked gear, and AI-powered trip planning — built for women who travel with a day job.

## ✨ Features

- **Story Library** — Verified travel stories filterable by profession, budget, trip style
- **Safety Intelligence Map** — Crowdsourced city safety scores from women's lived experience
- **The Solo Stack** — Community-ranked gear (cameras, safety devices, backpacks, tech)
- **AI Trip Architect** — Input your PTO + budget → get a full optimized solo itinerary
- **Encounter Board** — Find solo women with overlapping travel dates
- **Trending Dashboard** — Live data on hottest destinations, safety scores, gear

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Next.js 14, React, TypeScript, Tailwind CSS |
| Backend | Supabase (PostgreSQL, Auth, Storage, RLS) |
| Deployment | Vercel |
| Auth | Supabase Auth (Email + Google OAuth) |
| Mobile (future) | React Native / Expo or Capacitor |

## 🚀 Setup

See **[SETUP.md](./SETUP.md)** for complete step-by-step instructions covering:
1. Supabase database + auth setup
2. Local development
3. Vercel deployment
4. Custom domain
5. iOS app path

## 📁 Structure

```
apps/web/         Next.js frontend + API routes
supabase/         Database migrations + schema
docs/             Architecture docs
```

---

*Built by a woman who pulled her car out of Nevada desert sand and went back to work on Monday.*
