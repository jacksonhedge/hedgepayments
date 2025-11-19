# Hedge Payments Admin Dashboard Setup

## Overview
This document outlines the admin dashboard structure created for managing API users and tracking onboarding.

## Files Created

### 1. Admin Layout (`/app/admin/layout.tsx`)
- Fixed sidebar with navigation
- Dark header bar with "Hedge Admin" branding
- Quick stats in sidebar (Active Users, Today's Signups, API Calls)
- Collapsible sidebar
- Bookstore aesthetic maintained

### 2. Dashboard Page (`/app/admin/page.tsx`)
- Key metrics grid (Total Users, Active Users, API Calls, Live Mode Users)
- Onboarding funnel visualization
- Recent signups table
- All data currently showing mock values (0s)

### 3. Users List Page (`/app/admin/users/page.tsx`)
- Search functionality (name, email, company)
- Filter by status (All, Active, Onboarding, Inactive)
- Filter by environment (All, Test Mode, Live Mode)
- Users table with onboarding progress bars
- Currently shows "No users found" message

## Required Supabase Schema

### Tables to Create

#### 1. `users` table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  company TEXT,
  
  -- Onboarding tracking
  onboarding_stage TEXT DEFAULT 'signup_started',
  onboarding_progress INT DEFAULT 0,
  
  -- API keys
  test_api_key TEXT,
  live_api_key TEXT,
  
  -- Metadata
  integration_type TEXT, -- 'claude', 'chatgpt', 'codex', 'rest-api', etc
  estimated_volume TEXT,
  use_case TEXT,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  last_active_at TIMESTAMP,
  email_verified_at TIMESTAMP,
  first_api_call_at TIMESTAMP,
  first_payment_at TIMESTAMP,
  went_live_at TIMESTAMP
);
```

#### 2. `user_events` table
```sql
CREATE TABLE user_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_user_events_user_id ON user_events(user_id);
CREATE INDEX idx_user_events_type ON user_events(event_type);
CREATE INDEX idx_user_events_created_at ON user_events(created_at DESC);
```

Event types to track:
- `signup`
- `email_verified`
- `api_key_generated` (with environment: test/live)
- `first_api_call`
- `payment_created`
- `payment_completed`
- `webhook_configured`
- `went_live`

#### 3. `api_logs` table
```sql
CREATE TABLE api_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  status_code INT NOT NULL,
  response_time_ms INT,
  request_body JSONB,
  response_body JSONB,
  error_message TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_api_logs_user_id ON api_logs(user_id);
CREATE INDEX idx_api_logs_created_at ON api_logs(created_at DESC);
CREATE INDEX idx_api_logs_endpoint ON api_logs(endpoint);
```

#### 4. `payments` table (links to Coinflow)
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  hedge_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  coinflow_payment_id TEXT UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  environment TEXT NOT NULL, -- 'test' or 'live'
  customer_email TEXT,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  failed_at TIMESTAMP
);

CREATE INDEX idx_payments_user_id ON payments(hedge_user_id);
CREATE INDEX idx_payments_coinflow_id ON payments(coinflow_payment_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_environment ON payments(environment);
```

## Next Steps to Complete Admin Dashboard

### 1. Connect to Supabase
Create `/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)
```

### 2. Add Environment Variables
Add to `.env.local`:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Create Remaining Pages

#### API Logs Page (`/app/admin/api-logs/page.tsx`)
Should display:
- Recent API calls table
- Filter by user, endpoint, status code
- Search functionality
- Response time metrics
- Error highlighting

#### User Detail Page (`/app/admin/users/[id]/page.tsx`)
Should display:
- User profile information
- Onboarding checklist with checkmarks
- API keys (test and live)
- Statistics (API calls, payments, volume)
- Recent activity timeline
- Quick actions (send email, view logs, view payments)

#### Payments Page (`/app/admin/payments/page.tsx`)
Should display:
- All payments table
- Filter by user, status, environment
- Aggregate volume metrics
- Link to Coinflow dashboard

#### Analytics Page (`/app/admin/analytics/page.tsx`)
Should display:
- Conversion funnel chart
- Time-to-first-payment chart
- Signup trends over time
- API usage trends
- Drop-off points analysis

### 4. Implement Data Fetching

Example for dashboard page:
```typescript
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    signupsToday: 0,
    // ... etc
  })

  useEffect(() => {
    async function fetchStats() {
      // Total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      // Signups today
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { count: signupsToday } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())

      // Active users (last 7 days)
      const sevenDaysAgo = new Date()
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
      const { count: activeUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('last_active_at', sevenDaysAgo.toISOString())

      setStats({
        totalUsers: totalUsers || 0,
        signupsToday: signupsToday || 0,
        activeUsers: activeUsers || 0,
        // ... etc
      })
    }

    fetchStats()
  }, [])

  return (
    // ... render stats
  )
}
```

### 5. Add Authentication

Create `/app/admin/login/page.tsx`:
- Simple password protection for now
- Later: Supabase Auth with admin role

Protect admin routes in middleware:
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin-token')
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
}
```

### 6. Add Real-Time Updates (Optional)

For live dashboard updates:
```typescript
useEffect(() => {
  const channel = supabase
    .channel('user-changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'users' },
      (payload) => {
        console.log('New user signed up!', payload)
        // Update stats
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [])
```

## Design System

All admin pages use the bookstore aesthetic:
- **Background**: `#FAF8F5` (cream)
- **Primary text**: `#2C2416` (dark brown)
- **Secondary text**: `#6B5D4F` (medium brown)
- **Tertiary text**: `#8B7E6E` (light brown)
- **Border**: `#D4C5B0` (tan)
- **Font**: Georgia serif throughout
- **Accent**: Dark header bar `#2C2416`

## Navigation Structure

```
/admin
  /                     - Dashboard (overview metrics)
  /users                - Users list with filters
  /users/[id]           - Individual user detail
  /api-logs             - API call logs
  /payments             - Payment transactions
  /analytics            - Charts and funnel analysis
```

## Quick Start

1. Run Supabase SQL migrations (create tables above)
2. Install dependencies: `npm install @supabase/supabase-js`
3. Add environment variables
4. Visit `/admin` to see the dashboard
5. Connect data fetching to Supabase

The structure is in place - just need to wire up the data!
