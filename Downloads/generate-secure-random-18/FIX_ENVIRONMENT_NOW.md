# 🔧 Fix Environment Variables NOW

## Quick Fix (5 minutes)

### Step 1: Create .env file
In your project root, create a file named `.env` (not .env.example):

```bash
touch .env
```

### Step 2: Add your real values to .env

Open the `.env` file and add:

```env
# Supabase (Get from https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here

# Stripe (Get from https://dashboard.stripe.com/apikeys)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Stripe Prices (Get from https://dashboard.stripe.com/products)
VITE_STRIPE_PREMIUM_PRICE_ID=price_xxxxxxxxxxxxx
VITE_STRIPE_PRO_PRICE_ID=price_xxxxxxxxxxxxx
```

### Step 3: Get Your Actual Values

**Supabase:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy "Project URL" → paste as VITE_SUPABASE_URL
5. Copy "anon public" key → paste as VITE_SUPABASE_ANON_KEY

**Stripe:**
1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy "Publishable key" → paste as VITE_STRIPE_PUBLISHABLE_KEY
3. Go to https://dashboard.stripe.com/test/products
4. Create 2 products (Premium & Pro) if needed
5. Copy their Price IDs

### Step 4: Restart Dev Server
```bash
# Stop server (Ctrl + C)
# Start again
npm run dev
```

## ✅ Verify
Refresh http://localhost:8080/ - all checks should pass!
