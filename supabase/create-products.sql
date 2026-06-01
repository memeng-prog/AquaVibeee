-- Create products table for AquaVibe
-- Run this in the Supabase SQL editor for your project

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  description text not null,
  long_description text not null,
  price numeric(10, 2) not null,
  compare_at_price numeric(10, 2),
  category text not null check (category in ('freshwater','saltwater','nano','custom','accessories')),
  image_url text not null,
  gallery text[] default '{}',
  capacity_liters integer default 0,
  dimensions text not null,
  material text not null,
  in_stock boolean default true,
  stock_count integer default 0,
  rating numeric(2,1) default 5.0,
  review_count integer default 0,
  features text[] default '{}',
  featured boolean default false,
  created_at timestamptz default now()
);

create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_category_idx on public.products (category);
