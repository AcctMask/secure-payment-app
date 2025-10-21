# Real Money Payment Setup Guide

## Current Status Check

Your Stripe integration has **3 critical issues** preventing real money transfers:

### ❌ Issue 1: Placeholder Price IDs
**File:** `src/components/RealMembershipModal.tsx` (lines 38-41)
```typescript
const priceIds = {
  premium: 'price_1234567890', // ❌ FAKE ID
  pro: 'price_0987654321'      // ❌ FAKE ID
};
```

### ❌ Issue 2: Edge Function Parameter Mismatch
**File:** `supabase/functions/create-checkout-session/index.ts`
- Modal sends: `priceId`, `email`, `membershipType`
- Function expects: `plan`, `email`, `successUrl`, `cancelUrl`

### ❌ Issue 3: Virtual Cards Require Stripe Issuing
**File:** `supabase/functions/process-virtual-payment/index.ts`
- Uses `stripe.issuing.authorizations.create()`
- Requires **Stripe Issuing** (advanced feature, not available in all regions)
- Your restricted key may not have Issuing permissions

---

## ✅ FIX 1: Create Real Stripe Price IDs

### Step 1: Go to Stripe Dashboard
1. Visit: https://dashboard.stripe.com/products
2. Click **"+ Add product"**

### Step 2: Create Premium Membership
- **Name:** Premium Membership
- **Price:** $29.99
- **Billing:** Recurring monthly
- Click **Save product**
- **Copy the Price ID** (starts with `price_`)

### Step 3: Create Pro Membership
- **Name:** Professional Membership
- **Price:** $49.99
- **Billing:** Recurring monthly
- Click **Save product**
- **Copy the Price ID**

---

## ✅ FIX 2: Update Edge Function

Run this command to update the function:
```bash
# This will be fixed in the next step
```

---

## ✅ FIX 3: Check Stripe Issuing Access

### Option A: Enable Stripe Issuing (if available)
1. Go to: https://dashboard.stripe.com/issuing
2. Check if Issuing is available in your region
3. Complete the application process

### Option B: Use Standard Payments (Recommended)
If Issuing is not available, virtual cards won't work. Instead:
- Members pay subscription → get access
- Members can make purchases using standard Stripe checkout
- No virtual card needed

---

## 🔧 What I'll Fix Now

1. ✅ Update edge function to accept correct parameters
2. ✅ Add configuration for your real Price IDs
3. ✅ Simplify secure purchase to use standard Stripe payments
4. ✅ Add setup validation

**Please provide your 2 Stripe Price IDs and I'll complete the setup!**
