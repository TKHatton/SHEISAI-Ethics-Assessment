-- ============================================================================
-- UPDATE SESSION IDS FOR 2026 SESSIONS
-- ============================================================================
-- This script updates the CHECK constraint on the registrations table
-- to accept the new January 2026 session IDs used by the React form.
--
-- Run this in your Supabase SQL Editor BEFORE using the new React app.
-- ============================================================================

-- Drop the existing CHECK constraint
ALTER TABLE registrations
DROP CONSTRAINT IF EXISTS registrations_session_id_check;

-- Add new CHECK constraint with 2026 session IDs
ALTER TABLE registrations
ADD CONSTRAINT registrations_session_id_check
CHECK (
  session_id IN (
    -- 4-hour intensive sessions (January 2026)
    '4h-jan13', '4h-jan17',

    -- Part 1 sessions (January 2026)
    'p1-jan14-pm', 'p1-jan14-eve',
    'p1-jan15-am', 'p1-jan15-pm',

    -- Part 2 sessions (January 2026)
    'p2-jan21-pm', 'p2-jan21-eve',
    'p2-jan22-am', 'p2-jan22-pm'
  )
);

-- Verify the constraint was updated
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conname = 'registrations_session_id_check';
