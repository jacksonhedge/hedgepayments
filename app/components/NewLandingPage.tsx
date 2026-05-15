import Link from 'next/link'

type Product = {
  name: string
  monogram: string
  tagline: string
  description: string
  href: string
  external?: boolean
}

const products: Product[] = [
  {
    name: 'FraternityBase',
    monogram: 'F',
    tagline: 'Greek-life CRM',
    description:
      'Outreach, member data, and event coordination for fraternity organizations.',
    href: 'https://fraternitybase.com',
    external: true,
  },
  {
    name: 'Sneakers',
    monogram: 'Sn',
    tagline: 'Prediction-market terminal',
    description:
      'Live prices across prediction markets and sportsbooks, with arbitrage and value tooling. Sneakers Wallet built in.',
    href: 'https://sneakersterminal.com',
    external: true,
  },
  {
    name: 'SideBet',
    monogram: 'Sb',
    tagline: 'Round-up betting',
    description:
      'Turn spare change into wagers across DraftKings, FanDuel, and more.',
    href: '/sidebet',
  },
  {
    name: 'Vernacular',
    monogram: 'V',
    tagline: 'iMessage CRM',
    description:
      'A VIP service layer for high-touch customer relationships over iMessage.',
    href: 'https://vernacular.chat',
    external: true,
  },
]

function ProductLink({
  product,
  children,
  className,
}: {
  product: Product
  children: React.ReactNode
  className?: string
}) {
  if (product.external) {
    return (
      <a
        href={product.href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {children}
      </a>
    )
  }
  return (
    <Link href={product.href} className={className}>
      {children}
    </Link>
  )
}

export default function NewLandingPage() {
  return (
    <div className="min-h-screen bg-[#f4efe6] text-[#1f241d]">
      <main className="mx-auto flex w-full max-w-5xl flex-col px-6 pb-24 pt-10 sm:pt-16">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1f241d] font-serif text-base leading-none text-[#f8f3ea]">
              H
            </div>
            <span className="text-[15px] font-medium tracking-[-0.005em] text-[#1f241d]">
              Hedge Payments
            </span>
          </Link>

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-[15px] text-[#3a423a]">
            {products.map((product) => (
              <ProductLink
                key={product.name}
                product={product}
                className="transition hover:text-[#bf6b42]"
              >
                {product.name}
              </ProductLink>
            ))}
          </nav>
        </header>

        <section className="mt-24 sm:mt-32">
          <h1 className="max-w-[16ch] font-serif text-[clamp(2.75rem,8vw,6rem)] font-light leading-[1.02] tracking-[-0.035em] text-[#1f241d]">
            A small portfolio of focused consumer products.
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-[#5d6259]">
            Hedge Payments builds and operates a handful of independent
            products across community, fintech, prediction markets, and
            customer relationships.
          </p>
        </section>

        <section
          aria-label="Products"
          className="mt-20 border-t border-[#1f241d1a] sm:mt-28"
        >
          <ul className="divide-y divide-[#1f241d1a]">
            {products.map((product) => (
              <li key={product.name}>
                <ProductLink
                  product={product}
                  className="group flex items-start gap-6 py-8 transition sm:items-center sm:gap-10"
                >
                  <span
                    aria-hidden="true"
                    className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#1f241d1a] bg-[#fbf7ef] font-serif text-2xl font-light leading-none tracking-[-0.02em] text-[#1f241d] transition group-hover:border-[#394734]/40 group-hover:bg-[#f6efdf] sm:h-16 sm:w-16 sm:text-3xl"
                  >
                    {product.monogram}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-x-4">
                      <h2 className="font-serif text-2xl font-normal tracking-[-0.02em] text-[#1f241d] sm:text-3xl">
                        {product.name}
                      </h2>
                      <p className="text-[11px] uppercase tracking-[0.22em] text-[#6b7c60]">
                        {product.tagline}
                      </p>
                    </div>
                    <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[#5d6259]">
                      {product.description}
                    </p>
                  </div>

                  <span
                    aria-hidden="true"
                    className="mt-3 hidden text-[#1f241d80] transition group-hover:translate-x-1 group-hover:text-[#bf6b42] sm:inline-block"
                  >
                    →
                  </span>
                </ProductLink>
              </li>
            ))}
          </ul>
        </section>

        <footer className="mt-24 flex flex-col items-start justify-between gap-3 border-t border-[#1f241d1a] pt-8 text-sm text-[#5d6259] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Hedge Payments</p>
          <Link href="/contact" className="transition hover:text-[#bf6b42]">
            Contact
          </Link>
        </footer>
      </main>
    </div>
  )
}
