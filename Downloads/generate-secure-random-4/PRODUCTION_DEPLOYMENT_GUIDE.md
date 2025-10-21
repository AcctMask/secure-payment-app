# Production Deployment Guide

## 🚀 Taking Your App to Production

This guide will help you deploy your secure payment application to production and make it available to the public.

---

## Step 1: Switch to Live Stripe Keys

### Get Your Live Stripe Keys

1. **Log into Stripe Dashboard**: https://dashboard.stripe.com
2. **Toggle to Live Mode** (top right corner - switch from "Test" to "Live")
3. **Navigate to Developers → API Keys**: https://dashboard.stripe.com/apikeys
4. **Copy Your Live Keys**:
   - **Publishable key**: Starts with `pk_live_...`
   - **Secret key**: Starts with `sk_live_...` (click "Reveal live key")

### Update Supabase Secrets (CRITICAL)

Update your Supabase edge function secrets with LIVE keys:

```bash
# Update Stripe secret key
supabase secrets set STRIPE_SECRET_KEY=sk_live_YOUR_LIVE_SECRET_KEY

# Update publishable key (for reference)
supabase secrets set VITE_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_LIVE_PUBLISHABLE_KEY
```

Or update via Supabase Dashboard:
1. Go to your project: https://supabase.com/dashboard/project/YOUR_PROJECT
2. Navigate to **Edge Functions → Manage Secrets**
3. Update `STRIPE_SECRET_KEY` with your live key

---

## Step 2: Configure Production Webhook

### Create Live Webhook Endpoint

1. **Go to Stripe Webhooks**: https://dashboard.stripe.com/webhooks
2. **Click "Add endpoint"**
3. **Enter your endpoint URL**:
   ```
   https://YOUR_PROJECT_ID.supabase.co/functions/v1/stripe-webhook
   ```
4. **Select events to listen to**:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.succeeded`
   - `charge.failed`

5. **Copy the Webhook Signing Secret** (starts with `whsec_...`)

### Update Webhook Secret in Supabase

```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_LIVE_WEBHOOK_SECRET
```

---

## Step 3: Deploy Frontend to Production

### Option A: Deploy to Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   - `VITE_STRIPE_PUBLISHABLE_KEY` = `pk_live_...`
   - `VITE_SUPABASE_URL` = Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY` = Your Supabase anon key

4. **Deploy to Production**:
   ```bash
   vercel --prod
   ```

### Option B: Deploy to Netlify

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Build your app**:
   ```bash
   npm run build
   ```

3. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

4. **Set Environment Variables** in Netlify Dashboard

---

## Step 4: Security Checklist

### ✅ Database Security (COMPLETED)
- [x] Row Level Security (RLS) enabled on all tables
- [x] Users can only access their own data
- [x] Secure policies for `secure_accounts` table
- [x] Secure policies for `payment_accounts` table

### ✅ API Security
- [x] Stripe secret keys stored in Supabase secrets (server-side only)
- [x] No API keys exposed in frontend code
- [x] Edge functions handle all sensitive operations

### ⚠️ Additional Security Steps

1. **Enable Supabase Auth** (if not already):
   - Go to Authentication → Providers
   - Enable Email/Password or OAuth providers
   - Configure email templates

2. **Set up CORS** for your production domain:
   - Supabase Dashboard → API Settings
   - Add your production domain to allowed origins

3. **Review Stripe Settings**:
   - Enable 3D Secure for cards
   - Set up fraud detection rules
   - Configure email receipts

---

## Step 5: Testing in Production

### Test with Real Cards

⚠️ **IMPORTANT**: You're now in LIVE mode. Real charges will occur!

1. **Use a real credit card** for testing
2. **Test small amounts** first ($0.50 - $1.00)
3. **Verify the flow**:
   - Add credit card → Generate code → Make purchase
   - Check that code regenerates after purchase
   - Verify charges appear in Stripe Dashboard

### Monitor Payments

- **Stripe Dashboard**: https://dashboard.stripe.com/payments
- **Supabase Logs**: Check edge function logs for errors
- **Database**: Monitor `payment_logs` table for transaction records

---

## Step 6: Go Live! 🎉

### Final Checklist

- [ ] Live Stripe keys configured in Supabase
- [ ] Live webhook endpoint created and secret updated
- [ ] Frontend deployed with production environment variables
- [ ] RLS policies enabled and tested
- [ ] Test purchase completed successfully
- [ ] Monitoring and logging in place

### Share Your App

Your app is now ready for public use! Share your production URL with users.

---

## Monitoring & Maintenance

### Daily Checks
- Monitor Stripe Dashboard for failed payments
- Check Supabase edge function logs for errors
- Review database for any anomalies

### Monthly Tasks
- Review Stripe fees and payouts
- Check for Stripe API updates
- Update dependencies: `npm update`

---

## Troubleshooting Production Issues

### Payments Failing
1. Check Stripe Dashboard → Logs for detailed error messages
2. Verify webhook secret is correct
3. Check edge function logs in Supabase

### Users Can't See Their Data
1. Verify RLS policies are enabled
2. Check that user authentication is working
3. Review Supabase Auth logs

### Need Help?
- Stripe Support: https://support.stripe.com
- Supabase Support: https://supabase.com/support
- Check edge function logs for detailed error messages

---

## Cost Estimates

### Stripe Fees (Live Mode)
- 2.9% + $0.30 per successful card charge
- No monthly fees for standard account

### Supabase Costs
- Free tier: Up to 500MB database, 2GB bandwidth
- Pro tier ($25/mo): Recommended for production

### Hosting (Vercel/Netlify)
- Free tier available for small projects
- Pro tier if you need more bandwidth

---

**🎉 Congratulations! Your app is now live and ready to process real payments!**
