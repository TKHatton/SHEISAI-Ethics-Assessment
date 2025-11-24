# Registration System Troubleshooting Guide
## Fix: No Registrations Appearing in Supabase

If registrations aren't being saved to Supabase, follow these steps:

---

## Problem: Empty Credentials in config.js

### Symptom:
- Form submits successfully
- Success message appears
- BUT no data appears in Supabase
- Browser console shows: "Supabase credentials not configured"

### Solution:

#### Step 1: Get Your Supabase Credentials

1. **Go to Supabase Dashboard:** https://app.supabase.com
2. **Open your project** (SHE-IS-AI-Ethics-Training)
3. **Click Settings (⚙️)** in the sidebar
4. **Click "API"**

#### Step 2: Copy Project URL

Find the section: **"Project URL"**

```
Project URL
https://abcdefghijklmnop.supabase.co

[Copy icon]
```

Click the copy icon and save it.

#### Step 3: Copy Anon Public Key

Scroll down to: **"Project API keys"**

Find the key labeled: **"anon" "public"**

```
anon
public

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

[Copy icon]
```

Click the copy icon and save it.

#### Step 4: Update config.js

**Open:** `config.js` in your project

**Replace the empty strings:**

```javascript
// BEFORE (empty):
window.SUPABASE_URL = '';
window.SUPABASE_ANON_KEY = '';

// AFTER (with your actual credentials):
window.SUPABASE_URL = 'https://your-project.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

**Save the file!**

#### Step 5: Deploy/Upload Updated config.js

If testing locally:
- Refresh your browser (Ctrl+F5 or Cmd+Shift+R)

If on live server:
- Upload the updated `config.js` to your web server
- Replace the old one

#### Step 6: Test Again

1. Open your website
2. Press **F12** (open Developer Tools)
3. Go to **Console** tab
4. You should see: `Supabase initialized` (no errors)
5. Click **Register** button
6. Fill form and submit
7. Check Supabase → Table Editor → registrations

**Should now see your test registration!**

---

## Problem: Database Tables Not Created

### Symptom:
- Console error: "relation 'registrations' does not exist"
- 404 or database errors

### Solution:

#### Step 1: Verify Tables Exist

**In Supabase Dashboard:**
1. Click **"Table Editor"** in sidebar
2. Check if you see these tables:
   - registrations ✓
   - profiles ✓
   - assessment_attempts ✓
   - identity_alerts ✓

**If tables are missing:**

#### Step 2: Run Database Schema

1. Go to **SQL Editor** in Supabase
2. Click **"+ New query"**
3. Copy **ALL contents** from `database-schema-registration.sql`
4. Paste into editor
5. Click **"Run"**
6. Should see: "✓ All tables created successfully!"

---

## Problem: Browser Console Errors

### Check Console:

1. Press **F12**
2. Click **Console** tab
3. Look for red errors

### Common Errors:

#### Error: "supabase is not defined"
**Cause:** Supabase library not loaded

**Fix:** Check `index.html` has:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="config.js"></script>
<script defer src="script.js"></script>
```

#### Error: "Invalid API key"
**Cause:** Wrong key or typo in config.js

**Fix:**
- Re-copy the **anon public** key (not service_role)
- Check for extra spaces or quotes
- Should start with: `eyJ`

#### Error: "Failed to fetch"
**Cause:** Wrong URL or network issue

**Fix:**
- Verify URL in config.js is correct
- Should start with: `https://`
- Check internet connection

---

## Complete Test Checklist

### Pre-Test Setup:
- [ ] Supabase project created
- [ ] Database schema applied (tables exist)
- [ ] Credentials copied from Supabase
- [ ] config.js updated with credentials
- [ ] config.js uploaded to server (if live)

### Testing:
- [ ] Open website
- [ ] Press F12 → Console
- [ ] See "Supabase initialized" message
- [ ] No red errors in console
- [ ] Click Register button
- [ ] Modal opens
- [ ] Fill form completely
- [ ] Submit
- [ ] See success message
- [ ] Check Supabase Table Editor
- [ ] Registration appears in table ✓

### If Still Not Working:

1. **Clear browser cache:**
   - Ctrl+Shift+Del (Windows)
   - Cmd+Shift+Del (Mac)
   - Check "Cached files"
   - Clear and reload

2. **Check file paths:**
   ```
   ✓ index.html
   ✓ config.js (same folder as index.html)
   ✓ script.js (same folder as index.html)
   ✓ styles.css (same folder as index.html)
   ```

3. **Verify credentials format:**
   ```javascript
   // Correct:
   window.SUPABASE_URL = 'https://abc.supabase.co';

   // Wrong (extra quotes):
   window.SUPABASE_URL = '"https://abc.supabase.co"';

   // Wrong (extra spaces):
   window.SUPABASE_URL = '  https://abc.supabase.co  ';
   ```

---

## Quick Fix Command

If you have your credentials, you can update config.js directly:

**Replace YOUR_URL and YOUR_KEY with actual values:**

```javascript
window.SUPABASE_URL = 'YOUR_URL';
window.SUPABASE_ANON_KEY = 'YOUR_KEY';
```

---

## Still Having Issues?

### Debug Mode:

Add this to browser console to check configuration:

```javascript
console.log('URL:', window.SUPABASE_URL);
console.log('Key:', window.SUPABASE_ANON_KEY ? 'Set ✓' : 'Missing ✗');
```

**Expected output:**
```
URL: https://your-project.supabase.co
Key: Set ✓
```

**If you see:**
```
URL:
Key: Missing ✗
```

Then config.js is not loaded or credentials are empty.

---

## Contact Support

If nothing works after following this guide:

1. **Check Supabase Status:** https://status.supabase.com
2. **Supabase Discord:** https://discord.supabase.com
3. **Check browser console** for specific error messages

---

**Last Updated:** November 2024
