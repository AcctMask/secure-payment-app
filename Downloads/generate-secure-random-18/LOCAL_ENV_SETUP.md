# 🚨 LOCAL DEVELOPMENT ENVIRONMENT SETUP

## THE PROBLEM
When you run `npm run dev` locally, it reads from your **LOCAL .env file**, NOT from Vercel!

Vercel environment variables only work on the deployed site.
Local development needs a local `.env` file.

---

## QUICK FIX - CREATE LOCAL .env FILE

### Step 1: Create .env file in your project root
```bash
# In your terminal, in the secure-payment-app directory:
touch .env
```

### Step 2: Open .env and add your LIVE Stripe keys
```bash
# Open with any text editor:
nano .env
# or
code .env
# or
open .env
```

### Step 3: Add these lines (replace with YOUR live keys from Stripe):
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe LIVE Keys (from https://dashboard.stripe.com/apikeys)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_KEY_HERE

# Stripe LIVE Price IDs (from https://dashboard.stripe.com/products)
VITE_STRIPE_PREMIUM_PRICE_ID=price_YOUR_LIVE_PREMIUM_PRICE_ID
VITE_STRIPE_PRO_PRICE_ID=price_YOUR_LIVE_PRO_PRICE_ID
```

### Step 4: Save and restart dev server
```bash
# Stop the server (Ctrl+C if still running)
# Then restart:
npm run dev
```

---

## WHERE TO GET YOUR LIVE STRIPE KEYS

### 1. Get Live Publishable Key
1. Go to https://dashboard.stripe.com/apikeys
2. **TURN OFF "Test mode"** toggle (top right)
3. Find "Publishable key" - starts with `pk_live_`
4. Click "Reveal live key token"
5. Copy it to your .env file

### 2. Get Live Price IDs
1. Go to https://dashboard.stripe.com/products
2. **TURN OFF "Test mode"** toggle
3. Click on your "Premium" product
4. Copy the Price ID (starts with `price_` NOT `price_test_`)
5. Repeat for "Pro" product

---

## VERIFICATION CHECKLIST

After creating .env and restarting:

✅ Check your .env file exists: `ls -la .env`
✅ Check it has live keys: `cat .env | grep pk_live`
✅ Restart dev server: `npm run dev`
✅ Visit http://localhost:5173
✅ Click "Premium" - should NOT show test card message
✅ Test card message only shows if key starts with `pk_test_`

---

## TWO SEPARATE ENVIRONMENTS

| Environment | Uses | How to Configure |
|-------------|------|------------------|
| **Local** (npm run dev) | `.env` file in project | Create `.env` file manually |
| **Vercel** (deploypad.app) | Vercel dashboard | Set in Vercel → Settings → Environment Variables |

**You need to configure BOTH separately!**

---

## SECURITY WARNING

⚠️ **NEVER commit .env to git!**

Your `.gitignore` already includes `.env`, but double-check:
```bash
cat .gitignore | grep .env
```

Should show:
```
.env
.env.local
.env.production
```

---

## QUICK COPY-PASTE TEMPLATE

Copy this, replace the values, save as `.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51S8o3LCYgC6lPmKTNY1CENG99QbfLTOhuYR2nrLxrDy9aVqUrbCpwLGj8CNcw0Qflw31hRCGr4szDFDk1H3bPCuV00ySnstNru

VITE_STRIPE_PREMIUM_PRICE_ID=price_1SEEYgCYgC6lPmKTgZSTYJMq
VITE_STRIPE_PRO_PRICE_ID=price_1SEEazCYgC6lPmKTc2wZ6yYM
```

Save, then:
```bash
npm run dev
```

Done! 🎉
