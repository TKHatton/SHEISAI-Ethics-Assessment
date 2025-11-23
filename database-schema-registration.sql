-- ============================================================================
-- SHE IS AI ETHICS TRAINING - DATABASE SCHEMA
-- ============================================================================
-- This script creates all necessary tables for the registration system.
-- Run this script ONCE in your Supabase SQL Editor.
--
-- Tables Created:
-- 1. registrations - Stores class registrations
-- 2. profiles - User profiles (for future authentication)
-- 3. assessment_attempts - Tracks certification attempts
-- 4. identity_alerts - Monitors duplicate registrations
--
-- Estimated Run Time: 5-10 seconds
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================================
-- ENUM TYPES
-- ============================================================================

-- Status for assessment attempts
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attempt_status') THEN
    CREATE TYPE attempt_status AS ENUM ('started','pass','fail','abandoned');
  END IF;
END $$;

-- ============================================================================
-- TABLE 1: PROFILES
-- ============================================================================
-- Stores user profile information (one per authenticated user)
-- Used for future authentication and personalization features

CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  organization TEXT,
  tz TEXT,
  -- Normalized name for duplicate detection
  normalized_name TEXT GENERATED ALWAYS AS (
    LOWER(REGEXP_REPLACE(full_name, '[^a-z0-9]+','', 'g'))
  ) STORED,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster lookups
CREATE UNIQUE INDEX IF NOT EXISTS profiles_email_idx ON profiles (LOWER(email));

COMMENT ON TABLE profiles IS 'User profiles with normalized names for duplicate detection';

-- ============================================================================
-- TABLE 2: REGISTRATIONS ⭐ MAIN TABLE FOR REGISTRATION SYSTEM
-- ============================================================================
-- This is the primary table that stores all class registrations.
-- Every time someone fills out the registration form, a row is inserted here.

CREATE TABLE IF NOT EXISTS registrations (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- User information
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  organization TEXT,
  role TEXT,

  -- Session information
  session_id TEXT NOT NULL CHECK (
    session_id IN (
      -- 4-hour classes
      '4h-dec9', '4h-dec13',
      -- Part 1 classes
      'p1-dec10-am', 'p1-dec10-uk', 'p1-dec11-am', 'p1-dec11-pm',
      -- Part 2 classes
      'p2-dec17-uk', 'p2-dec17-pm', 'p2-dec18-am', 'p2-dec18-pm'
    )
  ),
  session_start_utc TIMESTAMPTZ NOT NULL,
  session_end_utc TIMESTAMPTZ NOT NULL,

  -- Metadata
  tz TEXT,           -- User's detected timezone (e.g., "America/New_York")
  user_agent TEXT    -- Browser information for support purposes
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS registrations_email_idx ON registrations(LOWER(email));
CREATE INDEX IF NOT EXISTS registrations_session_idx ON registrations(session_id);
CREATE INDEX IF NOT EXISTS registrations_created_idx ON registrations(created_at DESC);

COMMENT ON TABLE registrations IS 'Class registrations submitted through the website form';
COMMENT ON COLUMN registrations.session_id IS 'Class identifier matching the form dropdown values';
COMMENT ON COLUMN registrations.session_start_utc IS 'Class start time in UTC (converted from EST/UK time)';
COMMENT ON COLUMN registrations.tz IS 'User timezone detected by browser (Intl.DateTimeFormat)';

-- ============================================================================
-- TABLE 3: ASSESSMENT_ATTEMPTS
-- ============================================================================
-- Tracks certification assessment attempts (used for the assessment system)
-- Not directly used by registration, but part of the complete ethics training system

CREATE TABLE IF NOT EXISTS assessment_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- User identification
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL,
  organization TEXT,
  tz TEXT,

  -- Normalized fields for duplicate detection
  normalized_name TEXT GENERATED ALWAYS AS (
    LOWER(REGEXP_REPLACE(full_name, '[^a-z0-9]+','', 'g'))
  ) STORED,
  identity_key TEXT GENERATED ALWAYS AS (
    LOWER(REGEXP_REPLACE(COALESCE(full_name,'') || '|' || COALESCE(organization,''), '[^a-z0-9]+','', 'g'))
  ) STORED,

  -- Attempt tracking
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  status attempt_status NOT NULL DEFAULT 'started'
);

-- Indexes
CREATE INDEX IF NOT EXISTS aa_user_idx ON assessment_attempts(user_id);
CREATE INDEX IF NOT EXISTS aa_identity_idx ON assessment_attempts(identity_key);
CREATE INDEX IF NOT EXISTS aa_name_idx ON assessment_attempts(normalized_name);
CREATE INDEX IF NOT EXISTS aa_started_desc_idx ON assessment_attempts(started_at DESC);

-- Constraint: Only one active attempt per user
CREATE UNIQUE INDEX IF NOT EXISTS aa_one_started_per_user
  ON assessment_attempts(user_id)
  WHERE status = 'started';

COMMENT ON TABLE assessment_attempts IS 'Certification assessment attempts with duplicate prevention';

-- ============================================================================
-- TABLE 4: IDENTITY_ALERTS
-- ============================================================================
-- Flags when the same identity (name/org) is used with different emails
-- Helps detect potential duplicate registrations or policy violations

CREATE TABLE IF NOT EXISTS identity_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  identity_key TEXT NOT NULL,
  prior_email TEXT NOT NULL,
  new_email TEXT NOT NULL,
  prior_attempt_id UUID REFERENCES assessment_attempts(id),
  note TEXT
);

CREATE INDEX IF NOT EXISTS identity_alerts_key_idx ON identity_alerts(identity_key);
CREATE INDEX IF NOT EXISTS identity_alerts_created_idx ON identity_alerts(created_at DESC);

COMMENT ON TABLE identity_alerts IS 'Alerts for same identity used with different emails';

-- ============================================================================
-- BUSINESS LOGIC FUNCTIONS
-- ============================================================================
-- These functions enforce assessment attempt limits and waiting periods
-- (Used by the assessment system, not registration)

CREATE OR REPLACE FUNCTION can_start_assessment(
  _user_id UUID,
  _email TEXT,
  _full_name TEXT,
  _organization TEXT DEFAULT NULL,
  _now TIMESTAMPTZ DEFAULT NOW()
) RETURNS TABLE(
  allowed BOOLEAN,
  reason TEXT,
  lockout_until TIMESTAMPTZ,
  retake_deadline TIMESTAMPTZ,
  attempts_count INT
) LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
  _identity_key TEXT := LOWER(REGEXP_REPLACE(COALESCE(_full_name,'') || '|' || COALESCE(_organization,''), '[^a-z0-9]+','', 'g'));
  _latest RECORD;
  _fails INT;
  _passes INT;
  _total INT;
  _lockout_until TIMESTAMPTZ;
  _deadline TIMESTAMPTZ;
BEGIN
  -- Count attempts for this identity
  SELECT
    SUM((status='fail')::INT) AS fails,
    SUM((status='pass')::INT) AS passes,
    COUNT(*) AS total
  INTO _fails, _passes, _total
  FROM assessment_attempts
  WHERE identity_key = _identity_key;

  -- Get latest attempt
  SELECT *
  INTO _latest
  FROM assessment_attempts
  WHERE identity_key = _identity_key
  ORDER BY started_at DESC
  LIMIT 1;

  -- Check if already passed
  IF _passes > 0 THEN
    RETURN QUERY SELECT FALSE, 'already passed', NULL::TIMESTAMPTZ, NULL::TIMESTAMPTZ, _total;
    RETURN;
  END IF;

  -- Check if max attempts reached (2)
  IF _total >= 2 THEN
    RETURN QUERY SELECT FALSE, 'maximum attempts reached', NULL::TIMESTAMPTZ, NULL::TIMESTAMPTZ, _total;
    RETURN;
  END IF;

  -- Check 48-hour waiting period after failure
  IF _latest IS NOT NULL AND _latest.status = 'fail' THEN
    _lockout_until := COALESCE(_latest.completed_at, _latest.started_at) + INTERVAL '48 hours';
    _deadline := _lockout_until + INTERVAL '7 days';

    IF _now < _lockout_until THEN
      RETURN QUERY SELECT FALSE, 'wait 48 hours after failure', _lockout_until, _deadline, _total;
      RETURN;
    END IF;

    IF _now > _deadline THEN
      RETURN QUERY SELECT FALSE, 'retake window expired (7 days after 48h wait)', _lockout_until, _deadline, _total;
      RETURN;
    END IF;
  END IF;

  -- Check if already has active attempt
  IF EXISTS (
    SELECT 1 FROM assessment_attempts
    WHERE user_id = _user_id AND status = 'started'
  ) THEN
    RETURN QUERY SELECT FALSE, 'you already have an active attempt', NULL::TIMESTAMPTZ, NULL::TIMESTAMPTZ, _total;
    RETURN;
  END IF;

  -- All checks passed
  RETURN QUERY SELECT TRUE, NULL::TEXT, _lockout_until, _deadline, _total;
END;$$;

COMMENT ON FUNCTION can_start_assessment IS 'Checks if user is eligible to start assessment (max 2 attempts, 48h wait, 7-day window)';

-- ============================================================================
-- TRIGGER FUNCTIONS
-- ============================================================================

-- Trigger: Enforce assessment policy on insert
CREATE OR REPLACE FUNCTION trg_enforce_assessment_policy()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
  r RECORD;
BEGIN
  SELECT * INTO r
  FROM can_start_assessment(NEW.user_id, NEW.email, NEW.full_name, NEW.organization, NOW());

  IF NOT r.allowed THEN
    RAISE EXCEPTION 'Assessment start blocked: %', r.reason USING errcode = 'P0001';
  END IF;

  RETURN NEW;
END;$$;

DROP TRIGGER IF EXISTS before_insert_assessment_attempts ON assessment_attempts;
CREATE TRIGGER before_insert_assessment_attempts
BEFORE INSERT ON assessment_attempts
FOR EACH ROW EXECUTE FUNCTION trg_enforce_assessment_policy();

-- Trigger: Flag identity changes (same name/org, different email)
CREATE OR REPLACE FUNCTION trg_flag_identity_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
DECLARE
  prior RECORD;
BEGIN
  SELECT * INTO prior
  FROM assessment_attempts
  WHERE identity_key = NEW.identity_key
    AND email <> NEW.email
  ORDER BY started_at DESC
  LIMIT 1;

  IF prior IS NOT NULL THEN
    INSERT INTO identity_alerts(identity_key, prior_email, new_email, prior_attempt_id, note)
    VALUES (NEW.identity_key, prior.email, NEW.email, prior.id, 'Same name/org used with different email');
  END IF;

  RETURN NEW;
END;$$;

DROP TRIGGER IF EXISTS after_insert_assessment_attempts ON assessment_attempts;
CREATE TRIGGER after_insert_assessment_attempts
AFTER INSERT ON assessment_attempts
FOR EACH ROW EXECUTE FUNCTION trg_flag_identity_change();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================
-- Security policies control who can access what data

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE identity_alerts ENABLE ROW LEVEL SECURITY;

-- PROFILES: Users can only access their own profile
DROP POLICY IF EXISTS profiles_self ON profiles;
CREATE POLICY profiles_self ON profiles
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- REGISTRATIONS: Anyone can insert (register), but cannot read
-- This protects user privacy - registrations are stored but not publicly accessible
-- FIXED: INSERT policies should only use WITH CHECK, not USING
DROP POLICY IF EXISTS registrations_insert ON registrations;
CREATE POLICY registrations_insert ON registrations
  FOR INSERT
  WITH CHECK (TRUE);

COMMENT ON POLICY registrations_insert ON registrations IS 'Allow anyone to submit registration (privacy protected - no public reads)';

-- ASSESSMENT ATTEMPTS: Users can only access their own attempts
DROP POLICY IF EXISTS aa_insert_own ON assessment_attempts;
CREATE POLICY aa_insert_own ON assessment_attempts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS aa_update_own ON assessment_attempts;
CREATE POLICY aa_update_own ON assessment_attempts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS aa_select_own ON assessment_attempts;
CREATE POLICY aa_select_own ON assessment_attempts
  FOR SELECT
  USING (auth.uid() = user_id);

-- IDENTITY ALERTS: No public access (admin/service role only)
-- (No policy = no public access, only service role can access)

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================
-- Run these queries to verify everything was created successfully

DO $$
DECLARE
  tables TEXT[] := ARRAY['profiles', 'registrations', 'assessment_attempts', 'identity_alerts'];
  tbl TEXT;
BEGIN
  FOREACH tbl IN ARRAY tables
  LOOP
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = tbl) THEN
      RAISE EXCEPTION 'Table % was not created!', tbl;
    END IF;
  END LOOP;

  RAISE NOTICE '✓ All tables created successfully!';
END $$;

-- ============================================================================
-- SAMPLE QUERIES FOR ADMINS
-- ============================================================================

-- View all registrations (run with service role key only)
-- SELECT * FROM registrations ORDER BY created_at DESC;

-- Count registrations by class
-- SELECT session_id, COUNT(*) as total FROM registrations GROUP BY session_id ORDER BY session_id;

-- View recent registrations (last 7 days)
-- SELECT email, full_name, session_id, created_at
-- FROM registrations
-- WHERE created_at > NOW() - INTERVAL '7 days'
-- ORDER BY created_at DESC;

-- Export specific class registrations
-- SELECT full_name, email, organization, tz, created_at
-- FROM registrations
-- WHERE session_id = '4h-dec9'
-- ORDER BY created_at;

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- Your database is now ready for the registration system.
--
-- Next steps:
-- 1. Go to Project Settings → API
-- 2. Copy your Project URL and anon public key
-- 3. Add them to config.js
-- 4. Test the registration form!
--
-- See SUPABASE_QUICKSTART.md for detailed next steps.
-- ============================================================================
