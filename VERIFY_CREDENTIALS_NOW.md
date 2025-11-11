# ✅ Your Credentials Look Valid!

Your Supabase credentials appear to be correct:
- ✅ URL format is valid: `https://oxkrsmhccberdhvdhgyz.supabase.co`
- ✅ Anon key is a valid JWT token

## 🔒 SECURITY: Where Credentials Should Be

### ❌ NEVER put real credentials in:
- `.env.example` (this is for placeholders only, gets committed to git)

### ✅ Real credentials go in:
1. **Local Development**: `.env.local` file (gitignored)
2. **Production**: Vercel Environment Variables

---

## 🚀 Fix Your Payment Error - 3 Steps

### Step 1: Create `.env.local` with your REAL credentials

```bash
# Create .env.local file in your project root
cat > .env.local << 'EOF'
VITE_SUPABASE_URL=https://oxkrsmhccberdhvdhgyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94a3JzbWhjY2JlcmRodmRoZ3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNTMxMTQsImV4cCI6MjA3MjgyOTExNH0.RS0c0atH9rPqchwqfUD5fJ9FbI70BUtuK34LH7xfPig
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_51S8o3LCYgC6lPmKTNY1CENG99QbfLTOhuYR2nrLxrDy9aVqUrbCpwLGj8CNcw0Qflw31hRCGr4szDFDk1H3bPCuV00ySnstNru
VITE_STRIPE_PREMIUM_PRICE_ID=price_1SEEYgCYgC6lPmKTgZSTYJMq
VITE_STRIPE_PRO_PRICE_ID=price_1SEEazCYgC6lPmKTc2wZ6yYM
EOF
```

### Step 2: Deploy Edge Function to Supabase

```bash
# Install Supabase CLI if you haven't
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref oxkrsmhccberdhvdhgyz

# Deploy the create-checkout-session function
supabase functions deploy create-checkout-session

# Set the Stripe secret key in Supabase
supabase secrets set STRIPE_SECRET_KEY=sk_live_YOUR_STRIPE_SECRET_KEY
```

### Step 3: Update Vercel Environment Variables

1. Go to: https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Update these variables:

```
VITE_SUPABASE_URL=https://oxkrsmhccberdhvdhgyz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im94a3JzbWhjY2JlcmRodmRoZ3l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyNTMxMTQsImV4cCI6MjA3MjgyOTExNH0.RS0c0atH9rPqchwqfUD5fJ9FbI70BUtuK34LH7xfPig
VITE_STRIPE_PRO_PRICE_ID=price_1SEEazCYgC6lPmKTc2wZ6yYM
```

5. Redeploy: `vercel --prod`

---

## 🔍 Test Payment Flow

After completing the steps above:

1. Restart your local dev server: `npm run dev`
2. Click "Get Real Membership Now"
3. Select Premium or Pro
4. Enter your email
5. Should redirect to Stripe Checkout ✅

The error happens because the Edge Function isn't deployed to Supabase yet!
