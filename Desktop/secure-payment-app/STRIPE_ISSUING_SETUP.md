# Stripe Issuing Setup Guide

## Overview
Your app now supports **Stripe Issuing** - creating real virtual cards that members can use anywhere online (Amazon, eBay, etc.) or add to Apple Pay/Google Pay for tap-to-pay in stores.

## What Changed

### 1. **Real Virtual Cards (Not Just Codes)**
- Members now get actual virtual cards with real card numbers, CVV, and expiration dates
- These cards work on ANY website that accepts credit cards
- Cards can be added to Apple Pay/Google Pay for tap-to-pay

### 2. **Automatic Card Creation**
When a member subscribes:
1. Stripe webhook receives `checkout.session.completed` event
2. System creates a Stripe Issuing Cardholder
3. System creates a virtual card for that cardholder
4. Card details are stored in the database
5. Member can view and use their card immediately

### 3. **New Components**
- `RealVirtualCardDisplay.tsx` - Shows real card details (number, CVV, expiry)
- Edge function: `create-issuing-card` - Creates cardholders and cards
- Edge function: `get-card-details` - Securely retrieves card details

## Setup Instructions

### Step 1: Enable Stripe Issuing
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/issuing)
2. Click "Get Started" on Issuing
3. Complete the onboarding process (requires business verification)
4. **Note**: Stripe Issuing requires approval and is only available in certain countries

### Step 2: Configure Spending Limits
Current default: $1,000/month per card

To change, edit `create-issuing-card` function:
```typescript
spending_controls: {
  spending_limits: [
    {
      amount: 100000, // $1000 in cents
      interval: 'monthly',
    },
  ],
}
```

### Step 3: Test the Flow
1. Subscribe to membership via Stripe Checkout
2. Webhook automatically creates virtual card
3. View card in "Your Virtual Card" section
4. Click "Show Details" to see full card number, CVV, expiry

## How Members Use Their Cards

### Online Purchases (Amazon, eBay, etc.)
1. Click "Show Details" on virtual card
2. Copy card number, CVV, and expiry date
3. Use on any website like a normal credit card

### Tap-to-Pay (In Stores)
1. Add card to Apple Pay or Google Pay:
   - **Apple Pay**: Wallet app → Add Card → Enter details
   - **Google Pay**: Google Pay app → Add Card → Enter details
2. Use phone to tap-to-pay at any contactless terminal

## Important Notes

### Stripe Issuing Costs
- **Card creation**: $0 (free)
- **Monthly card fee**: $0 (free for virtual cards)
- **Transaction fees**: 
  - Domestic: 1% + $0.10
  - International: 3% + $0.10
  - ATM withdrawals: $2.50 + 1%

### Availability
Stripe Issuing is available in:
- United States
- United Kingdom
- European Union countries

### Security
- Card details are retrieved securely via edge functions
- Never stored in frontend code
- Full card number only shown when user clicks "Show Details"
- Spending limits prevent fraud

## Tap-to-Pay Implementation

### Current Status
✅ Virtual cards can be added to Apple Pay/Google Pay  
❌ Direct tap-to-pay in web browser (not possible)  
❌ Native mobile app with Stripe Terminal SDK (requires mobile app)

### For True Tap-to-Pay
To accept payments via tap-to-pay (turn phone into a terminal), you need:
1. Native iOS or Android app
2. Stripe Terminal SDK integration
3. Device with NFC capability (iPhone XS+ or compatible Android)

This is a **web app**, so direct tap-to-pay isn't available. However, members can:
- Add their virtual card to Apple/Google Pay
- Use their phone to tap-to-pay with that card

## Database Schema

The `members` table now includes:
```sql
stripe_cardholder_id TEXT  -- Stripe Issuing Cardholder ID
stripe_card_id TEXT        -- Stripe Issuing Card ID
card_status TEXT           -- 'active', 'cancelled', 'pending'
```

## API Reference

### Get Card Details
```typescript
const { data, error } = await supabase.functions.invoke('get-card-details', {
  body: { memberId: 'member_id_here' },
});

// Returns:
{
  number: "4242424242424242",
  cvc: "123",
  exp_month: 12,
  exp_year: 2025,
  brand: "visa",
  last4: "4242",
  status: "active"
}
```

### Create Card Manually
```typescript
const { data, error } = await supabase.functions.invoke('create-issuing-card', {
  body: {
    memberId: 'member_id',
    email: 'member@example.com',
    name: 'John Doe',
    address: {
      line1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      postal_code: '94111',
    },
  },
});
```

## Troubleshooting

### Card Not Showing
- Check if member has active subscription
- Verify webhook received `checkout.session.completed` event
- Check Supabase logs for edge function errors

### "Card not found" Error
- Member may not have completed subscription
- Check `members` table for `stripe_card_id`
- Manually trigger card creation via `create-issuing-card` function

### Stripe Issuing Not Available
- Verify your Stripe account country is supported
- Complete Stripe Issuing onboarding
- Contact Stripe support for approval

## Next Steps

1. **Test with real subscription** - Subscribe and verify card creation
2. **Customize spending limits** - Adjust based on your business model
3. **Add transaction history** - Show members their card transactions
4. **Implement card controls** - Allow members to freeze/unfreeze cards
5. **Add multiple cards** - Let members create cards for specific purposes
