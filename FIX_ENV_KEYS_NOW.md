# 🔧 FIX: Keys Getting Truncated with $ Symbol

## THE PROBLEM
Your terminal is interpreting `$` as a shell variable, cutting off your keys.

## THE SOLUTION

### Method 1: Use nano editor (RECOMMENDED)
```bash
nano .env.local
```

Then **manually type or paste** each line:
```
VITE_SUPABASE_URL=https://oxkrsmhccberdhvdhgyz.supabase.co
VITE_SUPABASE_ANON_KEY=<paste_full_key_from_supabase>
VITE_STRIPE_PUBLISHABLE_KEY=<paste_full_key_from_stripe>
VITE_STRIPE_SECRET_KEY=<paste_full_key_from_stripe>
VITE_STRIPE_PREMIUM_PRICE_ID=price_1SEEYgCYgC6lPmKTgZSTYJMq
VITE_STRIPE_PRO_PRICE_ID=price_1SEEazCYgC6lPmKTc2wZ6yYM
```

Save: `Ctrl+X`, then `Y`, then `Enter`

### Method 2: Get complete keys from dashboards

**Supabase Anon Key:**
1. Go to https://supabase.com/dashboard/project/oxkrsmhccberdhvdhgyz/settings/api
2. Copy the full "anon public" key (should be ~200+ characters)

**Stripe Keys:**
1. Go to https://dashboard.stripe.com/apikeys
2. Copy FULL publishable key (starts with `pk_live_`)
3. Copy FULL secret key (starts with `sk_live_`)

### Verify it worked:
```bash
cat .env.local
```

All keys should be complete with NO `$` at the end!
