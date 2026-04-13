# Juan Digital — ADHD-Friendly Productivity Platform

> Your ADHD brain deserves better tools.

Interactive weekly planners designed for how your brain actually works. Prioritize, plan, track habits, and dump your thoughts — all in one calming space.

## Tech Stack

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **Auth & Database:** Supabase
- **Payments:** Stripe
- **Deployment:** Vercel (recommended)

## Features (MVP)

- 🔐 **Authentication** — Email/password sign up & sign in
- 📊 **Dashboard** — Overview of plans, stats, and quick actions
- 📝 **Interactive ADHD Planner** — The core product:
  - Top 3 priorities (drag to reorder)
  - Mon–Fri day columns with time blocks and tasks
  - Habit tracker (5 customizable habits per day)
  - Brain dump zone
  - Distraction log with timestamps
  - Weekly review (what worked, what didn't, next week focus)
  - Auto-save (debounced)
- 📅 **Plan History** — Browse and review past weeks
- 💰 **Pricing** — Free / Pro / Business tiers with Stripe checkout
- 👤 **Profile** — Account settings and subscription management
- 🌙 **Dark Mode** — Automatic, follows system preference

## Setup

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd juan-platform
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the contents of `supabase/schema.sql`
3. Copy your project URL and anon key from Settings → API

### 3. Set Up Stripe

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Create products and prices:
   - **Pro Monthly:** $9/month
   - **Pro Yearly:** $90/year
   - **Business Monthly:** $19/month
   - **Business Yearly:** $190/year
3. Copy the price IDs and secret key
4. Set up a webhook endpoint pointing to `/api/webhooks/stripe` with these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`

### 4. Environment Variables

```bash
cp .env.example .env.local
```

Fill in all the values in `.env.local`.

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes (checkout, webhooks)
│   ├── auth/              # Login, signup, callback
│   ├── dashboard/         # User dashboard
│   ├── planner/           # Planner (new, [id], history)
│   ├── pricing/           # Pricing page
│   └── profile/           # User profile
├── components/            # React components
│   ├── auth/              # Protected route wrapper
│   ├── layout/            # Navbar, footer
│   ├── planner/           # All planner components
│   └── ui/                # Reusable UI (button, input, card, badge)
├── lib/                   # Utilities & hooks
│   ├── auth-context.tsx   # Auth provider & hook
│   ├── planner-hooks.ts   # Planner state management
│   ├── supabase.ts        # Client-side Supabase
│   ├── supabase-server.ts # Server-side Supabase
│   ├── stripe.ts          # Stripe config
│   └── utils.ts           # Helpers
├── types/                 # TypeScript types
│   └── database.ts        # Database types
supabase/
└── schema.sql             # Complete database schema with RLS
```

## Design

- **Brand:** Deep teal (#0D9488), clean whites, slate grays
- **ADHD-Friendly:** Large click targets, minimal clutter, clear hierarchy
- **Calming:** Subtle animations, progress indicators
- **Responsive:** Works on desktop, tablet, and mobile

## License

Private — Juan Digital © 2025
