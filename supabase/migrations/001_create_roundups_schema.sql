-- Create partners table (companies using our API)
CREATE TABLE IF NOT EXISTS partners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  website VARCHAR(255),
  api_key VARCHAR(255) UNIQUE NOT NULL,
  api_secret VARCHAR(255) NOT NULL,
  webhook_url VARCHAR(500),
  settings JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create users table (end users of partners)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  external_id VARCHAR(255) NOT NULL, -- Partner's user ID
  email VARCHAR(255),
  phone VARCHAR(50),
  metadata JSONB DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(partner_id, external_id)
);

-- Create bank_connections table
CREATE TABLE IF NOT EXISTS bank_connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'meld', 'plaid', 'finicity'
  provider_connection_id VARCHAR(255) NOT NULL,
  provider_access_token TEXT,
  provider_refresh_token TEXT,
  institution_id VARCHAR(255),
  institution_name VARCHAR(255),
  account_id VARCHAR(255),
  account_name VARCHAR(255),
  account_type VARCHAR(50),
  account_mask VARCHAR(10),
  routing_number VARCHAR(20),
  account_number_encrypted TEXT,
  balance DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) DEFAULT 'active',
  last_synced_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bank_connection_id UUID NOT NULL REFERENCES bank_connections(id) ON DELETE CASCADE,
  provider_transaction_id VARCHAR(255) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  merchant_name VARCHAR(255),
  merchant_category VARCHAR(255),
  description TEXT,
  transaction_date DATE NOT NULL,
  posted_date DATE,
  pending BOOLEAN DEFAULT false,
  category VARCHAR(100),
  subcategory VARCHAR(100),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(bank_connection_id, provider_transaction_id)
);

-- Create round_ups table
CREATE TABLE IF NOT EXISTS round_ups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  original_amount DECIMAL(10, 2) NOT NULL,
  rounded_amount DECIMAL(10, 2) NOT NULL,
  round_up_amount DECIMAL(10, 2) NOT NULL,
  multiplier DECIMAL(3, 1) DEFAULT 1.0,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'collected', 'settled', 'failed'
  collected_at TIMESTAMP WITH TIME ZONE,
  settled_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create settlements table (ACH transfers)
CREATE TABLE IF NOT EXISTS settlements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  bank_connection_id UUID NOT NULL REFERENCES bank_connections(id),
  provider VARCHAR(50) NOT NULL, -- 'dwolla', 'stripe', 'modern_treasury'
  provider_transfer_id VARCHAR(255),
  amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  direction VARCHAR(20) NOT NULL, -- 'debit', 'credit'
  initiated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  completed_at TIMESTAMP WITH TIME ZONE,
  failed_at TIMESTAMP WITH TIME ZONE,
  failure_reason TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create webhooks table for tracking webhook deliveries
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  attempts INTEGER DEFAULT 0,
  last_attempt_at TIMESTAMP WITH TIME ZONE,
  next_retry_at TIMESTAMP WITH TIME ZONE,
  response_status INTEGER,
  response_body TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create API usage tracking table
CREATE TABLE IF NOT EXISTS api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
  endpoint VARCHAR(255) NOT NULL,
  method VARCHAR(10) NOT NULL,
  status_code INTEGER,
  response_time_ms INTEGER,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Create indexes for performance
CREATE INDEX idx_users_partner_id ON users(partner_id);
CREATE INDEX idx_users_external_id ON users(external_id);
CREATE INDEX idx_bank_connections_user_id ON bank_connections(user_id);
CREATE INDEX idx_transactions_bank_connection_id ON transactions(bank_connection_id);
CREATE INDEX idx_transactions_date ON transactions(transaction_date);
CREATE INDEX idx_round_ups_transaction_id ON round_ups(transaction_id);
CREATE INDEX idx_round_ups_status ON round_ups(status);
CREATE INDEX idx_settlements_user_id ON settlements(user_id);
CREATE INDEX idx_settlements_status ON settlements(status);
CREATE INDEX idx_webhooks_partner_id ON webhooks(partner_id);
CREATE INDEX idx_webhooks_status ON webhooks(status);
CREATE INDEX idx_api_usage_partner_id ON api_usage(partner_id);
CREATE INDEX idx_api_usage_created_at ON api_usage(created_at);

-- Enable Row Level Security
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE round_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bank_connections_updated_at BEFORE UPDATE ON bank_connections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();