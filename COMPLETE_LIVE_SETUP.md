# 🎯 COMPLETE LIVE PAYMENT SETUP

## Your Current Status
✅ Publishable Key: `pk_live_51S8o3LCYgC6lPmKTNY1CENG99QbfLTOhuYR2nrLxrDy9aVqUrbCpwLGj8CNcw0Qflw31hRCGr4szDFDk1H3bPCuV00ySnstNru`

❌ Missing: Secret Key and Price IDs

---

## 🚨 STEP 1: Get Your SECRET Key (CRITICAL)

**The "string pattern" error means your SECRET key is wrong or missing.**

1. Open: https://dashboard.stripe.com/apikeys
2. Look for "Secret key" section
3. Click **"Reveal live key token"**
4. Copy the ENTIRE key (starts with `sk_live_`)
5. It should be ~100+ characters long

⚠️ **IMPORTANT**: 
- Use `sk_live_` NOT `pk_live_`
- Don't share this key publicly
- Make sure there are NO spaces

---

## 🚨 STEP 2: Get Your PRICE IDs

1. Go to: https://dashboard.stripe.com/products
2. If you don't have products yet, create them:
   - Click "Add product"
   - Name: "Basic Membership"
   - Price: $9.99/month (or your price)
   - Click "Save product"
   - Copy the **Price ID** (starts with `price_`)
3. Repeat for Premium tier
4. **CRITICAL**: Use Price IDs (start with `price_`), NOT Product IDs (start with `prod_`)

---

## 🚨 STEP 3: Update .env.local File

Open `.env.local` in your project root and fill in:

```bash
# Stripe Live Keys
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51S8o3LCYgC6lPmKTNY1CENG99QbfLTOhuYR2nrLxrDy9aVqUrbCpwLGj8CNcw0Qflw31hRCGr4szDFDk1H3bPCuV00ySnstNru
VITE_STRIPE_SECRET_KEY=sk_live_PASTE_YOUR_SECRET_KEY_HERE

# Stripe Price IDs
VITE_STRIPE_BASIC_PRICE_ID=price_PASTE_YOUR_BASIC_PRICE_ID
VITE_STRIPE_PREMIUM_PRICE_ID=price_PASTE_YOUR_PREMIUM_PRICE_ID

# Supabase (keep your existing values)
VITE_SUPABASE_URL=your_existing_url
VITE_SUPABASE_ANON_KEY=your_existing_key
```

---

## 🚨 STEP 4: Deploy Secret to Supabase

Run this in your terminal (replace with YOUR secret key):

```bash
npx supabase secrets set STRIPE_SECRET_KEY=sk_live_YOUR_ACTUAL_SECRET_KEY_HERE
```

---

## 🚨 STEP 5: Restart Server

```bash
# Press Ctrl+C to stop server
rm -rf node_modules/.vite dist
npm run dev
```

---

## ✅ STEP 6: Test

1. Open your app
2. Go to System Readiness page
3. Click "Test $1 Transaction"
4. Should see "Transaction Capability Confirmed"

---

## 🔍 Troubleshooting

### Still getting "string pattern" error?

**Check these:**
1. Secret key starts with `sk_live_` (not `pk_live_`)
2. No spaces or line breaks in the key
3. Key is in `.env.local` file in project root
4. Server was restarted after changes
5. Browser cache cleared (Ctrl+Shift+R)

### Error: "No such price"?

**Check these:**
1. Price IDs start with `price_` (not `prod_`)
2. Prices exist in your Stripe dashboard
3. Prices are in LIVE mode (not test mode)

---

## 📋 Final Checklist

- [ ] Got secret key from Stripe dashboard
- [ ] Created products with prices in Stripe
- [ ] Updated .env.local with all 4 values
- [ ] Ran supabase secrets set command
- [ ] Restarted dev server
- [ ] Cleared browser cache
- [ ] Tested $1 transaction successfully
