-- Create waitlist table
CREATE TABLE IF NOT EXISTS public.waitlist (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  sportsbooks TEXT[], -- Array of selected sportsbooks
  referral_code TEXT, -- Referral code used by this user when signing up
  own_referral_code TEXT UNIQUE, -- This user's unique referral code to share
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID -- Add a UUID column to correctly match auth.uid()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_own_referral_code ON public.waitlist(own_referral_code);
CREATE INDEX IF NOT EXISTS idx_waitlist_referral_code ON public.waitlist(referral_code);

-- Grant access to authenticated and anonymous users
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow insert from anyone
CREATE POLICY insert_waitlist ON public.waitlist 
  FOR INSERT TO anon, authenticated 
  WITH CHECK (true);

-- Fix: Use user_id column which is UUID type to match with auth.uid()
CREATE POLICY read_own_waitlist ON public.waitlist
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Grant service role full access
GRANT ALL ON public.waitlist TO service_role;

-- Create subscribers table for the subscribe API
CREATE TABLE IF NOT EXISTS public.subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referral_code TEXT -- Optional referral code 
);

-- Add indexes for subscribers table
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);

-- Grant anonymous access for subscribers table
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anonymous inserts to subscribers" ON public.subscribers FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Allow anonymous reads from subscribers" ON public.subscribers FOR SELECT USING (true);

-- Grant service role full access to subscribers
GRANT ALL ON public.subscribers TO service_role;
GRANT USAGE, SELECT ON SEQUENCE subscribers_id_seq TO anon;
GRANT USAGE, SELECT ON SEQUENCE subscribers_id_seq TO authenticated; 