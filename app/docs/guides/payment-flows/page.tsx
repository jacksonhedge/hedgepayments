'use client';

import PaymentFlow, { BranchFlow } from '../../components/PaymentFlow';
import { Callout, CodeBlock, NavCards } from '../../components';

const sections = [
  { id: 'ach', label: 'ACH Payment Flow' },
  { id: 'card', label: 'Card + Chargeback Protection' },
  { id: 'roundup', label: 'Round-Up (SideBet) Flow' },
  { id: 'architecture', label: 'Full Architecture' },
  { id: 'comparison', label: 'Open Banking Comparison' },
  { id: 'webhooks', label: 'Webhook Lifecycle' },
  { id: 'security', label: 'Security & Compliance' },
];

export default function PaymentFlowsPage() {
  return (
    <div>
      <h1
        className="text-3xl font-bold text-[#2C2416] mb-2"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        Payment Flow Diagrams
      </h1>
      <p
        className="text-[#6B5D4F] text-lg mb-6 leading-relaxed"
        style={{ fontFamily: 'Georgia, serif' }}
      >
        Visual reference for how Hedge processes payments through CoinFlow and Plaid,
        including chargeback protection and settlement flows.
      </p>

      {/* Table of Contents */}
      <nav className="mb-10 p-4 bg-white border border-[#D4C5B0] rounded-lg print:border-gray-300" aria-label="Page sections">
        <h2 className="text-[10px] font-semibold text-[#8B7E6E] uppercase tracking-widest mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          On this page
        </h2>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="flex items-center gap-2 text-sm text-[#6B5D4F] hover:text-[#2C2416] py-1 px-2 rounded-md hover:bg-[#FAF8F5] transition-colors"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                <span className="text-[10px] font-mono text-[#8B7E6E] w-4">{i + 1}.</span>
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* ─── 1. ACH Payment Flow ──────────────────────────────── */}
      <section id="ach" className="mb-16 scroll-mt-20">
        <h2
          className="text-xl font-bold text-[#2C2416] mb-1"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          ACH Payment Flow
        </h2>
        <p className="text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          End-to-end bank transfer using Plaid for bank verification and CoinFlow for ACH processing.
        </p>

        <PaymentFlow
          title="ACH Bank Transfer — End to End"
          description="Consumer initiates payment via Hedge white-label checkout"
          nodes={[
            { id: 'consumer', label: 'Consumer', sublabel: 'Initiates payment', color: 'brown', icon: 'user' },
            { id: 'hedge-api', label: 'Hedge API', sublabel: 'Session + validation', color: 'brown', icon: 'building' },
            { id: 'plaid', label: 'Plaid', sublabel: 'Bank account linking', color: 'blue', icon: 'link' },
            { id: 'bank-verify', label: 'Bank Verified', sublabel: 'Account + routing', color: 'blue', icon: 'bank' },
            { id: 'coinflow', label: 'CoinFlow', sublabel: 'ACH checkout', color: 'purple', icon: 'zap' },
            { id: 'ach-network', label: 'ACH Network', sublabel: 'Nacha processing', color: 'amber', icon: 'refresh' },
            { id: 'settlement', label: 'Settlement', sublabel: 'USDC or USD', color: 'green', icon: 'dollar' },
            { id: 'merchant', label: 'Merchant', sublabel: 'Funds received', color: 'green', icon: 'check' },
          ]}
          rows={[
            ['consumer', 'hedge-api'],
            ['plaid', 'bank-verify'],
            ['coinflow', 'ach-network'],
            ['settlement', 'merchant'],
          ]}
          connections={[
            { from: 'consumer', to: 'hedge-api', label: 'API request' },
            { from: 'hedge-api', to: 'plaid', label: 'Bank link initiated' },
            { from: 'plaid', to: 'bank-verify', label: 'Verified via Plaid' },
            { from: 'bank-verify', to: 'coinflow', label: 'ACH initiated' },
            { from: 'coinflow', to: 'ach-network', label: 'Batch submitted' },
            { from: 'ach-network', to: 'settlement', label: 'T+1 to T+3' },
            { from: 'settlement', to: 'merchant', label: 'Instant USDC' },
          ]}
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          {[
            { metric: 'Processing Time', value: '1-3 Business Days', note: 'Same-day ACH available for premium' },
            { metric: 'Fee', value: '~1% (min $1)', note: 'Lowest cost payment method' },
            { metric: 'Settlement', value: 'USDC or USD', note: 'Merchant chooses settlement type' },
          ].map((item) => (
            <div key={item.metric} className="bg-white border border-[#D4C5B0] rounded-lg p-4 print:border-gray-300">
              <div className="text-[10px] font-semibold text-[#8B7E6E] uppercase tracking-wider mb-1" style={{ fontFamily: 'Georgia, serif' }}>{item.metric}</div>
              <div className="text-lg font-bold text-[#2C2416]" style={{ fontFamily: 'Georgia, serif' }}>{item.value}</div>
              <div className="text-xs text-[#6B5D4F] mt-1" style={{ fontFamily: 'Georgia, serif' }}>{item.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 2. Card Payment + Chargeback Protection ──────────── */}
      <section id="card" className="mb-16 scroll-mt-20">
        <h2
          className="text-xl font-bold text-[#2C2416] mb-1"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Card Payment + Chargeback Protection
        </h2>
        <p className="text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          CoinFlow provides 100% chargeback protection through AI fraud detection, 3D Secure, and device fingerprinting.
        </p>

        <PaymentFlow
          title="Card Checkout with 100% Chargeback Protection"
          description="Every card transaction passes through CoinFlow's multi-layer fraud engine"
          nodes={[
            { id: 'cardholder', label: 'Cardholder', sublabel: 'Visa / MC / Amex', color: 'brown', icon: 'user' },
            { id: 'hedge-checkout', label: 'Hedge Checkout', sublabel: 'White-label UI', color: 'brown', icon: 'card' },
            { id: 'device-fp', label: 'Device Fingerprint', sublabel: 'Behavioral analysis', color: 'amber', icon: 'shield' },
            { id: 'risk-engine', label: 'AI Risk Engine', sublabel: 'Real-time scoring', color: 'amber', icon: 'zap' },
            { id: '3ds', label: '3D Secure', sublabel: 'Cardholder auth', color: 'blue', icon: 'lock' },
            { id: 'coinflow-process', label: 'CoinFlow', sublabel: 'Card processing', color: 'purple', icon: 'zap' },
            { id: 'approved', label: 'Approved', sublabel: 'Funds captured', color: 'green', icon: 'check' },
            { id: 'settled', label: 'Settled', sublabel: 'T+1 to T+3', color: 'green', icon: 'dollar' },
          ]}
          rows={[
            ['cardholder', 'hedge-checkout'],
            ['device-fp', 'risk-engine'],
            ['3ds', 'coinflow-process'],
            ['approved', 'settled'],
          ]}
          connections={[
            { from: 'cardholder', to: 'hedge-checkout', label: 'Card details' },
            { from: 'hedge-checkout', to: 'device-fp', label: 'Fraud screening' },
            { from: 'device-fp', to: 'risk-engine', label: 'Risk signals' },
            { from: 'risk-engine', to: '3ds', label: 'Auth required' },
            { from: '3ds', to: 'coinflow-process', label: 'Verified' },
            { from: 'coinflow-process', to: 'approved', label: 'Authorization' },
            { from: 'approved', to: 'settled', label: 'Capture' },
          ]}
        />

        <BranchFlow
          title="Chargeback Lifecycle — Hedge is Protected"
          mainFlow={[
            { id: 'txn', label: 'Transaction', sublabel: 'Card payment', color: 'blue', icon: 'card' },
            { id: 'fraud-screen', label: 'CoinFlow Screening', sublabel: 'AI + 3DS + Fingerprint', color: 'amber', icon: 'shield' },
            { id: 'approved-2', label: 'Approved', sublabel: 'Protected transaction', color: 'green', icon: 'check' },
            { id: 'protected', label: 'Guaranteed', sublabel: '100% covered', color: 'green', icon: 'shield' },
          ]}
          connectionLabels={['Submit', 'Pass', 'CoinFlow absorbs chargebacks']}
          branches={[
            {
              afterNodeIndex: 1,
              label: 'Dispute filed',
              nodes: [
                { id: 'chargeback', label: 'Chargeback Filed', sublabel: 'By cardholder', color: 'red', icon: 'x' },
                { id: 'coinflow-covers', label: 'CoinFlow Covers', sublabel: 'Merchant keeps funds', color: 'green', icon: 'dollar' },
              ],
            },
            {
              afterNodeIndex: 1,
              label: 'Flagged',
              nodes: [
                { id: 'declined', label: 'Declined', sublabel: 'High risk blocked', color: 'red', icon: 'x' },
              ],
            },
          ]}
        />

        <Callout variant="success">
          <strong>Zero chargeback liability.</strong> CoinFlow absorbs 100% of chargebacks on approved transactions.
          Merchants receive funds regardless of cardholder disputes. This is a key differentiator vs. traditional payment processors
          and open banking providers like Trustly.
        </Callout>
      </section>

      {/* ─── 3. Round-Up (SideBet) Micro-Debit Flow ──────────── */}
      <section id="roundup" className="mb-16 scroll-mt-20">
        <h2
          className="text-xl font-bold text-[#2C2416] mb-1"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Round-Up (SideBet) Micro-Debit Flow
        </h2>
        <p className="text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          Automated round-up collection from sportsbook bets, powered by merchant-initiated ACH debits via CoinFlow.
        </p>

        <PaymentFlow
          title="SideBet Round-Up Flow"
          description="Sportsbook bet triggers automatic round-up collection"
          nodes={[
            { id: 'bettor', label: 'Bettor', sublabel: 'Places $43 bet', color: 'brown', icon: 'user' },
            { id: 'sportsbook', label: 'Sportsbook', sublabel: 'Bet event webhook', color: 'brown', icon: 'building' },
            { id: 'hedge-roundup', label: 'Hedge Engine', sublabel: 'Calculates round-up', color: 'teal', icon: 'zap' },
            { id: 'roundup-amt', label: 'Round-Up: $7', sublabel: '$43 rounded to $50', color: 'teal', icon: 'dollar' },
            { id: 'plaid-auth', label: 'Plaid Auth', sublabel: 'Pre-linked bank', color: 'blue', icon: 'link' },
            { id: 'merchant-init', label: 'CoinFlow ACH', sublabel: 'Merchant-initiated debit', color: 'purple', icon: 'zap' },
            { id: 'user-account', label: 'User Account', sublabel: '$7 credited', color: 'green', icon: 'check' },
            { id: 'savings-pool', label: 'Savings Pool', sublabel: 'Accumulates over time', color: 'green', icon: 'dollar' },
          ]}
          rows={[
            ['bettor', 'sportsbook'],
            ['hedge-roundup', 'roundup-amt'],
            ['plaid-auth', 'merchant-init'],
            ['user-account', 'savings-pool'],
          ]}
          connections={[
            { from: 'bettor', to: 'sportsbook', label: 'Bet placed' },
            { from: 'sportsbook', to: 'hedge-roundup', label: 'Webhook event' },
            { from: 'hedge-roundup', to: 'roundup-amt', label: 'Strategy applied' },
            { from: 'roundup-amt', to: 'plaid-auth', label: 'Debit authorized' },
            { from: 'plaid-auth', to: 'merchant-init', label: 'ACH pull' },
            { from: 'merchant-init', to: 'user-account', label: 'Settled' },
            { from: 'user-account', to: 'savings-pool', label: 'Accumulated' },
          ]}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {[
            { strategy: 'Nearest Dollar', example: '$43 bet', roundup: '$7.00' },
            { strategy: 'Nearest $5', example: '$43 bet', roundup: '$2.00' },
            { strategy: 'Percentage (10%)', example: '$43 bet', roundup: '$4.30' },
            { strategy: 'Fixed Amount', example: '$43 bet', roundup: '$5.00' },
          ].map((item) => (
            <div key={item.strategy} className="bg-white border border-[#D4C5B0] rounded-lg p-3 text-center print:border-gray-300">
              <div className="text-[10px] font-semibold text-[#8B7E6E] uppercase tracking-wider mb-1" style={{ fontFamily: 'Georgia, serif' }}>
                {item.strategy}
              </div>
              <div className="text-lg font-bold text-[#4CAF50]" style={{ fontFamily: 'Georgia, serif' }}>{item.roundup}</div>
              <div className="text-[10px] text-[#6B5D4F] font-mono">{item.example}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. Full Architecture — Hedge + CoinFlow + Plaid ──── */}
      <section id="architecture" className="mb-16 scroll-mt-20">
        <h2
          className="text-xl font-bold text-[#2C2416] mb-1"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Full Architecture Overview
        </h2>
        <p className="text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          How Hedge, CoinFlow, and Plaid work together to provide complete payment infrastructure.
        </p>

        <PaymentFlow
          title="Hedge Payments Architecture"
          description="White-label payment infrastructure powered by CoinFlow + Plaid"
          nodes={[
            { id: 'end-user', label: 'End User', sublabel: 'Consumer / Bettor', color: 'brown', icon: 'user' },
            { id: 'hedge-platform', label: 'Hedge Platform', sublabel: 'API + White-label UI', color: 'brown', icon: 'building' },
            { id: 'plaid-layer', label: 'Plaid', sublabel: 'Bank linking + KYC', color: 'blue', icon: 'link' },
            { id: 'coinflow-layer', label: 'CoinFlow', sublabel: 'Payment processing', color: 'purple', icon: 'zap' },
            { id: 'fraud-layer', label: 'Fraud Engine', sublabel: 'AI + 3DS + Fingerprint', color: 'amber', icon: 'shield' },
            { id: 'card-rail', label: 'Card Networks', sublabel: 'Visa / MC / Amex', color: 'blue', icon: 'card' },
            { id: 'ach-rail', label: 'ACH / Nacha', sublabel: 'Bank transfers', color: 'blue', icon: 'bank' },
            { id: 'crypto-rail', label: 'Blockchain', sublabel: 'USDC settlement', color: 'teal', icon: 'lock' },
            { id: 'merchant-settle', label: 'Merchant', sublabel: 'Receives funds', color: 'green', icon: 'dollar' },
          ]}
          rows={[
            ['end-user', 'hedge-platform'],
            ['plaid-layer', 'coinflow-layer', 'fraud-layer'],
            ['card-rail', 'ach-rail', 'crypto-rail'],
            ['merchant-settle'],
          ]}
          connections={[
            { from: 'end-user', to: 'hedge-platform', label: 'Branded experience' },
            { from: 'hedge-platform', to: 'plaid-layer', label: 'Orchestration layer' },
            { from: 'plaid-layer', to: 'coinflow-layer' },
            { from: 'coinflow-layer', to: 'fraud-layer' },
            { from: 'fraud-layer', to: 'card-rail', label: 'Payment rails' },
            { from: 'card-rail', to: 'ach-rail' },
            { from: 'ach-rail', to: 'crypto-rail' },
            { from: 'card-rail', to: 'merchant-settle', label: 'Settlement' },
          ]}
        />

        <Callout variant="info">
          <strong>Trustly comparison:</strong> Like Trustly, Hedge enables direct bank-to-merchant payments.
          Unlike Trustly, Hedge adds CoinFlow&apos;s 100% chargeback guarantee, multi-rail settlement (USDC, USD, card),
          and Plaid-powered bank verification purpose-built for the US market.
        </Callout>
      </section>

      {/* ─── 5. Open Banking Comparison ───────────────────────── */}
      <section id="comparison" className="mb-16 scroll-mt-20">
        <h2
          className="text-xl font-bold text-[#2C2416] mb-1"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Open Banking Comparison
        </h2>
        <p className="text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          How Hedge compares to traditional open banking providers.
        </p>

        <div className="overflow-x-auto my-6 border border-[#D4C5B0] rounded-lg print:border-gray-300">
          <table className="w-full text-sm" role="table" aria-label="Feature comparison: Hedge vs Trustly">
            <thead>
              <tr className="bg-[#F5F0E8] border-b border-[#D4C5B0]">
                <th className="text-left px-4 py-3 text-[#6B5D4F] text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>Capability</th>
                <th className="text-center px-4 py-3 text-[#6B5D4F] text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>Hedge + CoinFlow</th>
                <th className="text-center px-4 py-3 text-[#6B5D4F] text-xs font-semibold uppercase tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>Trustly</th>
              </tr>
            </thead>
            <tbody>
              {([
                ['Bank-to-merchant ACH', 'yes', 'yes'],
                ['100% Chargeback Protection', 'yes', 'no'],
                ['Card Payments (Visa/MC/Amex)', 'yes', 'no'],
                ['Apple Pay / Google Pay', 'yes', 'no'],
                ['Crypto Settlement (USDC)', 'yes', 'no'],
                ['Open Banking (EU PSD2)', 'Roadmap', 'yes'],
                ['US Bank Linking (Plaid)', 'yes', 'Partial'],
                ['AI Fraud Detection', 'yes', 'Partial'],
                ['3D Secure', 'yes', 'N/A'],
                ['White-label Checkout', 'yes', 'yes'],
                ['Recurring / Merchant-Initiated', 'yes', 'yes'],
                ['Real-time Settlement (USDC)', 'yes', 'no'],
                ['Multi-chain Support', 'yes', 'no'],
                ['170+ Countries Supported', 'yes', 'EU-focused'],
                ['iGaming / Sportsbook Focus', 'yes', 'yes'],
                ['PCI DSS Level 1', 'yes', 'yes'],
                ['SOC 2 Type II', 'yes', 'yes'],
              ] as const).map(([feature, hedge, trustly], i) => (
                <tr key={feature} className={`border-b border-[#D4C5B0]/50 last:border-b-0 ${i % 2 === 1 ? 'bg-[#FAF8F5]' : 'bg-white'}`}>
                  <td className="px-4 py-2.5 text-[#2C2416] font-medium text-[13px]" style={{ fontFamily: 'Georgia, serif' }}>{feature}</td>
                  <td className="px-4 py-2.5 text-center">
                    <ComparisonCell value={hedge} />
                  </td>
                  <td className="px-4 py-2.5 text-center">
                    <ComparisonCell value={trustly} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout variant="warning">
          <strong>Key differentiator for partner discussions:</strong> Hedge provides the same bank-to-merchant ACH rails
          that Trustly offers, plus card acceptance, crypto settlement, and — critically — 100% chargeback protection
          on all approved transactions. This eliminates the #1 risk in iGaming and sportsbook payments.
        </Callout>
      </section>

      {/* ─── 6. Webhook Lifecycle ──────────────────────────────── */}
      <section id="webhooks" className="mb-16 scroll-mt-20">
        <h2
          className="text-xl font-bold text-[#2C2416] mb-1"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Webhook Event Lifecycle
        </h2>
        <p className="text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          Real-time status updates as payments move through the pipeline.
        </p>

        <BranchFlow
          title="Payment Webhook States"
          mainFlow={[
            { id: 'created', label: 'Created', sublabel: 'payment.created', color: 'amber', icon: 'zap' },
            { id: 'processing', label: 'Processing', sublabel: 'payment.processing', color: 'blue', icon: 'refresh' },
            { id: 'completed', label: 'Completed', sublabel: 'payment.completed', color: 'green', icon: 'check' },
            { id: 'settled-wh', label: 'Settled', sublabel: 'payment.settled', color: 'green', icon: 'dollar' },
          ]}
          connectionLabels={['', 'Auth + capture', 'Settlement']}
          branches={[
            {
              afterNodeIndex: 1,
              label: 'Declined',
              nodes: [
                { id: 'failed-wh', label: 'Failed', sublabel: 'payment.failed', color: 'red', icon: 'x' },
              ],
            },
            {
              afterNodeIndex: 2,
              label: 'Dispute',
              nodes: [
                { id: 'chargeback-wh', label: 'Chargeback', sublabel: 'payment.chargeback', color: 'red', icon: 'x' },
                { id: 'covered-wh', label: 'CoinFlow Covers', sublabel: 'No merchant loss', color: 'green', icon: 'shield' },
              ],
            },
          ]}
        />

        <CodeBlock
          language="json"
          title="Example: payment.completed webhook"
          code={`{
  "event": "payment.completed",
  "data": {
    "paymentId": "pay_7xK2mN9pQ",
    "amount": 5000,
    "currency": "USD",
    "method": "ach",
    "status": "completed",
    "settlementType": "USDC",
    "chargebackProtected": true,
    "plaidAccountId": "acc_Plaid_xxxxx",
    "webhookInfo": {
      "userId": "user_abc123",
      "orderId": "order_456"
    },
    "timestamps": {
      "created": "2025-11-18T10:30:00Z",
      "processing": "2025-11-18T10:30:02Z",
      "completed": "2025-11-18T10:30:45Z"
    }
  }
}`}
        />
      </section>

      {/* ─── 7. Security & Compliance Stack ───────────────────── */}
      <section id="security" className="mb-16 scroll-mt-20">
        <h2
          className="text-xl font-bold text-[#2C2416] mb-1"
          style={{ fontFamily: 'Georgia, serif' }}
        >
          Security & Compliance
        </h2>
        <p className="text-sm text-[#6B5D4F] mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          Enterprise-grade security across the full payment stack.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          {[
            {
              title: 'PCI DSS Level 1',
              desc: 'Highest level of card data security. CoinFlow handles all PCI scope — Hedge merchants never touch raw card numbers.',
              color: 'text-[#2563EB]',
              bg: 'bg-[#2563EB]/5',
              border: 'border-[#2563EB]/20',
            },
            {
              title: 'SOC 2 Type II',
              desc: 'Independently audited security controls covering availability, confidentiality, and processing integrity.',
              color: 'text-[#7C3AED]',
              bg: 'bg-[#7C3AED]/5',
              border: 'border-[#7C3AED]/20',
            },
            {
              title: '100% Chargeback Protection',
              desc: 'CoinFlow absorbs all chargebacks on approved transactions. AI fraud scoring, 3D Secure, device fingerprinting, and behavioral analysis.',
              color: 'text-[#4CAF50]',
              bg: 'bg-[#4CAF50]/5',
              border: 'border-[#4CAF50]/20',
            },
            {
              title: 'KYC / AML Compliance',
              desc: 'Identity verification, OFAC sanctions screening, FinCEN registration, and anti-money laundering monitoring — all handled by CoinFlow.',
              color: 'text-[#B45309]',
              bg: 'bg-[#F59E0B]/5',
              border: 'border-[#F59E0B]/20',
            },
            {
              title: 'Data Encryption',
              desc: 'TLS 1.3 for data in transit, AES-256 for data at rest, HSM for key management. GDPR and CCPA compliant.',
              color: 'text-[#2C2416]',
              bg: 'bg-[#2C2416]/3',
              border: 'border-[#2C2416]/10',
            },
            {
              title: 'Plaid Bank Verification',
              desc: 'Instant bank account verification via Plaid. No micro-deposits required. Supports 12,000+ financial institutions in the US.',
              color: 'text-[#0D9488]',
              bg: 'bg-[#0D9488]/5',
              border: 'border-[#0D9488]/20',
            },
          ].map((item) => (
            <div key={item.title} className={`${item.bg} ${item.border} border rounded-lg p-5 print:border-gray-300 print:bg-white`}>
              <h3 className={`text-sm font-bold ${item.color} mb-2`} style={{ fontFamily: 'Georgia, serif' }}>{item.title}</h3>
              <p className="text-xs text-[#6B5D4F] leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <NavCards
        cards={[
          { title: 'SideBet Overview', description: 'Round-up engine and strategies', href: '/docs/sidebet' },
          { title: 'ACH Payments', description: 'Detailed ACH integration guide', href: '/docs/checkout/ach' },
          { title: 'Webhooks Guide', description: 'Set up real-time notifications', href: '/docs/guides/webhooks' },
          { title: 'Settlement Options', description: 'USDC, USD, and crypto rails', href: '/docs/guides/settlement' },
        ]}
      />
    </div>
  );
}

function ComparisonCell({ value }: { value: string }) {
  if (value === 'yes') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#4CAF50]/10">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4CAF50" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
      </span>
    );
  }
  if (value === 'no') {
    return (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#EF4444]/10">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </span>
    );
  }
  if (value === 'N/A') {
    return <span className="text-[#8B7E6E] text-xs font-mono">N/A</span>;
  }
  // Partial, Roadmap, EU-focused, etc.
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold font-mono bg-[#F59E0B]/10 text-[#B45309] border border-[#F59E0B]/20">
      {value}
    </span>
  );
}
