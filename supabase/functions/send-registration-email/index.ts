// SHE IS AI - Registration Email Confirmation
// Automatically sends confirmation emails when users register for classes

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// Configuration
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = 'SHE IS AI Training <ethics@sheisai.ai>'
const WEBSITE_URL = 'https://ethics-training-registration.netlify.app/' // Update with your actual website URL

// CORS headers for requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Parse registration data from request
    const registration = await req.json()

    console.log('Processing registration email for:', registration.email)

    // Extract registration details
    const {
      full_name,
      email,
      session_id,
      session_start_utc,
      session_end_utc,
      organization,
      tz
    } = registration

    // Determine class type from session_id
    const is4Hour = session_id.startsWith('4h-')
    const isPart1 = session_id.startsWith('p1-')
    const isPart2 = session_id.startsWith('p2-')

    // Format date and time for user's timezone
    const classDate = new Date(session_start_utc)
    const classEndDate = new Date(session_end_utc)

    // Format date
    const formattedDate = classDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: tz || 'America/New_York'
    })

    // Format time
    const formattedStartTime = classDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: tz || 'America/New_York'
    })

    const formattedEndTime = classEndDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: tz || 'America/New_York'
    })

    // Get timezone abbreviation
    const tzName = new Intl.DateTimeFormat('en-US', {
      timeZoneName: 'short',
      timeZone: tz || 'America/New_York'
    }).formatToParts(classDate).find(part => part.type === 'timeZoneName')?.value || ''

    // Duration text
    const duration = is4Hour ? '4 hours' : '2 hours'

    // Format EST reference time (always show original EST time for consistency)
    const estDateFormatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/New_York'
    })

    const estTimeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'America/New_York'
    })

    const estDate = estDateFormatter.format(classDate)
    const estTime = estTimeFormatter.format(classDate)
    const estReference = `${estDate} at ${estTime} EST`

    // Build class-specific message
    let additionalMessage = ''
    let additionalMessageStyle = ''

    if (isPart1) {
      additionalMessageStyle = 'background: #FFF3CD; border-left: 4px solid #FFA500; color: #664D03;'
      additionalMessage = `
        <div style="${additionalMessageStyle} padding: 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0 0 12px; font-weight: 600; font-size: 16px;">⚠️ IMPORTANT REMINDER:</p>
          <p style="margin: 0 0 12px;">
            This is <strong>Part 1</strong> of a 2-part training. You <strong>MUST also register for a Part 2 session</strong> to complete the full training and receive your certification.
          </p>
          <p style="margin: 0;">
            <a href="${WEBSITE_URL}/#registration-cta"
               style="color: #DD292F; font-weight: bold; text-decoration: underline;">
              Register for Part 2 here →
            </a>
          </p>
        </div>
      `
    } else if (isPart2) {
      additionalMessageStyle = 'background: #D1ECF1; border-left: 4px solid #0C5460; color: #0C5460;'
      additionalMessage = `
        <div style="${additionalMessageStyle} padding: 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0 0 12px; font-weight: 600; font-size: 16px;">✓ Great!</p>
          <p style="margin: 0;">
            If you've also registered for Part 1, you're all set to complete the full training.
          </p>
        </div>
      `
    } else {
      additionalMessageStyle = 'background: #D4EDDA; border-left: 4px solid #28A745; color: #155724;'
      additionalMessage = `
        <div style="${additionalMessageStyle} padding: 20px; border-radius: 8px; margin: 24px 0;">
          <p style="margin: 0 0 12px; font-weight: 600; font-size: 16px;">✓ You're all set!</p>
          <p style="margin: 0;">
            This complete 4-hour training session covers everything you need for certification.
          </p>
        </div>
      `
    }

    // Build HTML email - Matching the website confirmation page exactly
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Confirmed - SHE IS AI Training</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #ffffff;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #ffffff;">
    <tr>
      <td align="center" style="padding: 80px 20px;">
        <table role="presentation" style="max-width: 672px; width: 100%; background-color: #f9fafb; border-radius: 24px; border: 1px solid #f3f4f6; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);">

          <!-- Header with Icon -->
          <tr>
            <td style="padding: 48px 48px 32px;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="vertical-align: top; width: 56px;">
                    <div style="width: 48px; height: 48px; background-color: #ffe4e6; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e11d48" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                  </td>
                  <td style="padding-left: 16px; vertical-align: top;">
                    <h2 style="margin: 0 0 4px; font-size: 24px; font-weight: 700; color: #111827; font-family: 'Georgia', serif;">
                      Registration Confirmed
                    </h2>
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">
                      A confirmation email has been sent to ${email}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Box -->
          <tr>
            <td style="padding: 0 48px 48px;">
              <table role="presentation" style="width: 100%; background-color: #ffffff; border-radius: 16px; border: 1px solid #e5e7eb; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);">
                <tr>
                  <td style="padding: 32px;">

                    <p style="margin: 0 0 16px; font-size: 16px; line-height: 1.6; color: #1f2937; font-weight: 300;">
                      Hi ${full_name},
                    </p>

                    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #1f2937; font-weight: 300;">
                      You're registered for the <strong style="font-weight: 600; color: #e11d48;">SHE IS AI Ethics Training!</strong>
                    </p>

                    <!-- Session Details -->
                    <div style="background-color: #f9fafb; padding: 24px; border-radius: 12px; border: 1px solid #f3f4f6; margin-bottom: 24px;">
                      <h3 style="margin: 0 0 16px; font-size: 12px; font-weight: 700; color: #111827; text-transform: uppercase; letter-spacing: 0.05em;">
                        Your Training Session Details
                      </h3>

                      <div style="margin-bottom: 16px;">
                        <p style="margin: 0 0 4px; font-size: 12px; font-weight: 700; color: #6b7280;">
                          ${is4Hour ? 'Intensive Session' : isPart1 ? 'Part 1' : 'Part 2'}
                        </p>
                        <p style="margin: 0; font-size: 18px; font-weight: 500; color: #111827;">
                          ${formattedDate}
                        </p>
                        <p style="margin: 4px 0 0; font-size: 18px; font-weight: 500; color: #111827;">
                          ${formattedStartTime} – ${formattedEndTime} ${tzName}
                        </p>
                      </div>

                      <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
                        <p style="margin: 0; font-size: 14px; color: #4b5563;">
                          <strong style="font-weight: 600;">Duration:</strong> ${duration}
                        </p>
                      </div>
                    </div>

                    <!-- Class Type Specific Message -->
                    ${additionalMessage}

                    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #1f2937; font-weight: 300;">
                      This complete training session covers everything you need for certification.
                    </p>

                    <!-- Calendar Info -->
                    <div style="margin-bottom: 24px;">
                      <h4 style="margin: 0 0 8px; font-size: 16px; font-weight: 700; color: #111827;">
                        Calendar Invitation Attached
                      </h4>
                      <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #4b5563;">
                        This email includes a calendar file (SHE-IS-AI-Ethics-Training.ics) attachment. Click on it to automatically add this training to your calendar app (Google Calendar, Outlook, Apple Calendar, etc.).
                      </p>
                    </div>

                    <!-- Zoom Button -->
                    <div style="margin-bottom: 32px;">
                      <a href="https://us02web.zoom.us/j/82821002196?pwd=tAp9f2hM6BfqGUUdqTBIsLBimY8RSY.1"
                         style="display: inline-flex; align-items: center; padding: 12px 24px; background-color: #2563eb; color: #ffffff; font-weight: 700; border-radius: 9999px; text-decoration: none; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                          <polygon points="23 7 16 12 23 17 23 7"></polygon>
                          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
                        </svg>
                        Join via Zoom
                      </a>
                    </div>

                    <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #6b7280;">
                      We'll send you a reminder 24 hours before your class with the meeting link and any materials you'll need.
                    </p>

                    <!-- Closing -->
                    <p style="margin: 16px 0 0; font-size: 14px; line-height: 1.6; color: #6b7280;">
                      See you soon!<br>
                      <strong style="color: #111827;">The SHE IS AI Team</strong>
                    </p>

                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `

    // Plain text version (fallback)
    const textContent = `
Hi ${full_name},

You're registered for the SHE IS AI Ethics Training!

Your Class Details:
• Date: ${formattedDate}
• Time: ${formattedStartTime} – ${formattedEndTime} ${tzName}
• Duration: ${duration}
• Reference: ${estReference}
${organization ? `• Organization: ${organization}` : ''}

${isPart1 ? '⚠️ IMPORTANT: This is Part 1 of a 2-part training. You MUST also register for a Part 2 session to complete the training. Register for Part 2 here: ' + WEBSITE_URL + '/#registration-cta' : ''}
${isPart2 ? '✓ Great! If you\'ve also registered for Part 1, you\'re all set to complete the full training.' : ''}
${is4Hour ? '✓ You\'re all set! This complete 4-hour training session covers everything you need for certification.' : ''}

We'll send you a reminder 24 hours before your class with the meeting link.

See you soon!
The SHE IS AI Team

---
SHE IS AI | Ethics Training
Website: ${WEBSITE_URL}
Email: info@sheisai.ai
    `.trim()

    // Generate .ics calendar file
    const formatICSDate = (date: Date): string => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    }

    const classType = is4Hour ? '4-Hour Complete Session' : isPart1 ? 'Part 1 of 2' : 'Part 2 of 2'
    const icsDescription = isPart1
      ? 'IMPORTANT: This is Part 1 of a 2-part training. You must also attend Part 2 to complete certification.\\n\\nWe will send you the meeting link 24 hours before the session.\\n\\nWebsite: ' + WEBSITE_URL
      : isPart2
      ? 'Part 2 of the Ethics Training. If you have completed Part 1, this session completes your certification training.\\n\\nWe will send you the meeting link 24 hours before the session.\\n\\nWebsite: ' + WEBSITE_URL
      : 'Complete 4-hour Ethics Training session covering everything needed for certification.\\n\\nWe will send you the meeting link 24 hours before the session.\\n\\nWebsite: ' + WEBSITE_URL

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SHE IS AI//Ethics Training//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${session_id}-${email}@sheisai.ai`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${formatICSDate(classDate)}`,
      `DTEND:${formatICSDate(classEndDate)}`,
      `SUMMARY:SHE IS AI Ethics Training - ${classType}`,
      `DESCRIPTION:${icsDescription}`,
      `LOCATION:Online (Meeting link will be sent 24 hours before)`,
      'STATUS:CONFIRMED',
      'SEQUENCE:0',
      'BEGIN:VALARM',
      'TRIGGER:-PT24H',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: SHE IS AI Ethics Training tomorrow',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n')

    // Base64 encode the .ics file for attachment
    const icsBase64 = btoa(icsContent)

    // Send email via Resend API
    console.log('Sending email via Resend...')

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
        text: textContent,
        attachments: [
          {
            filename: 'SHE-IS-AI-Ethics-Training.ics',
            content: icsBase64,
          }
        ],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Resend API error:', data)
      throw new Error(`Resend API error: ${JSON.stringify(data)}`)
    }

    console.log('Email sent successfully:', data.id)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email sent successfully',
        emailId: data.id
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error sending email:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
