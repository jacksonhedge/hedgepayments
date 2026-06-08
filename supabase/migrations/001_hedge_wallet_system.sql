-- HedgePayments Wallet System Schema
-- Complete digital wallet infrastructure with multi-currency support

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Custom types
CREATE TYPE currency_type AS ENUM (
  'USD', 'EUR', 'GBP', 'CAD', 'AUD', 'JPY', 'CNY', 'INR',
  'BTC', 'ETH', 'USDC', 'USDT'
);

CREATE TYPE wallet_status AS ENUM (
  'pending_verification',
  'active',
  'suspended',
  'frozen',
  'closed'
);

CREATE TYPE transaction_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'reversed',
  'refunded',
  'cancelled'
);

CREATE TYPE transaction_type AS ENUM (
  'deposit',
  'withdrawal',
  'transfer_in',
  'transfer_out',
  'payment',
  'refund',
  'fee',
  'adjustment',
  'hold',
  'release'
);

CREATE TYPE payment_method_type AS ENUM (
  'card',
  'bank_account',
  'wallet',
  'crypto',
  'paypal',
  'venmo',
  'cashapp',
  'apple_pay',
  'google_pay',
  'klarna',
  'afterpay',
  'affirm'
);

CREATE TYPE kyc_status AS ENUM (
  'not_started',
  'pending',
  'in_review',
  'approved',
  'rejected',
  'expired'
);

CREATE TYPE risk_level AS ENUM (
  'low',
  'medium',
  'high',
  'critical'
);

-- =====================================================
-- Core Tables
-- =====================================================

-- Organizations (for business accounts)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255),
  tax_id VARCHAR(50),
  website VARCHAR(255),
  industry VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(50),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  date_of_birth DATE,
  ssn_last4 VARCHAR(4),
  organization_id UUID REFERENCES organizations(id),
  kyc_status kyc_status DEFAULT 'not_started',
  kyc_completed_at TIMESTAMPTZ,
  risk_score INTEGER DEFAULT 0,
  risk_level risk_level DEFAULT 'low',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Wallets (multi-currency support)
CREATE TABLE wallets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id),
  currency currency_type NOT NULL DEFAULT 'USD',

  -- Balance tracking (in smallest unit: cents for USD, satoshi for BTC, etc.)
  balance_available BIGINT NOT NULL DEFAULT 0,
  balance_pending BIGINT NOT NULL DEFAULT 0,
  balance_reserved BIGINT NOT NULL DEFAULT 0,

  status wallet_status DEFAULT 'pending_verification',

  -- Limits
  daily_limit BIGINT,
  monthly_limit BIGINT,
  transaction_limit BIGINT,

  -- Metadata
  label VARCHAR(100),
  is_primary BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure one primary wallet per currency per user.
-- (Partial uniqueness must be an index in Postgres, not an inline table constraint.)
CREATE UNIQUE INDEX wallets_one_primary_per_user_currency
  ON wallets(user_id, currency) WHERE is_primary = TRUE;

-- Create indexes for wallet queries
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_wallets_status ON wallets(status);
CREATE INDEX idx_wallets_currency ON wallets(currency);

-- Ledger entries (double-entry bookkeeping)
CREATE TABLE ledger_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL,
  wallet_id UUID NOT NULL REFERENCES wallets(id),

  -- Double-entry accounting
  debit_amount BIGINT DEFAULT 0,
  credit_amount BIGINT DEFAULT 0,

  -- Running balance after this entry
  balance_after BIGINT NOT NULL,

  -- Entry metadata
  entry_type VARCHAR(50) NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Ensure balanced entries
  CONSTRAINT balanced_entry CHECK (
    (debit_amount > 0 AND credit_amount = 0) OR
    (credit_amount > 0 AND debit_amount = 0)
  )
);

-- Create indexes for ledger queries
CREATE INDEX idx_ledger_entries_transaction_id ON ledger_entries(transaction_id);
CREATE INDEX idx_ledger_entries_wallet_id ON ledger_entries(wallet_id);
CREATE INDEX idx_ledger_entries_created_at ON ledger_entries(created_at DESC);

-- Transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Transaction parties
  source_wallet_id UUID REFERENCES wallets(id),
  destination_wallet_id UUID REFERENCES wallets(id),

  -- Transaction details
  type transaction_type NOT NULL,
  status transaction_status DEFAULT 'pending',
  currency currency_type NOT NULL,
  amount BIGINT NOT NULL,
  fee_amount BIGINT DEFAULT 0,
  net_amount BIGINT GENERATED ALWAYS AS (amount - fee_amount) STORED,

  -- Exchange rate for cross-currency
  exchange_rate DECIMAL(20, 10),
  converted_amount BIGINT,
  converted_currency currency_type,

  -- Payment method used
  payment_method_id UUID,

  -- External references
  external_id VARCHAR(255) UNIQUE,
  processor_id VARCHAR(255),

  -- Risk & compliance
  risk_score INTEGER,
  risk_flags JSONB DEFAULT '[]',
  requires_review BOOLEAN DEFAULT FALSE,
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES users(id),

  -- Idempotency
  idempotency_key VARCHAR(255) UNIQUE,

  -- Metadata
  description TEXT,
  metadata JSONB DEFAULT '{}',
  error_message TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,

  -- Ensure valid transaction flow
  CONSTRAINT valid_transaction_parties CHECK (
    (type IN ('transfer_in', 'transfer_out') AND source_wallet_id IS NOT NULL AND destination_wallet_id IS NOT NULL) OR
    (type IN ('deposit', 'payment', 'fee') AND destination_wallet_id IS NOT NULL) OR
    (type IN ('withdrawal', 'refund') AND source_wallet_id IS NOT NULL)
  )
);

-- Create indexes for transaction queries
CREATE INDEX idx_transactions_source_wallet ON transactions(source_wallet_id);
CREATE INDEX idx_transactions_destination_wallet ON transactions(destination_wallet_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_created_at ON transactions(created_at DESC);
CREATE INDEX idx_transactions_external_id ON transactions(external_id);
CREATE INDEX idx_transactions_idempotency_key ON transactions(idempotency_key);

-- Payment methods
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  type payment_method_type NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,

  -- Card details (tokenized)
  card_token VARCHAR(255),
  card_last4 VARCHAR(4),
  card_brand VARCHAR(50),
  card_exp_month INTEGER,
  card_exp_year INTEGER,

  -- Bank account details (tokenized)
  bank_token VARCHAR(255),
  bank_last4 VARCHAR(4),
  bank_name VARCHAR(100),
  account_type VARCHAR(20),
  routing_number VARCHAR(9),

  -- Digital wallet details
  wallet_provider VARCHAR(50),
  wallet_id VARCHAR(255),

  -- Crypto wallet
  crypto_address VARCHAR(255),
  crypto_network VARCHAR(50),

  -- Verification
  verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMPTZ,

  -- Metadata
  nickname VARCHAR(100),
  billing_address JSONB,
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure one default payment method per type per user.
-- (Partial uniqueness must be an index in Postgres, not an inline table constraint.)
CREATE UNIQUE INDEX payment_methods_one_default_per_user_type
  ON payment_methods(user_id, type) WHERE is_default = TRUE;

-- Create indexes for payment method queries
CREATE INDEX idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX idx_payment_methods_type ON payment_methods(type);

-- Payout methods
CREATE TABLE payout_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  type VARCHAR(50) NOT NULL, -- 'bank_account', 'debit_card', 'paypal', 'crypto'
  is_default BOOLEAN DEFAULT FALSE,

  -- Bank/Card details (tokenized)
  token VARCHAR(255),
  last4 VARCHAR(4),
  institution_name VARCHAR(100),

  -- Processing details
  instant_payout_eligible BOOLEAN DEFAULT FALSE,
  processing_days INTEGER DEFAULT 3,

  -- Metadata
  nickname VARCHAR(100),
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhook events
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  event_type VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,

  payload JSONB NOT NULL,

  -- Delivery tracking
  delivery_attempts INTEGER DEFAULT 0,
  delivered_at TIMESTAMPTZ,
  next_retry_at TIMESTAMPTZ,

  -- Response tracking
  last_response_status INTEGER,
  last_response_body TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for webhook queries
CREATE INDEX idx_webhook_events_resource ON webhook_events(resource_type, resource_id);
CREATE INDEX idx_webhook_events_created_at ON webhook_events(created_at DESC);
CREATE INDEX idx_webhook_events_next_retry ON webhook_events(next_retry_at) WHERE delivered_at IS NULL;

-- Audit logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id UUID REFERENCES users(id),
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,

  ip_address INET,
  user_agent TEXT,

  changes JSONB,
  metadata JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for audit queries
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- =====================================================
-- Functions
-- =====================================================

-- Function to get wallet balance
CREATE OR REPLACE FUNCTION get_wallet_balance(wallet_uuid UUID)
RETURNS TABLE (
  available BIGINT,
  pending BIGINT,
  reserved BIGINT,
  total BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    balance_available,
    balance_pending,
    balance_reserved,
    balance_available + balance_pending AS total
  FROM wallets
  WHERE id = wallet_uuid;
END;
$$ LANGUAGE plpgsql;

-- Function to process transaction (with double-entry bookkeeping)
CREATE OR REPLACE FUNCTION process_transaction(
  p_type transaction_type,
  p_amount BIGINT,
  p_currency currency_type,
  p_source_wallet_id UUID DEFAULT NULL,
  p_destination_wallet_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}',
  p_idempotency_key VARCHAR(255) DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_transaction_id UUID;
  v_source_balance BIGINT;
  v_destination_balance BIGINT;
BEGIN
  -- Check idempotency
  IF p_idempotency_key IS NOT NULL THEN
    SELECT id INTO v_transaction_id
    FROM transactions
    WHERE idempotency_key = p_idempotency_key;

    IF v_transaction_id IS NOT NULL THEN
      RETURN v_transaction_id;
    END IF;
  END IF;

  -- Start transaction
  BEGIN
    -- Create transaction record
    INSERT INTO transactions (
      type, amount, currency,
      source_wallet_id, destination_wallet_id,
      description, metadata, idempotency_key,
      status
    ) VALUES (
      p_type, p_amount, p_currency,
      p_source_wallet_id, p_destination_wallet_id,
      p_description, p_metadata, p_idempotency_key,
      'processing'
    ) RETURNING id INTO v_transaction_id;

    -- Handle source wallet debit
    IF p_source_wallet_id IS NOT NULL THEN
      UPDATE wallets
      SET
        balance_available = balance_available - p_amount,
        updated_at = NOW()
      WHERE id = p_source_wallet_id
        AND balance_available >= p_amount
      RETURNING balance_available INTO v_source_balance;

      IF v_source_balance IS NULL THEN
        RAISE EXCEPTION 'Insufficient funds in source wallet';
      END IF;

      -- Create ledger entry for debit
      INSERT INTO ledger_entries (
        transaction_id, wallet_id,
        debit_amount, balance_after,
        entry_type, description
      ) VALUES (
        v_transaction_id, p_source_wallet_id,
        p_amount, v_source_balance,
        'debit', p_description
      );
    END IF;

    -- Handle destination wallet credit
    IF p_destination_wallet_id IS NOT NULL THEN
      UPDATE wallets
      SET
        balance_available = balance_available + p_amount,
        updated_at = NOW()
      WHERE id = p_destination_wallet_id
      RETURNING balance_available INTO v_destination_balance;

      -- Create ledger entry for credit
      INSERT INTO ledger_entries (
        transaction_id, wallet_id,
        credit_amount, balance_after,
        entry_type, description
      ) VALUES (
        v_transaction_id, p_destination_wallet_id,
        p_amount, v_destination_balance,
        'credit', p_description
      );
    END IF;

    -- Update transaction status
    UPDATE transactions
    SET
      status = 'completed',
      completed_at = NOW(),
      updated_at = NOW()
    WHERE id = v_transaction_id;

    -- Create webhook event
    INSERT INTO webhook_events (
      event_type, resource_type, resource_id,
      payload
    ) VALUES (
      'transaction.completed', 'transaction', v_transaction_id,
      jsonb_build_object(
        'transaction_id', v_transaction_id,
        'type', p_type,
        'amount', p_amount,
        'currency', p_currency
      )
    );

    RETURN v_transaction_id;
  EXCEPTION
    WHEN OTHERS THEN
      -- Mark transaction as failed
      UPDATE transactions
      SET
        status = 'failed',
        failed_at = NOW(),
        error_message = SQLERRM,
        updated_at = NOW()
      WHERE id = v_transaction_id;

      RAISE;
  END;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate fees
CREATE OR REPLACE FUNCTION calculate_fee(
  p_amount BIGINT,
  p_type transaction_type,
  p_payment_method payment_method_type
)
RETURNS BIGINT AS $$
DECLARE
  v_fee_percentage DECIMAL;
  v_fixed_fee BIGINT;
  v_calculated_fee BIGINT;
BEGIN
  -- Define fee structure
  CASE
    WHEN p_payment_method = 'card' THEN
      v_fee_percentage := 0.029; -- 2.9%
      v_fixed_fee := 30; -- 30 cents
    WHEN p_payment_method = 'bank_account' THEN
      v_fee_percentage := 0.008; -- 0.8%
      v_fixed_fee := 0;
    WHEN p_payment_method IN ('paypal', 'venmo') THEN
      v_fee_percentage := 0.025; -- 2.5%
      v_fixed_fee := 25;
    WHEN p_payment_method = 'crypto' THEN
      v_fee_percentage := 0.015; -- 1.5%
      v_fixed_fee := 0;
    ELSE
      v_fee_percentage := 0.025; -- Default 2.5%
      v_fixed_fee := 25;
  END CASE;

  -- Calculate fee
  v_calculated_fee := CEIL(p_amount * v_fee_percentage) + v_fixed_fee;

  -- Apply minimum fee
  IF v_calculated_fee < 50 THEN -- Minimum 50 cents
    v_calculated_fee := 50;
  END IF;

  RETURN v_calculated_fee;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- Triggers
-- =====================================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to tables
CREATE TRIGGER update_users_timestamp BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_wallets_timestamp BEFORE UPDATE ON wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_transactions_timestamp BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_payment_methods_timestamp BEFORE UPDATE ON payment_methods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =====================================================
-- Row Level Security (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE payout_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY users_read_own ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY wallets_read_own ON wallets
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY transactions_read_own ON transactions
  FOR SELECT USING (
    source_wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid()) OR
    destination_wallet_id IN (SELECT id FROM wallets WHERE user_id = auth.uid())
  );

CREATE POLICY payment_methods_read_own ON payment_methods
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY payout_methods_read_own ON payout_methods
  FOR SELECT USING (user_id = auth.uid());

-- =====================================================
-- Initial Data / Seed
-- =====================================================

-- Create system wallet for fees.
-- Seed the auth row first — users.id references auth.users(id).
INSERT INTO auth.users (id, email, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000000', 'system@hedgepayments.com', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, first_name, last_name, kyc_status)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'system@hedgepayments.com',
  'System',
  'Account',
  'approved'
) ON CONFLICT DO NOTHING;

INSERT INTO wallets (user_id, currency, status)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'USD',
  'active'
) ON CONFLICT DO NOTHING;