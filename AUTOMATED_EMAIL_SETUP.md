# Automated Email Confirmations - Complete Setup Guide
## Send Confirmation Emails Automatically When Users Register

This guide will set up automatic email confirmations using Supabase Edge Functions + Resend (email service).

**Result:** When someone registers → They immediately get a confirmation email

---

## Overview

**What You'll Set Up:**
1. Email service account (Resend - free tier)
2. Supabase Edge Function (sends emails)
3. Database trigger (calls function on new registration)

**Time Required:** 30-45 minutes
**Cost:** Free (up to 100 emails/day with Resend)

---

## Step 1: Create Resend Account (5 minutes)

### 1.1 Sign Up for Resend

1. Go to: https://resend.com
2. Click **"Start Building"** or **"Sign Up"**
3. Create account (use GitHub, Google, or Email)
4. Verify your email

### 1.2 Get API Key

1. After login, you'll see the dashboard
2. Click **"API Keys"** in the left sidebar
3. Click **"Create API Key"**
4. Name: `SHE-IS-AI-Registration`
5. Permission: **"Sending access"**
6. Click **"Create"**
7. **IMPORTANT:** Copy the API key NOW (starts with `re_...`)
   - Save it somewhere safe
   - You won't be able to see it again!

Example API key: `re_123abc456def789ghi012jkl345mno678`

### 1.3 Verify Domain (or Use Resend's Test Domain)

**Option A: Use Test Domain (Quick Start)**
- Resend provides `onboarding@resend.dev` for testing
- Emails will work immediately
- Shows "via resend.dev" in inbox
- Good for testing, then upgrade to your domain

**Option B: Use Your Domain (Recommended for Production)**
1. Click **"Domains"** in sidebar
2. Click **"Add Domain"**
3. Enter your domain: `sheisai.ai`
4. Add DNS records Resend provides
5. Wait for verification (10 min - 24 hours)

**For now, use Option A (test domain) to get started quickly!**

---

## Step 2: Install Supabase CLI (10 minutes)

### 2.1 Install Node.js (if not already installed)

**Check if you have Node.js:**
```bash
node --version
```

If you see a version number (v18+), skip to 2.2.

**If not installed:**
- Go to: https://nodejs.org
- Download LTS version
- Install and restart terminal

### 2.2 Install Supabase CLI

**Windows:**
```bash
npm install -g supabase
```

**Mac/Linux:**
```bash
npm install -g supabase
```

**Verify installation:**
```bash
supabase --version
```

Should show: `1.x.x` or similar

### 2.3 Login to Supabase

```bash
supabase login
```

- Opens browser for authentication
- Login with your Supabase account
- Terminal will confirm: "Logged in successfully"

---

## Step 3: Link Your Supabase Project (2 minutes)

### 3.1 Get Your Project Reference ID

**In Supabase Dashboard:**
1. Go to: Settings → General
2. Find **"Reference ID"**
3. Copy it (example: `abcdefghijklmnop`)

### 3.2 Link Project

**In your project directory:**
```bash
cd C:\Users\ltken\OneDrive\Documents\GitHub\SHEISAI-Ethics-Assessment

supabase link --project-ref YOUR-PROJECT-REF
```

Replace `YOUR-PROJECT-REF` with the reference ID you copied.

**Example:**
```bash
supabase link --project-ref abcdefghijklmnop
```

**You'll be prompted for database password:**
- This is the password you created when making the Supabase project
- Enter it (characters won't show - that's normal)
- Press Enter

**Success message:** "Linked to project abcdefghijklmnop"

---

## Step 4: Create Edge Function (5 minutes)

### 4.1 Create Function

```bash
supabase functions new send-registration-email
```

**Result:** Creates folder: `supabase/functions/send-registration-email/`

### 4.2 Create the Function Code

**Create file:** `supabase/functions/send-registration-email/index.ts`

I'll create this file for you with the complete code...

---

## Step 5: Deploy the Function (3 minutes)

### 5.1 Set Environment Variable (API Key)

```bash
supabase secrets set RESEND_API_KEY=your_actual_api_key_here
```

**Replace with your actual Resend API key!**

Example:
```bash
supabase secrets set RESEND_API_KEY=re_123abc456def789ghi012jkl345mno678
```

### 5.2 Deploy Function

```bash
supabase functions deploy send-registration-email
```

**Output should show:**
```
Deploying function send-registration-email...
Function deployed successfully!
```

### 5.3 Verify Deployment

**In Supabase Dashboard:**
1. Click **"Edge Functions"** in sidebar
2. You should see: `send-registration-email`
3. Status: **"Active"**

---

## Step 6: Set Up Database Trigger (5 minutes)

### 6.1 Get Your Edge Function URL

**In Supabase Dashboard:**
1. Click **"Edge Functions"**
2. Click on `send-registration-email`
3. Copy the URL (looks like):
   ```
   https://abcdefghijklmnop.supabase.co/functions/v1/send-registration-email
   ```

### 6.2 Create Database Trigger

**In Supabase:** Go to SQL Editor

**Paste this SQL** (replace the URL with yours):

```sql
-- Function to call Edge Function when new registration is inserted
CREATE OR REPLACE FUNCTION notify_new_registration()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
  payload json;
BEGIN
  -- Build payload with registration data
  payload := row_to_json(NEW);

  -- Call Edge Function via HTTP
  SELECT net.http_post(
    url := 'https://YOUR-PROJECT-REF.supabase.co/functions/v1/send-registration-email',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.anon_key')
    ),
    body := payload::jsonb
  ) INTO request_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_registration_created ON registrations;

-- Create trigger that fires after each registration insert
CREATE TRIGGER on_registration_created
  AFTER INSERT ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION notify_new_registration();
```

**IMPORTANT:** Replace `YOUR-PROJECT-REF` with your actual project reference ID!

### 6.3 Enable pg_net Extension (if needed)

If you get an error about `net.http_post`, run this first:

```sql
CREATE EXTENSION IF NOT EXISTS pg_net;
```

Then run the trigger SQL again.

---

## Step 7: Test the System (5 minutes)

### 7.1 Submit Test Registration

1. Go to your website
2. Click a **"Register"** button
3. Fill out the form:
   - Name: `Test User`
   - Email: **YOUR actual email** (so you can see the email!)
   - Organization: `Test Org`
   - Class: Any class
4. Submit

### 7.2 Check for Email

**Within 30 seconds**, check your email inbox for:
- **Subject:** "Registration Confirmed - SHE IS AI Training on [Date]"
- **From:** `onboarding@resend.dev` (if using test domain)

### 7.3 Troubleshooting

**If no email arrives:**

1. **Check Spam/Junk folder**

2. **Check Resend Dashboard:**
   - Go to Resend → "Logs"
   - See if email was sent
   - Check for errors

3. **Check Supabase Logs:**
   - Supabase Dashboard → Edge Functions
   - Click on `send-registration-email`
   - Click "Logs" tab
   - Look for errors

4. **Check Database Trigger:**
   ```sql
   -- Verify trigger exists
   SELECT * FROM pg_trigger WHERE tgname = 'on_registration_created';
   ```

5. **Test Edge Function Directly:**
   - In Supabase: Edge Functions → send-registration-email
   - Click "Invoke Function"
   - Test with sample data

---

## Email Template Customization

The email includes:
- ✅ Personalized greeting with their name
- ✅ Class date, time (in their timezone), and duration
- ✅ EST reference time (e.g., "Tuesday, December 17, 2024 at 7:00 PM EST")
- ✅ Different messages for 4-hour / Part 1 / Part 2
- ✅ Warning for Part 1 to also register for Part 2
- ✅ Confirmation for Part 2 if they have Part 1
- ✅ Professional SHE IS AI branding

### How Timezone Display Works:

The email shows times in **two formats**:

1. **Primary Time:** User's local timezone (automatically detected)
   - Example: "7:00 PM – 9:00 PM PST" (if user is in Pacific timezone)

2. **Reference Time:** Original EST time (always included for context)
   - Example: "Reference: Tuesday, December 17, 2024 at 7:00 PM EST"

This helps users understand:
- When the class starts in their local time
- The original scheduled time for coordination
- Confirmation they registered for the correct session

**Example Email Display:**

```
Your Class Details:
• Date: Tuesday, December 17, 2024
• Time: 4:00 PM – 6:00 PM PST
• Duration: 2 hours
• Reference: Tuesday, December 17, 2024 at 7:00 PM EST
• Organization: Example Corp
```

### Customize Email Content:

**To change the email text:**
1. Edit: `supabase/functions/send-registration-email/index.ts`
2. Find the `htmlContent` section (around line 80)
3. Modify the HTML
4. Redeploy: `supabase functions deploy send-registration-email`

### Add Your Logo:

**In the email HTML, add:**
```html
<img src="https://your-website.com/assets/White Transparent Logo.png"
     alt="SHE IS AI"
     style="max-width: 200px; margin-bottom: 20px;" />
```

### Change "From" Email:

Once you verify your domain with Resend:
```typescript
const FROM_EMAIL = 'training@sheisai.ai'; // Your actual email
```

---

## Calendar Invites (Optional Enhancement)

### To Add Calendar .ics Files:

**1. Install ics library in Edge Function:**
```bash
# In your function, import at top:
import { createEvent } from 'https://esm.sh/ics@3.5.0'
```

**2. Generate ICS file in function**
**3. Attach to email**

See `EMAIL_AUTOMATION_GUIDE.md` for calendar invite code examples.

---

## Monitoring & Maintenance

### Daily Check (First Week)

**Resend Dashboard:**
- Check "Logs" for sent emails
- Monitor delivery rate
- Check for bounces

**Supabase Edge Functions:**
- Check "Logs" for errors
- Monitor invocation count

### Weekly

**Query Registrations:**
```sql
SELECT
  email,
  full_name,
  session_id,
  created_at
FROM registrations
WHERE created_at > NOW() - INTERVAL '7 days'
ORDER BY created_at DESC;
```

**Cross-check with Resend:**
- Same number of emails sent?
- Any failed to send?

---

## Scaling

### Resend Free Tier:
- 100 emails/day
- 3,000 emails/month

### If You Exceed:
**Upgrade to Resend Pro:** $20/month
- 50,000 emails/month
- Custom domain
- Better deliverability

### Monitor Usage:
- Resend Dashboard → Usage tab
- Shows daily/monthly counts

---

## Troubleshooting Guide

### Problem: "RESEND_API_KEY not found"
**Solution:**
```bash
supabase secrets set RESEND_API_KEY=your_key_here
supabase functions deploy send-registration-email
```

### Problem: "net.http_post does not exist"
**Solution:**
```sql
CREATE EXTENSION IF NOT EXISTS pg_net;
```

### Problem: Emails not sending
**Check:**
1. Edge Function logs (Supabase Dashboard)
2. Resend logs (Resend Dashboard)
3. API key is correct
4. Trigger is created (check pg_trigger table)

### Problem: Wrong timezone in email
**Check:**
- Registration data includes `tz` field
- Edge Function uses correct timezone for formatting

### Problem: Emails go to spam
**Solutions:**
1. Verify your domain with Resend
2. Use your own domain instead of resend.dev
3. Add SPF/DKIM records (Resend provides these)

---

## Cost Breakdown

### Current Setup (Free Tier):
- ✅ Supabase Edge Functions: Free
- ✅ Resend: Free (100/day, 3,000/month)
- ✅ **Total: $0/month**

### If You Grow:
- Resend Pro: $20/month (50,000 emails)
- Supabase Pro: $25/month (more resources)

### Cost per Email:
- Free tier: $0
- Paid tier: ~$0.0004 per email (fraction of a cent)

---

## Success Checklist

Setup is complete when:
- [ ] Resend account created and API key saved
- [ ] Supabase CLI installed and logged in
- [ ] Project linked with CLI
- [ ] Edge Function created and deployed
- [ ] Environment variable (API key) set
- [ ] Database trigger created
- [ ] Test registration sends email successfully
- [ ] Email arrives in inbox with correct content
- [ ] Part 1/Part 2 logic works correctly

---

## Next Steps

After setup:
1. ✅ Test with multiple class types (4-hour, Part 1, Part 2)
2. ✅ Verify timezone conversion is accurate
3. ✅ Add your domain to Resend (optional)
4. ✅ Customize email template (optional)
5. ✅ Set up reminder emails (optional - see EMAIL_AUTOMATION_GUIDE.md)

---

## Support

**Resend Help:**
- Docs: https://resend.com/docs
- Support: support@resend.com

**Supabase Help:**
- Docs: https://supabase.com/docs/guides/functions
- Discord: https://discord.supabase.com

**This Setup:**
- Review: EMAIL_AUTOMATION_GUIDE.md
- Check: Edge Function logs in Supabase

---

**Setup Guide Version:** 1.0
**Estimated Time:** 30-45 minutes
**Difficulty:** Intermediate (requires CLI usage)
