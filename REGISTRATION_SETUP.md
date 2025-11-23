# SHE IS AI Ethics Training - Registration System Setup

This guide explains how to set up and use the complete registration system for the SHE IS AI Ethics Training website.

## Features

✅ **Complete Registration Form** with name, email, organization, and class selection
✅ **Automatic Timezone Conversion** - Shows times in each visitor's local timezone
✅ **Part 1/Part 2 Validation** - Enforces acknowledgment for 2-hour classes
✅ **Supabase Integration** - Stores registrations in database
✅ **Accessible & Mobile-Responsive** - WCAG 2.1 AA compliant
✅ **Visual Indicators** - Color-coded classes with clear warnings
✅ **Success/Error Handling** - User-friendly confirmation messages

## Quick Start

### 1. Configure Supabase Credentials

Edit `config.js` and add your Supabase credentials:

```javascript
window.SUPABASE_URL = 'https://your-project.supabase.co';
window.SUPABASE_ANON_KEY = 'your-anon-key-here';
```

**Where to find these:**
1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Open your project
3. Go to **Settings** → **API**
4. Copy the **Project URL** (SUPABASE_URL)
5. Copy the **anon public** key (SUPABASE_ANON_KEY)

### 2. Set Up Database (If Not Already Done)

The registration system uses the existing `registrations` table. If you haven't set up the database yet:

1. Open your Supabase project
2. Go to **SQL Editor**
3. Run the schema from `docs/supabase/schema.sql`

The schema creates these tables:
- `profiles` - User profiles
- `registrations` - Class registrations (what we use)
- `assessment_attempts` - Certification attempts
- `identity_alerts` - Duplicate detection

### 3. Deploy Your Site

Upload these files to your web server:
- `index.html`
- `styles.css`
- `script.js`
- `config.js` (with your credentials)
- `assets/` folder

The registration system will now be live!

## How It Works

### User Flow

1. **User clicks "Register"** on any class card
2. **Modal opens** with pre-selected class
3. **User fills form:**
   - Full Name (required)
   - Email Address (required)
   - Organization (optional)
   - Class Selection (required, can be changed)
4. **Timezone displayed** in their local time
5. **Part 1/2 acknowledgment** shown if applicable (required checkbox)
6. **Form validation** ensures all fields are valid
7. **Submission to Supabase** stores registration
8. **Success message** confirms registration with reminders

### Class Types

**4-Hour Classes (Complete in One Session):**
- Tuesday, December 9, 2024 at 10:00 AM EST
- Saturday, December 13, 2024 at 10:00 AM EST

**2-Hour Part 1 Classes (Must also register for Part 2):**
- Wednesday, December 10, 2024 at 10:00 AM EST
- Wednesday, December 10, 2024 at 3:00 PM UK time (Recorded)
- Thursday, December 11, 2024 at 10:00 AM EST
- Thursday, December 11, 2024 at 5:00 PM EST

**2-Hour Part 2 Classes (Must also register for Part 1):**
- Tuesday, December 17, 2024 at 3:00 PM UK time
- Tuesday, December 17, 2024 at 7:00 PM EST
- Wednesday, December 18, 2024 at 10:00 AM EST
- Wednesday, December 18, 2024 at 5:00 PM EST

### Data Storage

All registrations are stored in the `registrations` table with:
- `id` - Unique registration ID
- `email` - Registrant email
- `full_name` - Registrant name
- `organization` - Organization (optional)
- `session_id` - Class identifier (e.g., "4h-dec9", "p1-dec10-am")
- `session_start_utc` - Class start time (UTC)
- `session_end_utc` - Class end time (UTC)
- `tz` - User's detected timezone
- `user_agent` - Browser information
- `created_at` - Registration timestamp

### Querying Registrations

**View all registrations:**
```sql
SELECT * FROM registrations ORDER BY created_at DESC;
```

**Count registrations by class:**
```sql
SELECT session_id, COUNT(*) as registrants
FROM registrations
GROUP BY session_id
ORDER BY session_id;
```

**Export registrations for a specific class:**
```sql
SELECT full_name, email, organization, tz, created_at
FROM registrations
WHERE session_id = '4h-dec9'
ORDER BY created_at;
```

## Email Confirmations

### Current Status

The system stores all registration data but **does not automatically send email confirmations yet**. Users see a success message saying "A confirmation email will be sent to your email."

### Option A: Manual Email Follow-Up (Quick Start)

1. Query registrations daily:
   ```sql
   SELECT * FROM registrations
   WHERE created_at > NOW() - INTERVAL '24 hours'
   ORDER BY created_at DESC;
   ```

2. Send confirmation emails manually using your email client

3. Use this template (provided in the original requirements):

**Subject:** Registration Confirmed - SHE IS AI Training on [DATE]

```
Hi [NAME],

You're registered for the SHE IS AI training!

Your Class Details:
• Date: [DATE]
• Time: [TIME in their timezone]
• Duration: [4 hours OR 2 hours - Part 1/Part 2]

[IF PART 1]: ⚠️ IMPORTANT: This is Part 1 of a 2-part training.
You MUST also register for a Part 2 session to complete the training.
Register for Part 2 here: [REGISTRATION LINK]

[IF PART 2]: ✓ Great! If you've also registered for Part 1,
you're all set to complete the full training.

[IF 4-HOUR]: ✓ You're all set! This complete training session
covers everything you need for certification.

We'll send you a reminder 24 hours before your class with the meeting link.

See you soon!
The SHE IS AI Team
```

### Option B: Automated Emails (Recommended)

Set up automatic email confirmations using **Supabase Edge Functions** or a third-party service:

#### Supabase Edge Functions (Recommended)

1. Create an Edge Function that triggers on new registrations
2. Use the Supabase SMTP configuration
3. Send personalized confirmation emails automatically

[See Supabase Edge Functions documentation](https://supabase.com/docs/guides/functions)

#### Third-Party Email Services

**Resend** (Recommended - Simple & Developer-Friendly)
- Website: https://resend.com
- Free tier: 100 emails/day
- Easy API integration

**Postmark** (Good for Transactional Emails)
- Website: https://postmarkapp.com
- Free tier: 100 emails/month
- Excellent deliverability

**SendGrid**
- Website: https://sendgrid.com
- Free tier: 100 emails/day
- Popular enterprise choice

**Implementation Example (Resend + Supabase Function):**

```javascript
// edge-functions/send-confirmation/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  const { email, full_name, session_id, session_start_utc } = await req.json()

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'SHE IS AI <training@sheisai.ai>',
      to: email,
      subject: 'Registration Confirmed - SHE IS AI Training',
      html: `<p>Hi ${full_name},</p><p>You're registered!</p>...`
    })
  })

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  })
})
```

### Google Calendar Integration

To add Google Calendar invites:

1. **Manual ICS File Generation:**
   - Export registrations
   - Use a tool to generate .ics files
   - Send as email attachments

2. **Automated with API:**
   - Use Google Calendar API
   - Create events automatically
   - Send invites via Gmail API

3. **Third-Party Service:**
   - Use [Calendly](https://calendly.com) or [Cal.com](https://cal.com)
   - Integrate with your registration system

## Fallback Behavior

If Supabase credentials are not configured in `config.js`:

1. Registration modal still works
2. Form validation still works
3. On submission, shows a message asking users to email their registration details to `info@sheisai.ai`
4. All registration data is displayed for the user to copy

This ensures the system is functional even without backend configuration.

## Testing the Registration System

### 1. Test Modal Opening
- Click any "Register" button
- Modal should open with that class pre-selected

### 2. Test Validation
- Try submitting empty form → Should show errors
- Try invalid email → Should show error
- Try Part 1/Part 2 without checkbox → Should show error

### 3. Test Class Selection
- Select a 4-hour class → No acknowledgment checkbox
- Select Part 1 or Part 2 → Acknowledgment checkbox appears (required)
- Change classes → Time display updates with local timezone

### 4. Test Submission (With Supabase Configured)
- Fill form correctly
- Submit
- Check Supabase `registrations` table for new entry
- Success message should show with appropriate Part 1/Part 2 reminder

### 5. Test Submission (Without Supabase)
- Remove credentials from `config.js`
- Refresh page
- Try to register
- Should show fallback message with contact information

## Customization

### Change Email Address

Update the fallback email address in:
- `script.js` (line ~456): `info@sheisai.ai`
- Success messages as needed

### Update Class Schedule

To add/change classes:

1. **Update HTML** (`index.html`):
   - Add/edit `<option>` elements in the dropdown
   - Set `data-datetime` (ISO 8601 format with timezone)
   - Set `data-duration` (2 or 4)
   - Set `data-type` (4-hour, part1, or part2)

2. **Update Schedule Cards** (optional):
   - Add/edit session cards with matching `data-class` attributes
   - Times will automatically convert to user's timezone

### Style Customization

All styles are in `styles.css` under:
- `/* Registration Modal */`
- `/* Alert Messages */`
- `/* Form Styles */`
- `/* Success & Error Messages */`

## Security Notes

✅ **Safe to expose:**
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`

❌ **NEVER expose in frontend:**
- `SUPABASE_SERVICE_ROLE_KEY` (only use in server-side code)

The `registrations` table has Row Level Security (RLS) policies:
- Anyone can INSERT (register)
- No one can SELECT (read) without authentication
- Protects user privacy

## Troubleshooting

### Registration not saving to Supabase

**Check:**
1. Are credentials in `config.js` correct?
2. Is `config.js` loaded before `script.js` in HTML?
3. Open browser console - any errors?
4. Check Supabase project is active and schema is applied

### Modal not opening

**Check:**
1. Are Register buttons using `data-open-modal` attribute?
2. Open browser console - any JavaScript errors?
3. Is `script.js` loading correctly?

### Timezone not displaying

**Check:**
1. Does the option have `data-datetime` and `data-duration` attributes?
2. Is the datetime in valid ISO 8601 format?
3. Open browser console for errors

### Acknowledgment checkbox not appearing

**Check:**
1. Does the option have `data-type="part1"` or `data-type="part2"`?
2. Case-sensitive - must be lowercase
3. 4-hour classes use `data-type="4-hour"`

## Support

For questions or issues:
- Check the Supabase documentation: https://supabase.com/docs
- Review browser console for errors
- Check this file for troubleshooting steps

## Next Steps

1. ✅ Configure `config.js` with your Supabase credentials
2. ✅ Test the registration flow
3. ✅ Set up email confirmations (manual or automated)
4. ✅ Set up calendar invites (optional)
5. ✅ Monitor registrations in Supabase
6. ✅ Send reminders 24 hours before classes

---

**System Built:** November 2024
**Framework:** Vanilla JavaScript + Supabase
**Accessibility:** WCAG 2.1 AA Compliant
