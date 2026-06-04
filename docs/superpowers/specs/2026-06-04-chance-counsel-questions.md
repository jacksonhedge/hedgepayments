# Chance — Counsel Questions (Written Opinion Request)

**Date:** 2026-06-04
**For:** payments / gaming / fintech regulatory counsel
**Status:** Brief to obtain a written opinion. **No real-money code ships until this lands.**
**Owner:** Jackson Fitzgerald (Hedge Pay)

This is the true critical-path blocker per the build blueprint: compliance, live-data settlement, and the revenue model all gate on these answers. Please provide a **written opinion** and, where possible, a **fail-closed checklist** of conditions that must all be true before a real stake is placed — we will encode it server-side as the gate.

---

## 1. What Chance is (one paragraph)

Chance is a checkout-time feature (a web embed today; a shopper browser extension in preview). At a $X checkout, a shopper may **risk a small amount $R for a shot at a discount $W** (up to a free order; `chance ≈ R/W`). The mechanic **routes the shopper's stake to a real position on an external, licensed prediction market** (intended launch venue: **Kalshi**, a CFTC-regulated Designated Contract Market). If the position resolves in their favor, the payout is applied as a discount on the purchase. **Hedge Pay is the router/introducer, not the counterparty** ("router, not the house"). Today the product is **fully simulated** (outcomes are `Math.random()`, no funds move, geo gate is client-side, no KYC) and labeled as a demo; this brief governs the move to **real money**.

**Intended posture (please confirm or correct):** US-first via Kalshi; Hedge never takes custody of stakes or winnings (the licensed market / a regulated money partner holds funds, the Hedge ledger only records); prediction-market-routing as the primary legal theory, with a **separate** sweepstakes path for restricted jurisdictions if needed.

---

## 2. Core questions

### A. Money transmission / custody
1. If funds are held **only** by the licensed market and/or a regulated bank partner (e.g., Stripe Connect/Treasury), and Hedge's ledger merely **records** the movement, does Hedge avoid **state money-transmitter licensing (MTL)** and **FinCEN MSB** registration?
2. Does it change the analysis if, at the **moment of a win**, the payout is applied as a **merchant discount/refund** rather than a cash payout to the shopper?
3. Is there any flow (reserve → place → win-credit → merchant settlement) in which Hedge is deemed to "hold" or "transmit" funds even briefly? If so, how do we structure to avoid it?

### B. Event-contract / "router not the house" framing
4. Does **routing a retail shopper to a real position on a CFTC-regulated DCM (Kalshi)** keep Hedge a non-counterparty **introducer/router**, rather than a **bookmaker / unlicensed exchange / DCM-or-FCM** requiring its own registration?
5. Are we required to register or affiliate in any capacity (e.g., Introducing Broker, or a Kalshi partner/affiliate agreement) to legally route retail order flow to Kalshi?

### C. Principal model
6. Which reads as "routing, not a book": **(a) Hedge-as-principal** — Hedge places the Kalshi position from its own account and passes the economic outcome to the shopper as a discount; vs **(b) shopper-as-principal** — the shopper is onboarded onto Kalshi and places their own position? Please advise the lower-risk model and what each requires.
7. Under the recommended model, who is the Kalshi accountholder of record, and does the shopper need a Kalshi account / direct relationship?

### D. Jurisdiction (geo gating)
8. As of **mid-2026**, in which **US states** may retail users participate in CFTC event-contract markets such that Chance can operate? Please provide the **allow-list** (or block-list) we should enforce server-side. (Our current demo list — WA, ID, NV, MI, AZ, LA, CT, TN blocked — is an un-vetted guess.)
9. Must the geo determination be **server-side and fail-closed** (deny if jurisdiction can't be verified)? Any IP-geolocation reliability/legal standards we must meet?

### E. Age
10. Minimum age: **18 (CFTC floor)** vs a conservative **21**, given the product's gambling adjacency and that part of the audience is **college students**? Please advise.

### F. Consumer-facing framing / gambling characterization
11. Does "risk $R to win a discount" presented **at an e-commerce checkout** risk being characterized as **gambling** or an illegal lottery (prize + chance + consideration) under state law, **notwithstanding** that it routes to a regulated event-contract market?
12. Is a genuine **sweepstakes / "no purchase necessary"** path required for restricted jurisdictions? If we offer both, what keeps the real-stake offer and the free-entry sweepstakes **cleanly separated** (no blending that would taint the sweepstakes or imply consideration)?
13. Any required changes to **terminology** (we currently use "chance," "odds," "win," "bet"-adjacent language)?

### G. KYC / AML
14. Can Hedge **rely on the licensed market's KYC/AML program** for identity verification and monitoring, or must Hedge run its **own** KYC/AML? What is the division of responsibility, and what must be in the partner agreement?
15. What identity verification is required **before the first real stake** (name/DOB/address/SSN? document verification?)?

### H. Disclosures & responsible gaming
16. What **consumer disclosures** are mandatory at the configure/place/result steps (risk-of-loss, the regulated market's name, Hedge-as-router, no guaranteed outcome)?
17. Are **responsible-gaming controls** (self-exclusion, cooling-off, deposit/loss limits) legally required? If so, must they be tied to verified identity and persist **across merchants**? (We will need to build this server-side.)

### I. The browser extension specifically
18. Does a **shopper-installed browser extension** that surfaces the Chance offer on **third-party merchant checkouts** (merchants who have **not** integrated Chance) change any of the above analysis or add exposure (e.g., merchant-relationship, deceptive-practice, or unauthorized-injection concerns)?
19. Any constraints on **where** the extension may surface the offer (e.g., only on merchants who opted in)?

### J. Marketing / advertising
20. Constraints on advertising the offer (e.g., "win a free order"), endorsements, or referral incentives?

---

## 3. What we need back

1. A **written opinion** addressing §2.A–J.
2. A **fail-closed gating checklist** — the conditions that must ALL be server-side true before any real stake (jurisdiction allow-listed, age/identity verified, disclosures shown+acknowledged, venue available, custody via licensed partner, responsible-gaming checks passed). We encode this as the production gate; default DENY.
3. The **verified per-state allow-list** (§2.D) and **age** (§2.E) answers, as concrete values.
4. Confirmation of the **principal model** (§2.C) and **custody structure** (§2.A) so we can finalize the settlement design.

## 4. Materials we will provide

- Brand & payment architecture (the spine: accounts/KYC, ledger, wallet, payouts; "router not the house").
- The Chance drop-in design + the live widget (`hedgepayments.com/chance`) and the extension preview.
- The build/structure/enable blueprint (the staged path; real money is gated behind this opinion).

## 5. Open founder decisions this opinion informs

- US-first via Kalshi (recommended) vs intl via Polymarket (already live but US-restricted / unregulated-venue concerns).
- Stripe **Connect vs Treasury** for the money-movement leg.
- Hedge-as-principal vs shopper-as-principal (§2.C).
- Age 18 vs 21 (§2.E).
- Whether to build the sweepstakes parallel path at launch (§2.F.12).
