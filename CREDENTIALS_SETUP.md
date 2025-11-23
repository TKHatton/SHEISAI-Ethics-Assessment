# Supabase Credentials Setup Guide
## Getting Your API Keys and Configuring the Website

This guide shows you exactly where to find your Supabase credentials and how to add them to your website.

---

## Overview

You need TWO pieces of information:
1. **Project URL** - The web address of your Supabase project
2. **Anon Public Key** - The API key for frontend access (safe to expose)

---

## Step 1: Navigate to API Settings

### In Your Supabase Dashboard:

1. **Open your project**
   - Go to: https://app.supabase.com
   - Click on your project: "SHE-IS-AI-Ethics-Training"

2. **Click Settings (⚙️)**
   - Look in the left sidebar
   - At the bottom, click the **gear icon (⚙️)**
   - Or click the word **"Settings"**

3. **Click "API"**
   - In the settings menu, click **"API"**
   - This opens the API settings page

---

## Step 2: Find Your Project URL

### Location on Page:
Look for the section titled: **"Configuration"** or **"Project URL"**

### It looks like:
```
Project URL
https://abcdefghijklmnop.supabase.co

[Copy icon]
```

### Action:
1. Click the **copy icon** next to the URL
2. Paste it somewhere safe (you'll need it in a moment)

### Example:
```
https://xyzcompany.supabase.co
```

**Note:** Your URL will be different - it includes your project's unique identifier.

---

## Step 3: Find Your Anon Public Key

### Location on Page:
Scroll down to the section titled: **"Project API keys"**

### You'll see TWO keys:

#### ✅ anon public (This is what you need)
```
anon
public

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDUxMjAwMCwiZXhwIjoxOTQ2MDg4MDAwfQ.abc123def456...

[Copy icon]
```

#### ❌ service_role secret (DO NOT USE THIS)
```
service_role
secret

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

[Copy icon]
```

### Action:
1. Find the key labeled: **"anon" "public"**
2. Click the **copy icon** next to it
3. Paste it somewhere safe

### Important Notes:
- ✅ The **anon public** key is SAFE to expose in your frontend code
- ❌ NEVER use the **service_role** key in frontend code (it's a secret admin key)
- The anon key always starts with: `eyJ...`
- It's very long (100+ characters)

---

## Step 4: Add Credentials to config.js

### Open Your config.js File:

**File Location:** `config.js` in your project root folder

### Find These Lines:
```javascript
// Replace these with your actual Supabase credentials
window.SUPABASE_URL = '';  // e.g., 'https://abcdefgh.supabase.co'
window.SUPABASE_ANON_KEY = '';  // Your Supabase anon/public key
```

### Paste Your Credentials:
```javascript
// Replace these with your actual Supabase credentials
window.SUPABASE_URL = 'https://xyzcompany.supabase.co';  // ← Paste your Project URL here
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDUxMjAwMCwiZXhwIjoxOTQ2MDg4MDAwfQ.abc123def456';  // ← Paste your anon public key here
```

### Complete Example:
```javascript
/**
 * SHE IS AI Ethics Training - Configuration
 */

// Replace these with your actual Supabase credentials
window.SUPABASE_URL = 'https://xyzcompany.supabase.co';
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDUxMjAwMCwiZXhwIjoxOTQ2MDg4MDAwfQ.abc123def456';
```

### Save the File!
- Make sure to **save** config.js after adding your credentials

---

## Step 5: Verify Configuration

### Check index.html:

Make sure config.js is included in your HTML **before** script.js:

```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="config.js"></script>  <!-- ← This must come BEFORE script.js -->
<script defer src="script.js"></script>
```

**Order matters!**
1. Supabase library
2. config.js (your credentials)
3. script.js (uses the credentials)

---

## Step 6: Test Your Configuration

### Method 1: Browser Console Test

1. **Open your website**
2. **Press F12** (or right-click → "Inspect")
3. **Go to Console tab**
4. **Type:**
   ```javascript
   console.log(window.SUPABASE_URL);
   console.log(window.SUPABASE_ANON_KEY);
   ```
5. **Press Enter**

**Expected output:**
```
https://xyzcompany.supabase.co
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**If you see "undefined":**
- config.js is not loaded
- Check that config.js is in the correct location
- Check that it's included in index.html

### Method 2: Test Registration

1. **Click a "Register" button**
2. **Fill out the form**
3. **Submit**
4. **Check Supabase:**
   - Go to Supabase Dashboard
   - Table Editor → registrations
   - You should see your test registration!

**If you see an error:**
- Check browser console (F12)
- Verify credentials are correct
- See troubleshooting below

---

## Common Mistakes & How to Fix Them

### Mistake 1: Extra Quotes
❌ **Wrong:**
```javascript
window.SUPABASE_URL = '"https://xyzcompany.supabase.co"';
```

✅ **Correct:**
```javascript
window.SUPABASE_URL = 'https://xyzcompany.supabase.co';
```

### Mistake 2: Extra Spaces
❌ **Wrong:**
```javascript
window.SUPABASE_ANON_KEY = '  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  ';
```

✅ **Correct:**
```javascript
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### Mistake 3: Using service_role Key
❌ **Wrong:**
```javascript
// This is the SECRET admin key - never use in frontend!
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjMwNTEyMDAwLCJleHAiOjE5NDYwODgwMDB9...';
```

✅ **Correct:**
```javascript
// This is the PUBLIC key - safe to use in frontend
window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDUxMjAwMCwiZXhwIjoxOTQ2MDg4MDAwfQ...';
```

**How to tell the difference:**
- anon key includes: `"role":"anon"`
- service_role key includes: `"role":"service_role"`

### Mistake 4: config.js Not Loaded
❌ **Wrong order in HTML:**
```html
<script defer src="script.js"></script>
<script src="config.js"></script>  <!-- TOO LATE! -->
```

✅ **Correct order:**
```html
<script src="config.js"></script>
<script defer src="script.js"></script>
```

---

## Security Best Practices

### ✅ Safe to Expose:
- `SUPABASE_URL` (public URL)
- `SUPABASE_ANON_KEY` (public key)
- These are designed to be used in frontend code

### ❌ Keep Secret:
- `SUPABASE_SERVICE_ROLE_KEY` (admin key)
- Database password
- Never commit these to public repositories

### Git Configuration:

If using Git, add this to `.gitignore`:
```
# Supabase credentials (if you want to keep them private)
config.js

# Environment files
.env
.env.local
```

**Note:** For many projects, it's fine to commit config.js with the anon key since it's designed to be public. However, you may want to keep it private for organizational reasons.

---

## Troubleshooting

### Error: "Invalid API key"
**Cause:** Wrong key copied or extra characters
**Fix:**
- Re-copy the anon public key from Supabase
- Check for extra spaces or quotes
- Verify it starts with `eyJ`

### Error: "Failed to fetch"
**Cause:** Wrong Project URL or network issue
**Fix:**
- Re-copy the Project URL from Supabase
- Ensure it starts with `https://`
- Check your internet connection

### Error: "supabase is not defined"
**Cause:** Supabase library not loaded
**Fix:**
- Check that Supabase CDN script is in index.html
- Ensure it loads before config.js

### Nothing happens when submitting form
**Cause:** config.js not loaded or credentials empty
**Fix:**
- Open browser console (F12)
- Look for errors
- Verify `window.SUPABASE_URL` is defined

---

## Next Steps

✅ Credentials configured? Great!

**Now:**
1. **Test the registration system** → See `TESTING_CHECKLIST.md`
2. **Deploy your website** → Upload all files to your web host
3. **Set up email confirmations** → See `EMAIL_AUTOMATION_GUIDE.md`

---

## Quick Reference Card

```
┌─────────────────────────────────────────┐
│  SUPABASE CREDENTIALS QUICK REFERENCE   │
├─────────────────────────────────────────┤
│                                         │
│  WHERE TO FIND:                         │
│  Supabase Dashboard → Settings → API   │
│                                         │
│  WHAT YOU NEED:                         │
│  1. Project URL                         │
│  2. anon public key                     │
│                                         │
│  WHERE TO PUT THEM:                     │
│  File: config.js                        │
│  Lines: window.SUPABASE_URL             │
│         window.SUPABASE_ANON_KEY        │
│                                         │
│  TESTING:                               │
│  F12 → Console → Check for errors       │
│  Submit test registration               │
│  Check Supabase Table Editor            │
│                                         │
└─────────────────────────────────────────┘
```

---

**Last Updated:** November 2024
**Difficulty:** Easy
**Time Required:** 5 minutes
