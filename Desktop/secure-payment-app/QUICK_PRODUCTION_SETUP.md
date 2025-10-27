# Quick Production Setup (5 Minutes)

## 🚀 Get Your App Live in 5 Steps

### Step 1: Get Live Stripe Keys (2 min)
1. Go to https://dashboard.stripe.com
2. **Toggle to "Live Mode"** (top right corner)
3. Go to Developers → API Keys
4. Copy both keys:
   - Publishable key: `pk_live_...`
   - Secret key: `sk_live_...`

### Step 2: Update Supabase Secrets (1 min)
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_YOUR_KEY_HERE
```

Or via dashboard:
- Go to: https://supabase.com/dashboard/project/YOUR_PROJECT
- Edge Functions → Manage Secrets
- Update `STRIPE_SECRET_KEY`

### Step 3: Set Up Live Webhook (1 min)
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. URL: `https://YOUR_PROJECT_ID.supabase.co/functions/v1/stripe-webhook`
4. Events: Select `payment_intent.succeeded` and `payment_intent.payment_failed`
5. Copy webhook secret: `whsec_...`
6. Update in Supabase:
   ```bash
   supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET
   ```

### Step 4: Deploy Frontend (1 min)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# - VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
# - VITE_SUPABASE_URL=https://...
# - VITE_SUPABASE_ANON_KEY=...

# Deploy to production
vercel --prod
```

### Step 5: Test with Real Card (30 sec)
1. Visit your production URL
2. Add a real credit card
3. Generate a code
4. Make a small test purchase ($0.50)
5. Verify in Stripe Dashboard

---

## ✅ You're Live!

Your app is now processing real payments. Monitor:
- Stripe Dashboard: https://dashboard.stripe.com/payments
- Supabase Logs: Check edge functions for errors

---

## 🔒 Security Note

All security measures are already in place:
- ✅ Row Level Security enabled
- ✅ API keys secured server-side
- ✅ PCI compliant via Stripe

See `SECURITY_CHECKLIST.md` for details.

---

**Need detailed instructions? See `PRODUCTION_DEPLOYMENT_GUIDE.md`**
