# 🔴 LIVE MODE ACTIVATION CHECKLIST

## ❌ ISSUE: "Test Mode" Warning Appearing

You're seeing the test mode message because the **frontend** doesn't have the required Stripe environment variables in Vercel.

---

## ✅ STEP-BY-STEP FIX

### **Step 1: Get Live Stripe Keys** (2 minutes)

1. Go to https://dashboard.stripe.com/apikeys
2. **Toggle to LIVE MODE** (top right corner - should NOT say "Test mode")
3. Copy your **Publishable key** (starts with `pk_live_`)
4. Keep this tab open

### **Step 2: Create Live Price IDs** (3 minutes)

1. Go to https://dashboard.stripe.com/products
2. **Ensure you're in LIVE MODE** (top right)
3. Click **+ Add product**
4. Create Premium membership:
   - Name: `Premium Membership`
   - Price: `$29.99` (or your price)
   - Billing: `Recurring` → `Monthly`
   - Click **Save product**
   - **COPY the Price ID** (starts with `price_` - NOT `price_test_`)
5. Repeat for Pro membership:
   - Name: `Professional Membership`
   - Price: `$49.99` (or your price)
   - **COPY the Price ID**

### **Step 3: Add Variables to Vercel** (3 minutes)

1. Go to https://vercel.com/dashboard
2. Select your project (sp4all or securepurchase)
3. Click **Settings** → **Environment Variables**
4. Add these THREE variables:

```
VITE_STRIPE_PUBLISHABLE_KEY = pk_live_YOUR_KEY_HERE
VITE_STRIPE_PREMIUM_PRICE_ID = price_YOUR_PREMIUM_PRICE_ID
VITE_STRIPE_PRO_PRICE_ID = price_YOUR_PRO_PRICE_ID
```

5. **IMPORTANT:** Set environment to **Production, Preview, and Development**
6. Click **Save** for each

### **Step 4: Redeploy** (1 minute)

1. In Vercel dashboard, go to **Deployments**
2. Click the **...** menu on latest deployment
3. Click **Redeploy**
4. Wait 1-2 minutes for deployment to complete

### **Step 5: Clear Cache & Test** (1 minute)

1. Open your site in **Incognito/Private window**
2. Click "Get Real Membership Now"
3. Click "Choose Premium"
4. You should now see:
   - ✅ Email input field
   - ✅ "Subscribe $29.99/mo" button
   - ✅ "You'll be redirected to Stripe's secure checkout page"
   - ❌ NO "Test Mode" warning

---

## 🎯 WHAT HAPPENS AFTER FIX

### Before (Test Mode):
- Shows "Test Mode - Use these test card details"
- Manual form with card input
- Only accepts 4242 4242 4242 4242

### After (Live Mode):
- Shows email input only
- Redirects to **Stripe Checkout** (official Stripe page)
- Accepts **REAL credit cards**
- **REAL charges will be made**

---

## ⚠️ CRITICAL WARNINGS

### Once Live Mode is Active:

1. **Real Money:** All transactions will charge real credit cards
2. **Real Charges:** You will be charged Stripe fees (2.9% + $0.30)
3. **Test Carefully:** Start with the smallest amount possible
4. **Refund Ready:** Know how to refund in Stripe Dashboard

### How to Refund a Test Payment:
1. Go to https://dashboard.stripe.com/payments
2. Click the payment
3. Click **Refund**
4. Enter amount → **Refund**

---

## 🔍 VERIFICATION STEPS

After completing Steps 1-5, verify:

```
✅ Vercel shows 3 environment variables starting with VITE_
✅ VITE_STRIPE_PUBLISHABLE_KEY starts with pk_live_
✅ Both Price IDs start with price_ (NOT price_test_)
✅ Site loads without errors
✅ "Get Real Membership" button works
✅ NO "Test Mode" warning appears
✅ Shows "Redirecting to Stripe..." button
```

---

## 📞 TROUBLESHOOTING

### Still seeing "Test Mode"?
- Clear browser cache (Ctrl+Shift+Delete)
- Open in Incognito window
- Check Vercel deployment logs for errors
- Verify all 3 VITE_ variables are set

### "Stripe Price IDs not configured" error?
- Price IDs still contain "REPLACE_ME" or "1234567890"
- Go back to Step 2 and get real Price IDs from Stripe

### Redirects but shows error?
- Check Supabase Edge Function has STRIPE_SECRET_KEY
- Verify webhook is configured (see STRIPE_WEBHOOK_SETUP.md)

---

## 🎉 SUCCESS INDICATORS

You'll know it's working when:
1. No test mode warning appears
2. Click "Subscribe" → Redirects to stripe.com checkout page
3. Real card details can be entered
4. Payment processes and charges real money
5. Webhook creates virtual card in database

---

## 🚨 EMERGENCY: SWITCH BACK TO TEST MODE

If you need to stop live payments immediately:

1. Go to Vercel → Settings → Environment Variables
2. Delete or change `VITE_STRIPE_PUBLISHABLE_KEY` to test key (`pk_test_`)
3. Redeploy
4. Site will revert to test mode

---

**Next Step:** Complete Step 1 above and work through each step carefully.
