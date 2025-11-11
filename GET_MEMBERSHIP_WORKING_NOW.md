# 🚀 Get Membership Purchase Working NOW

## Current Status
Your membership modal and edge function are properly coded. We just need to ensure the configuration is complete so you can test with your personal credit card.

## ✅ Quick Checklist

### 1. Verify Stripe Dashboard Setup (2 minutes)

**Go to:** https://dashboard.stripe.com/test/products

**Create Two Subscription Products:**

1. **Premium Membership**
   - Name: "Premium Membership"
   - Price: $29.99/month (or your preferred amount)
   - Recurring: Monthly
   - Copy the **Price ID** (starts with `price_`)

2. **Pro Membership**
   - Name: "Pro Membership"  
   - Price: $49.99/month (or your preferred amount)
   - Recurring: Monthly
   - Copy the **Price ID** (starts with `price_`)

---

### 2. Update Your `.env.local` File (1 minute)

```bash
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
VITE_STRIPE_PREMIUM_PRICE_ID=price_YOUR_PREMIUM_PRICE_ID
VITE_STRIPE_PRO_PRICE_ID=price_YOUR_PRO_PRICE_ID

# Supabase Configuration
VITE_SUPABASE_URL=https://oxkrsmhccberdhvdhgyz.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**After updating, RESTART your dev server:**
```bash
# Stop the server (Ctrl+C)
npm run dev
```

---

### 3. Set Supabase Secret (1 minute)

```bash
# Link to your project
supabase link --project-ref oxkrsmhccberdhvdhgyz

# Set your Stripe SECRET key (sk_test_...)
supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY_HERE

# Deploy the checkout function
supabase functions deploy create-checkout-session --no-verify-jwt
```

---

### 4. Test the Flow (1 minute)

1. Open your app: http://localhost:5173
2. Click "Become a Member" in navigation
3. Select Premium or Pro plan
4. Enter your email
5. Click "Subscribe"
6. You should be redirected to Stripe Checkout
7. Use test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any ZIP code

---

## 🔍 Troubleshooting

### Error: "Price ID not configured"
- Check that price IDs in `.env.local` start with `price_`
- Restart dev server after changing `.env.local`

### Error: "Failed to start checkout"
- Check browser console for detailed error
- Verify edge function is deployed: `supabase functions list`
- Check function logs: `supabase functions logs create-checkout-session`

### Redirects but shows error on Stripe page
- Verify STRIPE_SECRET_KEY is set in Supabase secrets
- Make sure secret key starts with `sk_test_`
- Check that price IDs exist in your Stripe dashboard

---

## 📝 What Happens When It Works

1. ✅ Modal opens with Premium/Pro plans
2. ✅ You enter email and click Subscribe
3. ✅ Redirected to Stripe Checkout page
4. ✅ Enter test card details
5. ✅ Payment succeeds
6. ✅ Redirected back to your app with success message
7. ✅ Virtual card would be created (once we add that function)

---

## 🎯 Next Steps After Membership Works

Once you can successfully complete a test membership purchase:

1. We'll add the virtual card creation in the webhook
2. Test the instant card rotation on purchases
3. Perfect the card-after-every-transaction flow
4. Add push provisioning for Apple/Google Pay

**Focus:** Get one successful test membership purchase first!
