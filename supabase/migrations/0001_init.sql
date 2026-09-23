-- Elaine Fashion schema for Supabase
-- Apply this in the SQL editor or via supabase db push once the project exists.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  description text,
  price integer not null,
  compare_at integer,
  promo_percent integer,
  images text[] not null default '{}',
  colors jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  email text not null,
  total integer not null,
  status text not null default 'pending',
  payment_method text,
  shipping jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_slug text not null,
  color text,
  quantity integer not null,
  unit_price integer not null
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.contact_messages enable row level security;

create policy "public read products" on public.products for select using (true);
create policy "admin write products" on public.products for all using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

create policy "own profile" on public.profiles for select using (auth.uid() = id);
create policy "own orders" on public.orders for select using (auth.uid() = user_id);
create policy "insert orders" on public.orders for insert with check (true);
create policy "insert contact" on public.contact_messages for insert with check (true);
