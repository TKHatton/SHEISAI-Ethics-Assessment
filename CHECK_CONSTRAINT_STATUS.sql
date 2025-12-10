-- ============================================================================
-- CHECK CURRENT CONSTRAINT STATUS
-- ============================================================================
-- Run this to see what session IDs are currently allowed in your database
-- ============================================================================

-- View the current CHECK constraint definition
SELECT
    conname AS constraint_name,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'registrations'::regclass
  AND contype = 'c';  -- 'c' means CHECK constraint
