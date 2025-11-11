# Environment Variables Setup Guide

## Current Status
✅ Stripe Publishable Key - Added
⚠️ Supabase URL - Needs real value
⚠️ Supabase Anon Key - Needs real value
⚠️ Stripe Price IDs - Need to be created

## Step 1: Get Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Select your project (or create one)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJ...`)

Replace in `.env.local`:
```
VITE_SUPABASE_URL=https://your-actual-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...your_actual_key
```

## Step 2: Create Stripe Products & Get Price IDs

1. Go to https://dashboard.stripe.com/products
2. Click **+ Add product**
3. Create two products:
   - **Premium** (e.g., $29/month)
   - **Pro** (e.g., $49/month)
4. After creating, copy the **Price ID** (starts with `price_`)

Replace in `.env.local`:
```
VITE_STRIPE_PREMIUM_PRICE_ID=price_1abc123...
VITE_STRIPE_PRO_PRICE_ID=price_1xyz789...
```

## Step 3: Restart Dev Server

After updating `.env.local`:
```bash
# Stop current server (Ctrl+C)
npm run dev
```

## Step 4: Verify

Run diagnostics again to verify all values are correct.

## Note on Encrypted Values
The values in `.env.example` appear to be encrypted/hashed. You need the actual decrypted values from your Supabase and Stripe dashboards.
