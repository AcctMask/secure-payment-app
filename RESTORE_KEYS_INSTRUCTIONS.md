# 🔧 QUICK API KEY RESTORE INSTRUCTIONS

## ⚡ INSTANT RESTORE (Copy-Paste Method)

If your `.env.local` file is missing or corrupted, follow these steps:

### Step 1: Copy the keys below

```bash
VITE_SUPABASE_URL=https://oxkrsmhccberdhvdhgyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmF$
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51S8o3LCYgC6lPmKTNY1CENG99QbfLTOhuYR2nrLxrD$
VITE_STRIPE_PREMIUM_PRICE_ID=price_1SEEYgCYgC6lPmKTgZSTYJMq
VITE_STRIPE_PRO_PRICE_ID=price_1SEEazCYgC6lPmKTc2wZ6yYM
```

### Step 2: Paste into .env.local

Create or open `.env.local` in your project root and paste the keys above.

### Step 3: Restart dev server

```bash
npm run dev
```

---

## ⚠️ IMPORTANT NOTES

1. **Truncated Keys**: Some keys appear truncated with `$` symbol
   - Supabase Anon Key: Verify full key in [Supabase Dashboard](https://supabase.com/dashboard)
   - Stripe Publishable Key: Verify full key in [Stripe Dashboard](https://dashboard.stripe.com)

2. **Verified Working Keys**:
   - ✅ VITE_STRIPE_PREMIUM_PRICE_ID=price_1SEEYgCYgC6lPmKTgZSTYJMq
   - ✅ VITE_STRIPE_PRO_PRICE_ID=price_1SEEazCYgC6lPmKTc2wZ6yYM

3. **Backup Locations**:
   - Master backup: `CURRENT_API_KEYS.md`
   - This file: `RESTORE_KEYS_INSTRUCTIONS.md`
   - Template: `.env.example`


---

## 🔍 WHERE TO GET FULL KEYS

### Supabase Keys
1. Go to: https://supabase.com/dashboard
2. Select your project
3. Settings → API
4. Copy "Project URL" and "anon public" key

### Stripe Keys
1. Go to: https://dashboard.stripe.com
2. Developers → API keys
3. Copy "Publishable key" (pk_live_...)
4. For Price IDs: Products → Select product → Copy Price ID

---

## 🚨 IF KEYS ARE STILL LOST

See `CURRENT_API_KEYS.md` for the master backup reference.
