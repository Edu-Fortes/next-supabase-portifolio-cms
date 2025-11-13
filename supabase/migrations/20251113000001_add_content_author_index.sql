-- =====================================================
-- ADD INDEX FOR FOREIGN KEY ON CONTENT TABLE
-- =====================================================
-- This migration addresses the Supabase advisor suggestion:
-- "Unindexed foreign keys" - Adding index for better query performance
-- =====================================================

-- Create index on author_id foreign key
-- This improves performance when:
-- 1. Querying content by author: SELECT * FROM content WHERE author_id = ?
-- 2. Joining content with profiles: JOIN profiles ON content.author_id = profiles.id
-- 3. Checking referential integrity on DELETE/UPDATE operations
CREATE INDEX IF NOT EXISTS idx_content_author_id 
ON public.content(author_id);

-- =====================================================
-- NOTES
-- =====================================================
-- Without this index, PostgreSQL would perform a full table scan
-- when looking up content by author or enforcing foreign key constraints.
-- The index makes these operations much faster, especially as data grows.
-- =====================================================
