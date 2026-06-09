#!/usr/bin/env bash
# Verify the Supabase migrations actually apply to a real Postgres, and that
# credit_wallet is idempotent. Spins up a throwaway Postgres, applies 001 + 004,
# runs assertions, and cleans up. Unit tests mock the DB, so they can't catch
# SQL bugs (invalid DDL, plpgsql ambiguity, FK violations) — this can.
#
#   bash supabase/verify-migrations.sh
#
# Requires Postgres (e.g. `brew install postgresql@17`). No-ops if not installed.
set -uo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

PGBIN="$(dirname "$(command -v pg_ctl 2>/dev/null || true)")"
if [ -z "${PGBIN:-}" ] || [ ! -x "$PGBIN/pg_ctl" ]; then
  for d in /opt/homebrew/opt/postgresql@*/bin /usr/local/opt/postgresql@*/bin; do
    [ -x "$d/pg_ctl" ] && PGBIN="$d" && break
  done
fi
if [ -z "${PGBIN:-}" ] || [ ! -x "$PGBIN/pg_ctl" ]; then
  echo "⚠️  Postgres not found — skipping migration verification (install postgresql@17)"; exit 0
fi

WORK="$(mktemp -d)"; PGDATA="$WORK/data"; PORT="${PGPORT:-5433}"; SOCK="$WORK"
cleanup() { "$PGBIN/pg_ctl" -D "$PGDATA" stop >/dev/null 2>&1; rm -rf "$WORK"; }
trap cleanup EXIT
fail() { echo "❌ $1"; exit 1; }

"$PGBIN/initdb" -D "$PGDATA" -U postgres --auth=trust >/dev/null 2>&1 || fail "initdb failed"
"$PGBIN/pg_ctl" -D "$PGDATA" -o "-p $PORT -k $SOCK" -l "$WORK/log" -w start >/dev/null 2>&1 || fail "could not start postgres on :$PORT"
"$PGBIN/createdb" -p "$PORT" -h "$SOCK" -U postgres chancetest || fail "createdb failed"
PSQL=("$PGBIN/psql" -p "$PORT" -h "$SOCK" -U postgres -d chancetest -v ON_ERROR_STOP=1 -q -t -A)

# Supabase-managed objects the migrations reference (present on a real Supabase project).
"${PSQL[@]}" <<'SQL' || fail "auth stub failed"
CREATE SCHEMA auth;
CREATE TABLE auth.users (id UUID PRIMARY KEY, email TEXT, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now());
CREATE OR REPLACE FUNCTION auth.uid() RETURNS UUID AS $$ SELECT NULL::UUID $$ LANGUAGE sql STABLE;
SQL

"${PSQL[@]}" -f "$HERE/migrations/001_hedge_wallet_system.sql" >/dev/null || fail "001 did not apply"
"${PSQL[@]}" -f "$HERE/migrations/004_chance_funding.sql"        >/dev/null || fail "004 did not apply"
echo "✅ migrations 001 + 004 apply cleanly"

"${PSQL[@]}" -f "$HERE/migrations/005_link_sessions.sql" >/dev/null || fail "005 did not apply"
echo "✅ migration 005 applies"

# link_sessions round-trip: insert a pending session and read it back
"${PSQL[@]}" -c "INSERT INTO link_sessions (token, product, env, expires_at) VALUES ('lt_verify', 'chance', 'sandbox', NOW() + INTERVAL '30 minutes');" >/dev/null || fail "link_sessions insert failed"
ls_status=$("${PSQL[@]}" -c "SELECT status FROM link_sessions WHERE token='lt_verify';")
[ "$ls_status" = "pending" ] || fail "link_sessions status should be 'pending' (got '$ls_status')"
echo "✅ link_sessions round-trip: pending"

# exchange transition: pending -> opened
"${PSQL[@]}" -c "UPDATE link_sessions SET status='opened', opened_at=NOW() WHERE token='lt_verify' AND status='pending';" >/dev/null || fail "link_sessions update failed"
ls_status2=$("${PSQL[@]}" -c "SELECT status FROM link_sessions WHERE token='lt_verify';")
[ "$ls_status2" = "opened" ] || fail "link_sessions should be 'opened' after exchange (got '$ls_status2')"
echo "✅ link_sessions round-trip: pending -> opened"

W='00000000-0000-0000-0000-0000000000b1'
"${PSQL[@]}" -c "INSERT INTO wallets (id,user_id,currency,status) VALUES ('$W','00000000-0000-0000-0000-0000000000a1','USD','active');" >/dev/null || fail "wallet insert failed"
c1=$("${PSQL[@]}"  -c "SELECT credited FROM credit_wallet('$W',2500,'USD','e1');")
dup=$("${PSQL[@]}" -c "SELECT credited FROM credit_wallet('$W',2500,'USD','e1');")
"${PSQL[@]}" -c "SELECT credited FROM credit_wallet('$W',1500,'USD','e2');" >/dev/null
bal=$("${PSQL[@]}" -c "SELECT balance_available FROM wallets WHERE id='$W';")
dep=$("${PSQL[@]}" -c "SELECT count(*) FROM transactions WHERE destination_wallet_id='$W';")

[ "$c1"  = "t" ]    || fail "first credit should succeed (got '$c1')"
[ "$dup" = "f" ]    || fail "duplicate credit should be a no-op (got '$dup')"
[ "$bal" = "4000" ] || fail "balance should be 4000 (got '$bal')"
[ "$dep" = "2" ]    || fail "should be exactly 2 deposit rows (got '$dep')"
echo "✅ credit_wallet idempotent: first=t  dup=f  balance=4000  deposits=2"

# ---------------------------------------------------------------------------
# Migration 006: consume_result column + consumeOnSuccess idempotency
# ---------------------------------------------------------------------------
"${PSQL[@]}" -f "$HERE/migrations/006_link_consume_result.sql" >/dev/null || fail "006 did not apply"
echo "✅ migration 006 applies"

# Verify consume_result column exists
col=$("${PSQL[@]}" -c "SELECT column_name FROM information_schema.columns WHERE table_name='link_sessions' AND column_name='consume_result';")
[ "$col" = "consume_result" ] || fail "consume_result column missing from link_sessions"
echo "✅ consume_result column present"

# Round-trip: createSession → consumeOnSuccess × 2 (second must return 0 rows)
"${PSQL[@]}" -c "
  INSERT INTO link_sessions (token, product, config, env, status, expires_at)
  VALUES ('lt_verifytest_006', 'chance', '{\"amount\":50}', 'sandbox', 'opened', now() + interval '30 minutes')
  ON CONFLICT DO NOTHING;
" >/dev/null || fail "006 session insert failed"

# First consume — should update 1 row
rows1=$("${PSQL[@]}" -c "
  WITH upd AS (
    UPDATE link_sessions
      SET status='consumed', consumed_at=now(), consume_result='{\"won\":true}'
    WHERE token='lt_verifytest_006' AND status <> 'consumed'
    RETURNING id
  ) SELECT count(*) FROM upd;
")
[ "$rows1" -ge 1 ] && echo "✅ first consumeOnSuccess updated row" || fail "first consume failed (got $rows1 rows)"

# Second consume — should update 0 rows (idempotent)
rows2=$("${PSQL[@]}" -c "
  WITH upd AS (
    UPDATE link_sessions
      SET status='consumed', consumed_at=now(), consume_result='{\"won\":true}'
    WHERE token='lt_verifytest_006' AND status <> 'consumed'
    RETURNING id
  ) SELECT count(*) FROM upd;
")
[ "$rows2" -eq 0 ] && echo "✅ second consumeOnSuccess correctly returns 0 rows" || fail "idempotency failed (got $rows2 rows)"

# Cleanup
"${PSQL[@]}" -c "DELETE FROM link_sessions WHERE token='lt_verifytest_006';" >/dev/null

echo "✅ ALL MIGRATION CHECKS PASSED"
