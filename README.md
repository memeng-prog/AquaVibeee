 # Meng's Fish Tank

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
 3. Copy `.env.example` to `.env.local` and add your keys:

 ```env
 VITE_SUPABASE_URL=https://xxxx.supabase.co
 VITE_SUPABASE_ANON_KEY=your-anon-key
 VITE_USE_SUPABASE=true
 ```

 4. Seed the `products` table (or use the Supabase dashboard) matching the schema in `src/lib/database.types.ts`

 Until `VITE_USE_SUPABASE=true`, the app uses mock catalog data and stores orders/contact locally.

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

 | Command        | Description          |
 |----------------|----------------------|
 | `npm run dev`  | Start dev server     |
 | `npm run build`| Production build     |
 | `npm run preview` | Preview production build |

 ## Tech stack

 - React 19 + TypeScript
 - React Router 7
 - Tailwind CSS 4
 - Supabase JS client
 - Lucide React icons
