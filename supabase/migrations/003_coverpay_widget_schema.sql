-- ============================================
-- COVERPAY WIDGET SCHEMA
-- ============================================
-- Supabase Migration v003
--
-- Tables for the CoverPay embeddable BNPL widget:
-- - Merchant provider credentials (Klarna, Affirm, Afterpay, Sezzle)
-- - Checkout sessions
-- - Transactions

-- ============================================
-- COVERPAY MERCHANT PROVIDERS TABLE
-- ============================================
-- Stores merchant's BNPL provider API credentials
CREATE TABLE coverpay_merchant_providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Link to business account
  business_id UUID NOT NULL REFERENCES business_accounts(id) ON DELETE CASCADE,

  -- Provider identification
  provider_id TEXT NOT NULL CHECK (provider_id IN ('klarna', 'affirm', 'afterpay', 'sezzle', 'zip', 'paypal')),
  provider_name TEXT NOT NULL,

  -- Encrypted credentials (stored as JSONB)
  -- Structure varies by provider:
  -- Klarna: {username, password, merchantId}
  -- Affirm: {publicKey, secretKey, merchantId}
  -- Afterpay: {merchantId, secretKey}
  -- Sezzle: {publicKey, secretKey, merchantId}
  credentials_encrypted JSONB NOT NULL DEFAULT '{}',

  -- Status
  enabled BOOLEAN DEFAULT false,
  test_mode BOOLEAN DEFAULT true,

  -- Waterfall priority (lower = higher priority)
  priority INTEGER DEFAULT 1,

  -- Connection status
  last_test_at TIMESTAMPTZ,
  last_test_success BOOLEAN,
  last_test_error TEXT,

  -- Provider-specific config
  config JSONB DEFAULT '{}',
  -- Examples:
  -- {minAmount: 3500, maxAmount: 150000, supportedCurrencies: ['USD']}

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint: one provider per business
  UNIQUE(business_id, provider_id)
);

-- Indexes
CREATE INDEX idx_coverpay_providers_business ON coverpay_merchant_providers(business_id);
CREATE INDEX idx_coverpay_providers_enabled ON coverpay_merchant_providers(business_id, enabled) WHERE enabled = true;
CREATE INDEX idx_coverpay_providers_priority ON coverpay_merchant_providers(business_id, priority);

-- ============================================
-- COVERPAY SESSIONS TABLE
-- ============================================
-- Checkout sessions created by the widget
CREATE TABLE coverpay_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Session token for API lookups (public-facing)
  session_token TEXT UNIQUE NOT NULL,

  -- Link to business
  business_id UUID NOT NULL REFERENCES business_accounts(id) ON DELETE CASCADE,

  -- Order details
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',
  order_id TEXT,                        -- Merchant's order reference

  -- Customer info
  customer_email TEXT,
  customer_phone TEXT,
  customer_name TEXT,
  customer_data JSONB DEFAULT '{}',     -- Additional customer info for providers

  -- Session status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',           -- Session created, not started
    'eligibility_check', -- Checking provider eligibility
    'provider_selected', -- Customer selected a provider
    'redirected',        -- Customer redirected to provider
    'authorized',        -- Payment authorized
    'captured',          -- Payment captured
    'failed',            -- All providers declined
    'cancelled',         -- Customer cancelled
    'expired'            -- Session expired
  )),

  -- Provider tracking
  providers_attempted TEXT[] DEFAULT '{}',  -- Array of provider IDs attempted
  selected_provider TEXT,                   -- Provider customer chose

  -- Eligibility results from parallel checks
  eligibility_results JSONB DEFAULT '{}',
  -- Format: {
  --   klarna: {eligible: true, plans: [...], limit: 50000},
  --   affirm: {eligible: false, reason: 'amount_too_low'},
  --   ...
  -- }

  -- Provider session/order IDs
  provider_session_id TEXT,
  provider_order_id TEXT,

  -- Redirect URLs
  success_url TEXT,
  cancel_url TEXT,

  -- Widget config at session creation
  widget_config JSONB DEFAULT '{}',

  -- Metadata from merchant
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '30 minutes',
  completed_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_coverpay_sessions_token ON coverpay_sessions(session_token);
CREATE INDEX idx_coverpay_sessions_business ON coverpay_sessions(business_id);
CREATE INDEX idx_coverpay_sessions_status ON coverpay_sessions(status);
CREATE INDEX idx_coverpay_sessions_order ON coverpay_sessions(business_id, order_id);
CREATE INDEX idx_coverpay_sessions_created ON coverpay_sessions(created_at DESC);
CREATE INDEX idx_coverpay_sessions_expires ON coverpay_sessions(expires_at);
CREATE INDEX idx_coverpay_sessions_provider ON coverpay_sessions(provider_session_id);

-- ============================================
-- COVERPAY TRANSACTIONS TABLE
-- ============================================
-- Completed BNPL transactions
CREATE TABLE coverpay_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Link to session
  session_id UUID REFERENCES coverpay_sessions(id) ON DELETE SET NULL,

  -- Link to business
  business_id UUID NOT NULL REFERENCES business_accounts(id) ON DELETE CASCADE,

  -- Provider info
  provider_id TEXT NOT NULL,
  provider_txn_id TEXT,                 -- Provider's transaction/order ID

  -- Amount
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'USD',

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',
    'authorized',
    'captured',
    'partially_refunded',
    'refunded',
    'failed',
    'cancelled'
  )),

  -- Plan details
  plan_type TEXT,                       -- 'pay_in_4', 'monthly', 'pay_in_3', etc.
  plan_details JSONB DEFAULT '{}',      -- Payment schedule, APR, etc.

  -- Customer info (denormalized for reporting)
  customer_email TEXT,
  order_id TEXT,

  -- Provider response data
  provider_response JSONB DEFAULT '{}',

  -- Refund tracking
  refunded_amount NUMERIC(10,2) DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  authorized_at TIMESTAMPTZ,
  captured_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_coverpay_txn_session ON coverpay_transactions(session_id);
CREATE INDEX idx_coverpay_txn_business ON coverpay_transactions(business_id);
CREATE INDEX idx_coverpay_txn_provider ON coverpay_transactions(provider_id);
CREATE INDEX idx_coverpay_txn_provider_id ON coverpay_transactions(provider_txn_id);
CREATE INDEX idx_coverpay_txn_status ON coverpay_transactions(status);
CREATE INDEX idx_coverpay_txn_created ON coverpay_transactions(created_at DESC);
CREATE INDEX idx_coverpay_txn_order ON coverpay_transactions(business_id, order_id);

-- ============================================
-- COVERPAY WEBHOOK LOGS TABLE
-- ============================================
-- Audit log for provider webhooks
CREATE TABLE coverpay_webhook_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Business reference
  business_id UUID REFERENCES business_accounts(id) ON DELETE SET NULL,

  -- Provider info
  provider_id TEXT NOT NULL,
  event_type TEXT NOT NULL,

  -- Related IDs
  session_id UUID REFERENCES coverpay_sessions(id) ON DELETE SET NULL,
  transaction_id UUID REFERENCES coverpay_transactions(id) ON DELETE SET NULL,
  provider_event_id TEXT,

  -- Raw data
  raw_payload JSONB NOT NULL,
  headers JSONB,

  -- Processing
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  processing_error TEXT,

  -- Signature verification
  signature_valid BOOLEAN,

  -- Timestamp
  received_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_coverpay_webhooks_provider ON coverpay_webhook_logs(provider_id);
CREATE INDEX idx_coverpay_webhooks_session ON coverpay_webhook_logs(session_id);
CREATE INDEX idx_coverpay_webhooks_received ON coverpay_webhook_logs(received_at DESC);
CREATE INDEX idx_coverpay_webhooks_processed ON coverpay_webhook_logs(processed);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Generate session token
CREATE OR REPLACE FUNCTION generate_session_token()
RETURNS TEXT AS $$
BEGIN
  RETURN 'cps_' || encode(gen_random_bytes(16), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Create a new CoverPay session
CREATE OR REPLACE FUNCTION create_coverpay_session(
  p_business_id UUID,
  p_amount NUMERIC,
  p_currency TEXT DEFAULT 'USD',
  p_order_id TEXT DEFAULT NULL,
  p_customer_email TEXT DEFAULT NULL,
  p_customer_data JSONB DEFAULT '{}',
  p_success_url TEXT DEFAULT NULL,
  p_cancel_url TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'
)
RETURNS coverpay_sessions AS $$
DECLARE
  v_session coverpay_sessions;
BEGIN
  INSERT INTO coverpay_sessions (
    session_token,
    business_id,
    amount,
    currency,
    order_id,
    customer_email,
    customer_data,
    success_url,
    cancel_url,
    metadata
  ) VALUES (
    generate_session_token(),
    p_business_id,
    p_amount,
    p_currency,
    p_order_id,
    p_customer_email,
    p_customer_data,
    p_success_url,
    p_cancel_url,
    p_metadata
  )
  RETURNING * INTO v_session;

  RETURN v_session;
END;
$$ LANGUAGE plpgsql;

-- Get enabled providers for a business in priority order
CREATE OR REPLACE FUNCTION get_merchant_providers(p_business_id UUID)
RETURNS SETOF coverpay_merchant_providers AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM coverpay_merchant_providers
  WHERE business_id = p_business_id
    AND enabled = true
  ORDER BY priority ASC;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE TRIGGER update_coverpay_providers_updated_at
  BEFORE UPDATE ON coverpay_merchant_providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_coverpay_sessions_updated_at
  BEFORE UPDATE ON coverpay_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_coverpay_transactions_updated_at
  BEFORE UPDATE ON coverpay_transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE coverpay_merchant_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE coverpay_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coverpay_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE coverpay_webhook_logs ENABLE ROW LEVEL SECURITY;

-- Merchants can manage their own providers
CREATE POLICY "Merchants can view own providers"
  ON coverpay_merchant_providers FOR SELECT
  USING (business_id IN (SELECT id FROM business_accounts WHERE auth_user_id = auth.uid()));

CREATE POLICY "Merchants can insert own providers"
  ON coverpay_merchant_providers FOR INSERT
  WITH CHECK (business_id IN (SELECT id FROM business_accounts WHERE auth_user_id = auth.uid()));

CREATE POLICY "Merchants can update own providers"
  ON coverpay_merchant_providers FOR UPDATE
  USING (business_id IN (SELECT id FROM business_accounts WHERE auth_user_id = auth.uid()));

CREATE POLICY "Merchants can delete own providers"
  ON coverpay_merchant_providers FOR DELETE
  USING (business_id IN (SELECT id FROM business_accounts WHERE auth_user_id = auth.uid()));

-- Merchants can view their sessions and transactions
CREATE POLICY "Merchants can view own sessions"
  ON coverpay_sessions FOR SELECT
  USING (business_id IN (SELECT id FROM business_accounts WHERE auth_user_id = auth.uid()));

CREATE POLICY "Merchants can view own transactions"
  ON coverpay_transactions FOR SELECT
  USING (business_id IN (SELECT id FROM business_accounts WHERE auth_user_id = auth.uid()));

CREATE POLICY "Merchants can view own webhooks"
  ON coverpay_webhook_logs FOR SELECT
  USING (business_id IN (SELECT id FROM business_accounts WHERE auth_user_id = auth.uid()));

-- Service role has full access (for API server)
CREATE POLICY "Service role full access to coverpay_merchant_providers"
  ON coverpay_merchant_providers FOR ALL
  USING (true);

CREATE POLICY "Service role full access to coverpay_sessions"
  ON coverpay_sessions FOR ALL
  USING (true);

CREATE POLICY "Service role full access to coverpay_transactions"
  ON coverpay_transactions FOR ALL
  USING (true);

CREATE POLICY "Service role full access to coverpay_webhook_logs"
  ON coverpay_webhook_logs FOR ALL
  USING (true);
