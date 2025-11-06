--
-- POLICIES FOR: projects
--
-- 1. Allow public read-only access to projects
create policy "Allow public read-only access"
on public.projects
for select
using (true);

-- 2. Allow admin (authenticated users) full access to projects
create policy "Allow admin full access"
on public.projects
for all
using (auth.uid() is not null)
with check (auth.uid() is not null);


--
-- POLICIES FOR: blog_posts
--
-- 1. Allow public read-only access to non-draft posts
create policy "Allow public read-only access to non-drafts"
on public.blog_posts
for select
using (is_draft = false);

-- 2. Allow admin (authenticated users) full access to blog posts
create policy "Allow admin full access"
on public.blog_posts
for all
using (auth.uid() is not null)
with check (auth.uid() is not null);