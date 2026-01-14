# Bankroll Payment Flow

## Stablecoin Payment Gateway Architecture

```
═══════════════════════════════════════════════════════════════════════════
                      BANKROLL ON-CHAIN PAYMENT FLOW
═══════════════════════════════════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────┐
│                     DEPOSIT RAILS (Fiat → USDC)                         │
│                                                                         │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│   │  BANK   │ │  DEBIT  │ │  APPLE  │ │  VENMO  │ │ PAYPAL  │         │
│   │  (ACH)  │ │  CARD   │ │   PAY   │ │         │ │         │         │
│   └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘         │
│        │           │           │           │           │               │
│        └───────────┴───────────┴───────────┴───────────┘               │
│                                │                                        │
│                                ▼                                        │
│                    ┌───────────────────────┐                           │
│                    │  AUTO-CONVERT TO USDC │                           │
│                    │    (via Meld/Dwolla)  │                           │
│                    └───────────────────────┘                           │
└─────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        BANKROLL WALLET                                  │
│                                                                         │
│                    ┌─────────────────────────┐                         │
│                    │    💰 USDC WALLET       │                         │
│                    │                         │                         │
│                    │   Non-custodial         │                         │
│                    │   User owns keys        │                         │
│                    └─────────────────────────┘                         │
│                                                                         │
│   ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐         │
│   │    BALANCE      │ │   ROUND-UPS     │ │    COVERPAY     │         │
│   │                 │ │                 │ │                 │         │
│   │    $2,450       │ │     $127        │ │     Active      │         │
│   │     USDC        │ │  auto-saved     │ │   (built-in)    │         │
│   └─────────────────┘ └─────────────────┘ └─────────────────┘         │
└─────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                   HEDGE PSP: ON-CHAIN GATEWAY                           │
│                                                                         │
│   ┌───────────────┐                        ┌───────────────┐           │
│   │  FROM WALLET  │                        │  TO RECIPIENT │           │
│   │               │         ⚡             │               │           │
│   │   $100 USDC   │  ─────────────────►   │   $100 USDC   │           │
│   │               │       INSTANT          │               │           │
│   └───────────────┘                        └───────────────┘           │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────┐         │
│   │  ✓ No intermediaries   ✓ <$0.01 fee   ✓ 24/7 settlement │         │
│   └─────────────────────────────────────────────────────────┘         │
└─────────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          USE CASES                                      │
│                                                                         │
│   ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐         │
│   │  P2P TRANSFERS  │ │    MERCHANT     │ │  COVERPAY BNPL  │         │
│   │                 │ │    PAYMENTS     │ │                 │         │
│   │ Send to friends │ │ Pay at checkout │ │ Split payments  │         │
│   │ instantly via   │ │ with 1% fee     │ │ built-in        │         │
│   │ USDC            │ │                 │ │                 │         │
│   └─────────────────┘ └─────────────────┘ └─────────────────┘         │
│                                                                         │
│   ┌─────────────────┐ ┌─────────────────┐                              │
│   │   ROUND-UPS     │ │    SIDEBET      │                              │
│   │                 │ │   INTEGRATION   │                              │
│   │ Auto-save spare │ │ P2P sports      │                              │
│   │ change to USDC  │ │ betting escrow  │                              │
│   └─────────────────┘ └─────────────────┘                              │
└─────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                    HEDGE PSP REVENUE: 1% of processed payments
═══════════════════════════════════════════════════════════════════════════
```

## Payment Flow Details

### 1. Deposit Flow (Fiat → USDC)

```
User deposits $100 via ACH
        │
        ▼
┌───────────────────────┐
│  Meld/Dwolla Process  │
│  • Verify bank        │
│  • Pull funds (T+1)   │
│  • Convert to USDC    │
└───────────────────────┘
        │
        ▼
Bankroll Wallet: +$100 USDC
```

### 2. P2P Transfer Flow

```
User A sends $50 to User B
        │
        ▼
┌───────────────────────┐
│   Hedge PSP Gateway   │
│   • Validate balance  │
│   • USDC transfer     │
│   • <$0.01 gas fee    │
└───────────────────────┘
        │
        ▼
User B receives: $50 USDC (instant)
Hedge Revenue: $0.50 (1%)
```

### 3. Merchant Payment Flow

```
User pays $200 at merchant
        │
        ▼
┌───────────────────────┐
│   Hedge PSP Gateway   │
│   • Deduct from wallet│
│   • USDC to merchant  │
│   • Instant settlement│
└───────────────────────┘
        │
        ▼
Merchant receives: $198 USDC
Hedge Revenue: $2 (1%)
```

### 4. Round-Up Flow

```
User makes purchase: $4.75
        │
        ▼
┌───────────────────────┐
│   Round-Up Engine     │
│   • Calculate: $5.00  │
│   • Difference: $0.25 │
│   • Auto-transfer     │
└───────────────────────┘
        │
        ▼
Round-up Savings: +$0.25 USDC
```

## Technical Architecture

### On-Chain Components

| Component | Technology | Purpose |
|-----------|------------|---------|
| Wallet | Non-custodial (Base/Solana) | User fund storage |
| USDC | Circle stablecoin | Payment denomination |
| Gateway | Smart contract | Transfer routing |
| Oracle | Price feeds | Exchange rates |

### Off-Chain Components

| Component | Technology | Purpose |
|-----------|------------|---------|
| Deposit Rails | Meld, Dwolla | Fiat on-ramp |
| KYC/AML | Persona, Plaid | Compliance |
| API | REST/GraphQL | App integration |
| Analytics | Internal | Usage tracking |

## Revenue Model

```
Hedge PSP Revenue = Transaction Volume × 1%

Transaction Types:
├── P2P Transfers: 1% fee
├── Merchant Payments: 1% fee
├── Round-ups: No fee (drives deposits)
└── CoverPay: 2.5% fee (separate revenue)

Monthly Projections:
├── $1M volume = $10,000 revenue
├── $10M volume = $100,000 revenue
└── $100M volume = $1,000,000 revenue
```

## Advantages vs Traditional Rails

| Feature | Traditional | Bankroll (USDC) |
|---------|-------------|-----------------|
| Settlement | T+1 to T+3 | Instant |
| Fees | 2-3% | 1% |
| Hours | Business hours | 24/7/365 |
| Intermediaries | 3-5 | 0 |
| Chargebacks | Yes | No |
| International | Complex | Native |
