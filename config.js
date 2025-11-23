/**
 * SHE IS AI Ethics Training - Configuration
 *
 * IMPORTANT: This file contains your Supabase credentials.
 *
 * TO SET UP REGISTRATION:
 * 1. Get your Supabase URL and Anon Key from your Supabase project dashboard
 * 2. Replace the empty strings below with your actual credentials
 * 3. Include this file in index.html BEFORE script.js:
 *    <script src="config.js"></script>
 *    <script defer src="script.js"></script>
 *
 * NOTE: The Anon Key is safe to expose publicly (it's used in frontend apps)
 * but you should NEVER expose your Service Role Key in frontend code.
 */

// Replace these with your actual Supabase credentials
window.SUPABASE_URL = '';  // e.g., 'https://abcdefgh.supabase.co'
window.SUPABASE_ANON_KEY = '';  // Your Supabase anon/public key

/**
 * SETUP INSTRUCTIONS:
 *
 * 1. Create a Supabase project at https://supabase.com
 * 2. Run the database schema from docs/supabase/schema.sql
 * 3. Get your credentials:
 *    - Go to Project Settings → API
 *    - Copy the "Project URL" and paste it as SUPABASE_URL above
 *    - Copy the "anon public" key and paste it as SUPABASE_ANON_KEY above
 * 4. Save this file
 * 5. Add this script tag to index.html (before script.js):
 *    <script src="config.js"></script>
 *
 * FALLBACK BEHAVIOR:
 * If credentials are not configured, the registration form will display
 * a message asking users to email their registration details to
 * info@sheisai.ai for manual processing.
 *
 * EMAIL CONFIRMATIONS:
 * Currently, email confirmations need to be sent manually or via a
 * separate service like:
 * - Supabase Edge Functions (recommended for automation)
 * - Resend (https://resend.com)
 * - Postmark (https://postmarkapp.com)
 * - SendGrid (https://sendgrid.com)
 *
 * All registrations are stored in the 'registrations' table in Supabase.
 */
