# Coinbase Wallet extension — design reference (for the Chance drop-in redesign)

> Captured via Claude-in-Chrome from archived Chrome Web Store screenshots (1280×800,
> Dec 2024) + Coinbase brand pages. Colors pixel-sampled; type sizes scaled estimates
> (±2px); font family inferred. Use as the source of truth for the Chance drop-in's new
> Coinbase-style look. **Default theme is dark; no light mode observed.**

## Palette
| Token | Hex | Use |
|---|---|---|
| `bg-primary` | `#0a0b0d` | every screen background (flat — no elevated cards) |
| `surface-elevated` | `#0e0f12`–`#1a1a1c` | barely-there row elevation (rows float on same bg) |
| `border-divider` | `~#1a1a1c` | 1px row separators (near-invisible, ~5–10% lighter than bg) |
| `brand-blue` | `#0052ff` | Coinbase logo/wordmark, marketing text, external links |
| `accent-blue` (UI) | `#3773f5` | **interactive** — button fill, active-tab underline, action icons |
| `accent-blue-dark` | `#2c59bb` | pressed/depth edge on blue buttons |
| `nav-active-blue` | `#2775c9` | active bottom-nav icon (slightly desaturated) |
| `text-primary` | `#ffffff` | balance, row primary text, active tab |
| `text-secondary` | `#8a919e` | sub-labels, quantities, right-aligned secondary value |
| `text-muted` | `#848586` | domain label, inactive nav icons |
| `text-inactive-tab` | `#a3a3a4` | inactive tab labels |
| `pos-green` | `#05B169` | P&L positive (brand value, not sampled — verify) |
| `neg-red` | `#F05C50` | P&L negative (brand value, not sampled — verify) |

**Two blues are distinct — don't conflate:** `#0052ff` = brand/marketing; `#3773f5` = wallet UI interactive.

## Type scale (family: Coinbase Sans / Inter fallback — inferred)
| Role | ~px | Weight | Color |
|---|---|---|---|
| Balance / hero number | 28–32 | 700 | `#fff` |
| Screen / section title | 16 | 600 | `#fff` |
| Header domain label | 11–12 | 400 | `#848586` |
| Action button label | 11 | 500 | `#fff` |
| Tab — active | 13–14 | 600 | `#fff` |
| Tab — inactive | 13–14 | 400 | `#a3a3a4` |
| List row — primary | 14 | 500 | `#fff` |
| List row — secondary | 11 | 400 | `#8a919e` |
| List row — value | 14 | 500 | `#fff` |
| Bottom-nav label | 10 | 400 | `#848586` / `#2775c9` active |

## Components
- **Surfaces:** flat. Content sits directly on `#0a0b0d`. No box-shadow, no borders on cards. Row dividers are a ~1px `#1a1a1c` line (almost invisible). Popup outer frame ~12–16px radius.
- **Action buttons (Buy/Swap/Bridge/Send/Receive):** filled **circle** ~32–36px, fill `#3773f5`, white line-icon centered, ~11px white label below; row padded 16px from edges, ~8–10px gaps.
- **Primary CTA (inferred):** full-width **pill** (radius 9999), height ~44–48px, fill `#3773f5`, white ~15px semibold label.
- **Tabs:** equal-width text tabs; active = white text + 2px `#3773f5` underline flush to bottom; inactive = `#a3a3a4`, no background highlight. Row ~44px.
- **List row anatomy:** circular icon ~32px (left) · primary name `#fff` 14px + secondary `#8a919e` 11px (center) · right-aligned USD value `#fff` 14px + secondary amount `#8a919e` 11px. Row ~64–72px. 16px side padding.
- **Bottom nav:** 4 line-icon tabs on `#0a0b0d`; active `#2775c9`, inactive `#848586`, ~10px label. Bar ~52–56px.
- **Icons:** line/outline throughout (~22–24px nav, ~16px chevrons). Action icons sit in blue circles.

## Layout (home/balance, top→bottom)
1. Header ~43px: logo + muted domain label (left), overflow menu (right).
2. Balance ~43px: large white number up top, no secondary line.
3. Action row ~56px: 5 circular blue buttons + labels.
4. Tabs ~44px: underline-only active indicator.
5. List (scroll): flat rows ~64–72px, faint separators.
6. Bottom nav ~52px.

Spacing: 8px base unit, 16px screen-edge padding. Header→balance ~24px, balance→actions ~24px. Popup ~360×600. Dense, content starts high, **balance prominent in the upper quarter**.

## Caveats
Live extension popup not scriptable → all from static promo screenshots. Send/Swap/form screens not available (button/input styles inferred). Light mode: none found. P&L green/red are brand values, not sampled. Font name inferred. Type px ±2.
