# Stripe Restricted Key Setup (Recommended)

You're absolutely right! Stripe recommends restricted keys for security.

## Create Restricted Key with Correct Permissions

### Step 1: Create Restricted Key in Stripe
1. Go to Stripe Dashboard → **Developers** → **API Keys**
2. Click **Create restricted key**
3. Name it: `Supabase Edge Functions`

### Step 2: Enable Required Permissions
Enable these permissions (set to **Write**):
- ✅ **Checkout Sessions** → Write
- ✅ **Customers** → Write
- ✅ **Payment Intents** → Write (if using)
- ✅ **Subscriptions** → Write (if using)
- ✅ **Prices** → Read
- ✅ **Products** → Read

### Step 3: Add to Supabase
```bash
# Using Supabase CLI
supabase secrets set STRIPE_SECRET_KEY=rk_live_xxxxx

# Or in Dashboard:
# Project Settings → Edge Functions → Secrets
# Add: STRIPE_SECRET_KEY = rk_live_xxxxx
```

### Step 4: Add Price IDs
```bash
supabase secrets set VITE_STRIPE_PREMIUM_PRICE_ID=price_xxxxx
supabase secrets set VITE_STRIPE_PRO_PRICE_ID=price_xxxxx
```

### Step 5: Redeploy Function
```bash
supabase functions deploy create-checkout-session
```

## Verify Permissions
If still getting errors, check:
1. Restricted key has **Checkout Sessions → Write** enabled
2. Key starts with `rk_live_` or `rk_test_`
3. All secrets are set in Supabase (not just .env)
4. Function was redeployed after adding secrets

## Common Issue
❌ **Error**: "This API call cannot be made with a restricted key"
✅ **Fix**: Enable "Checkout Sessions → Write" permission on the restricted key
