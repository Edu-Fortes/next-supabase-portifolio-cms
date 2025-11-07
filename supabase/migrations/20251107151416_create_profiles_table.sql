-- Create the "profiles" table
create table public.profiles (
  id uuid not null primary key, -- User's ID from auth.users
  full_name text,
  display_name text,
  avatar_url text
);

-- Set up the foreign key relationship
alter table public.profiles
  add constraint profiles_id_fkey
  foreign key (id) references auth.users (id) on delete cascade;

-- Enable Row Level Security
alter table public.profiles enable row level security;

--
-- RLS POLICIES FOR: profiles
--

-- 1. Allow public read-only access to all profiles
create policy "Allow public read-only access"
on public.profiles
for select
using (true);

-- 2. Allow users to update their own profile
create policy "Allow users to update their own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

--
-- SQL FUNCTION & TRIGGER
--

-- This function runs when a new user signs up
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  -- Create a new row in public.profiles
  insert into public.profiles (id, full_name, display_name)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name', -- Get full_name from sign-up metadata
    new.raw_user_meta_data->>'display_name' -- Get display_name from sign-up metadata
  );
  return new;
end;
$$;

-- This trigger calls the function after a new user is created
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();