-- ============================================================================
-- FIX ROW LEVEL SECURITY POLICY FOR REGISTRATIONS
-- ============================================================================
-- This script enables anonymous users to insert registrations through the form.
-- Run this in your Supabase SQL Editor to allow the registration form to work.
-- ============================================================================

-- Enable RLS on registrations table (if not already enabled)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public registration inserts" ON registrations;
DROP POLICY IF EXISTS "Allow anonymous registration inserts" ON registrations;

-- Create a policy that allows anyone to insert registrations
CREATE POLICY "Allow public registration inserts"
ON registrations
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Optional: Allow users to read their own registrations by email
DROP POLICY IF EXISTS "Allow users to read own registrations" ON registrations;
CREATE POLICY "Allow users to read own registrations"
ON registrations
FOR SELECT
TO anon, authenticated
USING (true);  -- Change to (email = auth.jwt() ->> 'email') if you want to restrict to own email

-- Verify the policies were created
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'registrations';
