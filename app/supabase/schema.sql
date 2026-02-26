-- Enable UUID extension (built-in in modern Postgres/Supabase, but good to have pgcrypto if needed)
-- create extension if not exists "uuid-ossp";
-- create extension if not exists "pgcrypto";

-- PROFILES (Public user data linked to auth.users)
create table if not exists profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text,
  email text,
  avatar_url text,
  phone text,
  preferences jsonb default '{}',
  stats jsonb default '{}',
  notification_preferences jsonb default '{}',
  privacy_settings jsonb default '{}',
  role text default 'user' check (role in ('user', 'admin', 'moderator')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table profiles enable row level security;

-- Helper function to check if user is admin (prevents RLS recursion)
create or replace function is_admin()
returns boolean as $$
begin
  -- Search path must be set for security definer functions
  -- We query profiles directly. Since this is security definer, it runs as DB owner
  -- bypassing RLS on the select, preventing recursion.
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer set search_path = public;

-- Policies
drop policy if exists "Public profiles are viewable by everyone" on profiles;
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

drop policy if exists "Users can update their own profile" on profiles;
create policy "Users can update their own profile"
  on profiles for update
  using ( auth.uid() = id );

drop policy if exists "Admins can update all profiles" on profiles;
create policy "Admins can update all profiles"
  on profiles for update
  using ( is_admin() );

drop policy if exists "Admins can delete profiles" on profiles;
create policy "Admins can delete profiles"
  on profiles for delete
  using ( is_admin() );

-- PRODUCTS (Coffee Menu)
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price decimal(10,2) not null,
  original_price decimal(10,2),
  image text,
  category text,
  tags text[],
  flavor_notes text[],
  rating decimal(3,2) default 0,
  review_count integer default 0,
  hidden boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table products enable row level security;

drop policy if exists "Products are viewable by everyone" on products;
create policy "Products are viewable by everyone"
  on products for select
  using ( true );

drop policy if exists "Admins can insert products" on products;
create policy "Admins can insert products"
  on products for insert
  with check ( is_admin() );

drop policy if exists "Admins can update products" on products;
create policy "Admins can update products"
  on products for update
  using ( is_admin() )
  with check ( is_admin() );

drop policy if exists "Admins can delete products" on products;
create policy "Admins can delete products"
  on products for delete
  using ( is_admin() );

-- CAFES (Locations)
create table if not exists cafes (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  address text not null,
  description text,
  image text,
  rating decimal(3,2) default 0,
  review_count integer default 0,
  features text[],
  lat decimal(10,8),
  lng decimal(11,8),
  status text default 'Open Now',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table cafes enable row level security;

drop policy if exists "Cafes are viewable by everyone" on cafes;
create policy "Cafes are viewable by everyone"
  on cafes for select
  using ( true );

drop policy if exists "Admins can manage cafes" on cafes;
create policy "Admins can manage cafes"
  on cafes for all
  using ( is_admin() );

-- PAYMENT METHODS
create table if not exists payment_methods (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  type text not null, -- 'card', 'wallet', 'cash'
  last4 text,
  brand text,
  expiry text,
  is_default boolean default false,
  name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table payment_methods enable row level security;

drop policy if exists "Users can view own payment methods." on payment_methods;
create policy "Users can view own payment methods."
  on payment_methods for select
  using ( auth.uid() = user_id );

drop policy if exists "Users can insert own payment methods." on payment_methods;
create policy "Users can insert own payment methods."
  on payment_methods for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Users can update own payment methods" on payment_methods;
create policy "Users can update own payment methods"
  on payment_methods for update
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

drop policy if exists "Users can delete own payment methods" on payment_methods;
create policy "Users can delete own payment methods"
  on payment_methods for delete
  using ( auth.uid() = user_id );

-- ADDRESSES
create table if not exists addresses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  name text, -- 'Home', 'Work'
  address text not null,
  city text not null,
  zip text,
  type text, -- 'home', 'work', 'other'
  is_default boolean default false,
  location jsonb, -- {lat, lng}
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table addresses enable row level security;

drop policy if exists "Users can view own addresses" on addresses;
create policy "Users can view own addresses"
  on addresses for select
  using ( auth.uid() = user_id );

drop policy if exists "Admins can view all addresses" on addresses;
create policy "Admins can view all addresses"
  on addresses for select
  using ( is_admin() );

drop policy if exists "Users can insert own addresses" on addresses;
create policy "Users can insert own addresses"
  on addresses for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Users can update own addresses" on addresses;
create policy "Users can update own addresses"
  on addresses for update
  using ( auth.uid() = user_id )
  with check ( auth.uid() = user_id );

drop policy if exists "Users can delete own addresses" on addresses;
create policy "Users can delete own addresses"
  on addresses for delete
  using ( auth.uid() = user_id );

-- ORDERS
create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete set null,
  items jsonb not null, -- Array of product snapshots
  total_amount decimal(10,2) not null,
  status text default 'pending' check (status in ('pending', 'processing', 'completed', 'cancelled')),
  payment_status text default 'unpaid',
  payment_method_id uuid references payment_methods(id),
  shipping_address_id uuid references addresses(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table orders enable row level security;

drop policy if exists "Users can view own orders" on orders;
create policy "Users can view own orders"
  on orders for select
  using ( auth.uid() = user_id );

drop policy if exists "Admins can view all orders" on orders;
create policy "Admins can view all orders"
  on orders for select
  using ( is_admin() );

drop policy if exists "Users can create orders" on orders;
create policy "Users can create orders"
  on orders for insert
  with check ( auth.uid() = user_id );

drop policy if exists "Admins can update orders" on orders;
create policy "Admins can update orders"
  on orders for update
  using ( is_admin() );


-- MOOD HISTORY
create table if not exists mood_history (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  mood text not null,
  product_id uuid references products(id) on delete set null,
  drink_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table mood_history enable row level security;

drop policy if exists "Users can view own mood history" on mood_history;
create policy "Users can view own mood history"
  on mood_history for select
  using ( auth.uid() = user_id );

drop policy if exists "Admins can view all mood history" on mood_history;
create policy "Admins can view all mood history"
  on mood_history for select
  using ( is_admin() );

drop policy if exists "Users can insert own mood history" on mood_history;
create policy "Users can insert own mood history"
  on mood_history for insert
  with check ( auth.uid() = user_id );

-- Function to handle new user signup automatically
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, name, email, avatar_url)
  values (new.id, new.raw_user_meta_data->>'name', new.email, new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Seed the initial Admin user (for testing)
insert into auth.users (id, email)
values ('00000000-0000-0000-0000-000000000000', 'admin@moodbrew.com')
on conflict (id) do nothing;

insert into public.profiles (id, email, role, name)
values ('00000000-0000-0000-0000-000000000000', 'admin@moodbrew.com', 'admin', 'Super Admin')
on conflict (id) do update set role = 'admin', name = EXCLUDED.name;
