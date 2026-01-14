# CoverPay Payment Flow (Phase 1)

## BNPL Orchestration Architecture

```
═══════════════════════════════════════════════════════════════════════════
                        COVERPAY PHASE 1 ARCHITECTURE
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│                      LAYER 1: CHECKOUT REQUEST                          │
│                                                                         │
│     ┌──────┐                                        ┌──────────┐       │
│     │ USER │  ────────►  $600 Purchase  ────────►  │ MERCHANT │       │
│     │  🛒  │                                        │    🏪    │       │
│     └──────┘                                        └──────────┘       │
│                                                                         │
│     User selects "Pay with CoverPay" at checkout                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     LAYER 2: COVERPAY LOGIC ENGINE                      │
│                                                                         │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐       │
│   │ CREDIT ANALYSIS │  │PROVIDER MATCHING│  │ SPLIT CALCULATOR│       │
│   │                 │  │                 │  │                 │       │
│   │ • Credit score  │  │ • Best fit algo │  │ • Multi-provider│       │
│   │ • Payment hist  │  │ • Approval odds │  │ • Amount routing│       │
│   │ • Open loans    │  │ • Limit check   │  │ • Fee optimize  │       │
│   │ • Bank balance  │  │ • User prefs    │  │ • Split logic   │       │
│   └─────────────────┘  └─────────────────┘  └─────────────────┘       │
│                                                                         │
│                    ↓ OPTIMAL ROUTE CALCULATED ↓                        │
│                                                                         │
│   User Profile: Score 620, Good history, 1 open loan (Klarna)          │
│   Decision: Skip Klarna → Try PayPal → Fallback Zip → Sezzle           │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                  LAYER 3: BNPL INFRASTRUCTURE PLUGINS                   │
│                                                                         │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│   │ AFFIRM  │ │ KLARNA  │ │AFTERPAY │ │   ZIP   │ │ SEZZLE  │         │
│   │   API   │ │   API   │ │   API   │ │   API   │ │   API   │         │
│   └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
│                                                                         │
│   ┌─────────┐ ┌─────────┐                                              │
│   │ PAYPAL  │ │ SPLITIT │                                              │
│   │   API   │ │   API   │                                              │
│   └─────────┘ └─────────┘                                              │
│                                                                         │
│   WATERFALL EXECUTION:                                                  │
│   ┌────────────┐     ┌────────────┐     ┌────────────┐                │
│   │ 1st: PayPal│ ──► │ 2nd: Zip   │ ──► │ 3rd: Sezzle│                │
│   │  Approved  │     │ (if denied)│     │ (if denied)│                │
│   │   $300     │     │            │     │            │                │
│   └────────────┘     └────────────┘     └────────────┘                │
│                                                                         │
│   SPLIT RESULT:                                                         │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐              │
│   │ Klarna: $300 │ + │ Affirm: $300 │ = │   $600 ✓    │              │
│   └──────────────┘   └──────────────┘   └──────────────┘              │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        LAYER 4: SETTLEMENT                              │
│                                                                         │
│   ┌──────────────┐              ┌──────────────┐                       │
│   │BNPL PROVIDERS│              │   COVERPAY   │                       │
│   │              │              │              │                       │
│   │    $600      │  ─────────►  │  Aggregates  │                       │
│   │   (T+1/T+2)  │              │    Funds     │                       │
│   └──────────────┘              └──────┬───────┘                       │
│                                        │                                │
│                                        ▼                                │
│                               ┌──────────────┐                         │
│                               │   MERCHANT   │                         │
│                               │              │                         │
│                               │    $585      │                         │
│                               │  (2.5% fee)  │                         │
│                               └──────────────┘                         │
└─────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                           REVENUE: $15 (2.5% of $600)
═══════════════════════════════════════════════════════════════════════════
```

## Decision Engine Logic

### Credit Score Routing

| Score Range | 1st Choice | 2nd Choice | 3rd Choice | Reasoning |
|-------------|------------|------------|------------|-----------|
| 700+ | Affirm | Klarna | PayPal | Best rates, highest limits |
| 640-699 | Klarna | Affirm | Afterpay | Balance approval + limits |
| 580-639 | Klarna | Zip | Sezzle | Lenient mid-range |
| <580 | Zip | Sezzle | Perpay | Most lenient approval |
| No History | Afterpay | Zip | Sezzle | Don't penalize no history |

### Routing Modifiers

```
IF existing_balance_with_provider:
    → SKIP that provider

IF amount < $100:
    → Prioritize Klarna/Afterpay (easy small approval)

IF amount > $500:
    → Prioritize Affirm/Splitit (higher limits)

IF has_paypal_account:
    → Try PayPal first (leverage existing data)

IF bank_balance < 25% of amount:
    → SKIP Sezzle (they check balance)
```

## Provider Integration

| Provider | API Type | Difficulty | Merchant Fee | Settlement |
|----------|----------|------------|--------------|------------|
| Affirm | REST | Medium | 4-6% | T+2 |
| Klarna | REST | Easy | 3-5% | T+2 |
| Afterpay | REST | Easy | 4-6% | T+1 |
| Zip | REST | Medium | 2-5% | T+2 |
| Sezzle | REST | Easy | 2-8% | T+2 |
| PayPal | REST | Easy | 2.9%+$0.30 | T+1 |
| Splitit | REST | Complex | 2-4% | Instant |

## Revenue Model

```
CoverPay Revenue = Transaction Amount × 2.5%

Example $600 transaction:
├── Merchant receives: $585
├── CoverPay fee: $15
└── BNPL provider fees: Paid by merchant separately

Monthly projections:
├── $1M volume = $25,000 revenue
├── $10M volume = $250,000 revenue
└── $100M volume = $2,500,000 revenue
```

## User Experience

1. **Checkout**: User clicks "Pay with CoverPay"
2. **Invisible**: CoverPay runs decision engine (< 5 seconds)
3. **Single Approval**: User sees ONE approval message
4. **Done**: "Payment Approved" - user never knows about split
