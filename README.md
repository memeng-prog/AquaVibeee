<<<<<<< HEAD

# Meng's Fish Tank

=======

# AquaVibe Studio

> > > > > > > d24a0bc (Fix: display peso symbol instead of dollar sign in prices)

Professional e-commerce storefront for premium aquariums — built with **React**, **TypeScript**, **Vite**, **Tailwind CSS**, and **Supabase-ready** architecture.

## Features

- **Home** — Hero, category showcase, featured products, testimonials, newsletter
- **Shop** — Search, filters, sorting, category browsing
- **Product detail** — Gallery, specs, reviews, add to cart
- **Cart** — Persistent localStorage cart with quantity controls
- **Checkout** — Multi-step shipping, delivery, payment (demo)
- **Contact** — Form with Supabase-ready submission
- **About** — Brand story and stats

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Supabase integration

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Copy `.env.example` to `.env` and add your keys:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_USE_SUPABASE=true

SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-secret
```

4. Seed the `products` table (or use the Supabase dashboard) matching the schema in `src/lib/database.types.ts`

Until `VITE_USE_SUPABASE=true`, the app uses mock catalog data and stores orders/contact locally.

### Environment values

- Safe to keep local: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_USE_SUPABASE`
- Server-only secret, never commit: `SUPABASE_SERVICE_ROLE_KEY`
- Optional admin protection for admin endpoints:
  - `ADMIN_API_SECRET` for the Vercel serverless functions
  - `VITE_ADMIN_API_SECRET` for the frontend to send the matching header

### Team sharing

- Commit [.env.example](.env.example), not `.env`
- Keep real project values in `.env` on your machine only
- Share the schema and setup steps with your team so everyone can create their own local `.env`

### Deploying to Vercel (recommended)

1. Install Vercel CLI or connect the repo via the Vercel dashboard.

CLI quick deploy:

```bash
npm i -g vercel
vercel login
vercel --prod
```

2. In the Vercel project settings, set these Environment Variables for both Production and Preview:

- `VITE_SUPABASE_URL` — your Supabase URL
- `VITE_SUPABASE_ANON_KEY` — anon key
- `VITE_USE_SUPABASE` — `true`
- `SUPABASE_URL` — same Supabase URL (server)
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (server-only, DO NOT COMMIT)
- `ADMIN_API_SECRET` — optional secret used to protect admin endpoints on the server
- `VITE_ADMIN_API_SECRET` — same value, so the frontend can send the header

3. Serverless admin endpoints are provided under `/api/*` and use the `SUPABASE_SERVICE_ROLE_KEY` from Vercel env. Endpoints:

- `POST /api/create-staff` — body: `{ email, password?, full_name?, role? }`
- `POST /api/set-role` — body: `{ id?|email, role }`
- `GET  /api/list-staff` — returns staff profiles
- `POST /api/delete-user` — body: `{ id?|email }`

If you set admin protection, keep `ADMIN_API_SECRET` and `VITE_ADMIN_API_SECRET` the same value. The frontend sends `x-admin-secret: <value>` using the `VITE_ADMIN_API_SECRET` value.

4. Build & deploy: Vercel will run `npm run build` automatically. The frontend is served statically and `/api/*` routes run as serverless functions.

Notes:

- Keep `SUPABASE_SERVICE_ROLE_KEY` secret — only set this in Vercel environment variables, not in the repository.
- After deploy, your Shop/Admin pages will use live Supabase data.

## Project structure

```
src/
├── components/   # UI, layout, products, cart, home
├── context/      # Cart & toast providers
├── data/         # Mock products (dev fallback)
├── lib/          # Supabase client, utils, constants
├── pages/        # Route pages
├── services/     # Data layer (products, orders, contact)
└── types/        # TypeScript interfaces
```

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start dev server         |
| `npm run build`   | Production build         |
| `npm run preview` | Preview production build |

## Tech stack

- React 19 + TypeScript
- React Router 7
- Tailwind CSS 4
- Supabase JS client
- Lucide React icons
