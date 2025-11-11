# FIX SUPABASE CONFIGURATION NOW

## The Problem
You're seeing "Supabase Not Configured" because the `.env.local` file doesn't exist or the variables aren't set correctly.

## STEP-BY-STEP FIX

### Step 1: Create .env.local File
In your project root directory (same folder as package.json), create a file named `.env.local`

### Step 2: Get Your Supabase Credentials
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click on **Settings** (gear icon in sidebar)
4. Click on **API**
5. You'll see:
   - **Project URL** (copy this)
   - **anon public** key (copy this)

### Step 3: Add to .env.local
Open `.env.local` and paste:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**IMPORTANT**: Replace with YOUR actual values from Supabase dashboard!

### Step 4: Restart Dev Server
```bash
# Stop the server (Ctrl+C)
# Then restart:
npm run dev
```

## Quick Check
After restart, the red error banner should disappear if configured correctly.

## Still Not Working?

### Check 1: File Location
Make sure `.env.local` is in the ROOT directory:
```
your-project/
├── .env.local          ← HERE (same level as package.json)
├── package.json
├── src/
└── ...
```

### Check 2: Variable Names
Must be EXACTLY:
- `VITE_SUPABASE_URL` (not SUPABASE_URL)
- `VITE_SUPABASE_ANON_KEY` (not SUPABASE_KEY)

### Check 3: No Spaces
```
CORRECT:   VITE_SUPABASE_URL=https://...
WRONG:     VITE_SUPABASE_URL = https://...
```

### Check 4: Restart Required
Environment variables only load when server starts. You MUST restart after changes.

## Next Steps After This Works
1. Add Stripe keys to same file
2. Test membership purchase
3. Start testing with your personal credit card
