# Supabase Setup Guide

This guide configures Supabase to support registration, authentication (with password reset), assessment attempt limits, waiting periods, and duplicate-identity monitoring.

## Prerequisites
- A Supabase project (URL and keys)
- SMTP provider configured (Postmark, Resend, SendGrid, etc.)
- Frontend origin/URL where this site is hosted

## 1) Auth Configuration
1. Enable providers
   - Dashboard → Auth → Providers → Email: enable both Email/Password and Magic Link (OTP).
2. SMTP sender
   - Dashboard → Auth → Email → Sender: configure SMTP so password reset and magic links deliver reliably.
3. Redirect URLs
   - Dashboard → Auth → URL Configuration
     - Site URL: your production origin (e.g., https://ethics.sheisai.org)
     - Redirect URLs: include your password reset page (e.g., https://ethics.sheisai.org/reset)
4. Email templates
   - Customize “Magic Link” and “Reset Password” templates with brand text.

## 2) Run Database Schema
- Open Dashboard → SQL editor → create new query
- Paste the contents of `docs/supabase/SCHEMA.md` (SQL blocks) or `docs/supabase/schema.sql`
- Run to create tables, functions, triggers, and RLS policies

Tables created
- profiles: 1 row per auth user (email, full name, org, tz)
- registrations: optional signup capture for training sessions
- assessment_attempts: each started/pass/fail attempt is recorded
- identity_alerts: flags if same (name|org) appears with a different email

Rules enforced (database-side)
- Max 2 attempts total per identity (name|org)
- 48-hour wait after a failure
- Retake window: 7 days after the 48-hour wait
- Only one concurrent “started” attempt per user
- Alerts on same identity with a new email; attempts are counted by identity to prevent bypass

## 3) Row Level Security (RLS)
- RLS is enabled. Policies allow:
  - profiles: users can read/write their own row
  - registrations: anyone can insert; no reads for public
  - assessment_attempts: authenticated users can insert/select/update only their own rows
  - identity_alerts: no public access (service key only)

## 4) Environment Variables
Frontend (public, safe to expose)
- SUPABASE_URL = your-project-url (e.g., https://abcd.supabase.co)
- SUPABASE_ANON_KEY = anon public key

Server/Admin (KEEP SECRET)
- SUPABASE_SERVICE_ROLE_KEY = service role key for admin tasks (e.g., marking pass/fail)

## 5) Password Reset Flow
- Add “Forgot password?” link in your UI
- Call reset:
  - `await supabase.auth.resetPasswordForEmail(email, { redirectTo: 'https://yourdomain/reset' })`
- On your `/reset` page (redirect target):
  - The session is set via URL hash; prompt for new password
  - `await supabase.auth.updateUser({ password: newPassword })`
- Keep Magic Link sign-in enabled so users who forget passwords can also sign in passwordlessly

## 6) Identity Handling & Anti-Circumvention
- The database computes `identity_key = normalize(full_name|organization)`
- All eligibility checks use this identity key, so switching emails with the same name/org will not bypass limits
- `identity_alerts` records any identity used with different emails for admin review
- Caveat: If two distinct people share the same name and organization, they may be treated as one identity
  - To relax this, switch enforcement to user_id (see notes in `SCHEMA.md`), keeping identity_alerts for flagging only

## 7) Testing Checklist
- Create a user via magic link; complete profile with name/org
- Start an attempt → should insert with status=started
- Mark it fail (admin query) → verify block for 48 hours
- After 48 hours, verify 7-day window allows exactly one more attempt
- Try starting a 3rd attempt → blocked with “maximum attempts reached”
- Try with same name/org + new email → attempt counts against identity and an alert row is created

## 8) Admin Operations
- View identity alerts:
  - `select * from identity_alerts order by created_at desc limit 50;`
- Mark pass/fail (service role only):
  - `update assessment_attempts set status='pass', completed_at=now() where id='…';`
  - `update assessment_attempts set status='fail', completed_at=now() where id='…';`

## 9) Frontend Wiring (when ready)
- Registration form → insert into `registrations` with UTC session times and detected `tz`
- Begin Assessment → ensure user authenticated, insert into `assessment_attempts`
  - If blocked, the trigger returns a DB error with reason (display to user)
- On completion, your assessment platform calls admin endpoint to set `pass` or `fail`

For full SQL and code examples, see:
- `docs/supabase/SCHEMA.md`
- `docs/supabase/API_EXAMPLES.md`
