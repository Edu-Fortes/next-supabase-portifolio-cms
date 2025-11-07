-- 1. Rename the table
alter table public.projects
  rename to portfolio_projects;

-- 2. Drop the old RLS policies from the "projects" table
drop policy "Allow public read-only access" on public.portfolio_projects;
drop policy "Allow admin full access" on public.portfolio_projects;

-- 3. Re-create RLS policies for the new "portfolio_projects" table
create policy "Allow public read-only access"
on public.portfolio_projects
for select
using (true);

create policy "Allow admin full access"
on public.portfolio_projects
for all
using (auth.uid() is not null)
with check (auth.uid() is not null);