-- Create table for storing Stripe cardholder information
CREATE TABLE IF NOT EXISTS stripe_cardholders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  stripe_cardholder_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for storing virtual card information
CREATE TABLE IF NOT EXISTS virtual_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID NOT NULL,
  stripe_card_id TEXT NOT NULL,
  last4 TEXT,
  brand TEXT,
  status TEXT DEFAULT 'active',
  spending_limit INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for storing payment tokens
CREATE TABLE IF NOT EXISTS payment_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  virtual_card_id UUID REFERENCES virtual_cards(id),
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  used_at TIMESTAMP WITH TIME ZONE,
  merchant_name TEXT,
  amount INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create table for membership subscriptions
CREATE TABLE IF NOT EXISTS membership_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  stripe_subscription_id TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT NOT NULL,
  plan TEXT NOT NULL,
  status TEXT NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_stripe_cardholders_user_id ON stripe_cardholders(user_id);
CREATE INDEX idx_virtual_cards_account_id ON virtual_cards(account_id);
CREATE INDEX idx_payment_tokens_virtual_card_id ON payment_tokens(virtual_card_id);
CREATE INDEX idx_membership_subscriptions_user_id ON membership_subscriptions(user_id);

-- Enable Row Level Security
ALTER TABLE stripe_cardholders ENABLE ROW LEVEL SECURITY;
ALTER TABLE virtual_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_subscriptions ENABLE ROW LEVEL SECURITY;