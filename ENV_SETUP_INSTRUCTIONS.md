# Fix "Failed to send a request to the Edge Function" Error

## Problem
The payment is failing because Supabase environment variables are not configured.

## Solution

### Step 1: Check Your .env.local File
Open the file at: `/Users/stephenpashoian/Desktop/secure-payment-app/.env.local`

It should contain:
```bash
VITE_SUPABASE_URL=https://ygongssudngqrseklkah.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_key_here
```

### Step 2: Get Your Supabase Keys
1. Go to: https://supabase.com/dashboard/project/ygongssudngqrseklkah/settings/api
2. Copy the **Project URL** (should be: https://ygongssudngqrseklkah.supabase.co)
3. Copy the **anon/public key** (starts with `eyJ...`)

### Step 3: Update .env.local
```bash
cd /Users/stephenpashoian/Desktop/secure-payment-app
nano .env.local
```

Paste your keys:
```bash
VITE_SUPABASE_URL=https://ygongssudngqrseklkah.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51Q8...
```

Save: Ctrl+O, Enter, Ctrl+X

### Step 4: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 5: Test
1. Open http://localhost:5174/
2. The red error banner should disappear
3. Try making a payment again

## What Changed
- Added better error handling in payment modal
- Added visual warning when Supabase is not configured
- Added console logging for debugging

## Still Having Issues?
Check browser console (F12) for detailed error messages.
