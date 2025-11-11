# 📱 Push Provisioning Guide - Auto-Add Cards to Wallets

## Overview

Push provisioning automatically adds your rotated virtual cards to Apple Pay and Google Pay **without user intervention**. This is critical for seamless card rotation.

---

## 🍎 Apple Pay Push Provisioning

### Requirements

1. **Apple Developer Account** ($99/year)
2. **Stripe Issuing approval** for Apple Pay
3. **Apple Pay Certificate** from Stripe Dashboard

### Setup Steps

#### 1. Contact Stripe Support

Email: issuing@stripe.com

```
Subject: Enable Apple Pay Push Provisioning

Hi Stripe Team,

I need to enable Apple Pay push provisioning for my Stripe Issuing cards.

Account ID: [Your Stripe Account ID]
Use Case: Instant card rotation for fraud prevention
Expected Volume: [Monthly transactions]

Please enable Apple Pay provisioning and provide setup instructions.

Thank you!
```

#### 2. Configure in Stripe Dashboard

1. Go to Stripe Dashboard → Issuing → Settings
2. Enable "Apple Pay provisioning"
3. Upload Apple Pay certificate
4. Configure push provisioning endpoint

#### 3. Implement in Edge Function

```typescript
// After creating new card in process-member-payment
try {
  const provisioningData = await stripe.issuing.cards.deliverCard(
    newCard.id,
    {
      type: 'apple_pay',
      // Optional: specific device
      device_id: member.apple_device_id
    }
  );

  // Store provisioning token
  await supabase.from('card_rotation_history').update({
    apple_pay_token: provisioningData.token,
    wallet_provisioned: true,
    wallet_provisioned_at: new Date().toISOString()
  }).eq('new_card_id', newCard.id);

  console.log('✅ Card auto-added to Apple Pay');
} catch (error) {
  console.error('Apple Pay provisioning failed:', error);
}
```

---

## 🤖 Google Pay Push Provisioning

### Requirements

1. **Google Pay API access**
2. **Stripe Issuing approval** for Google Pay
3. **Google Cloud Project** with Wallet API enabled

### Setup Steps

#### 1. Enable in Stripe

Contact Stripe support to enable Google Pay provisioning.

#### 2. Configure Google Cloud

1. Create project at console.cloud.google.com
2. Enable "Google Pay API for Passes"
3. Create service account
4. Download credentials JSON

#### 3. Implement Provisioning

```typescript
// After creating new card
try {
  const googlePayData = await stripe.issuing.cards.deliverCard(
    newCard.id,
    {
      type: 'google_pay',
      wallet_provider: 'google_pay'
    }
  );

  await supabase.from('card_rotation_history').update({
    google_pay_token: googlePayData.token,
    wallet_provisioned: true,
    wallet_provisioned_at: new Date().toISOString()
  }).eq('new_card_id', newCard.id);

  console.log('✅ Card auto-added to Google Pay');
} catch (error) {
  console.error('Google Pay provisioning failed:', error);
}
```

---

## 📲 Samsung Pay (Optional)

Samsung Pay uses MST (Magnetic Secure Transmission) + NFC.

Contact Stripe for Samsung Pay support.

---

## 🔄 Complete Rotation Flow with Push Provisioning

```typescript
async function rotateCardWithProvisioning(member, transaction) {
  // 1. Freeze old card
  await stripe.issuing.cards.update(member.stripe_card_id, {
    status: 'canceled'
  });

  // 2. Create new card
  const newCard = await stripe.issuing.cards.create({
    cardholder: member.stripe_cardholder_id,
    currency: 'usd',
    type: 'virtual',
    status: 'active',
    spending_controls: {
      spending_limits: [{ amount: 100000, interval: 'monthly' }]
    }
  });

  // 3. Push to Apple Pay
  let applePaySuccess = false;
  try {
    await stripe.issuing.cards.deliverCard(newCard.id, {
      type: 'apple_pay'
    });
    applePaySuccess = true;
  } catch (e) {
    console.error('Apple Pay failed:', e);
  }

  // 4. Push to Google Pay
  let googlePaySuccess = false;
  try {
    await stripe.issuing.cards.deliverCard(newCard.id, {
      type: 'google_pay'
    });
    googlePaySuccess = true;
  } catch (e) {
    console.error('Google Pay failed:', e);
  }

  // 5. Update database
  await supabase.from('members').update({
    stripe_card_id: newCard.id,
    previous_card_id: member.stripe_card_id,
    card_rotation_count: (member.card_rotation_count || 0) + 1,
    last_card_rotation_at: new Date().toISOString()
  }).eq('id', member.id);

  // 6. Log rotation
  await supabase.from('card_rotation_history').insert({
    member_id: member.id,
    old_card_id: member.stripe_card_id,
    new_card_id: newCard.id,
    transaction_id: transaction.id,
    wallet_provisioned: applePaySuccess || googlePaySuccess,
    wallet_provisioned_at: new Date().toISOString()
  });

  return {
    success: true,
    newCardId: newCard.id,
    applePayProvisioned: applePaySuccess,
    googlePayProvisioned: googlePaySuccess
  };
}
```

---

## 🧪 Testing Push Provisioning

### Test Mode

Stripe provides test tokens for wallet provisioning:

```typescript
// Test Apple Pay
const testToken = 'tok_apple_pay_test_12345';

// Test Google Pay  
const testToken = 'tok_google_pay_test_67890';
```

### Live Mode Testing

1. Use your own device with Apple/Google Pay
2. Make test transaction
3. Check Wallet app for new card
4. Verify old card removed
5. Test tap-to-pay at terminal

---

## 🚨 Fallback: Manual Provisioning

If push provisioning fails, show user card details:

```typescript
// In frontend after rotation
if (!walletProvisioned) {
  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
      <h3>⚠️ Manual Setup Required</h3>
      <p>Your new card is ready! Add it to your wallet:</p>
      
      <div className="mt-2 space-y-1">
        <div>Card: {cardNumber}</div>
        <div>Exp: {expiry}</div>
        <div>CVV: {cvv}</div>
      </div>
      
      <button onClick={addToApplePay}>
        Add to Apple Pay
      </button>
      <button onClick={addToGooglePay}>
        Add to Google Pay
      </button>
    </div>
  );
}
```

---

## 📊 Monitoring Provisioning Success

```sql
-- Check provisioning success rate
SELECT 
  COUNT(*) as total_rotations,
  SUM(CASE WHEN wallet_provisioned THEN 1 ELSE 0 END) as provisioned,
  ROUND(100.0 * SUM(CASE WHEN wallet_provisioned THEN 1 ELSE 0 END) / COUNT(*), 2) as success_rate
FROM card_rotation_history
WHERE rotated_at > NOW() - INTERVAL '30 days';
```

---

## ✅ Success Criteria

- ✅ Card rotates after every transaction
- ✅ New card auto-added to Apple Pay (if enabled)
- ✅ New card auto-added to Google Pay (if enabled)
- ✅ Old card removed from wallets
- ✅ User can tap-to-pay immediately
- ✅ Zero manual intervention required

**This completes your patent-protected fraud prevention system!**
