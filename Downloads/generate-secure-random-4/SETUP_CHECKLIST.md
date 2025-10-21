# ✅ Real Money Payment Setup Checklist

## Status Overview

### ✅ COMPLETED
- [x] Stripe restricted key updated via CLI
- [x] Edge function fixed to accept Price IDs
- [x] Frontend updated to use environment variables
- [x] Validation added for missing configuration

### ⚠️ REQUIRED: Add Your Stripe Price IDs

**You need to complete these 3 steps:**

## Step 1: Create Stripe Products (5 minutes)

1. Go to: https://dashboard.stripe.com/products
2. Click **"+ Add product"**

**Premium Membership:**
- Name: `Premium Membership`
- Price: `$29.99`
- Billing: `Recurring` → `Monthly`
- Click **Save**
- **COPY THE PRICE ID** (starts with `price_`)

**Pro Membership:**
- Name: `Professional Membership`  
- Price: `$49.99`
- Billing: `Recurring` → `Monthly`
- Click **Save**
- **COPY THE PRICE ID**

## Step 2: Add to .env File

Add these lines to your `.env` file:
```bash
VITE_STRIPE_PREMIUM_PRICE_ID=price_YOUR_PREMIUM_ID_HERE
VITE_STRIPE_PRO_PRICE_ID=price_YOUR_PRO_ID_HERE
```

## Step 3: Redeploy Edge Function

```bash
npx supabase functions deploy create-checkout-session
```

---

## 🧪 Testing Real Payments

### Test Membership Purchase:
1. Click "Become a Member" button
2. Select Premium or Pro plan
3. Enter email address
4. Click "Subscribe"
5. You'll be redirected to Stripe Checkout
6. Use test card: `4242 4242 4242 4242`
7. Any future date, any CVC

### Test Secure Purchase:
⚠️ **Virtual cards require Stripe Issuing** (not available in all regions)

**Alternative:** The secure purchase feature will work once a member has an active subscription. It creates payment tokens that can be used for purchases.

---

## 🔍 Verify Setup

Run these checks:

```bash
# 1. Check environment variables
cat .env | grep STRIPE

# 2. Verify edge function is deployed
npx supabase functions list

# 3. Test edge function
curl -X POST https://YOUR_PROJECT.supabase.co/functions/v1/create-checkout-session \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"priceId":"YOUR_PREMIUM_PRICE_ID","email":"test@example.com","membershipType":"premium"}'
```

---

## ✅ When Complete

You'll have:
- ✅ Real money membership subscriptions
- ✅ Stripe Checkout integration
- ✅ Webhook handling for subscription events
- ✅ Member access control

**Provide your 2 Price IDs and I'll verify everything is working!**
