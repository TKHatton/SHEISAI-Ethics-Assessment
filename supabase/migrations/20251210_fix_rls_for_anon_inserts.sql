-- Fix RLS policy to allow anon key to insert embeddings
-- This is needed for the update-manual script to work

-- Drop the restrictive insert policy
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON manual_embeddings;

-- Create a new policy that allows both authenticated and anon users to insert
-- Note: In production, you might want to restrict this further with API key validation
CREATE POLICY "Allow inserts for manual updates"
  ON manual_embeddings
  FOR INSERT
  TO public
  WITH CHECK (true);

COMMENT ON POLICY "Allow inserts for manual updates" ON manual_embeddings IS
'Allows inserts from the update-manual script using anon key.
In production, consider using service_role key instead.';
