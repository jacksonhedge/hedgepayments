# Claude-in-Chrome — Visual QA prompt for the Novig proposal page

Paste the prompt below into the Claude Chrome extension **with the `/novig` page open and focused** (local dev: `http://localhost:3000/novig/`, or production once deployed). It drives a structured visual review of the page against the source deck and brand expectations.

---

You are doing a meticulous visual QA pass on the web page currently open in this tab. It is a single-page sales proposal — **Street Corner Sports × Novig**, "powered by Hedge Payments." It is a faithful web recreation of a 10-section PDF pitch deck, and it must read as a polished, premium, on-brand proposal a founder would send to a real client (Novig). Do not change anything — only observe, scroll the full page top to bottom, and report.

Work through these dimensions in order and give me findings per dimension, each with a **severity** (blocker / major / minor / nit), the **exact location** (which section + what element), what you **see**, what you **expected**, and a **concrete suggested fix**. Take screenshots of anything you flag.

**1. Brand & logos**
- The hero shows the white **Street Corner Sports** street-sign logo. Confirm it renders fully (no clipping, no broken image, correct aspect ratio, crisp not blurry/stretched) and sits well against the dark background.
- The hero lockup reads **"SPORTS × NOVIG"** where NOVIG is the actual Novig wordmark rendered in white. Confirm the Novig wordmark is genuinely white (not a black box, not a gray/washed artifact, no visible rectangle/edges from blend modes), is vertically centered with the "SPORTS ×" text, and is sized harmoniously next to it.
- The **Hedge Payments** "Powered by" logo appears in the hero and again in the footer. Confirm both render correctly and are legible.
- Check every logo at the current zoom AND after zooming the browser to 150% and 67% — flag any that degrade, pixelate, or misalign.

**2. Layout, spacing & alignment**
- Scroll the entire page. For each of the ~10 sections (Opportunity / The Model / The Markets / The Packages / CPA Upside / Curated Video / The Frame / Next Steps), check: consistent left alignment of headings and body, consistent section padding, no awkward orphaned lines, no overlapping elements, no content touching the viewport edges.
- The card grids (4-up timeline, 3-up model, 2-up CPA, 4-up video, 3-up frame) should be evenly sized with consistent gaps. Flag any card noticeably taller/shorter or misaligned.
- The package "spec tables" (key/value rows with dashed dividers) should align in two clean columns with consistent dividers. Flag any mis-wrapping values or broken dividers.

**3. Typography & hierarchy**
- Headlines should be a heavy condensed display face (Anton) in cream/white; eyebrow labels in pink uppercase monospace; prices and small kickers in gold; body in a clean sans; spec-table keys in muted monospace.
- Confirm the hierarchy is obvious at a glance and nothing falls back to a default/system font (which would look wrong). Flag any font that looks like a fallback, any text that's too small to read comfortably, or any line-length that's uncomfortably wide.

**4. Color, contrast & readability**
- Background is near-black with a subtle green glow in the hero. Confirm all text meets comfortable contrast — especially the muted gray monospace labels and the green "CPA billed separately" pills. Flag anything hard to read.
- Confirm the accent colors are used consistently: pink for eyebrows/callout left-borders, gold for prices/kickers, green for the CPA pills. Flag any color that looks off-brand or inconsistent.

**5. The callout blocks**
- Each section ends with a highlighted callout (pink left border, faint green-tinted panel: "The thesis," "The content angle writes itself," "What you're really buying," "The tailwind," "Don't discount this one," "One honest note"). Confirm they're visually distinct from body text and consistent with each other.

**6. Responsive behavior**
- Resize the browser narrow (simulate mobile, ~390px wide). Confirm: the hero logos scale down without clipping, the multi-column card grids collapse to a single column, the package spec tables stack to one column, the price block stays readable, and nothing overflows horizontally (no sideways scrollbar). Flag any horizontal overflow or broken stacking.
- Return to desktop width and confirm it still looks right.

**7. Interactive bits**
- The CTA email (`jackson@hedgepayments.com`) should be a gold mailto link that underlines on hover. Confirm it works visually.
- Confirm there are no obvious broken links, missing images, or console-visible layout warnings.

**8. Content fidelity (spot-check, don't rewrite)**
- Spot-check that key numbers survived: packages **$8–15K / $35–50K / $100K+**, CPA **$40–50 / $20–25**, projections **~420 / ~980 / ~1,950**, and the July **15/16–17/18/19** timeline. Flag any that look wrong, duplicated, or garbled.
- Flag any typos, doubled words, or broken special characters (e.g. mojibake in place of —, ×, ♠♥♦♣, or curly quotes).

**Finally:** give me a prioritized punch list — blockers first — of the top issues to fix before this goes to the client, plus one short paragraph on your overall impression of whether it reads as a premium, send-ready proposal.
