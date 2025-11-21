-- Drop existing members table if it exists and recreate with proper schema
DROP TABLE IF EXISTS public.members CASCADE;

CREATE TABLE public.members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  stripe_customer_id text UNIQUE,
  stripe_cardholder_id text,
  membership_status text DEFAULT 'pending' CHECK (membership_status IN ('pending', 'active', 'canceled')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Drop and recreate virtual_cards table with proper schema
DROP TABLE IF EXISTS public.virtual_cards CASCADE;

CREATE TABLE public.virtual_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  stripe_card_id text NOT NULL,
  last4 text,
  exp_month int,
  exp_year int,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'used', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS public.transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id uuid NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  stripe_card_id text NOT NULL,
  stripe_transaction_id text NOT NULL,
  amount bigint,
  currency text,
  merchant_name text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_members_stripe_customer_id ON public.members(stripe_customer_id);
CREATE INDEX idx_members_user_id ON public.members(user_id);
CREATE INDEX idx_virtual_cards_member_id ON public.virtual_cards(member_id);
CREATE INDEX idx_virtual_cards_stripe_card_id ON public.virtual_cards(stripe_card_id);
CREATE INDEX idx_virtual_cards_status ON public.virtual_cards(status);
CREATE INDEX idx_transactions_member_id ON public.transactions(member_id);
CREATE INDEX idx_transactions_stripe_card_id ON public.transactions(stripe_card_id);

-- Enable RLS
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.virtual_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role full access members" ON public.members FOR ALL USING (true);
CREATE POLICY "Service role full access virtual_cards" ON public.virtual_cards FOR ALL USING (true);
CREATE POLICY "Service role full access transactions" ON public.transactions FOR ALL USING (true);
