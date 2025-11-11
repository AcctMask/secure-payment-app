# Setup Frontend Environment Variables

## Current Status
Your **Supabase Edge Functions** have the secrets configured (backend is ready), but your **frontend** needs these values too.

## The Issue
- ✅ Supabase secrets are set (for edge functions)
- ❌ Frontend `.env.local` file needs the **actual Stripe values** (not the encrypted hashes)

## What You Need To Do

### 1. Get Your Actual Stripe Values
Go to https://dashboard.stripe.com and get:

**Publishable Key** (Developers → API Keys)
- Starts with `pk_test_...` (test mode) or `pk_live_...` (live mode)

**Price IDs** (Products → Click product → Copy Price ID)
- Premium Price ID: starts with `price_...`
- Pro Price ID: starts with `price_...`

### 2. Create `.env.local` File
In your project root, create `.env.local` with:

```bash
# Supabase (from dashboard → Settings → API)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...your-anon-key

# Stripe (from dashboard → Developers → API Keys)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...your-key

# Stripe Price IDs (from Products page)
VITE_STRIPE_PREMIUM_PRICE_ID=price_...premium
VITE_STRIPE_PRO_PRICE_ID=price_...pro
```

### 3. Restart Dev Server
```bash
npm run dev
```

### 4. Test Again
Click "Test Edge Function" - it should now make real API calls!

## Why This Is Needed
- **Supabase Secrets** = Used by edge functions (backend)
- **Frontend .env.local** = Used by React app (frontend)
- Both need the values, but frontend needs the ACTUAL Stripe keys (not encrypted)
