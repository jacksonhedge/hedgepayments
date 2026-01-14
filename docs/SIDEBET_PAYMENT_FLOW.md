# SideBet Payment Flow

## P2P Sports Betting Settlement

```
                    ┌─────────────┐     ┌─────────────┐
                    │   USER A    │     │   USER B    │
                    │  Stakes $50 │     │  Stakes $50 │
                    └──────┬──────┘     └──────┬──────┘
                           │                   │
                           └─────────┬─────────┘
                                     │
                                     ▼
                    ┌─────────────────────────────────┐
                    │      SIDEBET ESCROW (USDC)      │
                    │                                 │
                    │           $100 LOCKED           │
                    │                                 │
                    │   Smart contract holds funds    │
                    │   until game outcome resolved   │
                    └────────────────┬────────────────┘
                                     │
                                     ▼
                    ┌─────────────────────────────────┐
                    │      SPORTS DATA ORACLE         │
                    │                                 │
                    │   • ESPN API Integration        │
                    │   • Official Game Results       │
                    │   • Real-time Score Tracking    │
                    └────────────────┬────────────────┘
                                     │
                                     ▼
                    ┌─────────────────────────────────┐
                    │     AUTOMATIC SETTLEMENT        │
                    │                                 │
                    │   ┌───────────┐  ┌───────────┐  │
                    │   │  WINNER   │  │ SIDEBET   │  │
                    │   │           │  │   FEE     │  │
                    │   │   $95     │  │   $5      │  │
                    │   │  (USDC)   │  │  (5%)     │  │
                    │   └───────────┘  └───────────┘  │
                    │                                 │
                    │   Instant payout via USDC      │
                    └─────────────────────────────────┘
```

## Flow Steps

### 1. Bet Creation
- User A creates a bet on a game/outcome
- User A stakes USDC (e.g., $50)
- Bet is published to friends/public

### 2. Bet Acceptance
- User B accepts the bet
- User B stakes matching USDC ($50)
- Both stakes locked in smart contract escrow

### 3. Game Monitoring
- Sports data oracle monitors game in real-time
- ESPN API provides official results
- Smart contract awaits final outcome

### 4. Settlement Trigger
- Game ends, oracle confirms result
- Smart contract automatically executes
- No manual intervention required

### 5. Payout Distribution
```
Total Pool:     $100.00
SideBet Fee:    -$5.00  (5% rake)
Winner Payout:  $95.00  (instant USDC transfer)
```

## Key Features

| Feature | Description |
|---------|-------------|
| **No Counterparty Risk** | Funds held in smart contract escrow until settlement |
| **Instant Payout** | USDC sent within seconds of game result |
| **Transparent Odds** | P2P means no house edge manipulation |
| **Social Betting** | Bet against friends, not the house |
| **Provably Fair** | All transactions on-chain and verifiable |

## Revenue Model

```
Per Bet Revenue = Total Pool × 5%

Example:
- $100 total pool = $5 revenue
- $1,000 total pool = $50 revenue
- $10,000 daily volume = $500 daily revenue
```

## Technical Stack

- **Escrow**: USDC smart contract (Solana/Base)
- **Oracle**: ESPN API + backup data sources
- **Settlement**: Automatic on-chain execution
- **Wallet**: Non-custodial USDC wallet integration
