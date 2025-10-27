# Real Payment Processing Setup Guide

## ✅ System Overview

Your app now processes **REAL payments** using Stripe's standard payment processing (not Stripe Issuing).

### How It Works:

1. **Member Signs Up** → Pays via Stripe Checkout (subscription)
2. **Webhook Activates** → Creates member record with unique secure code
3. **Member Gets Code** → Can use it to make purchases
4. **Purchase Made** → Charges member's saved payment method in Stripe
5. **New Code Generated** → After each purchase for security

---

## 🔧 Required Setup Steps

### 1. Create Stripe Products & Prices

Go to https://dashboard.stripe.com/test/products

**Create a Product:**
- Name: "Premium Membership"
- Billing: Recurring
- Price: $9.99/month (or your amount)
- Copy the **Price ID** (starts with `price_`)

### 2. Update Frontend

In `src/components/RealMembershipModal.tsx` or wherever you call checkout:

```typescript
const priceId = 'price_YOUR_PRICE_ID_HERE'; // Replace with your actual price ID
```

### 3. Configure Stripe Webhook

**In Stripe Dashboard:**
1. Go to Developers → Webhooks
2. Add endpoint: `https://ygongssudngqrseklkah.supabase.co/functions/v1/stripe-webhook`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the **Signing Secret** (starts with `whsec_`)
5. Already set in Supabase secrets as `STRIPE_WEBHOOK_SECRET`

---

## 🧪 Testing Real Payments

### Test Membership Purchase:

1. Go to your site: https://sp4all.com
2. Click "Become a Member"
3. Use Stripe test card: **4242 4242 4242 4242**
4. Expiration: Any future date
5. CVV: Any 3 digits
6. Complete checkout

### After Successful Payment:

- Webhook creates member record
- Member gets a secure code (e.g., `ABCD-EFGH-IJKL`)
- Code is stored in database

### Test Purchase with Code:

1. Member enters their code
2. Enters purchase amount
3. System charges their Stripe customer account
4. New code is generated automatically

---

## 💳 Real Card Processing

### For LIVE/Production:

1. **Switch to Live Mode** in Stripe Dashboard
2. Use **real credit cards** (not test cards)
3. Update webhook URL to production
4. Charges will be **REAL** and money will be transferred

### Important Notes:

- ✅ Uses customer's **saved payment method** from signup
- ✅ Processes **off-session** payments (no customer present)
- ✅ Generates **new code** after each purchase
- ✅ Validates membership status before charging
- ❌ Does NOT use Stripe Issuing (no approval needed)
- ❌ Does NOT create virtual cards

---

## 🔐 Security Features

- Codes regenerate after each use
- Validates membership status
- Checks subscription is active
- Uses Stripe's secure payment processing
- Stores only customer IDs (not card details)

---

## 📊 Database Structure

**members table:**
- `email` - Member's email
- `stripe_customer_id` - Links to Stripe customer
- `current_code` - Active secure code
- `membership_status` - active/inactive
- `subscription_id` - Stripe subscription ID
- `subscription_status` - Subscription state

---

## 🚀 Going Live

1. Switch Stripe to **Live Mode**
2. Update `STRIPE_SECRET_KEY` with live key
3. Update webhook with live endpoint
4. Test with real card (small amount)
5. Monitor Stripe Dashboard for transactions

---

## ❓ Troubleshooting

**Code not working?**
- Check member exists in database
- Verify membership_status is 'active'
- Ensure subscription_status is 'active'

**Payment failing?**
- Check customer has valid payment method
- Verify Stripe customer ID is correct
- Check Stripe Dashboard for error details

**Webhook not firing?**
- Verify webhook URL is correct
- Check webhook signing secret matches
- View webhook logs in Stripe Dashboard
