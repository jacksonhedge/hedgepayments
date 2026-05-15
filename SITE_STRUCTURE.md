# Hedge Payments Website Structure

> **Tech Stack:** Next.js 14 (App Router), Tailwind CSS, Supabase, Framer Motion
> **Domain:** hedgepayments.com
> **Supabase Project:** `wsphgxqgtusmtzepfvuo`

---

## Directory Overview

```
/app
├── (Public Pages)
├── admin/                    # Internal admin panel
├── dashboard/                # Merchant dashboard (Stripe-style)
├── docs/                     # API documentation
├── components/               # Shared components
├── api/                      # API routes
└── utils/                    # Utilities & helpers
```

---

## Public Pages

| Route | File | Description |
|-------|------|-------------|
| `/` | `page.tsx` | Landing page with hero, features, waitlist |
| `/business-login` | `business-login/page.tsx` | Merchant login (Supabase Auth) |
| `/business-signup` | `business-signup/page.tsx` | Merchant registration flow |
| `/get-started` | `get-started/page.tsx` | Multi-step onboarding wizard |
| `/contact` | `contact/page.tsx` | Contact form |
| `/partners` | `partners/page.tsx` | Partner program info |
| `/products` | `products/page.tsx` | Product overview |
| `/blog` | `blog/page.tsx` | Blog listing |
| `/deck` | `deck/page.tsx` | Investor deck |
| `/sidebet` | `sidebet/page.tsx` | SideBet product landing |
| `/demo` | `demo/page.tsx` | Product demos |
| `/wallet` | `wallet/page.tsx` | Consumer wallet page |

---

## Merchant Dashboard (`/dashboard`)

**Layout:** `dashboard/layout.tsx` - Stripe-style with persistent sidebar
**Theme:** Light mode, forest green primary (#2e7d32)

### Main Pages

| Route | File | Description |
|-------|------|-------------|
| `/dashboard` | `page.tsx` | Home with metrics, products, API keys |
| `/dashboard/balances` | `balances/page.tsx` | Balance overview & payouts |
| `/dashboard/transactions` | `transactions/page.tsx` | Transaction history table |
| `/dashboard/customers` | `customers/page.tsx` | Customer management |

### Checkout Products (`/dashboard/products`)

| Route | File | Status |
|-------|------|--------|
| `/dashboard/products/card` | `products/card/page.tsx` | **Active** - Card checkout dashboard |
| `/dashboard/products/ach` | `products/ach/page.tsx` | **Active** - ACH payments dashboard |
| `/dashboard/products/crypto` | `products/crypto/page.tsx` | Planned - Crypto payments |
| `/dashboard/products/subscriptions` | `products/subscriptions/page.tsx` | Planned - Recurring billing |
| `/dashboard/products/coverpay` | `products/coverpay/page.tsx` | Legacy - BNPL orchestration |
| `/dashboard/products/gateway` | `products/gateway/page.tsx` | Legacy - Payment gateway |
| `/dashboard/products/sidebet` | `products/sidebet/page.tsx` | Legacy - Round-ups |

### Developer Tools (`/dashboard/developers`)

| Route | File | Description |
|-------|------|-------------|
| `/dashboard/developers/api-keys` | `developers/api-keys/page.tsx` | API key management (test/live) |
| `/dashboard/developers/webhooks` | `developers/webhooks/page.tsx` | Webhook configuration |
| `/dashboard/developers/logs` | `developers/logs/page.tsx` | API request logs |

### Settings (`/dashboard/settings`)

| Route | File | Description |
|-------|------|-------------|
| `/dashboard/settings` | `settings/page.tsx` | Settings overview |
| `/dashboard/settings/account` | `settings/account/page.tsx` | Business profile |
| `/dashboard/settings/team` | `settings/team/page.tsx` | Team members & roles |
| `/dashboard/settings/billing` | `settings/billing/page.tsx` | Plans & invoices |
| `/dashboard/settings/branding` | `settings/branding/page.tsx` | Logo & brand colors |

### Dashboard Components

```
dashboard/components/
├── layout/
│   ├── Sidebar.tsx           # Collapsible nav sidebar
│   └── Header.tsx            # Top bar with search & user menu
├── ui/
│   ├── Button.tsx            # Primary/secondary/ghost buttons
│   ├── Card.tsx              # Content cards
│   └── Badge.tsx             # Status badges
├── widgets/
│   ├── MetricCard.tsx        # KPI cards with trends
│   └── ActivityFeed.tsx      # Recent activity list
└── tables/
    └── DataTable.tsx         # Sortable/filterable tables
```

### Dashboard Context

```
dashboard/contexts/
└── ModeContext.tsx           # Test/Live mode toggle (affects API keys)
```

---

## API Documentation (`/docs`)

**Layout:** `docs/layout.tsx` - Bookstore theme with sidebar navigation

### Getting Started

| Route | File | Description |
|-------|------|-------------|
| `/docs` | `page.tsx` | Introduction |
| `/docs/quickstart` | `quickstart/page.tsx` | Quick start guide |
| `/docs/authentication` | `authentication/page.tsx` | API authentication |
| `/docs/testing` | `testing/page.tsx` | Test cards & sandbox mode |

### Checkout Documentation

| Route | File | Description |
|-------|------|-------------|
| `/docs/checkout` | `checkout/page.tsx` | Checkout overview |
| `/docs/checkout/card` | `checkout/card/page.tsx` | Card payments guide |
| `/docs/checkout/ach` | `checkout/ach/page.tsx` | ACH/bank transfer guide |
| `/docs/checkout/react-sdk` | `checkout/react-sdk/page.tsx` | React SDK reference |
| `/docs/checkout/checkout-link` | `checkout/checkout-link/page.tsx` | Hosted checkout URLs |

### Guides

| Route | File | Description |
|-------|------|-------------|
| `/docs/guides/webhooks` | `guides/webhooks/page.tsx` | Webhook setup & events |
| `/docs/guides/ai-integration` | `guides/ai-integration/page.tsx` | AI agent integration |

### Payments API

| Route | File | Description |
|-------|------|-------------|
| `/docs/payments/create` | `payments/create/page.tsx` | Create payment endpoint |

---

## Admin Panel (`/admin`)

**Access:** Internal use only (super admin)

| Route | File | Description |
|-------|------|-------------|
| `/admin` | `page.tsx` | Admin dashboard |
| `/admin/users` | `users/page.tsx` | User management |
| `/admin/waitlist` | `waitlist/page.tsx` | Waitlist management |
| `/admin/subscribers` | `subscribers/page.tsx` | Newsletter subscribers |
| `/admin/setup` | `setup/page.tsx` | System setup |
| `/admin/super-admin` | `super-admin/page.tsx` | Super admin controls |

---

## Shared Components (`/components`)

| Component | Description |
|-----------|-------------|
| `BookstoreNavbar.tsx` | Docs-style navigation bar |
| `Navbar.tsx` | Main site navigation |
| `Footer.tsx` | Site footer |
| `Hero.tsx` | Landing page hero section |
| `Features.tsx` | Feature showcase |
| `WaitlistForm.tsx` | Email capture form |
| `NetworkDiagram.tsx` | Payment flow visualization |
| `LogoTicker.tsx` | Partner logo carousel |
| `RoundUpsDemo.tsx` | SideBet demo component |

---

## API Routes (`/api`)

| Route | Description |
|-------|-------------|
| `/api/seed/bankroll` | Seed test business account |
| `/api/webhooks/*` | Webhook handlers |
| `/api/auth/*` | Auth endpoints |

---

## Database Schema (Supabase)

### Core Tables

| Table | Description |
|-------|-------------|
| `business_accounts` | Merchant accounts with API keys |
| `transactions` | Payment transactions |
| `webhooks` | Webhook configurations |
| `api_request_logs` | API request history |

### Business Account Fields

```sql
- id, auth_user_id, business_name
- contact_first_name, contact_last_name, contact_email
- business_type, onboarding_status
- api_key_test, api_secret_test (sandbox)
- api_key_live, api_secret_live (production)
- webhook_secret
- card_checkout_status, ach_status, crypto_status
- subscriptions_status
```

---

## Design System

### Colors (Tailwind)

```css
/* Primary - Forest Green */
--dash-primary-500: #2e7d32
--dash-primary-600: #1b5e20

/* Surfaces */
--dash-surface-bg: #f6f9fc
--dash-surface-card: #ffffff
--dash-surface-border: #e3e8ee

/* Text */
--dash-text-primary: #0a2540
--dash-text-secondary: #425466

/* Status */
--dash-status-success: #30a46c
--dash-status-warning: #f5a623
--dash-status-error: #e54d42
--dash-status-info: #0073e6

/* Mode Indicators */
--dash-mode-test: #f5a623 (orange)
--dash-mode-live: #2e7d32 (green)
```

### Typography

- **Headings:** System sans-serif
- **Body:** System sans-serif
- **Docs:** Georgia, serif (bookstore theme)
- **Code:** Monospace

---

## Key Integrations

| Service | Purpose |
|---------|---------|
| **Coinflow** | White-label payment infrastructure |
| **Supabase** | Database, Auth, Realtime |
| **Plaid** | Bank account linking (ACH) |
| **Vercel** | Hosting & Edge functions |
| **SendGrid** | Transactional email |

---

## Scripts

| Script | Description |
|--------|-------------|
| `scripts/create-notion-roadmap.js` | Populates Notion with product roadmap |

---

## Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Coinflow (if applicable)
COINFLOW_MERCHANT_ID=
COINFLOW_API_KEY=

# Plaid
PLAID_CLIENT_ID=
PLAID_SECRET=

# Notion
NOTION_TOKEN=
NOTION_PARENT_PAGE_ID=
```

---

## Quick Commands

```bash
# Development
npm run dev               # Start on port 3000

# Build
npm run build             # Production build
npm run start             # Start production server

# Database
npx supabase gen types    # Generate TypeScript types
```

---

## File Naming Conventions

- **Pages:** `page.tsx` (Next.js App Router)
- **Layouts:** `layout.tsx`
- **Components:** PascalCase (e.g., `MetricCard.tsx`)
- **Utilities:** camelCase (e.g., `supabase-client.ts`)
- **API Routes:** `route.ts`

---

## Related Repositories

| Repo | Description |
|------|-------------|
| `jacksonhedge/hedge-payments-api` | Backend API service |
| `jacksonhedge/hedgepayments` | This website repo |

---

*Last updated: January 2026*
