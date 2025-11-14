-- 1. Drop the old "all-in-one" admin policy
-- This policy was too restrictive for sandbox use cases
DROP POLICY IF EXISTS "Allow admin full access" ON public.content;

-- 2. Create a new, broad SELECT policy
-- This allows ANY authenticated user to VIEW all content in the admin panel
CREATE POLICY "Allow authenticated users to read all content"
ON public.content
FOR SELECT
USING ((SELECT auth.uid()) IS NOT NULL);

-- 3. Create a new, specific INSERT policy
-- This allows a user to create content
CREATE POLICY "Allow users to insert their own content"
ON public.content
FOR INSERT
WITH CHECK ((SELECT auth.uid()) = author_id);

-- 4. Create a new, specific UPDATE policy
-- This allows a user to update ONLY their own content
CREATE POLICY "Allow users to update their own content"
ON public.content
FOR UPDATE
USING ((SELECT auth.uid()) = author_id)
WITH CHECK ((SELECT auth.uid()) = author_id);

-- 5. Create a new, specific DELETE policy
-- This allows a user to delete ONLY their own content
CREATE POLICY "Allow users to delete their own content"
ON public.content
FOR DELETE
USING ((SELECT auth.uid()) = author_id);