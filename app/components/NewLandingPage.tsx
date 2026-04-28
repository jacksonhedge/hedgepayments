'use client'

import Link from 'next/link'
import Image from 'next/image'

const platformPillars = [
  {
    name: 'Payments core',
    description:
      'Ledger orchestration, settlement logic, payouts, fees, and banking-rail flexibility.'
  },
  {
    name: 'Wallet infrastructure',
    description:
      'Balances, deposit flows, custody adapters, transfers, and crypto movement across products.'
  },
  {
    name: 'Control layer',
    description:
      'Compliance defaults, geography controls, operational review, and partner-safe rollout structure.'
  }
]

const products = [
  {
    name: 'Hedge Payments',
    label: 'Platform',
    description:
      'The white-label payments layer for branded deposits, movement of funds, treasury controls, and partner-facing money operations.'
  },
  {
    name: 'SideBet',
    label: 'Separate product',
    description:
      'An independent product that plugs into shared payment and wallet interfaces while keeping its own deployment, workflows, and operational controls.'
  },
  {
    name: 'Vernacular',
    label: 'Possible layer',
    description:
      'A VIP CRM and service layer that can sit alongside the platform when high-value customer management becomes part of the stack.'
  }
]

const reasons = [
  'Swap banking tools behind stable capability interfaces.',
  'Keep SideBet operationally separate while sharing the money engine.',
  'Launch new branded payment products without rebuilding rails each time.',
  'Standardize compliance and control logic at the platform layer.'
]

export default function NewLandingPage() {
  return (
    <div className="min-h-screen bg-[#f4efe6] text-[#1f241d]">
      <div className="absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(circle_at_top_left,rgba(205,145,73,0.26),transparent_32%),radial-gradient(circle_at_80%_12%,rgba(84,104,73,0.22),transparent_28%),linear-gradient(180deg,#fbf7ef_0%,#f2eadc_58%,#efe4d3_100%)]" />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <header className="sticky top-4 z-20 rounded-[28px] border border-[#2a31261a] bg-[rgba(255,250,242,0.78)] px-5 py-4 backdrop-blur-xl shadow-[0_24px_70px_rgba(57,49,35,0.10)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#394734_0%,#182215_100%)] text-sm tracking-[0.18em] text-[#f6f1e7]">
                HP
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#6b7c60]">
                  Hedge Payments
                </p>
                <p className="text-sm text-[#5d6259]">
                  White-label payments infrastructure
                </p>
              </div>
            </div>

            <nav className="flex flex-wrap items-center gap-4 text-sm text-[#2d3329]">
              <a href="#platform" className="transition hover:text-[#bf6b42]">
                Platform
              </a>
              <a href="#products" className="transition hover:text-[#bf6b42]">
                Products
              </a>
              <a href="#control" className="transition hover:text-[#bf6b42]">
                Control
              </a>
              <Link href="/sidebet" className="transition hover:text-[#bf6b42]">
                SideBet
              </Link>
            </nav>
          </div>
        </header>

        <section className="grid gap-6 overflow-hidden rounded-[36px] border border-[#2a31261a] bg-[rgba(255,251,245,0.82)] p-8 shadow-[0_28px_80px_rgba(46,41,29,0.12)] lg:grid-cols-[1.15fr_0.85fr] lg:p-12">
          <div className="flex flex-col justify-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6b7c60]">
              Shared rails. Separate products.
            </p>
            <h1 className="mt-5 max-w-[11ch] font-serif text-5xl leading-[0.95] tracking-[-0.04em] text-[#1f241d] sm:text-6xl lg:text-8xl">
              White-label payments infrastructure for modern products.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5d6259]">
              Hedge Payments is the platform layer for branded money movement,
              crypto wallet flows, and provider-flexible banking tools. It powers
              products like SideBet through stable interfaces, not fragile vendor-specific
              rewrites.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[linear-gradient(135deg,#394734_0%,#131a11_100%)] px-6 text-sm font-medium tracking-[0.08em] text-[#f8f3ea] transition hover:-translate-y-0.5"
              >
                Book a Demo
              </Link>
              <Link
                href="/products"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#2a312624] bg-white/40 px-6 text-sm font-medium tracking-[0.08em] text-[#1f241d] transition hover:-translate-y-0.5 hover:border-[#394734]"
              >
                Explore Products
              </Link>
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-[28px] border border-[#2a31261a] bg-[linear-gradient(135deg,rgba(57,71,52,0.98)_0%,rgba(18,23,16,0.98)_100%)] p-6 text-[#f2ecdf] shadow-[0_20px_50px_rgba(25,25,20,0.18)]">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#cbc2b1]">
                Platform posture
              </p>
              <div className="mt-4 flex items-center gap-4">
                <Image
                  src="/images/hedge-inc-logo.png"
                  alt="Hedge Payments"
                  width={68}
                  height={68}
                  className="h-[68px] w-[68px] object-contain"
                  priority
                />
                <div>
                  <p className="font-serif text-4xl leading-none tracking-[-0.03em]">
                    White-label first
                  </p>
                  <p className="mt-3 max-w-sm text-sm leading-6 text-[#d9d1c3]">
                    Shared payment rails, wallet infrastructure, compliance defaults,
                    and room for separate products underneath.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              {platformPillars.map((pillar, index) => (
                <article
                  key={pillar.name}
                  className="rounded-[24px] border border-[#2a31261a] bg-[rgba(255,252,247,0.82)] p-5"
                >
                  <p className="font-serif text-lg text-[#d58e3d]">0{index + 1}</p>
                  <h2 className="mt-2 text-xl font-semibold text-[#1f241d]">
                    {pillar.name}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#5d6259]">
                    {pillar.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="platform"
          className="rounded-[32px] border border-[#2a31261a] bg-[rgba(255,251,245,0.76)] p-8 shadow-[0_28px_80px_rgba(46,41,29,0.10)] lg:p-10"
        >
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6b7c60]">
              Platform model
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.03em] text-[#1f241d] sm:text-5xl">
              One money layer with clear boundaries around each product.
            </h2>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <article className="rounded-[28px] border border-[#2a31261a] bg-white/70 p-6">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#6b7c60]">
                Shared by design
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-[#1f241d]">
                Hedge Payments
              </h3>
              <p className="mt-3 text-base leading-7 text-[#5d6259]">
                The white-label platform for partner-facing payment operations,
                banking-tool abstraction, treasury flows, ledger logic, and controlled rollout.
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-[#5d6259]">
                <li>ACH, wire, book transfer, and stablecoin settlement rails</li>
                <li>Ledger and reconciliation models that can be reused across products</li>
                <li>Compliance and audit rules enforced at the platform level</li>
              </ul>
            </article>

            <article className="rounded-[28px] border border-[#2a31261a] bg-[linear-gradient(180deg,rgba(191,107,66,0.12),rgba(255,252,246,0.84)_36%)] p-6">
              <p className="text-[11px] uppercase tracking-[0.24em] text-[#6b7c60]">
                Separate, but connected
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-[#1f241d]">
                SideBet
              </h3>
              <p className="mt-3 text-base leading-7 text-[#5d6259]">
                A separate product using shared payment and wallet capabilities through
                interfaces, so banking tools can change without forcing a full product rewrite.
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-[#5d6259]">
                <li>Own deployment, configuration, and release cadence</li>
                <li>Own product workflows and user operations</li>
                <li>Shared capabilities without shared fragility</li>
              </ul>
            </article>
          </div>
        </section>

        <section
          id="products"
          className="rounded-[32px] border border-[#2a31261a] bg-[rgba(255,251,245,0.76)] p-8 shadow-[0_28px_80px_rgba(46,41,29,0.10)] lg:p-10"
        >
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6b7c60]">
              Products
            </p>
            <h2 className="mt-4 font-serif text-4xl leading-tight tracking-[-0.03em] text-[#1f241d] sm:text-5xl">
              Hedge at the center, with room for multiple product surfaces.
            </h2>
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {products.map((product, index) => (
              <article
                key={product.name}
                className="min-h-[250px] rounded-[28px] border border-[#2a31261a] bg-white/70 p-6"
              >
                <p className="font-serif text-lg text-[#d58e3d]">0{index + 1}</p>
                <p className="mt-4 text-[11px] uppercase tracking-[0.24em] text-[#6b7c60]">
                  {product.label}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-[#1f241d]">
                  {product.name}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#5d6259]">
                  {product.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="control"
          className="grid gap-5 rounded-[32px] border border-[#2a31261a] bg-[rgba(255,251,245,0.76)] p-8 shadow-[0_28px_80px_rgba(46,41,29,0.10)] lg:grid-cols-[1.1fr_0.9fr] lg:p-10"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#6b7c60]">
              Why this structure works
            </p>
            <h2 className="mt-4 max-w-2xl font-serif text-4xl leading-tight tracking-[-0.03em] text-[#1f241d] sm:text-5xl">
              Built to change providers without changing identity.
            </h2>
            <div className="mt-8 grid gap-4">
              {reasons.map((reason) => (
                <article
                  key={reason}
                  className="rounded-[24px] border border-[#2a31261a] bg-white/70 px-5 py-4 text-sm leading-7 text-[#5d6259]"
                >
                  {reason}
                </article>
              ))}
            </div>
          </div>

          <aside className="flex flex-col justify-between rounded-[28px] border border-[#2a31261a] bg-[linear-gradient(135deg,rgba(213,142,61,0.18),rgba(255,252,246,0.84))] p-6">
            <p className="font-serif text-2xl text-[#d58e3d]">/ /</p>
            <p className="mt-10 font-serif text-3xl leading-tight tracking-[-0.03em] text-[#1f241d]">
              Own the interface layer, and the business stays flexible even when the vendors change.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#1f241d] px-5 text-sm font-medium tracking-[0.08em] text-[#f8f3ea] transition hover:-translate-y-0.5"
              >
                Talk to Hedge
              </Link>
              <Link
                href="/sidebet"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#2a312624] bg-white/40 px-5 text-sm font-medium tracking-[0.08em] text-[#1f241d] transition hover:-translate-y-0.5 hover:border-[#394734]"
              >
                See SideBet
              </Link>
            </div>
          </aside>
        </section>
      </main>
    </div>
  )
}
