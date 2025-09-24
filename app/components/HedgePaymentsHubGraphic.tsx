import React from "react";

/**
 * HedgePaymentsHubGraphic
 * -------------------------------------------------------------
 * A responsive, scalable SVG hero graphic that places "Hedge" at the center,
 * shows a consumer "Digital Wallet" app on the left, and a stack of payment
 * options on the right, all connected to the hub.
 *
 * Colors: green / mint green / light blue on a dark background.
 *
 * Usage:
 * <div className="w-full h-[520px] md:h-[640px] lg:h-[760px]">
 *   <HedgePaymentsHubGraphic payments={["Bankroll", "Visa", "Venmo", "PayPal", "Kalshi"]} />
 * </div>
 */
export default function HedgePaymentsHubGraphic({
  payments = ["Bankroll", "Visa", "Venmo", "PayPal", "Kalshi"],
  title = "The Payment Infrastructure Hub",
  subtitle = "Connecting digital wallets to every payment method your users need",
}: {
  payments?: string[];
  title?: string;
  subtitle?: string;
}) {
  // Layout constants for the right-hand payment stack
  const stackTop = 130; // y-start for first payment card
  const stackGap = 90;  // vertical gap between cards
  const cardWidth = 210;
  const cardHeight = 64;

  return (
    <div className="relative w-full h-full overflow-hidden rounded-2xl bg-[#071b1d]">
      {/* Decorative background gradient */}
      <div className="absolute inset-0">
        <svg className="h-full w-full" viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice">
          <defs>
            <radialGradient id="bgGradient" cx="50%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#0a2b2e" />
              <stop offset="60%" stopColor="#071b1d" />
              <stop offset="100%" stopColor="#061417" />
            </radialGradient>
            <linearGradient id="mintLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5bf2c9" />
              <stop offset="100%" stopColor="#79e1ff" />
            </linearGradient>
            <linearGradient id="pulsingLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#5bf2c9">
                <animate attributeName="stop-opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
              </stop>
              <stop offset="100%" stopColor="#79e1ff">
                <animate attributeName="stop-opacity" values="0.4;1;0.4" dur="2s" repeatCount="indefinite" />
              </stop>
            </linearGradient>
            <linearGradient id="nodeFill" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1ad0a7" />
              <stop offset="100%" stopColor="#45b7ff" />
            </linearGradient>
            <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="12" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="cardGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="cg" />
              <feMerge>
                <feMergeNode in="cg" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect x="0" y="0" width="1440" height="800" fill="url(#bgGradient)" />

          {/* Floating dots */}
          {Array.from({ length: 24 }).map((_, i) => (
            <circle
              key={i}
              cx={Math.random() * 1440}
              cy={Math.random() * 800}
              r={Math.random() * 2 + 1}
              fill="#0e3c41"
              opacity="0.6"
            />
          ))}

          {/* Left: Wallet card */}
          <g transform="translate(120, 290)" opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="0.8s" begin="0.2s" fill="freeze" />
            <rect
              width="240"
              height="180"
              rx="20"
              fill="#0e2b2f"
              stroke="#163e44"
              strokeWidth="2"
              filter="url(#cardGlow)"
            />
            {/* Wallet icon */}
            <g transform="translate(26, 26)">
              <rect width="58" height="40" rx="8" fill="#114449" stroke="#1b5e66" />
              <circle cx="50" cy="38" r="4" fill="#79e1ff" />
            </g>
            <text x="26" y="98" fill="#c9fff0" fontSize="20" fontWeight="700" letterSpacing="0.3px">
              Digital Wallet
            </text>
            <text x="26" y="126" fill="#93e8d5" fontSize="14" opacity="0.9">
              Consumer App
            </text>
          </g>

          {/* Center: Hedge node */}
          <g transform="translate(620, 350)" filter="url(#softGlow)" opacity="0">
            <animate attributeName="opacity" from="0" to="1" dur="1s" begin="0s" fill="freeze" />
            <circle r="120" fill="#072224" stroke="url(#nodeFill)" strokeWidth="3" />
            <circle r="130" fill="none" stroke="#0e3c41" strokeWidth="2" opacity="0.6" />
            <text textAnchor="middle" fill="#eafffb" fontSize="48" fontWeight="800" dy="14">
              Hedge
            </text>
            <text textAnchor="middle" fill="#93e8d5" fontSize="14" dy="36" opacity="0.9">
              Payments Hub
            </text>
          </g>

          {/* Title & subtitle (top) */}
          <text x="120" y="110" fill="#eafffb" fontSize="44" fontWeight="800" letterSpacing="0.4px">
            {title}
          </text>
          <text x="120" y="150" fill="#b4fff0" fontSize="18" opacity="0.9">
            {subtitle}
          </text>

          {/* Right: Payment stack */}
          {payments.map((label, idx) => {
            const y = stackTop + idx * stackGap;
            const x = 1120;
            // Compute line attachment points
            const hubX = 620; // center X of hub group
            const hubY = 350; // center Y of hub group
            const cardX = x; // left of card
            const cardY = y; // top of card
            const attachY = cardY + cardHeight / 2;

            // Path: from hub edge to left of the card with a slight curve
            const startX = hubX + 120; // hub radius
            const startY = hubY + (idx - payments.length / 2) * 12; // stagger
            const endX = cardX - 12;
            const endY = attachY;
            const c1X = startX + 180;
            const c1Y = startY;
            const c2X = endX - 80;
            const c2Y = endY;

            return (
              <g key={label}>
                <path
                  d={`M ${startX},${startY} C ${c1X},${c1Y} ${c2X},${c2Y} ${endX},${endY}`}
                  stroke="url(#mintLine)"
                  strokeWidth="2.5"
                  fill="none"
                  opacity="0.9"
                  strokeDasharray="1000"
                  strokeDashoffset="1000"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="1000"
                    to="0"
                    dur="1.5s"
                    begin={`${0.3 + idx * 0.2}s`}
                    fill="freeze"
                  />
                </path>
                <g transform={`translate(${x}, ${y})`} filter="url(#cardGlow)" opacity="0">
                  <animate
                    attributeName="opacity"
                    from="0"
                    to="1"
                    dur="0.8s"
                    begin={`${0.5 + idx * 0.2}s`}
                    fill="freeze"
                  />
                  <rect
                    width={cardWidth}
                    height={cardHeight}
                    rx="16"
                    fill="#0e2b2f"
                    stroke="#17484d"
                    strokeWidth="2"
                  />
                  <text
                    x={20}
                    y={cardHeight / 2 + 6}
                    fill="#d7fff6"
                    fontSize="22"
                    fontWeight="700"
                  >
                    {label}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}