# 🎯 Stripe Price ID Setup Guide

## What Are Price IDs?

Price IDs are unique identifiers for subscription products in Stripe. They start with `price_` and are different from Product IDs.

## Step-by-Step Setup

### 1. Create Products in Stripe Dashboard

1. Go to: https://dashboard.stripe.com/products
2. **Switch to LIVE mode** (toggle in top-right)
3. Click **"+ Add product"**

#### Create Premium Product:
- **Name**: Premium Membership
- **Description**: Unlimited secure purchases with virtual card generation
- **Pricing**: $29.99 / month (recurring)
- **Click "Save product"**
- **Copy the Price ID** (starts with `price_` NOT `price_test_`)

#### Create Pro Product:
- **Name**: Professional Membership  
- **Description**: Everything in Premium plus team collaboration
- **Pricing**: $49.99 / month (recurring)
- **Click "Save product"**
- **Copy the Price ID**

### 2. Add Price IDs to Vercel

1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add these variables:

```
VITE_STRIPE_PREMIUM_PRICE_ID=price_1234567890abcdef
VITE_STRIPE_PRO_PRICE_ID=price_0987654321fedcba
```

**IMPORTANT**: Use the LIVE Price IDs (not test mode)

### 3. Redeploy Your App

After adding the variables:
1. Go to Vercel Deployments tab
2. Click "Redeploy" on the latest deployment
3. Wait for deployment to complete

### 4. Verify Configuration

1. Visit your deployed app
2. Click **"🔍 Check Config"** button in navigation
3. Verify all checks show green ✅
4. Click **"Test Checkout Session"** to confirm it works

## Common Issues

### ❌ "Price IDs not configured"
- Make sure Price IDs don't contain "REPLACE_ME" or placeholder text
- Verify they start with `price_` (not `prod_`)
- Check you're using LIVE mode Price IDs

### ❌ "Stripe checkout failed"
- Verify `STRIPE_SECRET_KEY` is set in Supabase (not Vercel)
- Make sure it's the LIVE secret key (`sk_live_...`)
- Check Supabase Edge Function logs for errors

### ❌ "Invalid price ID"
- Confirm the Price ID exists in your Stripe account
- Make sure you're in LIVE mode (not test mode)
- Verify the Price ID is for a recurring subscription

## Environment Variables Checklist

### Vercel (Frontend):
- ✅ `VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...`
- ✅ `VITE_STRIPE_PREMIUM_PRICE_ID=price_...`
- ✅ `VITE_STRIPE_PRO_PRICE_ID=price_...`
- ✅ `VITE_SUPABASE_URL=https://...supabase.co`
- ✅ `VITE_SUPABASE_ANON_KEY=eyJ...`

### Supabase (Backend):
- ✅ `STRIPE_SECRET_KEY=sk_live_...`
- ✅ `STRIPE_WEBHOOK_SECRET=whsec_...`

## Testing the Setup

1. Click "Join Premium" button
2. Select a membership plan
3. Enter test email
4. Should redirect to Stripe Checkout page
5. Complete test purchase with test card: `4242 4242 4242 4242`

## Need Help?

- Check browser console for errors
- Use the "🔍 Check Config" diagnostic tool
- Review Supabase Edge Function logs
- Verify all environment variables are set correctly
