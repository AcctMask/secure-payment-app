# 🔴 ACTIVATE LIVE MODE - Final Steps

## ✅ You Have Your Live Key!
`pk_live_51S8o3LCYgC6lPmKTNY1CENG99QbfLTOhuYR2nrLxrDy9aVqUrbCpwLGj8CNcw0Qflw31hRCGr4szDFDk1H3bPCuV00ySnstNru`

---

## 🎯 STEP 1: Add to .env.local

**Open or create `.env.local` in your project root:**

```bash
# Stripe Live Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51S8o3LCYgC6lPmKTNY1CENG99QbfLTOhuYR2nrLxrDy9aVqUrbCpwLGj8CNcw0Qflw31hRCGr4szDFDk1H3bPCuV00ySnstNru

# Get these from Stripe Dashboard (LIVE MODE):
VITE_STRIPE_PREMIUM_PRICE_ID=price_YOUR_LIVE_PREMIUM_PRICE_ID
VITE_STRIPE_PRO_PRICE_ID=price_YOUR_LIVE_PRO_PRICE_ID

# Supabase (if you have these)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
```

---

## 🎯 STEP 2: Get Live Price IDs

1. Go to https://dashboard.stripe.com/products
2. **Toggle to LIVE MODE** (top right - should NOT say "Test mode")
3. Click on your **Premium** product → Copy Price ID
4. Click on your **Pro** product → Copy Price ID
5. Add both to `.env.local` above

**If you don't have products yet:**
- Create them in Live Mode
- Premium: $29.99/month recurring
- Pro: $49.99/month recurring

---

## 🎯 STEP 3: Restart Dev Server

**CRITICAL:** Vite only loads .env on startup!

```bash
# Stop your server (Ctrl+C in terminal)
# Then restart:
npm run dev
```

---

## 🎯 STEP 4: Test Live Mode

1. Open http://localhost:5173
2. Click "Join Premium" or "Get Real Membership"
3. **✅ SUCCESS:** Should show email input + "Subscribe $29.99/mo" button
4. **❌ STILL TEST MODE:** Check browser console (F12) for errors

---

## 🔍 VERIFY IT'S WORKING

**Open browser console (F12) and look for:**
```
🔑 Stripe Key Check: {
  keyExists: true,
  keyPrefix: "pk_live_",
  isLive: true,
  isTest: false
}
🔌 Stripe Promise: Created
```

**If you see "NULL - Will use fallback form":**
- Your .env.local is not being loaded
- Make sure file is named exactly `.env.local` (not .env)
- Restart server again

---

## 🚀 DEPLOY TO VERCEL

Once local works, update Vercel:

1. Go to https://vercel.com/dashboard
2. Select your project → Settings → Environment Variables
3. Add these 3 variables:
   - `VITE_STRIPE_PUBLISHABLE_KEY` = your live key
   - `VITE_STRIPE_PREMIUM_PRICE_ID` = your premium price ID
   - `VITE_STRIPE_PRO_PRICE_ID` = your pro price ID
4. Redeploy: Deployments → Click ⋯ → Redeploy

---

## ✅ SUCCESS CHECKLIST

- [ ] .env.local created with live keys
- [ ] Dev server restarted
- [ ] Browser console shows "isLive: true"
- [ ] No "Test Mode" warning appears
- [ ] Shows email input field
- [ ] Button says "Subscribe $29.99/mo"
- [ ] Vercel environment variables updated
- [ ] Production site redeployed

---

## 🆘 STILL NOT WORKING?

**Check these common issues:**

1. **File name wrong:** Must be `.env.local` (with the dot)
2. **Server not restarted:** Must stop and restart after .env changes
3. **Wrong directory:** .env.local must be in project root (same folder as package.json)
4. **Typo in variable name:** Must be exactly `VITE_STRIPE_PUBLISHABLE_KEY`
5. **Browser cache:** Try incognito window

**Share your browser console output (F12) if still stuck!**
