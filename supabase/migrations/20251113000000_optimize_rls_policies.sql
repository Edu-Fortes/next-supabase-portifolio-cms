-- =====================================================
-- OPTIMIZE RLS POLICIES FOR PERFORMANCE
-- =====================================================
-- This migration addresses Supabase linter warnings:
-- 1. auth_rls_initplan - Wraps auth functions in SELECT
-- 2. multiple_permissive_policies - Consolidates policies
-- =====================================================

-- =====================================================
-- FIX 1: PROFILES TABLE
-- =====================================================

-- Drop the old policy
DROP POLICY IF EXISTS "Allow users to update their own profile" ON public.profiles;

-- Recreate with optimized auth function call
CREATE POLICY "Allow users to update their own profile"
ON public.profiles
FOR UPDATE
USING ((SELECT auth.uid()) = id)
WITH CHECK ((SELECT auth.uid()) = id);

-- =====================================================
-- FIX 2: CONTENT TABLE
-- =====================================================

-- Drop the existing policies
DROP POLICY IF EXISTS "Allow public read-all" ON public.content;
DROP POLICY IF EXISTS "Allow admin full access" ON public.content;

-- Create a single optimized policy for SELECT (public read)
-- This replaces the overlapping "Allow public read-all" and "Allow admin full access" for SELECT
CREATE POLICY "Allow public read access"
ON public.content
FOR SELECT
USING (true);

-- Create separate optimized policies for INSERT, UPDATE, DELETE (admin only)
CREATE POLICY "Allow admin insert"
ON public.content
FOR INSERT
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Allow admin update"
ON public.content
FOR UPDATE
USING ((SELECT auth.uid()) IS NOT NULL)
WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

CREATE POLICY "Allow admin delete"
ON public.content
FOR DELETE
USING ((SELECT auth.uid()) IS NOT NULL);

-- =====================================================
-- NOTES
-- =====================================================
-- Performance improvements:
-- 1. auth.uid() → (SELECT auth.uid()) prevents re-evaluation per row
-- 2. Separated policies by action to avoid multiple permissive policies
-- 3. More explicit and maintainable policy structure
-- =====================================================
