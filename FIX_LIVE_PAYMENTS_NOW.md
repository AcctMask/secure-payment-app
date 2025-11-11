# 🚨 FIX LIVE PAYMENTS NOW - Step by Step

## The Problem
You're getting "string pattern" error because:
1. Your SECRET key is missing or in wrong format
2. Your PRICE IDs are missing or in wrong format

## ✅ STEP 1: Get Your Stripe Secret Key

1. Go to: https://dashboard.stripe.com/apikeys
2. Find "Secret key" section (NOT publishable key)
3. Click "Reveal live key token"
4. Copy the key that starts with `sk_live_`

## ✅ STEP 2: Get Your Price IDs

1. Go to: https://dashboard.stripe.com/products
2. Click on your membership product
3. Copy the Price ID (starts with `price_`)
4. Do this for BOTH Basic and Premium tiers

## ✅ STEP 3: Update .env.local File

Open `.env.local` in your project root and replace:

```
VITE_STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_SECRET_KEY_HERE
VITE_STRIPE_BASIC_PRICE_ID=price_YOUR_ACTUAL_BASIC_PRICE_ID
VITE_STRIPE_PREMIUM_PRICE_ID=price_YOUR_ACTUAL_PREMIUM_PRICE_ID
```

## ✅ STEP 4: Update Supabase Edge Function

Run this command:
```bash
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_SECRET_KEY_HERE
```

## ✅ STEP 5: Restart Everything

```bash
# Stop server (Ctrl+C)
rm -rf node_modules/.vite
npm run dev
```

## ✅ STEP 6: Test $1 Transaction

1. Go to System Readiness page
2. Click "Test $1 Transaction"
3. Use test card: 4242 4242 4242 4242
4. Should now work!

## 🔴 CRITICAL CHECKLIST

- [ ] Secret key starts with `sk_live_` (NOT `pk_live_`)
- [ ] Price IDs start with `price_` (NOT `prod_`)
- [ ] No spaces in the keys
- [ ] Keys are in .env.local file
- [ ] Server restarted after changes
