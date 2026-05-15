# CoverPay Integration Ralph Loop

You are iterating on CoverPay - a BNPL orchestration widget for Hedge Payments.

## Project Location
- Website: `/Users/jacksonfitzgerald/Projects/HedgePayments/website`
- Supabase Project ID: `wsphgxqgtusmtzepfvuo`

## What's Already Built
- Database schema (coverpay_merchant_providers, coverpay_sessions, coverpay_transactions, coverpay_webhook_logs)
- Dashboard credentials page at `/dashboard/coverpay/providers`
- API endpoints at `/api/coverpay/sessions/*`
- Widget JS at `/public/embed/coverpay-widget.js`
- React SDK at `/packages/coverpay-react/`
- Documentation at `/docs/coverpay/*`

## Your Mission This Loop

Iterate on CoverPay to make it production-ready. Each iteration, pick the next incomplete task:

### Task 1: Demo Checkout Page
Create `/app/demo/coverpay/page.tsx` - A mock e-commerce checkout page demonstrating the widget in action with a sample product ($249.99 headphones or similar).

### Task 2: Dashboard Analytics
Enhance `/app/dashboard/products/coverpay/page.tsx` - Add more detailed analytics cards, charts showing approval rates over time, provider performance comparison.

### Task 3: Widget Preview in Dashboard
Add an interactive widget preview section where merchants can customize and see exactly how the widget will appear on their checkout.

### Task 4: Transactions History Page
Create `/app/dashboard/coverpay/transactions/page.tsx` - Transaction list with filters (status, provider, date range), search, and details modal.

### Task 5: Polish Provider Cards
Improve `/app/dashboard/coverpay/providers/page.tsx` - Add actual provider logos, better form validation, connection status indicators, quick setup guides.

### Task 6: Settings Page
Create `/app/dashboard/coverpay/settings/page.tsx` - Webhook configuration, notification preferences, API keys display.

## Design System
Follow the existing dashboard patterns:
- Use Card, Badge, Button components from `../../components/ui/`
- Use MetricCard from `../../components/widgets/`
- Dark theme with `bg-dash-*` and `text-dash-*` classes
- Purple accent color (`dash-primary-500`)

## Success Criteria
- Demo checkout page renders and simulates the widget flow
- Dashboard shows meaningful analytics with mock data
- Transactions page displays filterable history
- Settings page allows webhook configuration
- All pages are styled consistently

When ALL tasks are complete and working, output:
<promise>COVERPAY INTEGRATION COMPLETE</promise>

## Current Status
Check each file to see what's done. Pick the first incomplete task and implement it fully before moving on.
