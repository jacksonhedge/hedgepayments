-- ============================================
-- HEDGE PAYMENTS - Business Onboarding Schema
-- ============================================
-- Supabase Migration v002
--
-- Supports multi-step business onboarding with:
-- - Business profile & underwriting info
-- - Product selection (CoverPay, Bankroll Gateway, SideBet)
-- - Onboarding status tracking
-- - API key management

-- ============================================
-- ENUMS
-- ============================================

CREATE TYPE business_type AS ENUM (
  'fintech',
  'gaming',
  'sports_betting',
  'daily_fantasy',
  'ecommerce',
  'saas',
  'marketplace',
  'hospitality',
  'real_money_gaming',
  'sweepstakes',
  'other'
);

CREATE TYPE business_structure AS ENUM (
  'sole_proprietorship',
  'llc',
  'corporation',
  'partnership',
  's_corp',
  'non_profit',
  'other'
);

CREATE TYPE onboarding_status AS ENUM (
  'started',           -- Just created account
  'profile_complete',  -- Basic info filled
  'products_selected', -- Chose products
  'underwriting',      -- In underwriting review
  'documents_pending', -- Awaiting documents
  'under_review',      -- Manual review
  'approved',          -- Fully approved
  'rejected',          -- Application denied
  'suspended'          -- Account suspended
);

CREATE TYPE product_status AS ENUM (
  'not_requested',
  'requested',
  'pending_underwriting',
  'pending_documents',
  'under_review',
  'approved',
  'rejected',
  'active',
  'suspended'
);

-- ============================================
-- BUSINESS ACCOUNTS TABLE
-- ============================================
-- Main table for B2B merchant accounts
CREATE TABLE business_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Link to Supabase auth
  auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- ==========================================
  -- BASIC BUSINESS INFO
  -- ==========================================
  business_name TEXT NOT NULL,
  dba_name TEXT,                           -- Doing Business As
  business_type business_type NOT NULL,
  business_structure business_structure,

  -- Contact info
  contact_first_name TEXT NOT NULL,
  contact_last_name TEXT NOT NULL,
  contact_email TEXT NOT NULL UNIQUE,
  contact_phone TEXT,
  contact_title TEXT,                      -- CEO, CTO, etc.

  -- Website & social
  website TEXT,
  linkedin_url TEXT,
  app_store_url TEXT,
  play_store_url TEXT,

  -- ==========================================
  -- BUSINESS ADDRESS
  -- ==========================================
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT DEFAULT 'US',

  -- ==========================================
  -- UNDERWRITING FIELDS
  -- ==========================================
  -- Legal/Tax info
  ein TEXT,                                -- Employer Identification Number
  state_of_incorporation TEXT,
  date_of_incorporation DATE,

  -- Business details
  business_description TEXT,
  years_in_business INTEGER,
  employee_count TEXT,                     -- '1-10', '11-50', '51-200', '201-500', '500+'

  -- Financial info
  annual_revenue TEXT,                     -- Revenue range
  expected_monthly_volume TEXT,            -- Expected payment volume
  average_transaction_size TEXT,           -- Avg transaction amount

  -- Industry-specific (gaming/betting)
  gaming_licenses TEXT[],                  -- Array of license jurisdictions
  is_licensed BOOLEAN DEFAULT false,
  license_numbers JSONB DEFAULT '[]',      -- [{state: 'NJ', number: 'xxx', expiry: '2025-01-01'}]

  -- Risk assessment
  has_chargebacks BOOLEAN,
  chargeback_rate NUMERIC(5,2),            -- Percentage
  previous_processor TEXT,
  reason_for_switch TEXT,

  -- Beneficial owners (for KYB)
  beneficial_owners JSONB DEFAULT '[]',
  -- Format: [{name, title, ownership_percent, dob, ssn_last4, address}]

  -- ==========================================
  -- PRODUCTS
  -- ==========================================
  -- CoverPay (BNPL Orchestration)
  coverpay_status product_status DEFAULT 'not_requested',
  coverpay_requested_at TIMESTAMPTZ,
  coverpay_approved_at TIMESTAMPTZ,
  coverpay_config JSONB DEFAULT '{}',

  -- Bankroll Gateway (Payment Gateway)
  gateway_status product_status DEFAULT 'not_requested',
  gateway_requested_at TIMESTAMPTZ,
  gateway_approved_at TIMESTAMPTZ,
  gateway_config JSONB DEFAULT '{}',

  -- SideBet (Round-ups as a service)
  sidebet_status product_status DEFAULT 'not_requested',
  sidebet_requested_at TIMESTAMPTZ,
  sidebet_approved_at TIMESTAMPTZ,
  sidebet_config JSONB DEFAULT '{}',

  -- ==========================================
  -- API CREDENTIALS
  -- ==========================================
  api_key_test TEXT UNIQUE,               -- pk_test_xxx
  api_secret_test TEXT,                   -- sk_test_xxx
  api_key_live TEXT UNIQUE,               -- pk_live_xxx
  api_secret_live TEXT,                   -- sk_live_xxx
  webhook_secret TEXT,
  webhook_url TEXT,

  -- ==========================================
  -- STATUS & TRACKING
  -- ==========================================
  onboarding_status onboarding_status DEFAULT 'started',
  onboarding_step INTEGER DEFAULT 1,      -- Current step in wizard (1-5)
  onboarding_completed_at TIMESTAMPTZ,

  -- Risk scoring
  risk_score INTEGER,                     -- 0-100, lower is better
  risk_tier TEXT,                         -- 'low', 'medium', 'high'
  risk_notes TEXT,

  -- Review info
  reviewed_by UUID,                       -- Admin user who reviewed
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  rejection_reason TEXT,

  -- Metadata
  referral_source TEXT,
  referral_code TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ
);

-- Indexes
CREATE INDEX idx_business_accounts_auth ON business_accounts(auth_user_id);
CREATE INDEX idx_business_accounts_email ON business_accounts(contact_email);
CREATE INDEX idx_business_accounts_api_key_test ON business_accounts(api_key_test);
CREATE INDEX idx_business_accounts_api_key_live ON business_accounts(api_key_live);
CREATE INDEX idx_business_accounts_status ON business_accounts(onboarding_status);
CREATE INDEX idx_business_accounts_type ON business_accounts(business_type);
CREATE INDEX idx_business_accounts_created ON business_accounts(created_at DESC);

-- ============================================
-- BUSINESS DOCUMENTS TABLE
-- ============================================
-- Documents uploaded for underwriting
CREATE TABLE business_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES business_accounts(id) ON DELETE CASCADE,

  -- Document info
  document_type TEXT NOT NULL,            -- 'articles_of_incorporation', 'ein_letter', 'bank_statement', 'gaming_license', etc.
  document_name TEXT NOT NULL,
  file_path TEXT NOT NULL,                -- Supabase storage path
  file_size INTEGER,
  mime_type TEXT,

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,

  -- Expiration (for licenses)
  expires_at DATE,

  -- Timestamps
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_business_docs_business ON business_documents(business_id);
CREATE INDEX idx_business_docs_type ON business_documents(document_type);
CREATE INDEX idx_business_docs_status ON business_documents(status);

-- ============================================
-- ONBOARDING EVENTS TABLE
-- ============================================
-- Track onboarding progress and events
CREATE TABLE onboarding_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES business_accounts(id) ON DELETE CASCADE,

  event_type TEXT NOT NULL,               -- 'step_completed', 'document_uploaded', 'product_selected', etc.
  event_data JSONB DEFAULT '{}',

  -- Context
  ip_address INET,
  user_agent TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_onboarding_events_business ON onboarding_events(business_id);
CREATE INDEX idx_onboarding_events_type ON onboarding_events(event_type);
CREATE INDEX idx_onboarding_events_created ON onboarding_events(created_at DESC);

-- ============================================
-- PRODUCT INTEREST TABLE
-- ============================================
-- Detailed product configuration requests
CREATE TABLE product_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES business_accounts(id) ON DELETE CASCADE,

  product TEXT NOT NULL CHECK (product IN ('coverpay', 'gateway', 'sidebet')),

  -- Request details
  use_cases TEXT[],                       -- What they want to use it for
  integration_type TEXT,                  -- 'api', 'sdk', 'widget', 'white_label'
  expected_volume TEXT,
  launch_timeline TEXT,                   -- 'immediately', '1-3 months', '3-6 months', '6+ months'

  -- Technical requirements
  platforms TEXT[],                       -- 'ios', 'android', 'web', 'react_native', 'flutter'
  existing_integrations TEXT[],           -- Current payment providers

  -- CoverPay specific
  bnpl_providers_wanted TEXT[],           -- Which BNPL providers they want
  has_existing_bnpl_accounts BOOLEAN,

  -- Gateway specific
  payment_methods_wanted TEXT[],          -- 'cards', 'ach', 'crypto', etc.

  -- SideBet specific
  bank_connection_provider TEXT,          -- 'plaid', 'meld', 'finicity'
  round_up_destination TEXT,              -- Where round-ups go

  -- Notes
  additional_notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_product_requests_business ON product_requests(business_id);
CREATE INDEX idx_product_requests_product ON product_requests(product);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Generate API key
CREATE OR REPLACE FUNCTION generate_api_key(prefix TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN prefix || '_' || encode(gen_random_bytes(24), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Create business account with API keys
CREATE OR REPLACE FUNCTION create_business_with_keys(
  p_auth_user_id UUID,
  p_business_name TEXT,
  p_contact_first_name TEXT,
  p_contact_last_name TEXT,
  p_contact_email TEXT,
  p_business_type business_type
)
RETURNS business_accounts AS $$
DECLARE
  v_business business_accounts;
BEGIN
  INSERT INTO business_accounts (
    auth_user_id,
    business_name,
    contact_first_name,
    contact_last_name,
    contact_email,
    business_type,
    api_key_test,
    api_secret_test,
    webhook_secret,
    onboarding_status,
    onboarding_step
  ) VALUES (
    p_auth_user_id,
    p_business_name,
    p_contact_first_name,
    p_contact_last_name,
    p_contact_email,
    p_business_type,
    generate_api_key('pk_test'),
    generate_api_key('sk_test'),
    generate_api_key('whsec'),
    'started',
    1
  )
  RETURNING * INTO v_business;

  -- Log onboarding event
  INSERT INTO onboarding_events (business_id, event_type, event_data)
  VALUES (v_business.id, 'account_created', jsonb_build_object(
    'business_name', p_business_name,
    'email', p_contact_email
  ));

  RETURN v_business;
END;
$$ LANGUAGE plpgsql;

-- Update onboarding step
CREATE OR REPLACE FUNCTION advance_onboarding_step(
  p_business_id UUID,
  p_new_step INTEGER,
  p_new_status onboarding_status DEFAULT NULL
)
RETURNS void AS $$
BEGIN
  UPDATE business_accounts
  SET
    onboarding_step = p_new_step,
    onboarding_status = COALESCE(p_new_status, onboarding_status),
    updated_at = NOW()
  WHERE id = p_business_id;

  -- Log event
  INSERT INTO onboarding_events (business_id, event_type, event_data)
  VALUES (p_business_id, 'step_completed', jsonb_build_object(
    'step', p_new_step,
    'status', p_new_status
  ));
END;
$$ LANGUAGE plpgsql;

-- Request a product
CREATE OR REPLACE FUNCTION request_product(
  p_business_id UUID,
  p_product TEXT
)
RETURNS void AS $$
BEGIN
  -- Update the appropriate product status
  IF p_product = 'coverpay' THEN
    UPDATE business_accounts
    SET coverpay_status = 'requested', coverpay_requested_at = NOW(), updated_at = NOW()
    WHERE id = p_business_id;
  ELSIF p_product = 'gateway' THEN
    UPDATE business_accounts
    SET gateway_status = 'requested', gateway_requested_at = NOW(), updated_at = NOW()
    WHERE id = p_business_id;
  ELSIF p_product = 'sidebet' THEN
    UPDATE business_accounts
    SET sidebet_status = 'requested', sidebet_requested_at = NOW(), updated_at = NOW()
    WHERE id = p_business_id;
  END IF;

  -- Log event
  INSERT INTO onboarding_events (business_id, event_type, event_data)
  VALUES (p_business_id, 'product_requested', jsonb_build_object('product', p_product));
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_business_accounts_updated_at
  BEFORE UPDATE ON business_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

ALTER TABLE business_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_requests ENABLE ROW LEVEL SECURITY;

-- Business can view/edit their own account
CREATE POLICY "Users can view own business account"
  ON business_accounts FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update own business account"
  ON business_accounts FOR UPDATE
  USING (auth.uid() = auth_user_id);

-- Business can manage their own documents
CREATE POLICY "Users can view own documents"
  ON business_documents FOR SELECT
  USING (business_id IN (SELECT id FROM business_accounts WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can insert own documents"
  ON business_documents FOR INSERT
  WITH CHECK (business_id IN (SELECT id FROM business_accounts WHERE auth_user_id = auth.uid()));

-- Business can view their own events
CREATE POLICY "Users can view own onboarding events"
  ON onboarding_events FOR SELECT
  USING (business_id IN (SELECT id FROM business_accounts WHERE auth_user_id = auth.uid()));

-- Business can manage their product requests
CREATE POLICY "Users can manage own product requests"
  ON product_requests FOR ALL
  USING (business_id IN (SELECT id FROM business_accounts WHERE auth_user_id = auth.uid()));

-- Service role has full access
CREATE POLICY "Service role full access to business_accounts"
  ON business_accounts FOR ALL
  USING (true);

CREATE POLICY "Service role full access to business_documents"
  ON business_documents FOR ALL
  USING (true);

CREATE POLICY "Service role full access to onboarding_events"
  ON onboarding_events FOR ALL
  USING (true);

CREATE POLICY "Service role full access to product_requests"
  ON product_requests FOR ALL
  USING (true);
