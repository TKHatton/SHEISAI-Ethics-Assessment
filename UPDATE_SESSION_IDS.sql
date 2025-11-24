-- ============================================================================
-- UPDATE SESSION IDs - Safe Constraint Update
-- ============================================================================
-- This script ONLY updates the session_id constraint in the registrations table.
-- It does NOT drop the table or delete any data.
-- Safe to run on existing database with data.
-- ============================================================================

-- Step 1: Drop the old constraint
ALTER TABLE registrations
DROP CONSTRAINT IF EXISTS registrations_session_id_check;

-- Step 2: Add the new constraint with correct session IDs
ALTER TABLE registrations
ADD CONSTRAINT registrations_session_id_check CHECK (
  session_id IN (
    -- 4-hour classes
    '4h-dec9', '4h-dec13',
    -- Part 1 classes (NOTE: p1-dec10-pm is 7pm EST, not am)
    'p1-dec10-uk', 'p1-dec10-pm', 'p1-dec11-am', 'p1-dec11-pm',
    -- Part 2 classes
    'p2-dec17-uk', 'p2-dec17-pm', 'p2-dec18-am', 'p2-dec18-pm'
  )
);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Verify the constraint was updated
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.constraint_column_usage
    WHERE table_name = 'registrations'
    AND constraint_name = 'registrations_session_id_check'
  ) THEN
    RAISE NOTICE '✓ Session ID constraint updated successfully!';
    RAISE NOTICE '  Allowed session IDs:';
    RAISE NOTICE '  - 4h-dec9, 4h-dec13';
    RAISE NOTICE '  - p1-dec10-uk, p1-dec10-pm, p1-dec11-am, p1-dec11-pm';
    RAISE NOTICE '  - p2-dec17-uk, p2-dec17-pm, p2-dec18-am, p2-dec18-pm';
  ELSE
    RAISE EXCEPTION 'Constraint was not created!';
  END IF;
END $$;

-- ============================================================================
-- DONE!
-- ============================================================================
-- Your registrations table now accepts the correct session IDs.
-- Test your registration form - it should work now!
-- ============================================================================
