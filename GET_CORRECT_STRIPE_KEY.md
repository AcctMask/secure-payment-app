# GET THE CORRECT STRIPE LIVE SECRET KEY

## ⚠️ IMPORTANT: You need the STANDARD secret key, NOT the restricted key!

The key you provided is a **restricted key** (`rk_live_...`), but you need the **standard secret key** (`sk_live_...`).

---

## STEP-BY-STEP:

### 1. Get Your LIVE Secret Key:
- Go to: https://dashboard.stripe.com/apikeys
- Look for **"Secret key"** section
- It will show: `sk_live_••••••••••••••••••••••••••`
- Click **"Reveal live key token"**
- Copy the FULL key (starts with `sk_live_`)

### 2. Add to Supabase:
- Go to: https://supabase.com/dashboard
- Select your project
- Click **Edge Functions** (left sidebar)
- Click **Manage secrets** (top right)
- Find `STRIPE_SECRET_KEY` or click **New secret**
- Name: `STRIPE_SECRET_KEY`
- Value: Paste your `sk_live_...` key
- Click **Save**

### 3. Restart Functions:
Wait 1-2 minutes for auto-restart, or run:
```bash
supabase functions deploy create-payment-intent
```

### 4. Test the $1 Transaction Again

---

## Why Not the Restricted Key?

- **Restricted keys** (`rk_live_...`) have limited permissions
- **Standard secret keys** (`sk_live_...`) have full API access
- Payment processing requires the standard secret key

---

**The key you need starts with: `sk_live_`**
