# ADD STRIPE KEY TO VERCEL - 2 MINUTE FIX

## ⚠️ IMPORTANT: Remove ".env.local" from the end!

Your key is:
```
pk_live_51S8o3LCYgC6lPmKTNY1CENG99QbfLTOhuYR2nrLxrDy9aVqUrbCpwLGj8CNcw0Qflw31hRCGr4szDFDk1H3bPCuV00ySnstNru
```

**NOT** this (don't include ".env.local"):
```
pk_live_51S8o3LCYgC6lPmKTNY1CENG99QbfLTOhuYR2nrLxrDy9aVqUrbCpwLGj8CNcw0Qflw31hRCGr4szDFDk1H3bPCuV00ySnstNru.env.local
```

---

## STEPS:

### 1. Go to Vercel Dashboard
- Visit: https://vercel.com/dashboard
- Click your **sp4all** project

### 2. Add Environment Variable
- Click **Settings** tab
- Click **Environment Variables** in left sidebar
- Click **Add New**

### 3. Enter These Values:
```
Name: VITE_STRIPE_PUBLISHABLE_KEY
Value: pk_live_51S8o3LCYgC6lPmKTNY1CENG99QbfLTOhuYR2nrLxrDy9aVqUrbCpwLGj8CNcw0Qflw31hRCGr4szDFDk1H3bPCuV00ySnstNru
Environment: Production, Preview, Development (check all 3)
```

### 4. Save & Redeploy
- Click **Save**
- Go to **Deployments** tab
- Click **⋮** on latest deployment
- Click **Redeploy**
- ✅ Wait for green checkmark

### 5. Verify Success
- Hard refresh browser: `Cmd + Shift + R`
- Open Console: `Cmd + Option + C`
- Should see: `✅ Stripe configured with valid key: pk_live_...`
- Click "Join Premium" - should open real Stripe checkout

---

## WHY THIS FIXES IT:

The error message shows Stripe received an "empty string" because the environment variable wasn't set in Vercel. Setting it and redeploying will bake the correct key into your build.
