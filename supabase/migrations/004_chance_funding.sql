-- Chance wallet funding (cash-in) — slice 1

-- Seeded anonymous user + auth row so device wallets have a valid owner.
INSERT INTO auth.users (id, email, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-0000000000a1', 'anon@chance.local', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

INSERT INTO users (id, email, kyc_status, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-0000000000a1', 'anon@chance.local', 'not_started', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Funding sessions (consumer wallet top-ups; decoupled from B2B coverpay_sessions)
CREATE TABLE IF NOT EXISTS chance_funding_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wallet_id UUID NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'stripe',
  stripe_session_id TEXT UNIQUE NOT NULL,
  amount BIGINT NOT NULL,            -- cents
  currency currency_type NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_funding_sessions_wallet ON chance_funding_sessions(wallet_id);

-- Atomic, idempotent credit: writes a deposit txn (unique external_id) + bumps balance.
CREATE OR REPLACE FUNCTION credit_wallet(
  p_wallet_id UUID,
  p_amount BIGINT,
  p_currency TEXT,
  p_external_id TEXT
) RETURNS TABLE(balance_available BIGINT, credited BOOLEAN) AS $$
DECLARE
  v_balance BIGINT;
BEGIN
  -- Idempotency: if this external_id already credited, return current balance.
  IF EXISTS (SELECT 1 FROM transactions WHERE external_id = p_external_id) THEN
    SELECT w.balance_available INTO v_balance FROM wallets w WHERE w.id = p_wallet_id;
    RETURN QUERY SELECT v_balance, FALSE;
    RETURN;
  END IF;

  INSERT INTO transactions
    (destination_wallet_id, type, status, currency, amount, external_id, description, completed_at)
  VALUES
    (p_wallet_id, 'deposit', 'completed', p_currency::currency_type, p_amount, p_external_id,
     'Chance wallet funding (Stripe)', NOW());

  UPDATE wallets
    SET balance_available = balance_available + p_amount, updated_at = NOW()
    WHERE id = p_wallet_id
    RETURNING balance_available INTO v_balance;

  RETURN QUERY SELECT v_balance, TRUE;
END;
$$ LANGUAGE plpgsql;
