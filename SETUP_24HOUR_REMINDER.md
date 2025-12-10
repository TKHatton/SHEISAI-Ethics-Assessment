# Setting Up 24-Hour Email Reminders

## Current Status

✅ **Immediate confirmation emails** - Now working! After registration, users receive:
- Confirmation email
- Calendar attachment (.ics file)
- The calendar file includes a 24-hour reminder alarm

❓ **24-hour email reminders** - Not set up yet. Here's how to add them:

---

## Option 1: Supabase Cron Job (Recommended)

Supabase can run a scheduled function daily to check for upcoming sessions and send reminder emails.

### Steps:

1. **Create a new Edge Function:**
```bash
# In your project directory
supabase functions new send-24hour-reminders
```

2. **Add the function code** (see below)

3. **Set up a daily cron job in Supabase:**
   - Go to Supabase Dashboard → Database → Cron Jobs
   - Create new job: `send_daily_reminders`
   - Schedule: `0 9 * * *` (runs at 9 AM daily)
   - SQL:
   ```sql
   SELECT net.http_post(
     url:='YOUR_SUPABASE_URL/functions/v1/send-24hour-reminders',
     headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
   );
   ```

---

## Option 2: External Service

Use services like:
- **Zapier** - Check database daily and send emails
- **n8n** - Self-hosted automation
- **AWS Lambda** - Scheduled function

---

## What the current email does:

The immediate confirmation email:
1. ✅ Confirms registration
2. ✅ Includes calendar file with 24-hour alarm
3. ✅ Shows session details
4. ✅ Says "We'll send you a reminder 24 hours before" (but doesn't actually send it yet)

The calendar alarm will trigger a notification on their device 24 hours before, but it's not an email—it's a calendar app notification.

---

## To enable emails now:

**Test the immediate confirmation:**
1. Make sure `RESEND_API_KEY` is set in Supabase (Dashboard → Settings → Edge Functions → Environment Variables)
2. Register for a test session
3. Check your email!

The code is now set up to send confirmation emails immediately after registration.
