# Supabase Quick Start Guide
## Complete Setup in 15 Minutes

This guide will walk you through setting up Supabase from scratch to work with the SHE IS AI registration system.

---

## Step 1: Create Supabase Account (2 minutes)

1. **Go to Supabase:**
   - Visit: https://supabase.com
   - Click "Start your project"

2. **Sign Up:**
   - Choose sign-up method:
     - GitHub (recommended - fastest)
     - Email/Password
     - Google
   - Complete authentication

3. **Create Organization (if prompted):**
   - Organization Name: `SHE IS AI` (or your preference)
   - Click "Create Organization"

---

## Step 2: Create New Project (2 minutes)

1. **Click "New Project"**

2. **Fill in Project Details:**
   ```
   Name: SHE-IS-AI-Ethics-Training
   Database Password: [Generate a strong password - SAVE THIS]
   Region: Choose closest to your users
     - US East (Ohio) - for US East Coast
     - US West (Oregon) - for US West Coast
     - Europe (Ireland) - for European users
   Pricing Plan: Free (perfect for getting started)
   ```

3. **Click "Create new project"**
   - Wait 2-3 minutes for project provisioning
   - You'll see "Setting up project..." progress

4. **Project is Ready!**
   - You'll see the project dashboard when ready

---

## Step 3: Set Up Database Tables (3 minutes)

1. **Open SQL Editor:**
   - In your project, click **"SQL Editor"** in left sidebar
   - Or go to: `https://app.supabase.com/project/YOUR-PROJECT/sql`

2. **Create New Query:**
   - Click "+ New query" button

3. **Copy the SQL Script:**
   - Open the file: `database-schema-registration.sql`
   - Copy ALL the contents

4. **Paste and Run:**
   - Paste the SQL into the editor
   - Click **"Run"** button (bottom right)
   - You should see: "Success. No rows returned"

5. **Verify Tables Created:**
   - Click **"Table Editor"** in left sidebar
   - You should see these tables:
     - `registrations` ✓
     - `profiles` ✓
     - `assessment_attempts` ✓
     - `identity_alerts` ✓

---

## Step 4: Get Your Credentials (2 minutes)

1. **Open Project Settings:**
   - Click the **⚙️ Settings** icon (bottom left)
   - Click **"API"** in the settings menu

2. **Copy Your Credentials:**

   **Project URL:**
   ```
   https://abcdefghijklmnop.supabase.co
   ```
   - Click the copy icon next to "Project URL"
   - Save this - you'll need it!

   **API Keys - Find the "anon public" key:**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
   - Under "Project API keys"
   - Find the key labeled: **"anon" "public"**
   - Click the copy icon
   - Save this - you'll need it!

   ⚠️ **IMPORTANT:**
   - Copy the **"anon public"** key (safe to expose)
   - DO NOT use the **"service_role"** key (secret - never expose in frontend)

---

## Step 5: Configure Your Website (3 minutes)

1. **Open Your config.js File:**
   - File location: `config.js` in your project root

2. **Add Your Credentials:**
   ```javascript
   // Replace these with your actual Supabase credentials
   window.SUPABASE_URL = 'https://abcdefghijklmnop.supabase.co';  // Paste your Project URL
   window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';  // Paste your anon public key
   ```

3. **Save the File**

4. **Example (Filled Out):**
   ```javascript
   window.SUPABASE_URL = 'https://xyzcompany.supabase.co';
   window.SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emNvbXBhbnkiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYzMDUxMjAwMCwiZXhwIjoxOTQ2MDg4MDAwfQ.abc123def456';
   ```

---

## Step 6: Test the Registration System (3 minutes)

See **TESTING_CHECKLIST.md** for complete testing guide.

**Quick Test:**

1. **Open Your Website** (locally or deployed)

2. **Click a "Register" Button:**
   - Should open the registration modal

3. **Fill Out the Form:**
   ```
   Name: Test User
   Email: test@example.com
   Organization: Test Org
   Class: Choose any class
   ```

4. **Submit:**
   - Should see success message
   - No errors in browser console (F12)

5. **Verify in Supabase:**
   - Go to Supabase project
   - Click **"Table Editor"** → **"registrations"**
   - You should see your test registration!

---

## ✅ Setup Complete!

You now have:
- ✅ Supabase account created
- ✅ Project configured
- ✅ Database tables set up
- ✅ Credentials configured
- ✅ Registration system working

---

## Next Steps

### 1. **Deploy Your Website**
Upload these files to your web host:
- `index.html`
- `styles.css`
- `script.js`
- `config.js` (with your credentials)
- `assets/` folder

### 2. **Set Up Email Confirmations (Optional)**
See **EMAIL_AUTOMATION_GUIDE.md** for:
- Manual email confirmations
- Automated email setup
- Email templates

### 3. **Monitor Registrations**
- Supabase Dashboard → Table Editor → registrations
- Export data: Click "..." → "Download as CSV"

---

## Common Issues & Solutions

### Issue: "Error: Invalid API key"
**Solution:**
- Check you copied the **"anon public"** key (not service_role)
- No extra spaces before/after the key in config.js
- Key should start with: `eyJ...`

### Issue: "Cannot read properties of undefined"
**Solution:**
- Make sure `config.js` is loaded BEFORE `script.js` in index.html
- Check browser console for specific errors

### Issue: Registration not appearing in Supabase
**Solution:**
- Check browser console (F12) for errors
- Verify credentials in config.js are correct
- Confirm SQL schema was run successfully

### Issue: "Row Level Security" error
**Solution:**
- The SQL script includes RLS policies
- Re-run the SQL from `database-schema-registration.sql`
- Or manually disable RLS (not recommended):
  ```sql
  ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;
  ```

---

## Support Resources

- **Supabase Documentation:** https://supabase.com/docs
- **Supabase Discord:** https://discord.supabase.com
- **SQL Schema File:** `database-schema-registration.sql`
- **Testing Guide:** `TESTING_CHECKLIST.md`
- **Email Setup:** `EMAIL_AUTOMATION_GUIDE.md`

---

## Security Notes

✅ **Safe to Commit to Git:**
- The SQL schema file
- index.html, styles.css, script.js

❌ **DO NOT Commit to Git:**
- config.js with real credentials (add to .gitignore)
- Any file with SUPABASE_SERVICE_ROLE_KEY

**Recommended .gitignore:**
```
config.js
.env
.env.local
```

---

**Setup Date:** November 2024
**Estimated Time:** 15 minutes
**Difficulty:** Beginner-Friendly
