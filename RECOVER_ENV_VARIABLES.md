# 🔧 RECOVER ALL ENVIRONMENT VARIABLES

Your environment variables have been lost. Follow these steps to retrieve them from your service providers.

---

## Step 1: Create Local .env.local File

```bash
# In your project root, create .env.local
touch .env.local
```

Copy this template into `.env.local`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
VITE_STRIPE_PREMIUM_PRICE_ID=your_premium_price_id_here
VITE_STRIPE_PRO_PRICE_ID=your_pro_price_id_here
```

---

## Step 2: Get Supabase Credentials

### A. Login to Supabase
1. Go to https://supabase.com/dashboard
2. Login with your account
3. Select your project

### B. Get Project URL
1. Click **Settings** (gear icon in sidebar)
2. Click **API** section
3. Find **Project URL**
4. Copy the URL (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
5. Paste as `VITE_SUPABASE_URL` in `.env.local`

### C. Get Anon Key
1. Same **Settings → API** page
2. Find **Project API keys** section
3. Copy the **anon** / **public** key (starts with `eyJ...`)
4. Paste as `VITE_SUPABASE_ANON_KEY` in `.env.local`

---

## Step 3: Get Stripe Credentials

### A. Login to Stripe
1. Go to https://dashboard.stripe.com
2. Login with your account
3. **IMPORTANT**: Toggle to **Test Mode** (switch in top right)

### B. Get Publishable Key
1. Click **Developers** in top right
2. Click **API keys**
3. Find **Publishable key** (starts with `pk_test_...`)
4. Click to reveal and copy
5. Paste as `VITE_STRIPE_PUBLISHABLE_KEY` in `.env.local`

### C. Get Price IDs

#### Option 1: Find Existing Products
1. Click **Products** in left sidebar
2. Find your **Premium** membership product
3. Click on it
4. Copy the **Price ID** (starts with `price_...`)
5. Paste as `VITE_STRIPE_PREMIUM_PRICE_ID`
6. Repeat for **Pro** membership

#### Option 2: Create New Products
If you don't have products yet:

1. Click **Products** → **Add product**
2. Name: "Premium Membership"
3. Price: $29 (or your price)
4. Billing: One-time or Recurring
5. Click **Save product**
6. Copy the **Price ID** (starts with `price_...`)
7. Paste as `VITE_STRIPE_PREMIUM_PRICE_ID`
8. Repeat for "Pro Membership" ($49 or your price)

---

## Step 4: Verify Your .env.local File

Your `.env.local` should now look like:

```env
VITE_SUPABASE_URL=https://abcdefghijk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_51Abc123...
VITE_STRIPE_PREMIUM_PRICE_ID=price_1Abc123...
VITE_STRIPE_PRO_PRICE_ID=price_1Xyz789...
```

---

## Step 5: Add to Vercel

1. Go to https://vercel.com/dashboard
2. Select your project
3. Click **Settings** → **Environment Variables**
4. Add each variable:
   - Name: `VITE_SUPABASE_URL`
   - Value: (paste from .env.local)
   - Environment: Check all (Production, Preview, Development)
   - Click **Save**
5. Repeat for all 5 variables

---

## Step 6: Restart Everything

### Local Development
```bash
# Stop server (Ctrl+C)
# Restart
npm run dev
```

### Vercel
```bash
# Trigger new deployment
git commit --allow-empty -m "Trigger redeploy with env vars"
git push origin main
```

Or in Vercel Dashboard:
- Go to **Deployments**
- Click **...** on latest deployment
- Click **Redeploy**

---

## Step 7: Test Configuration

Visit your local app: http://localhost:5173

You should see:
- ✅ No "Stripe not configured" warning
- ✅ No "Using fallback Supabase" warning
- ✅ Premium/Pro buttons enabled

---

## 🆘 Still Having Issues?

### Can't find Supabase project?
- Check if project was deleted
- Create new project at https://supabase.com/dashboard
- Run migrations from `supabase/migrations/` folder

### Can't find Stripe products?
- Create new products as shown in Step 3C
- Make sure you're in **Test Mode**

### Variables still not loading?
```bash
# Check if .env.local exists
ls -la .env.local

# Check file contents (safe to view)
cat .env.local

# Ensure no spaces around = signs
# ✅ CORRECT: VITE_SUPABASE_URL=https://...
# ❌ WRONG: VITE_SUPABASE_URL = https://...
```

---

## 📋 Quick Checklist

- [ ] Created `.env.local` in project root
- [ ] Retrieved Supabase URL from dashboard
- [ ] Retrieved Supabase anon key from dashboard
- [ ] Retrieved Stripe publishable key (pk_test_...)
- [ ] Retrieved or created Premium price ID
- [ ] Retrieved or created Pro price ID
- [ ] Added all 5 variables to Vercel
- [ ] Restarted local dev server
- [ ] Triggered Vercel redeploy
- [ ] Tested app - no warnings visible

---

**Need the exact URLs?**
- Supabase Dashboard: https://supabase.com/dashboard
- Stripe Dashboard: https://dashboard.stripe.com
- Vercel Dashboard: https://vercel.com/dashboard
