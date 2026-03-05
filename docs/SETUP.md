# LAYA Inventory — Environment Setup Guide

Complete guide to set up the LAYA Inventory platform from scratch on a new machine or environment.

---

## 1. Prerequisites

- **Node.js** >= 18
- **pnpm** (package manager)
- A **Supabase** project (free tier works)
- A **Clerk** account (free tier works) — for authentication

---

## 2. Clone & Install

```bash
git clone <repo-url>
cd laya_inventory
pnpm install
```

---

## 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

### Required Variables

| Variable | Description | Where to find |
|----------|-------------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase anon/public key | Supabase Dashboard → Settings → API → anon public |
| `SUPABASE_SECRET_KEY` | Supabase service role key | Supabase Dashboard → Settings → API → service_role secret |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Clerk Dashboard → API Keys |
| `CLERK_SECRET_KEY` | Clerk secret key | Clerk Dashboard → API Keys |

### Example `.env.local`

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOi...
SUPABASE_SECRET_KEY=eyJhbGciOi...

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

---

## 4. Supabase Setup

### 4a. Create the Database Schema

Run the SQL migration in the **Supabase SQL Editor** (Dashboard → SQL Editor → New query):

1. Open `supabase/migrations/001_initial_schema.sql`
2. Paste the entire contents into the SQL Editor
3. Click **Run**

This creates all tables: `projects`, `group_types`, `groups`, `unit_types`, `units`, `unit_groups`, `unit_prices`, `price_visibility`, `media`, `project_amenities`, `status_audit_log`.

### 4b. Create the Storage Bucket

Run the storage migration:

1. Open `supabase/migrations/002_storage_bucket.sql`
2. Paste into the SQL Editor
3. Click **Run**

This creates the `project-media` storage bucket (public) with read/write policies.

**Alternatively**, you can create the bucket manually:
1. Go to **Storage** in the Supabase sidebar
2. Click **New bucket**
3. Name: `project-media`
4. Toggle **Public bucket** ON
5. Click **Create bucket**

### 4c. Seed Initial Data

Seed the LAYA Residences project data (88 terrace homes, stages, areas, prices, floorplans):

```bash
npx tsx scripts/seed-supabase.ts
```

### 4d. Verify Setup

After seeding, you can verify in the Supabase Table Editor:
- `projects` should have 1 row (LAYA Residences)
- `units` should have 88 rows
- `groups` should have 8 rows (3 stages + 5 areas)
- `unit_prices` should have 88 rows (one per unit)

---

## 5. Supabase Configuration Checklist

| Item | Location | Status |
|------|----------|--------|
| Database schema created | SQL Editor | Run `001_initial_schema.sql` |
| Storage bucket created | SQL Editor or Storage UI | Run `002_storage_bucket.sql` |
| Data seeded | Terminal | Run `npx tsx scripts/seed-supabase.ts` |
| RLS policies (storage) | Automatically created by migration | Verify in Auth → Policies |
| API keys copied to `.env.local` | Settings → API | Copy anon + service_role keys |

---

## 5b. Clerk Authentication Setup

### Create a Clerk Application

1. Sign up at [clerk.com](https://clerk.com) and create a new application
2. Choose **Email** as the sign-in method (simplest setup)
3. Go to **API Keys** and copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

### Configure User Roles

Roles are stored in Clerk's **Public Metadata** per user.

1. Go to Clerk Dashboard → **Users**
2. Click a user → **Public Metadata**
3. Set: `{ "role": "super_admin" }` for the primary admin

Available roles:
| Role | Access |
|------|--------|
| `super_admin` | Full access to all projects and admin pages |
| `project_admin` | Can manage assigned projects (default for new users) |
| `sales_agent` | Can view internal dashboard, no admin access |
| `viewer` | Read-only (shouldn't normally need to log in) |

> **Note**: Authenticated users with no role set default to `project_admin` for frictionless setup.

### Route Access

All routes require Clerk authentication except the sign-in page.

| Route | Auth | Role Required |
|-------|------|---------------|
| `/sign-in` | Public | None |
| `/` | Clerk login | Any authenticated user |
| `/{slug}/client` | Clerk login | Any authenticated user |
| `/{slug}/client/present` | Clerk login | Any authenticated user |
| `/{slug}/internal` | Clerk login | Any authenticated user |
| `/{slug}/admin/*` | Clerk login | `super_admin` or `project_admin` |

---

## 6. Running the App

```bash
# Development
pnpm dev

# Production build
pnpm build
pnpm start
```

### URLs (development)

| URL | Description |
|-----|-------------|
| `http://localhost:3000` | Project selector |
| `http://localhost:3000/laya-residences/client` | Client view |
| `http://localhost:3000/laya-residences/internal` | Internal dashboard |
| `http://localhost:3000/laya-residences/admin/prices` | Admin — Price management |
| `http://localhost:3000/laya-residences/admin/stages` | Admin — Stage releases |
| `http://localhost:3000/laya-residences/admin/media` | Admin — Media management |
| `http://localhost:3000/laya-residences/admin/units` | Admin — Unit table |
| `http://localhost:3000/laya-residences/admin/settings` | Admin — Branding & settings |
| `http://localhost:3000/laya-residences/client/present` | Presentation mode |
| `http://localhost:3000/sign-in` | Clerk login page |

---

## 7. Deploying to Vercel

1. Connect your repo to Vercel
2. Set all environment variables from `.env.local` in the Vercel dashboard (Settings → Environment Variables)
3. Deploy

### Important Vercel Settings

- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `pnpm build` (default)
- **Output Directory**: `.next` (default)
- **Node.js Version**: 18.x or higher

### Environment Variables on Vercel

Add these in Vercel → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJ...
SUPABASE_SECRET_KEY=eyJ...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

---

## 8. Adding a New Project

To add a new property development project:

1. Insert a row in the `projects` table with:
   - `slug` (URL-friendly, e.g., `riverstone-towers`)
   - `name`, `tagline`, `location`
   - `branding` (JSON with colors, fonts, logos)
   - `unit_label` (e.g., "Apartment"), `unit_label_short` (e.g., "APT")
   - `currency_code`, `currency_symbol`
   - `siteplan_image_url` (upload siteplan to storage first)

2. Create `group_types` for the project (e.g., "Stage", "Area", "Tower", "Floor")

3. Create `groups` for each group type (e.g., "Stage 1", "Stage 2", "Tower A")

4. Create `unit_types` for floor plan types

5. Insert `units` with hotspot coordinates (`hotspot_x`, `hotspot_y` as percentage values)

6. Insert `unit_prices` with `is_current = true`

7. Upload media via the admin UI at `/<slug>/admin/media`

---

## 9. Project Structure

```
laya_inventory/
├── .env.example              # Template env vars
├── .env.local                # Local env vars (not committed)
├── next.config.ts            # Next.js config (Supabase image domains)
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql   # Database tables + indexes
│       └── 002_storage_bucket.sql   # Storage bucket + policies
├── scripts/
│   └── seed-supabase.ts      # Seed LAYA Residences data
├── src/
│   ├── app/                  # Next.js routes
│   │   ├── [projectSlug]/    # Dynamic per-project routes
│   │   │   ├── client/       # Client view
│   │   │   ├── internal/     # Internal dashboard
│   │   │   └── admin/        # Admin pages (prices, stages, media, units, settings)
│   │   └── api/              # API routes
│   ├── components/           # React components
│   ├── lib/                  # Data layer, types, utilities
│   │   ├── data.ts           # Supabase data fetching
│   │   ├── types.ts          # TypeScript interfaces
│   │   └── supabase/         # Supabase client setup
│   └── providers/            # React context providers
├── public/
│   └── images/               # Static images (siteplans)
└── docs/
    └── SETUP.md              # This file
```

---

## 10. Troubleshooting

### "Project not found" on admin pages
- Verify the project exists in the `projects` table with `is_active = true`

### Media upload fails
- Check that the `project-media` storage bucket exists (step 4b)
- Verify `SUPABASE_SECRET_KEY` is set (the service role key, not the anon key)

### Prices/stages not saving
- Verify Supabase connection and API keys

### Floor plans not showing
- Upload via admin media page, set type to "floorplan" with ground/upper variant

### Images not loading from Supabase
- `next.config.ts` must have `remotePatterns` allowing `**.supabase.co`
- Storage bucket must be set to **public**

### Hotspots not showing on siteplan
- Verify `hotspot_x` and `hotspot_y` are populated for units in the database
- Values should be percentage coordinates (0-100)
