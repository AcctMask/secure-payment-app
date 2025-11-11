# Create New Restricted Key for Supabase

## Step 1: Create Restricted Key in Stripe

1. Go to: https://dashboard.stripe.com/apikeys
2. Click **"Create restricted key"** (under Restricted keys section)
3. Name it: `supabase-edge-functions-live`

## Step 2: Set Permissions (Set to WRITE)

Enable these permissions with **WRITE** access:
- ✅ Checkout Sessions → **Write**
- ✅ Customers → **Write**
- ✅ Payment Intents → **Write**
- ✅ Subscriptions → **Write**
- ✅ Prices → **Read**
- ✅ Products → **Read**

Leave all other permissions as "None"

## Step 3: Create & Copy Key

1. Click **"Create key"**
2. **IMMEDIATELY COPY** the key (starts with `rk_live_...`)
3. Save it temporarily in a secure note

## Step 4: Update Supabase

```bash
# Set the new restricted key
npx supabase secrets set STRIPE_SECRET_KEY=rk_live_YOUR_NEW_KEY_HERE

# Verify it's set
npx supabase secrets list
```

## Step 5: Update .env.local

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51S8o3LCYgC6lPmKTNY1CENG99QbfLTOhuYR2nrLxrDy9aVqUrbCpwLGj8CNcw0Qflw31hRCGr4szDFDk1H3bPCuV00ySnstNru
```

## Step 6: Test

Wait 1-2 minutes, then test a payment on your site.

---

**Why this works:**
- Restricted keys are MORE secure than standard keys
- No IP restrictions needed (serverless functions have dynamic IPs)
- Limited permissions = reduced risk
