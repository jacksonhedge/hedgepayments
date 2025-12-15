# Super-Admin Dashboard Setup Guide

## Overview
The super-admin dashboard combines two data sources:
1. **Supabase** - Real HedgePayments business metrics
2. **Lindeman Radar** - Agent monitoring and alerts

## Quick Start

### 1. Configure Supabase Credentials

Open `.env.local` and replace these values with your actual Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

**Where to find these:**
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to Settings → API
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_KEY`

### 2. Start the Backends

You need TWO servers running:

**Terminal 1: Lindeman Radar (Express Backend)**
```bash
cd ~/lindeman-radar
npm start
```
Should show: `Server running at: http://localhost:3000`

**Terminal 2: Next.js Website**
```bash
cd ~/Documents/hedgepayments-website
npm run dev -- --port 3001
```
Should show: `Ready on http://localhost:3001`

### 3. Access the Dashboard

**URL:** http://localhost:3001/admin/super-admin
**Password:** `radar2025`

## What You'll See

### Business Metrics (Top Bar - 6 Metrics)
These pull from your **Supabase database** in real-time:

1. **New Signups (24h)** - Users who signed up today
2. **Total Users** - All users in your platform
3. **Transactions (24h)** - Completed/processing transactions today
4. **Volume (24h)** - Total dollar volume processed
5. **Revenue (24h)** - Fee revenue collected from transactions
6. **Active Wallets** - Number of active wallets

**Tables Used:**
- `users` - User signups and counts
- `transactions` - Transaction data, volume, fees
- `wallets` - Wallet status

**Auto-refresh:** Every 30 seconds

### Agent Monitoring (Radar Display)
These pull from the **Lindeman Radar Express backend**:

- **12 Agent positions** around the radar
- **Real-time WebSocket updates** for status changes
- **Alert feed** with priority filtering (P0-P3)
- **Agent detail cards** showing health, issues, schedules

## Troubleshooting

### "Supabase not configured" in console
- Check that `.env.local` has valid Supabase credentials
- Restart Next.js server: `Ctrl+C` then `npm run dev -- --port 3001`

### WebSocket not connecting
- Ensure Lindeman Radar backend is running on port 3000
- Check terminal output: should show "Server running at: http://localhost:3000"
- Restart backend: `cd ~/lindeman-radar && npm start`

### Metrics showing 0
- Verify your Supabase database has data in `users`, `transactions`, `wallets` tables
- Check browser console for any errors
- Confirm environment variables are loaded: check Network tab for API calls

### Port conflicts
- Next.js: Uses port **3001** (configurable)
- Express Backend: Uses port **3000** (fixed)
- If port is in use, kill existing process or change Next.js port

## Architecture

```
┌─────────────────────────────────────────────────┐
│         Super-Admin Dashboard                    │
│         (http://localhost:3001/admin/super-admin)│
└────────┬────────────────────────────────┬───────┘
         │                                │
         │                                │
         ▼                                ▼
┌────────────────────┐         ┌─────────────────────┐
│   Supabase DB      │         │ Lindeman Radar API  │
│   (Business Data)  │         │ (Agent Monitoring)  │
│                    │         │                     │
│ - users            │         │ - Agent status      │
│ - transactions     │         │ - WebSocket updates │
│ - wallets          │         │ - Alert feed        │
└────────────────────┘         └─────────────────────┘
```

## Next Steps

### Adding More Agents
Edit `AGENT_CONFIGS` array in:
`app/admin/super-admin/page.tsx:53`

### Customizing Metrics
Modify queries in `fetchMetrics()` function:
`app/admin/super-admin/page.tsx:118`

### Changing Password
Update Lindeman Radar server:
`~/lindeman-radar/server.js`

## Files Reference

**Frontend:**
- `/app/admin/super-admin/page.tsx` - Main dashboard component
- `/app/admin/super-admin/SuperAdmin.module.css` - Styling
- `/app/admin/super-admin/layout.tsx` - Custom layout (bypasses sidebar)

**Backend:**
- `~/lindeman-radar/server.js` - Express API & WebSocket server

**Configuration:**
- `.env.local` - Environment variables
- `app/utils/supabase.ts` - Supabase client

## Production Deployment

### Environment Variables Needed:
```bash
NEXT_PUBLIC_SUPABASE_URL=<production_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<production_key>
SUPABASE_SERVICE_KEY=<production_service_key>
```

### Backend Deployment:
You'll need to deploy the Lindeman Radar Express server separately and update the API_BASE URL in the super-admin page.

### Security Recommendations:
1. Change the default password in production
2. Add proper authentication middleware
3. Use HTTPS for all connections
4. Enable rate limiting on API endpoints
5. Use environment-specific Supabase credentials

---

**Need Help?**
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Express.js Docs: https://expressjs.com
