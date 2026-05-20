-- Meng's Fish Tank — Supabase schema
-- Run in Supabase SQL Editor after creating your project

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  long_description text not null,
  price numeric(10, 2) not null,
  compare_at_price numeric(10, 2),
  category text not null check (category in ('freshwater', 'saltwater', 'nano', 'custom', 'accessories')),
  image_url text not null,
  gallery text[] default '{}',
  capacity_liters integer default 0,
  dimensions text not null,
  material text not null,
  in_stock boolean default true,
  stock_count integer default 0,
  rating numeric(2, 1) default 5.0,
  review_count integer default 0,
  features text[] default '{}',
  featured boolean default false,
  created_at timestamptz default now()
);

-- Orders
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id),
  items jsonb not null,
  subtotal numeric(10, 2) not null,
  shipping numeric(10, 2) not null,
  tax numeric(10, 2) not null,
  total numeric(10, 2) not null,
  status text default 'pending' check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  shipping_address jsonb not null,
  shipping_method text not null,
  created_at timestamptz default now()
);

-- Contact messages
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  created_at timestamptz default now()
);

-- Newsletter subscribers
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  created_at timestamptz default now()
);

-- Row Level Security
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.contact_messages enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- Public read for products
create policy "Products are viewable by everyone"
  on public.products for select using (true);

-- Anyone can submit contact / newsletter (adjust for production spam protection)
create policy "Anyone can insert contact messages"
  on public.contact_messages for insert with check (true);

create policy "Anyone can subscribe to newsletter"
  on public.newsletter_subscribers for insert with check (true);

-- Orders: allow anonymous insert for guest checkout (tighten with auth later)
create policy "Anyone can create orders"
  on public.orders for insert with check (true);

create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_category_idx on public.products (category);
