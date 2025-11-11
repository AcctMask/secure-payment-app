# 🔥 IMMEDIATE FIX FOR STRIPE ERROR

## The Problem
You're getting "string did not match expected pattern" because the Stripe keys in .env.local are PLACEHOLDERS, not real keys.

## 🚨 QUICK FIX - Choose Option A or B:

---

## Option A: Use the Setup Script (RECOMMENDED)

```bash
# Run the interactive setup
node scripts/setup-stripe.js
```

Follow the prompts to enter your real Stripe keys.

---

## Option B: Manual Fix

### 1. Get Your REAL Stripe Keys

Go to: https://dashboard.stripe.com/apikeys

Copy these values:
- **Publishable key**: starts with `pk_live_` (or `pk_test_` for testing)
- **Secret key**: starts with `sk_live_` (or `sk_test_` for testing)

### 2. Get Your Price IDs

Go to: https://dashboard.stripe.com/products

Create two products if you haven't:
- Premium Membership - $29.99/month
- Professional Membership - $49.99/month

Copy the Price IDs (start with `price_`)

### 3. Edit .env.local

```bash
# Open the file
nano .env.local
```

Replace ALL placeholder values with your REAL keys:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_[YOUR_REAL_KEY_HERE]
VITE_STRIPE_SECRET_KEY=sk_live_[YOUR_REAL_SECRET_HERE]
VITE_STRIPE_PREMIUM_PRICE_ID=price_[YOUR_REAL_PRICE_ID]
VITE_STRIPE_PRO_PRICE_ID=price_[YOUR_REAL_PRICE_ID]
```

### 4. Update Supabase Edge Function

```bash
# Set the secret in Supabase
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_[YOUR_REAL_SECRET]
```

### 5. Restart Everything

```bash
# Stop server (Ctrl+C), then:
rm -rf node_modules/.vite
npm run dev
```

---

## 🧪 TEST MODE FIRST (If you don't have live keys)

Use test keys to verify everything works:

1. Get test keys from Stripe Dashboard (toggle "Test mode")
2. Use test price IDs or create test products
3. Use test card: `4242 4242 4242 4242`

---

## ✅ Success Indicators

After fixing, you should see in browser console:
- "✅ Stripe configured successfully"
- "🔐 Mode: LIVE" (or TEST)
- No red errors about invalid keys

## 🆘 Still Not Working?

1. Check browser console (F12) for exact error
2. Verify keys don't have extra spaces or quotes
3. Make sure you restarted the server
4. Clear browser cache (Ctrl+Shift+R)

## 📞 Emergency Support

If you see "Invalid API Key provided", your key format is wrong.
Keys MUST look exactly like:
- `pk_live_51PzaK...` (about 100+ characters)
- NOT `pk_live_1234567890...` (placeholder)