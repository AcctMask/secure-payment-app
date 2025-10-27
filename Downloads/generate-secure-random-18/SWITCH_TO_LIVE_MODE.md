# 🚀 Switch to LIVE MODE on Vercel

## The Issue
You're seeing "Test Mode - Use these test card details" because your **Vercel deployment** is either:
1. Missing the `VITE_STRIPE_PUBLISHABLE_KEY` environment variable, OR
2. Using a TEST key (`pk_test_...`) instead of a LIVE key (`pk_live_...`)

---

## ✅ SOLUTION: Set Live Keys on Vercel

### Step 1: Get Your LIVE Stripe Keys

1. Go to https://dashboard.stripe.com/apikeys
2. **IMPORTANT:** Toggle to **LIVE MODE** (top right corner - should say "Viewing live data")
3. Copy your **Publishable key** (starts with `pk_live_`)

### Step 2: Update Vercel Environment Variables

1. Go to https://vercel.com/dashboard
2. Select your project: **generate-secure-random**
3. Click **Settings** → **Environment Variables**
4. Find or add these variables:

```
VITE_STRIPE_PUBLISHABLE_KEY = pk_live_YOUR_LIVE_KEY_HERE
VITE_STRIPE_PREMIUM_PRICE_ID = price_YOUR_PREMIUM_PRICE_ID
VITE_STRIPE_PRO_PRICE_ID = price_YOUR_PRO_PRICE_ID
```

**CRITICAL:** Make sure the key starts with `pk_live_` NOT `pk_test_`

### Step 3: Redeploy

After setting the variables:
1. Go to **Deployments** tab
2. Click the **three dots (•••)** on the latest deployment
3. Click **Redeploy**
4. Wait 1-2 minutes for deployment to complete

---

## 🎯 How to Remove Test Card Instructions

The test card instructions are hardcoded in the payment form. To remove them:

**Option A: Hide them in production** (recommended)
- The test card section will only show if using test keys

**Option B: Remove them completely**
- I can remove the test card instructions section from the code

Would you like me to remove the test card instructions from the payment form?

---

## ✅ Verification Checklist

After redeploying, visit your site and check:

- [ ] No "Test Mode" warning appears
- [ ] Payment form shows Stripe Elements (card input field)
- [ ] No test card numbers displayed
- [ ] When you click "Choose Premium", it shows real Stripe checkout

---

## 🔍 Quick Debug

Open browser console (F12) on your deployed site and look for:
```
✅ Stripe configured with valid key: pk_live_...
```

If you see:
```
⚠️ No Stripe publishable key found
```

Then the environment variable isn't set correctly on Vercel.
