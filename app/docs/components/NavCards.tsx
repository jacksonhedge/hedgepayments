'use client';

import Link from 'next/link';

interface NavCard {
  title: string;
  description: string;
  href: string;
}

interface NavCardsProps {
  cards: NavCard[];
}

export default function NavCards({ cards }: NavCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
      {cards.map((card) => (
        <Link
          key={card.href}
          href={card.href}
          className="group block p-5 rounded-lg border border-[#D4C5B0] bg-white hover:border-[#6B5D4F] hover:shadow-[0_2px_12px_rgba(44,36,22,0.08)] transition-all duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#4CAF50]/40 focus:border-[#4CAF50]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h4
                className="text-[15px] font-semibold text-[#2C2416] mb-1.5 group-hover:text-[#4CAF50] transition-colors duration-200"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {card.title}
              </h4>
              <p
                className="text-[#8B7E6E] text-sm leading-relaxed"
                style={{ fontFamily: 'Georgia, serif' }}
              >
                {card.description}
              </p>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0 mt-1 text-[#D4C5B0] group-hover:text-[#6B5D4F] group-hover:translate-x-0.5 transition-all duration-200"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
}
