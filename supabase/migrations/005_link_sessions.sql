-- Hedge Link sessions: short-lived, single-use, scoped tokens for the drop-in handshake.
CREATE TABLE IF NOT EXISTS link_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT UNIQUE NOT NULL,
  product TEXT NOT NULL,
  env TEXT NOT NULL DEFAULT 'sandbox',
  config JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'opened', 'consumed', 'expired')),
  expires_at TIMESTAMPTZ NOT NULL,
  opened_at TIMESTAMPTZ,
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_link_sessions_token ON link_sessions(token);
