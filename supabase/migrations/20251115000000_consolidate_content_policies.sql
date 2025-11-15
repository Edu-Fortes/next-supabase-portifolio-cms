-- =====================================================
-- CONSOLIDATE CONTENT TABLE RLS POLICIES
-- =====================================================
-- This migration fixes "multiple_permissive_policies" warnings
-- by consolidating overlapping policies into single policies per action
-- =====================================================

-- Drop ALL existing policies on content table
DROP POLICY IF EXISTS "Allow public read access" ON public.content;
DROP POLICY IF EXISTS "Allow authenticated users to read all content" ON public.content;
DROP POLICY IF EXISTS "Allow admin insert" ON public.content;
DROP POLICY IF EXISTS "Allow users to insert their own content" ON public.content;
DROP POLICY IF EXISTS "Allow admin update" ON public.content;
DROP POLICY IF EXISTS "Allow users to update their own content" ON public.content;
DROP POLICY IF EXISTS "Allow admin delete" ON public.content;
DROP POLICY IF EXISTS "Allow users to delete their own content" ON public.content;

-- =====================================================
-- CREATE CONSOLIDATED POLICIES (ONE PER ACTION)
-- =====================================================

-- SELECT: Allow everyone (public + authenticated) to read all content
CREATE POLICY "Allow everyone to read content"
ON public.content
FOR SELECT
USING (true);

-- INSERT: Allow authenticated users to create content with themselves as author
CREATE POLICY "Allow authenticated users to create content"
ON public.content
FOR INSERT
WITH CHECK ((SELECT auth.uid()) = author_id);

-- UPDATE: Allow users to update only their own content
CREATE POLICY "Allow users to update own content"
ON public.content
FOR UPDATE
USING ((SELECT auth.uid()) = author_id)
WITH CHECK ((SELECT auth.uid()) = author_id);

-- DELETE: Allow users to delete only their own content
CREATE POLICY "Allow users to delete own content"
ON public.content
FOR DELETE
USING ((SELECT auth.uid()) = author_id);

-- =====================================================
-- NOTES
-- =====================================================
-- This structure ensures:
-- 1. No overlapping policies (one policy per action)
-- 2. Optimized auth.uid() calls wrapped in SELECT
-- 3. Clear, maintainable security rules
-- 4. Public can read, but only authors can modify their content
-- =====================================================
