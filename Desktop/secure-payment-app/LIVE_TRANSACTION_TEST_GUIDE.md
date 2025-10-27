# 🔴 LIVE TRANSACTION TEST GUIDE

## ⚠️ CRITICAL: You are in LIVE MODE with real Stripe keys
All transactions will process REAL MONEY. Test carefully!

---

## 🎯 Test Flow 1: Becoming a Member (Subscription Purchase)

### What Gets Tested:
- Stripe Checkout Session creation
- Real subscription payment processing
- Webhook handling for member creation
- Secure code generation for new members

### Steps to Test:

1. **Start Membership Purchase**
   - Navigate to your app homepage
   - Click "Become a Member" button in navigation
   - RealMembershipModal should open

2. **Select a Plan**
   - Choose either Premium ($29.99/mo) or Pro ($49.99/mo)
   - Click "Choose [Plan Name]" button

3. **Enter Email & Checkout**
   - Enter a REAL email address (you'll receive receipts)
   - Click "Subscribe $XX.XX/mo" button
   - You'll be redirected to Stripe Checkout

4. **Complete Payment**
   - Use a REAL credit card (this will charge!)
   - Or use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date, any CVC
   - Complete the checkout

5. **Verify Success**
   - After payment, you'll be redirected back to your app
   - Check Stripe Dashboard → Payments to see the transaction
   - Check Supabase → Table Editor → `members` table
   - You should see a new member record with:
     - email
     - stripe_customer_id
     - membership_status: 'active'
     - current_code: (12-char code like ABCD-EFGH-IJKL)
     - subscription_id

### Edge Functions Used:
- ✅ `create-checkout-session` - Creates Stripe Checkout
- ✅ `stripe-webhook` - Handles payment confirmation

---

## 🎯 Test Flow 2: Making a Purchase as a Member

### What Gets Tested:
- Member code validation
- Payment processing with saved card
- Code rotation after use
- Transaction logging

### Prerequisites:
- You must be a member (complete Test Flow 1 first)
- Your member record must have a valid Stripe customer ID with payment method

### Steps to Test:

1. **Verify Member Status**
   - Check that you see the green member bar at top
   - Should show: "Welcome, [Your Name]"
   - Should show: "Member #[Account Number]"

2. **Initiate Purchase**
   - Click "My Profile" button
   - Note your current secure code
   - Close profile modal

3. **Test Purchase with Code**
   - Option A: Use the ProductSelectionModal
     - Click "Make a Purchase" (if available)
     - Select a product
     - Enter your current member code
   
   - Option B: Direct API Test
     - Use the member code from your profile
     - Call the edge function directly (see below)

### Direct API Test (Using curl):

```bash
# Get your member code from the profile modal first
# Replace YOUR_CODE with your actual 12-character code

curl -X POST https://ygongssudngqrseklkah.supabase.co/functions/v1/process-member-payment \
  -H "Content-Type: application/json" \
  -d '{
    "code": "YOUR_CODE",
    "amount": 25.00,
    "merchantName": "Test Store",
    "description": "Test Purchase"
  }'
```

### Expected Response:
```json
{
  "success": true,
  "transactionId": "pi_xxxxx",
  "newCode": "WXYZ-1234-5678",
  "amount": 25.00,
  "merchant": "Test Store"
}
```

### Verify Success:
1. Check Stripe Dashboard → Payments
   - Should see new payment for $25.00
2. Check Supabase → `members` table
   - Your `current_code` should be different (rotated)
   - `code_last_used_at` should be updated
3. Check Supabase → `payment_logs` table (if exists)
   - Should have transaction record

### Edge Functions Used:
- ✅ `process-member-payment` - Processes payment with member code

---

## 🔍 Troubleshooting

### Membership Purchase Issues:

**Error: "Stripe Price IDs not configured"**
- Check `.env` file has:
  - `VITE_STRIPE_PREMIUM_PRICE_ID=price_xxxxx`
  - `VITE_STRIPE_PRO_PRICE_ID=price_xxxxx`
- These must be LIVE price IDs from Stripe Dashboard

**Error: "Stripe key not configured"**
- Check Supabase Edge Function Secrets:
  - `STRIPE_SECRET_KEY` should start with `sk_live_`

**Webhook not creating member**
- Check webhook endpoint is configured in Stripe
- URL: `https://ygongssudngqrseklkah.supabase.co/functions/v1/stripe-webhook`
- Events: `checkout.session.completed`, `customer.subscription.updated`
- Check webhook signing secret matches `STRIPE_WEBHOOK_SECRET`

### Member Purchase Issues:

**Error: "Invalid code or membership not found"**
- Verify member exists in `members` table
- Check code matches exactly (case-sensitive)
- Code may have been used already (codes rotate after each use)

**Error: "Membership is not active"**
- Check `membership_status` in database is 'active'
- Check subscription hasn't been cancelled

**Error: "Payment failed"**
- Check Stripe customer has valid payment method
- Check payment method hasn't expired
- Check sufficient funds on card

---

## 📊 Verification Checklist

### After Membership Purchase:
- [ ] Stripe Dashboard shows successful subscription
- [ ] Member record created in Supabase `members` table
- [ ] Member has valid `stripe_customer_id`
- [ ] Member has `current_code` generated
- [ ] `subscription_status` is 'active'
- [ ] Email receipt sent to customer

### After Member Purchase:
- [ ] Stripe Dashboard shows successful payment
- [ ] Payment amount matches request
- [ ] Member's code was rotated (changed)
- [ ] `code_last_used_at` timestamp updated
- [ ] Transaction logged (if logging enabled)

---

## 💰 Cost Estimate

If you test both flows with minimum amounts:
- Membership: $29.99 (Premium) or $49.99 (Pro) - RECURRING MONTHLY
- Purchase: $25.00 (or whatever amount you test with)

**Remember to cancel test subscriptions** in Stripe Dashboard after testing!

---

## 🛡️ Safety Tips

1. Use small amounts for purchase tests
2. Cancel test subscriptions immediately after verification
3. Keep test cards separate from production cards
4. Monitor Stripe Dashboard during tests
5. Check Supabase logs for any errors

---

## ✅ Success Indicators

**System is working correctly if:**
1. Membership purchases create Supabase member records
2. Member codes can be used for purchases
3. Codes rotate after each use
4. All transactions appear in Stripe Dashboard
5. Webhooks process without errors
