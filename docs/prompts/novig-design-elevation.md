# Browser-agent prompt — make the Novig proposal page look bespoke, not AI-generated

Paste into the Claude Chrome extension / browser agent **with the page open and focused**
(`http://localhost:3000/novig-streetcorner-proposal/`, or production once deployed).

The goal: the page currently reads as clean but **generic — "default AI-generated / templated"** (evenly-spaced rounded cards on a flat white background, predictable single-column rhythm, safe type). It needs to feel like a **bespoke, art-directed sales proposal** with a real point of view — gritty, bold, street-sports editorial energy that matches the Street Corner Sports street-sign logo and the ♠♥♦♣ card motif — while staying premium and legible. Push it away from the template.

---

You are a senior brand/art director reviewing the web page open in this tab. It is a sales proposal — **Street Corner Sports × Novig**, a street-team launch pitch. Right now it looks competent but **templated and AI-generated**: flat white background, a stack of near-identical rounded grey cards, uniform spacing, and conventional type hierarchy. Your job is to make it look like a human designer with a strong point of view made it.

Do not just rubber-stamp it. Be opinionated. Scroll the entire page top to bottom first, then deliver concrete, implementable art direction.

**1. Diagnose the "AI/template" tells.** List the specific things making it read as generic — e.g. every section is the same rounded-card-on-white pattern, identical 16px gaps, no rhythm changes, no texture, no imagery, centered safe layouts, decorative elements (the ♠♥♦♣ suits, the street-sign logo) used timidly. Be specific with locations.

**2. Establish a point of view.** Propose a single clear art direction that fits *street-team / sports / prediction-market* energy and the Street Corner street-sign identity — bold, confident, a little gritty, editorial (think a premium sports brand deck or a Wieden-style pitch), NOT fintech-default. State the concept in 2–3 sentences so every other suggestion ladders up to it.

**3. Give concrete, codeable changes** (this is the important part — provide specifics a developer can implement directly):
   - **Type:** a more expressive scale and pairing. Where to go bigger/heavier (the deck already loads the condensed **Anton** display face and **Space Mono** — exploit them harder), tighter leading, oversized section numbers or kickers, etc. Suggest exact sizes/weights/letter-spacing.
   - **Layout & rhythm:** break the monotony — asymmetry, full-bleed sections, alternating backgrounds, a sticky/oversized section index, varied card sizes, an editorial grid. Suggest which sections should break the pattern and how.
   - **Surface & texture:** alternatives to flat-white-with-grey-cards — e.g. a subtle paper/grid/halftone texture, an accent section in inverted (dark) color for contrast, hairline rules, ticket-stub / street-sign framing devices. Keep it tasteful, high-contrast, and fast.
   - **Brand motifs:** make the ♠♥♦♣ suit marks and the street-sign logo *do work* — as section dividers, list bullets, watermark, or a recurring device — instead of sitting decoratively in the hero only.
   - **Color:** the palette is white / black / gold (#b5730a) / pink (#d11e68) / green (#138a5a). Tell me where to use the accents with more intent (and where the current usage is timid or muddy).
   - **The three pricing boxes, the timeline cards, the package spec tables, and the callouts** specifically — how to make each feel designed rather than defaulted.

   For each change, give the **exact CSS / structural suggestion** (selectors, property values, before→after) so it can be applied without guesswork. These are CSS-module classes (e.g. `.hero`, `.section`, `.h2`, `.card`, `.priceBox`, `.pkg`, `.callout`).

**4. Prioritize.** Give a ranked list: the top 5 highest-leverage changes that would most move it from "AI template" to "art-directed," in order, with a one-line reason each.

**5. Guardrails.** Keep it legible, fast (no heavy images/animation that hurt load), responsive (it must still collapse cleanly on mobile), and on-brand. Flag anything you'd change that risks those.

Finish with a short paragraph describing how the page *should feel* to a Novig exec opening it — and how far the current version is from that.
