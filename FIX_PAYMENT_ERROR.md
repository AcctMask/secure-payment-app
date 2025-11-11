# Fix "Failed to send a request to the Edge Function" Error

## Problem
Your `.env.example` file has corrupted Supabase credentials. The payment is failing because it can't reach the Supabase Edge Function.

## Step 1: Get Your Real Supabase Credentials

1. Go to https://supabase.com/dashboard
2. Select your project (or create one if needed)
3. Go to **Settings** → **API**
4. Copy these values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)

## Step 2: Fix Your .env.example File

Replace lines 2-3 with your actual credentials:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 3: Deploy Edge Function to Supabase

```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the Edge Function
supabase functions deploy create-checkout-session
```

## Step 4: Set Stripe Secret in Supabase

1. Go to Supabase Dashboard → **Edge Functions** → **Secrets**
2. Add secret: `STRIPE_SECRET_KEY`
3. Value: Your Stripe secret key (starts with `sk_live_`)

## Step 5: Update Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Update/add these:
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key
   - `VITE_STRIPE_PUBLISHABLE_KEY` = Your Stripe publishable key
   - `VITE_STRIPE_PREMIUM_PRICE_ID` = `price_1SEEYgCYgC6lPmKTgZSTYJMq`
   - `VITE_STRIPE_PRO_PRICE_ID` = `price_1SEEazCYgC6lPmKTc2wZ6yYM`

## Step 6: Redeploy

```bash
vercel --prod
```

## Quick Test

After redeploying, check browser console for:
```
🔑 Stripe Key Check: { keyExists: true, isLive: true }
```

If you see this, Stripe is configured. The payment should now work!
