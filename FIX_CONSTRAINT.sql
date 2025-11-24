-- ============================================================================
-- FIX SESSION ID CONSTRAINT - Robust Version
-- ============================================================================
-- This script finds and drops ANY check constraint on session_id,
-- then creates the correct one.
-- ============================================================================

-- Drop ALL possible constraint names (both singular and plural)
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registration_session_id_check;
ALTER TABLE registrations DROP CONSTRAINT IF EXISTS registrations_session_id_check;

-- Also drop any unnamed check constraints on session_id
DO $$
DECLARE
  constraint_name TEXT;
BEGIN
  -- Find any check constraints on the registrations table
  FOR constraint_name IN
    SELECT conname
    FROM pg_constraint
    WHERE conrelid = 'registrations'::regclass
    AND contype = 'c'
    AND conname LIKE '%session%'
  LOOP
    EXECUTE format('ALTER TABLE registrations DROP CONSTRAINT IF EXISTS %I', constraint_name);
    RAISE NOTICE 'Dropped constraint: %', constraint_name;
  END LOOP;
END $$;

-- Now add the correct constraint
ALTER TABLE registrations
ADD CONSTRAINT registrations_session_id_check CHECK (
  session_id IN (
    -- 4-hour classes
    '4h-dec9', '4h-dec13',
    -- Part 1 classes
    'p1-dec10-uk', 'p1-dec10-pm', 'p1-dec11-am', 'p1-dec11-pm',
    -- Part 2 classes
    'p2-dec17-uk', 'p2-dec17-pm', 'p2-dec18-am', 'p2-dec18-pm'
  )
);

-- ============================================================================
-- VERIFICATION
-- ============================================================================

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conrelid = 'registrations'::regclass
    AND conname = 'registrations_session_id_check'
  ) THEN
    RAISE NOTICE '✓✓✓ SUCCESS! Constraint updated correctly!';
    RAISE NOTICE '';
    RAISE NOTICE 'Allowed session IDs:';
    RAISE NOTICE '  - 4h-dec9, 4h-dec13';
    RAISE NOTICE '  - p1-dec10-uk, p1-dec10-pm, p1-dec11-am, p1-dec11-pm';
    RAISE NOTICE '  - p2-dec17-uk, p2-dec17-pm, p2-dec18-am, p2-dec18-pm';
    RAISE NOTICE '';
    RAISE NOTICE 'TEST YOUR REGISTRATION FORM NOW!';
  ELSE
    RAISE EXCEPTION 'Constraint was not created!';
  END IF;
END $$;

-- ============================================================================
-- DONE!
-- ============================================================================
