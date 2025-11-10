# 🔍 LIVE MODE DIAGNOSTIC - Test Mode Warning Fix

## 🎯 THE ISSUE

You're seeing the **"Test Mode - Use these test card details"** warning because the app can't find `VITE_STRIPE_PUBLISHABLE_KEY` at runtime.

---

## ✅ STEP-BY-STEP FIX

### Step 1: Verify the Key Value in Vercel

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Find `VITE_STRIPE_PUBLISHABLE_KEY`
4. Click the **three dots (•••)** next to it → **Edit**
5. **CRITICAL CHECK:**
   - Does it start with `pk_live_` ? ✅ (LIVE MODE)
   - Does it start with `pk_test_` ? ❌ (TEST MODE - needs to be changed)
   - Is it empty or says "REPLACE_ME"? ❌ (needs actual key)

**If it's wrong:**
- Go to https://dashboard.stripe.com/apikeys
- Toggle to **LIVE MODE** (top right)
- Copy your **Publishable key** (starts with `pk_live_`)
- Paste it into Vercel

---

### Step 2: CRITICAL - Redeploy After Adding Variables

**Environment variables require a NEW deployment to take effect!**

1. Go to your Vercel project
2. Click **Deployments** tab
3. Find the latest deployment
4. Click **three dots (•••)** → **Redeploy**
5. Check **"Use existing Build Cache"** is OFF
6. Click **Redeploy**

**OR** trigger a new deployment:
```bash
# Make a small change and push
git commit --allow-empty -m "Trigger redeploy for env vars"
git push
```

---

### Step 3: Verify the Deployment

1. Wait for deployment to complete (2-3 minutes)
2. Open your site in **Incognito/Private window**
3. Click **"Get Real Membership Now"**
4. Click **"Choose Premium"**

**✅ SUCCESS INDICATORS:**
- NO "Test Mode" warning appears
- Shows email input field
- Button says "Subscribe $29.99/mo"
- Below button: "You'll be redirected to Stripe's secure checkout page"

**❌ STILL BROKEN:**
- Still shows "Test Mode - Use these test card details"
- Shows card number input fields
- Continue to Step 4

---

### Step 4: Check Browser Console for Errors

1. Open your site
2. Press **F12** (or Cmd+Option+I on Mac)
3. Click **Console** tab
4. Look for errors mentioning "VITE_STRIPE_PUBLISHABLE_KEY"
5. Take a screenshot and check if it says "undefined"

---

### Step 5: Verify All Required Variables

Make sure these are ALL set in Vercel:

```
✅ VITE_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
✅ VITE_STRIPE_PREMIUM_PRICE_ID=price_xxxxx (from Stripe Products)
✅ VITE_STRIPE_PRO_PRICE_ID=price_xxxxx (from Stripe Products)
✅ VITE_SUPABASE_URL=https://xxxxx.supabase.co
✅ VITE_SUPABASE_ANON_KEY=eyJxxxxx
```

**All should be set for "All Environments" (Production, Preview, Development)**

---

## 🧪 HOW TO TEST LIVE PAYMENTS

Once the test mode warning is gone:

1. Click "Get Real Membership Now"
2. Click "Choose Premium"
3. Enter your real email
4. Click "Subscribe $29.99/mo"
5. **You'll be redirected to checkout.stripe.com**
6. Enter a real credit card
7. Complete payment
8. You'll be redirected back to your site

**⚠️ WARNING: This will charge your card $29.99!**

---

## 🔧 TROUBLESHOOTING

### Still Seeing Test Mode After Redeploy?

**Clear your browser cache:**
1. Press **Ctrl+Shift+Delete** (Cmd+Shift+Delete on Mac)
2. Select "Cached images and files"
3. Clear cache
4. Try again in Incognito window

### Check if Variables Are Loading:

Add this temporarily to `src/components/RealMembershipModal.tsx` at line 15:

```typescript
console.log('Stripe Key:', stripeKey ? 'LOADED' : 'MISSING');
console.log('Premium Price ID:', import.meta.env.VITE_STRIPE_PREMIUM_PRICE_ID);
```

Then check browser console (F12) for output.

---

## 📊 WHAT'S HAPPENING BEHIND THE SCENES

```javascript
// In RealMembershipModal.tsx
const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

// If stripePromise is null → Shows SimplePaymentForm (test mode)
if (!stripePromise) {
  return <SimplePaymentForm ... /> // ❌ TEST MODE WARNING
}

// If stripePromise exists → Shows Stripe Checkout
return <StripeCheckoutButton ... /> // ✅ LIVE MODE
```

---

## ✅ SUCCESS CHECKLIST

- [ ] VITE_STRIPE_PUBLISHABLE_KEY starts with `pk_live_`
- [ ] Redeployed after setting variables
- [ ] Cleared browser cache
- [ ] Tested in Incognito window
- [ ] No "Test Mode" warning appears
- [ ] Shows "Redirecting to Stripe..." button
- [ ] Clicking button redirects to checkout.stripe.com

---

## 🆘 STILL NOT WORKING?

Share these details:
1. Screenshot of Vercel environment variables (hide the actual values)
2. Screenshot of the modal showing test mode warning
3. Browser console errors (F12 → Console tab)
4. Vercel deployment logs
