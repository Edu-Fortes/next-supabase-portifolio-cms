-- 1. Enable the 'moddatetime' extension if not already enabled
-- This extension provides a trigger function to update timestamps
create extension if not exists moddatetime with schema extensions;

-- 2. Add the new columns to the 'portfolio_projects' table
alter table public.portfolio_projects
  add column updated_at timestamptz default now() not null,
  add column body text; -- For the full Markdown case study

-- 3. Create the trigger to automatically update 'updated_at'
-- This will fire BEFORE any UPDATE on a row and call the function
create trigger handle_updated_at
before update on public.portfolio_projects
for each row
execute procedure extensions.moddatetime (updated_at);