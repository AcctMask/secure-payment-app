# 🚀 Complete Stripe Setup Guide - Fix "String Pattern" Error

## ⚠️ IMPORTANT: This error means your Stripe keys are not properly configured

## Step 1: Get Your REAL Stripe Keys

1. **Go to Stripe Dashboard**
   - Visit: https://dashboard.stripe.com
   - Sign in to your account

2. **Get Your Live Keys**
   - Click "Developers" → "API keys"
   - Copy your **Live publishable key** (starts with `pk_live_`)
   - Copy your **Live secret key** (starts with `sk_live_`)

## Step 2: Create Your Price IDs

1. **In Stripe Dashboard**
   - Go to "Products" → "Add product"
   - Create "Premium Membership" - $29.99/month
   - Create "Professional Membership" - $49.99/month
   - Copy the Price IDs (start with `price_`)

## Step 3: Update Your .env.local File

```bash
# Edit the .env.local file with your ACTUAL keys
nano .env.local
```

Replace with your REAL values:
```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_ACTUAL_KEY_HERE
VITE_STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_SECRET_KEY_HERE
VITE_STRIPE_PREMIUM_PRICE_ID=price_YOUR_PREMIUM_PRICE_ID
VITE_STRIPE_PRO_PRICE_ID=price_YOUR_PRO_PRICE_ID
```

## Step 4: Update Supabase Edge Function

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Add Secret to Edge Functions**
   ```bash
   # In your terminal
   npx supabase secrets set STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_SECRET_KEY
   ```

## Step 5: Restart Everything

```bash
# 1. Stop the server (Ctrl+C)

# 2. Clear all caches
rm -rf node_modules/.vite
rm -rf dist
npm cache clean --force

# 3. Restart the server
npm run dev

# 4. Hard refresh browser
# Windows/Linux: Ctrl+Shift+R
# Mac: Cmd+Shift+R
```

## Step 6: Test the Payment

1. Open your app
2. Click "Become a Member"
3. Select a plan
4. Enter your email
5. You'll be redirected to Stripe Checkout

## 🔍 Debugging Checklist

- [ ] Keys start with `pk_live_` and `sk_live_` (not test keys)
- [ ] Price IDs start with `price_`
- [ ] No placeholder values like "1234567890"
- [ ] .env.local file exists in root directory
- [ ] Server was restarted after changes
- [ ] Browser cache was cleared

## 📝 Common Issues

### "String did not match pattern"
- Your Stripe key is invalid or malformed
- Check for extra spaces or quotes
- Ensure it's a live key, not test

### "No such price"
- Price ID doesn't exist in your Stripe account
- Create the products first in Stripe Dashboard

### "API key not found"
- Edge function can't access the secret
- Run: `npx supabase secrets set STRIPE_SECRET_KEY=your_key`

## 🚨 Emergency Fix

If nothing works, use this test mode temporarily:

1. Get TEST keys from Stripe (start with `pk_test_` and `sk_test_`)
2. Use test price IDs
3. Use test card: 4242 4242 4242 4242

## Need Help?

Check browser console for detailed error messages:
- Right-click → Inspect → Console tab
- Look for red error messages
- Share the exact error text