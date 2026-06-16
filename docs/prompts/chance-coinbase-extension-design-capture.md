# Chrome prompt — Capture the Coinbase Wallet extension design language

**Purpose:** Ground the Chance checkout drop-in redesign in the *real* Coinbase Wallet
browser-extension aesthetic. We want an accurate, reusable design-token reference —
not a vibe. Paste the prompt below into Claude in Chrome.

**Context for whoever runs this:** The output feeds the Chance drop-in redesign
(`packages/link/src/app/flows/chance/Chance.tsx`). Drop the agent's summary back into the
brainstorm so we can build the new look against it.

---

## Prompt to paste into Claude in Chrome

```
You are capturing the visual design language of the Coinbase Wallet browser extension
so I can mirror it in a different product's checkout UI. I need an accurate, structured
reference — colors as hex, real spacing, real component shapes — not a general impression.

Do this:

1. Open the Coinbase Wallet extension UI. Try these in order until you have real screens
   to look at:
   a. If the Coinbase Wallet extension is installed, open its popup (the wallet home /
      balance screen, an asset/token list, a single-asset detail screen, and a
      send/receive or swap screen if reachable without moving funds — do NOT sign in with
      real credentials, move funds, or approve anything; just observe the UI).
   b. Otherwise, go to the Chrome Web Store listing for "Coinbase Wallet" and open the
      listing's screenshot gallery (these show the real extension screens).
   c. Also check coinbase.com/wallet and Coinbase's brand/marketing pages for the wallet
      product for additional screens and the brand palette.

2. Take screenshots of each distinct screen you find (home/balance, token list, asset
   detail, and any action screen). Note which source each came from.

3. From what you actually see (sample real pixels where you can), extract and report:
   - **Color palette** — exact hex values for: primary background, secondary/card
     background, the Coinbase blue accent (and any accent variants), primary text,
     secondary/muted text, borders/dividers, positive (green) and negative (red) value
     colors. Note whether the default is light or dark, and capture both if both exist.
   - **Typography** — font family/families, the weight + approximate size of: the big
     balance number, screen titles, list-row primary text, list-row secondary text,
     button labels, and small/caption text.
   - **Layout & structure** — how the home screen is organized (is the balance "up top"
     and large? where do actions sit? how are token rows laid out?). Describe the
     vertical rhythm.
   - **Components** — card/surface style (corner radius, border vs shadow, padding),
     button styles (primary/secondary, radius, height, fill vs outline), list-row anatomy
     (icon, primary/secondary text, right-aligned value), chips/pills/badges, iconography
     style (filled vs line, rounded), and any signature motifs.
   - **Spacing** — approximate base unit and the padding/margins used on screen edges,
     between cards, and within rows.

4. Output a single structured summary I can hand to a developer, in this shape:
   - "Palette" table (token name → hex → where it's used)
   - "Type scale" table (role → family/size/weight)
   - "Components" bullets (card, button, list-row, chip, icon)
   - "Layout notes" (balance-up-top rhythm, etc.)
   - "Screenshots" (list what you captured and the source)
   - "Caveats" (anything you couldn't verify directly / inferred)

Keep it factual and specific. If you can't reach the live extension, say so and base the
report on the Web Store screenshots + brand pages, and flag which values are inferred
rather than sampled.
```

---

## After it runs
Paste the agent's structured summary (palette + type scale + components + layout) back
into the brainstorm. We'll use it to build the Chance drop-in's new Coinbase-style look,
and to decide light-vs-dark default for the redesign.
