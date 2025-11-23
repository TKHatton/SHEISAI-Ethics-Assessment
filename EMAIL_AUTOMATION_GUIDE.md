# Email Confirmation Automation Guide
## Setting Up Automated Emails for Registration Confirmations

This guide covers multiple approaches to sending confirmation emails, from quick manual solutions to fully automated systems.

---

## Current Status

✅ **Working Now:**
- Registration form captures all data
- Data stored in Supabase `registrations` table
- Success message tells users "A confirmation email will be sent"

❌ **Not Yet Automated:**
- Actual email sending
- Calendar invites
- Reminder emails

---

## Option 1: Manual Email Sending (Quick Start)
**Time:** 5 minutes setup, 10-15 minutes daily
**Cost:** Free
**Best for:** Small number of registrations, getting started quickly

### How It Works:
1. Query new registrations from Supabase daily
2. Send confirmation emails manually using your email client
3. Use email template provided below

### Setup Steps:

#### 1. Query New Registrations Daily

**In Supabase Dashboard:**
```sql
SELECT
  full_name,
  email,
  organization,
  session_id,
  session_start_utc,
  tz,
  created_at
FROM registrations
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

**Export to CSV:**
- Click "..." button
- Select "Download as CSV"
- Open in Excel/Google Sheets

#### 2. Send Confirmation Emails

Use your regular email client (Gmail, Outlook, etc.)

**Email Template** (copy and personalize):

```
Subject: Registration Confirmed - SHE IS AI Training on [DATE]

Hi [NAME],

You're registered for the SHE IS AI Ethics Training!

Your Class Details:
• Date: [DATE]
• Time: [TIME in their timezone - check the 'tz' column]
• Duration: [4 hours OR 2 hours - Part 1/Part 2]

[IF session_id starts with p1-]:
⚠️ IMPORTANT: This is Part 1 of a 2-part training. You MUST also register for a Part 2 session to complete the training. Register for Part 2 here: https://your-website.com

[IF session_id starts with p2-]:
✓ Great! If you've also registered for Part 1, you're all set to complete the full training.

[IF session_id starts with 4h-]:
✓ You're all set! This complete 4-hour training session covers everything you need for certification.

Add to your calendar: [Create calendar event and include link or .ics file]

We'll send you a reminder 24 hours before your class with the meeting link.

See you soon!
The SHE IS AI Team

---
SHE IS AI | Ethics Training
Website: https://sheisai.ai
Email: info@sheisai.ai
```

### Pros:
- ✅ Quick to set up
- ✅ No code required
- ✅ Free
- ✅ You review each registration personally

### Cons:
- ❌ Time-consuming for many registrations
- ❌ Easy to miss someone
- ❌ No automatic reminders
- ❌ Manual timezone conversion needed

---

## Option 2: Supabase Edge Functions (Recommended)
**Time:** 1-2 hours setup
**Cost:** Free (within Supabase limits)
**Best for:** Automated, reliable, scalable solution

### How It Works:
1. Supabase Edge Function triggers when new registration inserted
2. Function sends email automatically via SMTP service
3. Includes all personalization (name, time, Part 1/2 reminders)

### Prerequisites:
- Supabase project with registrations table
- SMTP service (see Option 3 for providers)
- Basic JavaScript knowledge

### Setup Steps:

#### 1. Install Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref
```

#### 2. Create Edge Function

```bash
# Create new function
supabase functions new send-registration-confirmation
```

#### 3. Function Code

Create: `supabase/functions/send-registration-confirmation/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Email service configuration (example using Resend)
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = 'SHE IS AI <training@sheisai.ai>'

serve(async (req) => {
  try {
    const { record } = await req.json()

    // Extract registration data
    const {
      full_name,
      email,
      session_id,
      session_start_utc,
      tz,
      organization
    } = record

    // Determine class type
    const is4Hour = session_id.startsWith('4h-')
    const isPart1 = session_id.startsWith('p1-')
    const isPart2 = session_id.startsWith('p2-')

    // Format date/time for user's timezone
    const classDate = new Date(session_start_utc)
    const formattedDate = classDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: tz
    })

    const formattedTime = classDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      timeZone: tz
    })

    // Build email content
    let additionalInfo = ''
    if (isPart1) {
      additionalInfo = `
        <div style="background: #FFF3CD; padding: 16px; border-radius: 8px; margin-top: 16px; border-left: 4px solid #FFA500;">
          <strong>⚠️ IMPORTANT REMINDER:</strong><br>
          This is <strong>Part 1</strong> of the training. You MUST also register for a <strong>Part 2</strong> session to complete the full training.
          <br><br>
          <a href="https://your-website.com/#registration-cta" style="color: #DD292F; font-weight: bold;">Register for Part 2 here</a>
        </div>
      `
    } else if (isPart2) {
      additionalInfo = `
        <div style="background: #D1ECF1; padding: 16px; border-radius: 8px; margin-top: 16px; border-left: 4px solid #0C5460;">
          <strong>✓ Great!</strong><br>
          If you've also registered for Part 1, you're all set to complete the full training.
        </div>
      `
    } else {
      additionalInfo = `
        <div style="background: #D4EDDA; padding: 16px; border-radius: 8px; margin-top: 16px; border-left: 4px solid #28A745;">
          <strong>✓ You're all set!</strong><br>
          This complete 4-hour training session covers everything you need for certification.
        </div>
      `
    }

    const htmlContent = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #DD292F;">Registration Confirmed!</h2>

        <p>Hi ${full_name},</p>

        <p>You're registered for the SHE IS AI Ethics Training!</p>

        <div style="background: #F5F5F5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Your Class Details:</h3>
          <p style="margin: 8px 0;"><strong>Date:</strong> ${formattedDate}</p>
          <p style="margin: 8px 0;"><strong>Time:</strong> ${formattedTime} (your local time)</p>
          <p style="margin: 8px 0;"><strong>Duration:</strong> ${is4Hour ? '4 hours' : '2 hours'}</p>
          ${organization ? `<p style="margin: 8px 0;"><strong>Organization:</strong> ${organization}</p>` : ''}
        </div>

        ${additionalInfo}

        <p style="margin-top: 24px;">We'll send you a reminder 24 hours before your class with the meeting link.</p>

        <p>See you soon!<br>
        <strong>The SHE IS AI Team</strong></p>

        <hr style="border: none; border-top: 1px solid #DDD; margin: 32px 0;">

        <p style="font-size: 12px; color: #666;">
          SHE IS AI | Ethics Training<br>
          Website: <a href="https://sheisai.ai">sheisai.ai</a> |
          Email: <a href="mailto:info@sheisai.ai">info@sheisai.ai</a>
        </p>
      </div>
    `

    // Send email via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: `Registration Confirmed - SHE IS AI Training on ${formattedDate}`,
        html: htmlContent,
      }),
    })

    const data = await response.json()

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
```

#### 4. Set Up Database Trigger

```sql
-- Create webhook to call Edge Function on new registration
CREATE OR REPLACE FUNCTION notify_registration()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
BEGIN
  -- Call the Edge Function via pg_net
  SELECT net.http_post(
    url := 'https://your-project-ref.supabase.co/functions/v1/send-registration-confirmation',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer YOUR_ANON_KEY"}'::jsonb,
    body := jsonb_build_object('record', row_to_json(NEW))
  ) INTO request_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_registration_created
AFTER INSERT ON registrations
FOR EACH ROW
EXECUTE FUNCTION notify_registration();
```

#### 5. Deploy Function

```bash
# Set environment variable
supabase secrets set RESEND_API_KEY=your_resend_api_key

# Deploy function
supabase functions deploy send-registration-confirmation
```

### Pros:
- ✅ Fully automated
- ✅ Sends immediately after registration
- ✅ Scalable (handles any volume)
- ✅ Timezone conversion built-in
- ✅ Free within Supabase limits

### Cons:
- ❌ Requires coding knowledge
- ❌ Setup time required
- ❌ Need SMTP service account

---

## Option 3: Third-Party Email Services
**Time:** 30 minutes - 1 hour setup
**Cost:** Free tier available, paid plans from $10/month
**Best for:** Easy automation without managing infrastructure

### Recommended Services:

#### A. Resend (Recommended - Best for Developers)
**Website:** https://resend.com
**Free Tier:** 100 emails/day, 3,000/month
**Pricing:** $20/month for 50,000 emails

**Pros:**
- ✅ Modern, developer-friendly API
- ✅ Easy setup
- ✅ Great documentation
- ✅ Generous free tier

**Setup:**
1. Create account at resend.com
2. Verify your domain (or use resend.dev for testing)
3. Get API key
4. Use with Supabase Edge Function (see Option 2)

#### B. Postmark
**Website:** https://postmarkapp.com
**Free Tier:** 100 emails/month
**Pricing:** $15/month for 10,000 emails

**Pros:**
- ✅ Excellent deliverability
- ✅ Fast sending
- ✅ Great for transactional emails

#### C. SendGrid
**Website:** https://sendgrid.com
**Free Tier:** 100 emails/day
**Pricing:** $19.95/month for 50,000 emails

**Pros:**
- ✅ Established service
- ✅ Lots of integrations
- ✅ Template editor

---

## Option 4: Zapier/Make Integration (No Code)
**Time:** 30 minutes setup
**Cost:** Free tier available, paid from $20/month
**Best for:** Non-technical setup, connecting services

### How It Works:
1. Supabase → Zapier/Make → Email Service
2. New row in registrations table triggers workflow
3. Workflow formats and sends email

### Setup with Zapier:

1. **Create Zapier account** (zapier.com)

2. **Create new Zap:**
   - Trigger: Supabase "New Row"
   - Table: registrations

3. **Add Supabase connection:**
   - Enter Supabase URL
   - Enter service role key (keep secret!)

4. **Add Filter (Optional):**
   - Only send for new registrations
   - Skip test registrations

5. **Add Email Action:**
   - Choose: Gmail, Outlook, or Email by Zapier
   - Map fields from Supabase to email template

6. **Format Email:**
   ```
   To: {{email}}
   Subject: Registration Confirmed - SHE IS AI Training
   Body: Hi {{full_name}}, ...
   ```

7. **Test and Activate**

### Pros:
- ✅ No code required
- ✅ Visual workflow builder
- ✅ Connects to many services
- ✅ Can add calendar invites, Slack notifications, etc.

### Cons:
- ❌ Monthly cost after free tier
- ❌ Less flexible than custom code
- ❌ Requires service role key (security consideration)

---

## Calendar Invites

### Manual .ics File Creation:

**Template:**
```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SHE IS AI//Ethics Training//EN
BEGIN:VEVENT
UID:registration-{ID}@sheisai.ai
DTSTAMP:20241123T120000Z
DTSTART:20241209T150000Z
DTEND:20241209T190000Z
SUMMARY:SHE IS AI Ethics Training
DESCRIPTION:Your Ethics Training session. Meeting link will be sent 24 hours before.
LOCATION:Online (Link TBA)
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR
```

### Automated Calendar Invites:

**Using Google Calendar API:**
1. Enable Google Calendar API
2. Create service account
3. Generate calendar events programmatically
4. Send invites via email

**Using Calendly/Cal.com:**
1. Create booking page for each session
2. Embed booking links in website
3. Automatic calendar invites sent

---

## Reminder Emails (24 Hours Before)

### Manual Approach:
1. Query registrations for tomorrow:
```sql
SELECT * FROM registrations
WHERE session_start_utc > NOW()
  AND session_start_utc < NOW() + INTERVAL '25 hours'
  AND session_start_utc > NOW() + INTERVAL '23 hours';
```

2. Send reminder email with meeting link

### Automated Approach:
1. Set up scheduled Edge Function (cron job)
2. Runs daily at midnight
3. Finds classes in next 24-48 hours
4. Sends reminder emails automatically

---

## Email Templates

### Confirmation Email (Plain Text)
```
Subject: Registration Confirmed - SHE IS AI Training on {DATE}

Hi {NAME},

You're registered for the SHE IS AI Ethics Training!

Your Class Details:
• Date: {DATE}
• Time: {TIME} (your local time)
• Duration: {DURATION}

{ADDITIONAL_INFO based on class type}

We'll send you a reminder 24 hours before your class with the meeting link.

Add to your calendar: {CALENDAR_LINK}

See you soon!
The SHE IS AI Team

---
SHE IS AI | Ethics Training
Website: https://sheisai.ai
Email: info@sheisai.ai
```

### Reminder Email (24 Hours Before)
```
Subject: Reminder: SHE IS AI Training Tomorrow at {TIME}

Hi {NAME},

Your SHE IS AI Ethics Training is tomorrow!

Class Details:
• Date: {DATE}
• Time: {TIME} (your local time)
• Duration: {DURATION}

Meeting Link: {ZOOM/TEAMS_LINK}

What to Prepare:
✓ Quiet space with good internet
✓ Notebook for key takeaways
✓ Questions you want to ask

See you tomorrow!
The SHE IS AI Team
```

---

## Recommended Approach

**For Small Scale (< 50 registrations/month):**
→ **Option 1 (Manual)** - Quick, free, simple

**For Medium Scale (50-500 registrations/month):**
→ **Option 3 (Resend)** + **Option 2 (Edge Function)** - Best balance

**For Large Scale (500+ registrations/month):**
→ **Option 2 (Edge Function)** + **Option 3 (SendGrid)** - Fully automated

**For Non-Technical Teams:**
→ **Option 4 (Zapier)** - No code required

---

## Next Steps

1. **Choose your approach** based on scale and technical comfort
2. **Set up email service** (if using automation)
3. **Test with a few registrations** first
4. **Monitor deliverability** (check spam folders)
5. **Collect feedback** from participants

---

## Support & Resources

- **Resend Docs:** https://resend.com/docs
- **Supabase Edge Functions:** https://supabase.com/docs/guides/functions
- **Zapier University:** https://zapier.com/university
- **Email Template Generator:** https://emailoctopus.com/templates

---

**Guide Version:** 1.0
**Last Updated:** November 2024
