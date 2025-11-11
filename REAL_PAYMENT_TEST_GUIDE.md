# 💳 REAL CREDIT CARD PAYMENT TEST GUIDE

## ✅ You're Ready! Your App is Deployed

**Production URL:** https://secure-payment-5inermx81-secure-purchase.vercel.app  
**Custom Domain:** sp4all.com (SSL pending)

---

## 🎯 How to Test with REAL Credit Cards

### Step 1: Verify Vercel Has LIVE Stripe Keys

1. Go to: https://vercel.com/secure-purchase/secure-payment-app/settings/environment-variables
2. Check these 3 variables exist and are set to **Production**:
   - `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_live_...` (NOT pk_test_)
   - `VITE_STRIPE_PREMIUM_PRICE_ID` = `price_...` (from Stripe Products)
   - `VITE_STRIPE_PRO_PRICE_ID` = `price_...` (from Stripe Products)

3. If missing or wrong, add/update them:
   - Click **Add New**
   - Name: `VITE_STRIPE_PUBLISHABLE_KEY`
   - Value: Your `pk_live_...` key
   - Environment: Check **Production**, **Preview**, **Development**
   - Click **Save**

4. **CRITICAL:** After updating, click **Deployments** → **Redeploy** (latest deployment)

---

### Step 2: Get LIVE Price IDs from Stripe

1. Go to: https://dashboard.stripe.com/products
2. **Toggle to LIVE MODE** (top right - should NOT say "Test mode")
3. Create 2 products if they don't exist:
   - **Premium** - $29.99/month recurring
   - **Pro** - $49.99/month recurring
4. Click each product → Copy the **Price ID** (starts with `price_`, NOT `price_test_`)
5. Add these to Vercel (Step 1 above)

---

### Step 3: Set Supabase Secret Key

1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/secrets
2. Add secret:
   - Name: `STRIPE_SECRET_KEY`
   - Value: Your `sk_live_...` key (from Stripe Dashboard → API Keys → Secret key)
3. Click **Save**

---

### Step 4: Test the Flow

1. **Visit:** https://secure-payment-5inermx81-secure-purchase.vercel.app
2. **Click:** "Join Premium" button (top right)
3. **Select:** Premium ($29.99/mo) or Pro ($49.99/mo)
4. **Enter:** Your real email address
5. **Click:** "Subscribe $XX.XX/mo"
6. **You'll be redirected to Stripe Checkout** (stripe.com domain)
7. **Enter:** REAL credit card details
8. **Complete:** Payment on Stripe's secure page
9. **Redirected back** to your app with success message

---

## 🔍 What Happens Behind the Scenes

1. **Frontend** (RealMembershipModal.tsx):
   - Collects email and plan selection
   - Calls Supabase edge function

2. **Edge Function** (create-checkout-session):
   - Uses your LIVE secret key
   - Creates Stripe Checkout session
   - Returns redirect URL

3. **Stripe Checkout**:
   - Hosted by Stripe (secure, PCI compliant)
   - Processes REAL payment
   - Redirects back to your app

4. **Success Page**:
   - URL: `/?success=true&session_id=cs_...&membership=premium`
   - Shows success message

---

## ⚠️ IMPORTANT WARNINGS

### This Will Charge REAL Money
- All transactions are REAL
- You will be charged the subscription amount
- Cancel immediately in Stripe Dashboard if testing

### How to Refund Test Purchases
1. Go to: https://dashboard.stripe.com/payments
2. Find the payment
3. Click **⋯** → **Refund payment**
4. Enter amount → **Refund**

### How to Cancel Subscriptions
1. Go to: https://dashboard.stripe.com/subscriptions
2. Find the subscription
3. Click **⋯** → **Cancel subscription**
4. Confirm cancellation

---

## ✅ Success Checklist

After completing a purchase, verify:

- [ ] You were redirected to stripe.com checkout page
- [ ] Payment processed successfully
- [ ] Redirected back to your app with success message
- [ ] Payment appears in Stripe Dashboard → Payments
- [ ] Subscription appears in Stripe Dashboard → Subscriptions
- [ ] You received email receipt from Stripe

---

## 🐛 Troubleshooting

### "Stripe not configured" error
- Check Vercel env vars are set to Production
- Redeploy after updating variables
- Clear browser cache

### "Price ID not configured" error
- Ensure VITE_STRIPE_PREMIUM_PRICE_ID and VITE_STRIPE_PRO_PRICE_ID are set
- Ensure they start with `price_` (NOT `price_test_`)
- Ensure they're from LIVE mode in Stripe

### Redirects to test mode checkout
- Your publishable key is `pk_test_` instead of `pk_live_`
- Update to LIVE key in Vercel
- Redeploy

### Edge function error
- Check Supabase secrets have STRIPE_SECRET_KEY set
- Ensure it's the LIVE secret key (sk_live_)
- Check edge function logs in Supabase Dashboard

---

## 📊 Monitor Transactions

**Stripe Dashboard:** https://dashboard.stripe.com/payments  
**Supabase Logs:** https://supabase.com/dashboard/project/YOUR_PROJECT/logs

---

## 🎉 You're All Set!

Your app is configured for REAL payments. Visit your production URL and test the full flow with a real credit card.

**Remember:** All charges are REAL. Refund/cancel immediately if testing.
