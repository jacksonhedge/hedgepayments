-- 007 — Per-merchant Chance engine settings: AI offer-ranker provider + parlays toggle.
-- Dedicated table (more Chance knobs are expected); one row per business account.
CREATE TABLE IF NOT EXISTS business_chance_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_account_id UUID NOT NULL REFERENCES business_accounts(id) ON DELETE CASCADE,
  ai_provider TEXT NOT NULL DEFAULT 'off' CHECK (ai_provider IN ('anthropic', 'openai', 'off')),
  ai_model TEXT,
  parlays_enabled BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (business_account_id)
);

CREATE INDEX IF NOT EXISTS idx_business_chance_settings_account
  ON business_chance_settings(business_account_id);
