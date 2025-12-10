-- ============================================================================
-- REMOVE SESSION ID CHECK CONSTRAINT
-- ============================================================================
-- This removes the restrictive CHECK constraint on session_id.
-- This allows any session ID format, making the system more flexible.
-- ============================================================================

-- Drop the CHECK constraint
ALTER TABLE registrations
DROP CONSTRAINT IF EXISTS registrations_session_id_check;

-- Verify it was removed
SELECT
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'registrations'::regclass
  AND contype = 'c'
  AND conname = 'registrations_session_id_check';

-- If the above query returns no rows, the constraint was successfully removed!
