# One-Click Vercel Deployment Guide

## 🚀 Deploy in 3 Steps

### Step 1: Push to GitHub
```bash
# Run the automated setup script
chmod +x AUTOMATED_SETUP.sh && ./AUTOMATED_SETUP.sh
```

This will:
- Create a GitHub repository
- Push your code
- Set up GitHub secrets

### Step 2: Update README Deploy Button

After pushing to GitHub, update the Deploy button URL in `README.md`:

Replace `YOUR_USERNAME` and `YOUR_REPO` with your actual GitHub username and repository name:

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2FYOUR_REPO&env=VITE_SUPABASE_URL,VITE_SUPABASE_ANON_KEY,SUPABASE_SERVICE_ROLE_KEY,STRIPE_SECRET_KEY,STRIPE_PUBLISHABLE_KEY,STRIPE_WEBHOOK_SECRET&envDescription=Required%20environment%20variables%20for%20Stripe%20and%20Supabase%20integration&envLink=https%3A%2F%2Fgithub.com%2FYOUR_USERNAME%2FYOUR_REPO%2Fblob%2Fmain%2FQUICK_PRODUCTION_SETUP.md&project-name=secure-payment-codes&repository-name=secure-payment-codes)
```

### Step 3: Click Deploy Button

1. Click the "Deploy with Vercel" button in your README
2. Sign in to Vercel with GitHub
3. Vercel will prompt for environment variables:

**Required Environment Variables:**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (for edge functions)
- `STRIPE_SECRET_KEY` - Your Stripe secret key (sk_live_... for production)
- `STRIPE_PUBLISHABLE_KEY` - Your Stripe publishable key (pk_live_... for production)
- `STRIPE_WEBHOOK_SECRET` - Your Stripe webhook signing secret (whsec_...)

4. Click "Deploy"
5. Wait 2-3 minutes for deployment to complete

## 📋 Getting Your Environment Variables

### Supabase Variables
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → API
4. Copy:
   - Project URL → `VITE_SUPABASE_URL`
   - anon/public key → `VITE_SUPABASE_ANON_KEY`
   - service_role key → `SUPABASE_SERVICE_ROLE_KEY`

### Stripe Variables
1. Go to https://dashboard.stripe.com
2. Switch to "Live mode" (toggle in top right)
3. Go to Developers → API keys
4. Copy:
   - Publishable key → `STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY`

### Stripe Webhook Secret
1. In Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter your Vercel URL: `https://your-app.vercel.app/api/webhook`
4. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copy the signing secret → `STRIPE_WEBHOOK_SECRET`

## ✅ Post-Deployment Checklist

- [ ] App loads successfully at your Vercel URL
- [ ] Test user signup/login
- [ ] Test adding a payment method (use test card: 4242 4242 4242 4242)
- [ ] Test making a purchase
- [ ] Verify webhook is receiving events in Stripe Dashboard
- [ ] Check Supabase logs for any errors

## 🔧 Troubleshooting

**Build fails?**
- Check that all environment variables are set correctly
- Verify no typos in variable names

**App loads but features don't work?**
- Check browser console for errors
- Verify Supabase RLS policies are enabled
- Check Stripe webhook is configured correctly

**Payments fail?**
- Verify you're using LIVE mode keys in production
- Check Stripe Dashboard logs
- Verify webhook secret matches

## 🎉 Success!

Your app is now live! Share your Vercel URL with users.

**Next Steps:**
- Set up custom domain in Vercel settings
- Enable Vercel Analytics
- Monitor Supabase usage
- Review Stripe Dashboard regularly
