-- supabase/migrations/006_link_consume_result.sql
ALTER TABLE link_sessions
  ADD COLUMN IF NOT EXISTS consume_result JSONB;
