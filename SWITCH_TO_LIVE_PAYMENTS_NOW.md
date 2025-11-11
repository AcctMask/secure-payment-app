# 🚀 Switch to LIVE Payments - Step by Step

## Why You're Seeing Test Mode

Your `.env.local` file either:
- Doesn't have `VITE_STRIPE_PUBLISHABLE_KEY` set, OR
- Has a TEST key (`pk_test_...`) instead of LIVE key (`pk_live_...`)

---

## ✅ Step 1: Get Your LIVE Stripe Keys

1. Go to: https://dashboard.stripe.com/apikeys
2. **Toggle OFF "Test mode"** (switch in top right corner)
3. Copy your **Publishable key** (starts with `pk_live_...`)

---

## ✅ Step 2: Get Your LIVE Price IDs

1. Go to: https://dashboard.stripe.com/products
2. Make sure you're in **LIVE mode** (not test mode)
3. Create two products if you haven't:
   - **Premium** - $29.99/month
   - **Professional** - $49.99/month
4. Click each product → Copy the **Price ID** (starts with `price_...`)

---

## ✅ Step 3: Update Your .env.local File

Open `.env.local` in your project root and add/update:

```env
# Stripe LIVE Keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY_HERE

# Stripe LIVE Price IDs
VITE_STRIPE_PREMIUM_PRICE_ID=price_YOUR_PREMIUM_PRICE_ID
VITE_STRIPE_PRO_PRICE_ID=price_YOUR_PRO_PRICE_ID

# Supabase (if not already set)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## ✅ Step 4: Restart Your Dev Server

1. Stop the server (Ctrl+C in terminal)
2. Start it again:
   ```bash
   npm run dev
   ```

---

## ✅ Step 5: Test LIVE Payment

1. Open http://localhost:5173
2. Click "Join Premium"
3. You should now see:
   - ✅ Email input field
   - ✅ "Subscribe $29.99/mo" button
   - ✅ "You'll be redirected to Stripe's secure checkout page"
   - ❌ NO "Test Mode" warning

4. Enter your email and click Subscribe
5. You'll be redirected to Stripe Checkout (real payment page)

---

## 🎯 Success Checklist

- [ ] Stripe dashboard is in LIVE mode (toggle off test mode)
- [ ] `.env.local` has `pk_live_...` key
- [ ] `.env.local` has live price IDs
- [ ] Dev server restarted
- [ ] No "Test Mode" warning appears
- [ ] Redirects to Stripe Checkout page

---

## ⚠️ Important Notes

1. **LIVE mode = REAL MONEY**: Any payments will charge real credit cards
2. **Test your flow first**: Use test mode to verify everything works
3. **Stripe fees apply**: 2.9% + $0.30 per successful charge
4. **Activate your account**: Stripe may require business verification for live payments

---

## 🆘 Still Seeing Test Mode?

Check browser console (F12):
- Look for: `🔑 Stripe Key Check:`
- Should show: `isLive: true`
- If `isLive: false`, your key is still a test key

Make sure your `.env.local` key starts with `pk_live_` NOT `pk_test_`
