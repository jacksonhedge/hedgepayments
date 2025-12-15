# 🚀 Hedge Payments Super-Admin Monitoring - Quick Start

**Super-Admin:** Jackson Fitzgerald
**Goal:** Build your first monitoring agent in 2 hours

---

## ✅ What You Have Right Now

- ✓ Lindeman Radar Dashboard (http://localhost:3000)
- ✓ 2 Bankroll agents already running
- ✓ Complete infrastructure in place
- ✓ Ready to add Hedge Payments agents

---

## 🎯 Build Your First Agent Today

### **Agent:** Payment Processing Health Monitor
**Why:** Most critical for payment processing business
**Time:** 2 hours
**Saves:** $100K/year + prevents customer churn

---

## Step-by-Step (Copy & Paste)

### 1. Create Agent Definition (5 minutes)

```bash
mkdir -p ~/.claude/agents
cat > ~/.claude/agents/hedge-payments-processor-health.md << 'EOF'
# Hedge Payments - Payment Processing Health Monitor

You are monitoring all payment transactions for Hedge Payments.

## Your Tasks

Every 2 minutes:
1. Check Supabase `transactions` table for last 10 minutes
2. Calculate payment success rate
3. Identify stuck/failed transactions
4. Check Stripe API status
5. Generate report with issues found

## Priority Guidelines

- **P0** (Critical): Success rate <95%, API down, stuck transactions >10 min
- **P1** (High): Success rate <98%, settlement delays >24 hours
- **P2** (Medium): Elevated failure rates, slow API responses
- **P3** (Low): Daily summary, trends

## Output Format

Generate markdown report with:

### Payment Health Status: [GREEN/YELLOW/RED]

**Metrics** (last 2 hours):
- Total Transactions: X
- Success Rate: Y%
- Failed: Z
- Average Amount: $X

**Issues Found**:
- [P0/P1/P2/P3] Issue description
- Evidence and data
- Recommended action

**Trends**:
- Compare to yesterday
- Unusual patterns

Save to the report file path provided.
EOF
```

### 2. Create Monitoring Script (10 minutes)

```bash
mkdir -p ~/Scripts
cat > ~/Scripts/hedge_payments_processor_monitor.sh << 'EOF'
#!/opt/homebrew/bin/bash

set -e

PROJECT_ROOT="$HOME/Documents/hedgepayments-website"
LOG_DIR="$HOME/logs/hedge-payments-processor"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
LOG_FILE="$LOG_DIR/check-$TIMESTAMP.log"
REPORT_FILE="$LOG_DIR/report-$TIMESTAMP.md"
TELEGRAM_SCRIPT="$HOME/Library/Mobile Documents/com~apple~CloudDocs/Documents/Bankroll/telegram_notify.py"

mkdir -p "$LOG_DIR"

log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

send_alert() {
    local priority="$1"
    local title="$2"
    local message="[$priority] Hedge Payments Alert\n\n$title\n\nTime: $(date)"

    if [ "$priority" = "P0" ] || [ "$priority" = "P1" ]; then
        python3 "$TELEGRAM_SCRIPT" "$message" 2>&1 | tee -a "$LOG_FILE" || true
    fi
}

log "🎯 Hedge Payments Processor Health Check Starting..."

cd "$PROJECT_ROOT" || exit 1

claude << CLAUDE_PROMPT 2>&1 | tee -a "$LOG_FILE"
Act as the Hedge Payments Payment Processing Health Monitor agent.

Your task:
1. Query Supabase for recent transactions (last 2 hours)
2. Calculate success/failure rates
3. Check for stuck or failed payments
4. Verify Stripe API status
5. Generate detailed report

Output report to: $REPORT_FILE

Be thorough but concise. Focus on actionable issues.
CLAUDE_PROMPT

# Analyze report for alerts
if [ -f "$REPORT_FILE" ]; then
    p0_count=$(grep -c "P0" "$REPORT_FILE" 2>/dev/null || echo "0")
    p1_count=$(grep -c "P1" "$REPORT_FILE" 2>/dev/null || echo "0")

    if [ "$p0_count" -gt 0 ]; then
        p0_issues=$(grep "P0" "$REPORT_FILE" | head -3)
        send_alert "P0" "Critical Payment Issues Detected\n\n$p0_issues"
    fi

    if [ "$p1_count" -gt 0 ]; then
        p1_issues=$(grep "P1" "$REPORT_FILE" | head -3)
        send_alert "P1" "High Priority Payment Issues\n\n$p1_issues"
    fi

    log "✅ Check complete. P0=$p0_count, P1=$p1_count"
else
    log "⚠️  No report generated"
fi

log "Report: $REPORT_FILE"
EOF

chmod +x ~/Scripts/hedge_payments_processor_monitor.sh
```

### 3. Set Up Environment (5 minutes)

Make sure you have Supabase credentials:

```bash
# Check if .env exists in hedgepayments-website
cat ~/Documents/hedgepayments-website/.env | grep SUPABASE
```

If not, create `.env`:
```bash
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-key
```

### 4. Test Run (2 minutes)

```bash
bash ~/Scripts/hedge_payments_processor_monitor.sh
```

Check the output:
```bash
ls -lh ~/logs/hedge-payments-processor/
tail -50 ~/logs/hedge-payments-processor/check-*.log
```

### 5. Add to Cron (2 minutes)

```bash
crontab -e
```

Add this line (runs every 2 minutes):
```
*/2 * * * * /opt/homebrew/bin/bash ~/Scripts/hedge_payments_processor_monitor.sh >> ~/logs/hedge-payments-processor/cron.log 2>&1
```

Save and verify:
```bash
crontab -l | grep hedge
```

---

## ✅ You're Done!

Your first Hedge Payments agent is now:
- ✓ Monitoring every 2 minutes
- ✓ Checking payment health
- ✓ Sending alerts for critical issues
- ✓ Logging everything

---

## 🎮 View in Lindeman Radar

Open: http://localhost:3000

You should see:
- **Bankroll Agents**: UI/UX Optimizer, KYC Security
- **Hedge Payments Agent**: Processor Health (coming soon to dashboard)

---

## 📊 What Happens Next

**Every 2 minutes:**
1. Agent checks last 2 hours of transactions
2. Calculates success rate
3. Looks for stuck payments
4. Checks Stripe API
5. Generates report with findings
6. Sends alerts if P0/P1 issues found

**You get notified via:**
- Telegram (P0/P1 issues)
- Dashboard (all issues)
- Log files (everything)

---

## 🚀 Next Agents to Build

After Processor Health is stable (1-2 days):

**Next:** Fraud & Security Monitor
- Catches suspicious transactions
- Prevents chargebacks
- Saves $90K/year
- Build time: 12-16 hours

**Then:** API Health Monitor
- Ensures 99.9% uptime
- Prevents outages
- Saves $120K/year
- Build time: 8-10 hours

**After That:** Business Intelligence
- Automated reports
- Growth metrics
- Saves $85K/year
- Build time: 12-16 hours

---

## 💡 Pro Tips

- **First Week**: Just run manually, check reports
- **Second Week**: Let cron run, monitor alerts
- **Third Week**: Adjust thresholds based on false positives
- **Fourth Week**: Build next agent

**Don't rush.** One solid agent is better than three half-baked ones.

---

## 🆘 Troubleshooting

**Agent not running?**
```bash
# Check cron logs
tail -50 ~/logs/hedge-payments-processor/cron.log

# Test script manually
bash ~/Scripts/hedge_payments_processor_monitor.sh
```

**No alerts?**
- Check if Telegram script exists
- Verify report has P0/P1 issues
- Check log files for errors

**Supabase errors?**
- Verify .env file has correct credentials
- Test Supabase connection manually

---

## 📞 Need Help?

Check the full plan:
- `~/Documents/hedgepayments-website/HEDGE_PAYMENTS_AGENT_PLAN.md`

Or reference the Bankroll setup:
- `~/Library/Mobile Documents/com~apple~CloudDocs/Documents/Bankroll/BANKROLL_*_GUIDE.md`

---

**You've got this, Jackson! 🎯**

In 2 hours, you'll have your first Hedge Payments super-admin agent running.

---

*Last Updated: November 21, 2025*
