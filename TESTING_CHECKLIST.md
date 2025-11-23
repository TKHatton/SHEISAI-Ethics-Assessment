# Registration System Testing Checklist
## Complete Testing Guide to Verify Everything Works

Use this checklist to thoroughly test the registration system before going live.

---

## Pre-Testing Setup

Before you start testing, ensure:

- [ ] Supabase project created
- [ ] Database schema applied (`database-schema-registration.sql`)
- [ ] Credentials added to `config.js`
- [ ] Website files deployed (locally or to web server)
- [ ] Browser console open (F12) to monitor for errors

---

## Test 1: Basic Page Load ✓

**Goal:** Verify the website loads without errors

### Steps:
1. Open your website in a browser
2. Press **F12** to open Developer Tools
3. Click the **Console** tab
4. Look for any red error messages

### Expected Results:
- ✅ Page loads completely
- ✅ Header with logo visible
- ✅ Schedule section shows all 10 class cards
- ✅ Footer with logo visible
- ✅ Console shows: "Supabase initialized" (if credentials configured)
- ✅ No red error messages

### If you see errors:
- "supabase is not defined" → Check script tags in index.html
- "SUPABASE_URL is undefined" → Check config.js is loaded
- "Failed to load resource" → Check file paths are correct

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 2: Modal Opening ✓

**Goal:** Verify registration modal opens correctly

### Steps:
1. Click any **"Register"** button on a class card
2. Observe the modal behavior

### Expected Results:
- ✅ Modal appears with smooth transition
- ✅ Background darkens (overlay visible)
- ✅ Form fields are visible and empty
- ✅ The class you clicked is pre-selected in dropdown
- ✅ Warning message at top: "IMPORTANT: 2-hour classes require BOTH..."
- ✅ Close button (×) visible in top-right

### Try These:
- ✅ Click different Register buttons → Correct class pre-selected each time
- ✅ Click overlay (background) → Modal closes
- ✅ Press **Escape** key → Modal closes
- ✅ Click **Cancel** button → Modal closes
- ✅ Click × button → Modal closes

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 3: Form Validation - Empty Form ✓

**Goal:** Verify required field validation works

### Steps:
1. Open registration modal
2. **Without filling anything**, click "Complete Registration"

### Expected Results:
- ✅ Form does NOT submit
- ✅ Error message under "Full Name": "Please enter your full name"
- ✅ Error message under "Email": "Please enter your email address"
- ✅ Error message under "Select Your Class": "Please select a class"
- ✅ Input fields have red borders
- ✅ Form stays open (doesn't close)

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 4: Form Validation - Invalid Email ✓

**Goal:** Verify email format validation

### Steps:
1. Fill in:
   - Name: `Test User`
   - Email: `notanemail` (no @ symbol)
   - Class: Any class
2. Click "Complete Registration"

### Expected Results:
- ✅ Form does NOT submit
- ✅ Error message under Email: "Please enter a valid email address"
- ✅ Email field has red border

### Try these invalid emails:
- `test` → Should fail
- `test@` → Should fail
- `test@domain` → Should fail
- `@domain.com` → Should fail

### Try valid email:
- `test@example.com` → Should NOT show error

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 5: Class Selection - 4-Hour Class ✓

**Goal:** Verify 4-hour class behavior

### Steps:
1. Open modal
2. Select a **4-hour class** from dropdown
3. Observe the form

### Expected Results:
- ✅ Acknowledgment checkbox does NOT appear
- ✅ Time display appears showing: "Your local time: [date] at [time]"
- ✅ Time is in YOUR timezone (not EST)
- ✅ Duration shows 4 hours (e.g., "10:00 AM – 2:00 PM")

### Verify Timezone Conversion:
If you're in PST (Pacific):
- 10:00 AM EST should show as 7:00 AM PST

If you're in GMT (London):
- 10:00 AM EST should show as 3:00 PM GMT

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 6: Class Selection - Part 1 Class ✓

**Goal:** Verify Part 1 acknowledgment appears

### Steps:
1. Open modal
2. Select any **Part 1** class from dropdown
3. Observe the form

### Expected Results:
- ✅ Acknowledgment checkbox **APPEARS**
- ✅ Checkbox has blue/info background
- ✅ Text: "I understand that Part 1 and Part 2 classes must BOTH be completed..."
- ✅ Checkbox is **UNCHECKED** by default
- ✅ Red asterisk (*) indicating required

### Try to submit WITHOUT checking:
1. Fill name and email
2. Don't check the box
3. Click "Complete Registration"

### Expected:
- ✅ Error message: "You must acknowledge that both Part 1 and Part 2 are required"
- ✅ Form does NOT submit

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 7: Class Selection - Part 2 Class ✓

**Goal:** Verify Part 2 acknowledgment appears

### Steps:
1. Open modal
2. Select any **Part 2** class from dropdown
3. Observe the form

### Expected Results:
- ✅ Acknowledgment checkbox **APPEARS** (same as Part 1)
- ✅ Same validation rules apply

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 8: Successful Registration - 4-Hour Class ✓

**Goal:** Submit a complete 4-hour class registration

### Steps:
1. Open modal
2. Fill in:
   - Name: `Test User 4Hour`
   - Email: `test4hour@example.com`
   - Organization: `Test Org` (optional)
   - Class: **Tuesday, December 9, 2024 - 4 hours**
3. Click "Complete Registration"
4. Wait for response

### Expected Results:
- ✅ "Submitting..." text appears on button briefly
- ✅ Form disappears
- ✅ Success message appears with:
   - Green checkmark (✓)
   - "Registration Successful!"
   - "Thank you, Test User 4Hour!"
   - "December 9, 2024" mentioned
   - "Confirmation email will be sent to test4hour@example.com"
   - Green box: "✓ You're all set! This complete 4-hour training session..."
- ✅ "Close" button visible

### Verify in Supabase:
1. Go to Supabase Dashboard
2. Click **Table Editor** → **registrations**
3. You should see:
   - email: `test4hour@example.com`
   - full_name: `Test User 4Hour`
   - organization: `Test Org`
   - session_id: `4h-dec9`
   - session_start_utc: `2024-12-09T15:00:00Z` (10 AM EST = 3 PM UTC)
   - tz: Your timezone (e.g., `America/Los_Angeles`)
   - created_at: Current timestamp

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 9: Successful Registration - Part 1 Class ✓

**Goal:** Submit a Part 1 registration with acknowledgment

### Steps:
1. Open modal
2. Fill in:
   - Name: `Test User Part1`
   - Email: `testpart1@example.com`
   - Class: Any **Part 1** class
3. **Check the acknowledgment box**
4. Click "Complete Registration"

### Expected Results:
- ✅ Success message appears
- ✅ **Yellow/orange warning box** appears with:
   - "⚠️ IMPORTANT REMINDER:"
   - "This is **Part 1** of the training"
   - "You MUST also register for a **Part 2** session"
- ✅ Clear emphasis on needing Part 2

### Verify in Supabase:
- ✅ Registration appears in table
- ✅ session_id starts with `p1-` (e.g., `p1-dec10-am`)

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 10: Successful Registration - Part 2 Class ✓

**Goal:** Submit a Part 2 registration

### Steps:
1. Open modal
2. Fill in:
   - Name: `Test User Part2`
   - Email: `testpart2@example.com`
   - Class: Any **Part 2** class
3. **Check the acknowledgment box**
4. Click "Complete Registration"

### Expected Results:
- ✅ Success message appears
- ✅ **Blue info box** appears with:
   - "✓ Great!"
   - "If you've also registered for Part 1, you're all set"
- ✅ Reassuring message about completing training

### Verify in Supabase:
- ✅ Registration appears in table
- ✅ session_id starts with `p2-` (e.g., `p2-dec17-pm`)

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 11: Multiple Registrations ✓

**Goal:** Verify users can register for multiple classes

### Steps:
1. Close success message
2. Click another "Register" button
3. Fill form with same or different email
4. Submit

### Expected Results:
- ✅ Can register multiple times
- ✅ Each registration creates new row in database
- ✅ No errors about "already registered"

### Verify in Supabase:
- ✅ Multiple rows visible
- ✅ All registrations have unique IDs

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 12: Mobile Responsiveness ✓

**Goal:** Verify modal works on mobile devices

### Steps:
1. Open browser Developer Tools (F12)
2. Click "Toggle device toolbar" (phone icon)
3. Select a mobile device (e.g., iPhone 12)
4. Test registration flow

### Expected Results:
- ✅ Modal fits on screen (no horizontal scroll)
- ✅ Form fields are readable and tappable
- ✅ Buttons are large enough to tap
- ✅ Success message displays properly
- ✅ Close button easy to tap

### Test on actual mobile device (if available):
- ✅ Open website on phone
- ✅ Test full registration flow
- ✅ Verify keyboard doesn't break layout

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 13: Accessibility ✓

**Goal:** Verify accessible experience

### Keyboard Navigation:
1. **Tab** through the page
2. When Register button is focused, press **Enter**
3. **Tab** through form fields
4. Press **Escape** to close modal

### Expected Results:
- ✅ Can open modal with Enter key
- ✅ Can tab through all form fields
- ✅ Focus indicator visible on each field
- ✅ Can close modal with Escape key
- ✅ Focus returns to Register button after closing

### Screen Reader (Optional):
- ✅ Error messages announced
- ✅ Field labels read correctly
- ✅ Required fields identified

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 14: Error Handling ✓

**Goal:** Verify error handling when things go wrong

### Test Network Error:
1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Check "Offline" box
4. Try to submit registration

### Expected Results:
- ✅ Error message appears
- ✅ Message explains the issue
- ✅ "Try Again" button visible
- ✅ Can retry after going back online

### Test Invalid Supabase Credentials:
1. Temporarily break credentials in config.js:
   ```javascript
   window.SUPABASE_URL = 'https://invalid.supabase.co';
   ```
2. Refresh page
3. Try to register

### Expected Results:
- ✅ Fallback message appears asking user to email registration
- ✅ All registration details shown for user to copy
- ✅ Email address provided: info@sheisai.ai

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 15: Browser Compatibility ✓

**Goal:** Verify works across browsers

### Test in:
- [ ] **Chrome** (or Edge/Brave)
- [ ] **Firefox**
- [ ] **Safari** (Mac/iPhone)

### Expected Results:
- ✅ Modal opens in all browsers
- ✅ Form validation works
- ✅ Submissions succeed
- ✅ No console errors

**Status:** ⬜ Pass / ⬜ Fail

---

## Test 16: Data Quality Check ✓

**Goal:** Verify data is stored correctly

### In Supabase:
1. Go to **Table Editor** → **registrations**
2. Look at a few registration rows

### Verify:
- ✅ `email` is correct format
- ✅ `full_name` matches what was entered
- ✅ `session_id` matches dropdown value
- ✅ `session_start_utc` is correct datetime in UTC
- ✅ `session_end_utc` = start + duration (2 or 4 hours)
- ✅ `tz` shows user's timezone
- ✅ `user_agent` shows browser info
- ✅ `created_at` is current timestamp

### Run Query:
```sql
SELECT
  session_id,
  COUNT(*) as registrations,
  MIN(created_at) as first_registration,
  MAX(created_at) as last_registration
FROM registrations
GROUP BY session_id
ORDER BY session_id;
```

### Expected:
- ✅ All session_ids are valid
- ✅ Counts make sense
- ✅ Timestamps are reasonable

**Status:** ⬜ Pass / ⬜ Fail

---

## Test Summary

**Total Tests:** 16

**Passed:** _____ / 16
**Failed:** _____ / 16

### Critical Issues (Must Fix Before Launch):
1. _________________________________
2. _________________________________
3. _________________________________

### Minor Issues (Nice to Fix):
1. _________________________________
2. _________________________________

### Notes:
_________________________________
_________________________________
_________________________________

---

## Production Readiness Checklist

Before going live:

- [ ] All 16 tests passed
- [ ] Tested on at least 2 browsers
- [ ] Tested on mobile device
- [ ] Supabase credentials verified
- [ ] No console errors
- [ ] Data appears correctly in Supabase
- [ ] Backup of database schema saved
- [ ] Know how to export registrations
- [ ] Email confirmation plan in place (manual or automated)
- [ ] Team knows how to access Supabase dashboard

---

## Post-Launch Monitoring

### Daily (First Week):
- [ ] Check Supabase for new registrations
- [ ] Monitor for error reports
- [ ] Verify timezone conversions are correct

### Weekly:
- [ ] Export registration data
- [ ] Check for duplicate registrations
- [ ] Review any identity alerts

### Before Each Class:
- [ ] Export attendee list for that session
- [ ] Send reminder emails (if automated)
- [ ] Verify class meeting links work

---

## Getting Help

**If tests fail:**
1. Check browser console for specific error messages
2. Review `CREDENTIALS_SETUP.md` for configuration issues
3. Verify database schema was applied correctly
4. Check `SUPABASE_QUICKSTART.md` for setup steps

**Common Solutions:**
- Clear browser cache and reload
- Verify credentials are correct (no extra spaces)
- Check network connection
- Ensure Supabase project is active (not paused)

---

**Testing Guide Version:** 1.0
**Last Updated:** November 2024
