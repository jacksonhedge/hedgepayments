# Browser-agent prompt — find the best tools to build a looping "rolling die" animation

Paste into the Claude Chrome extension / browser agent. It researches the best way to BUILD
and SHIP a small blue 3D die that recurringly rolls and shows different faces, for the Chance brand.

---

You are helping me choose the best tools to build a small, looping animation of a **blue 3D die that recurringly rolls and lands on different faces** — the brand mark for a product called "Chance." Research current (2025–2026) options and give me a concrete, ranked recommendation, not just a list.

**Where it has to run (these constrain the choice):**
1. A **vanilla-JS web component** with **Shadow DOM**, embedded on third-party sites, **no build step and ideally zero/▪tiny dependencies** (it loads on every checkout — must stay light).
2. A **Chrome extension** popup + injected content (subject to extension **CSP** — no remote scripts; assets must be bundled).
3. A **Next.js / React** page.
It must render at small sizes (a ~20–60px badge) AND as a larger hero (~120px+).

**Hard requirements:** transparent background, **seamless loop**, small file (<~200KB ideally), crisp on retina, respects `prefers-reduced-motion` (fall back to a static die).

**Cover two questions:**

**A) Render/playback approach** — compare and rank for MY constraints:
- Pure **CSS 3D** cube (six faces, `transform-style: preserve-3d`, keyframe roll) — no asset, no dep. How good can it look? Limits?
- **Lottie** (lottie-web / dotLottie player) — file size, the player's weight, Shadow-DOM + extension-CSP compatibility.
- **Sprite sheet** of pre-rendered die frames animated via CSS `steps()` — pros/cons, how to keep it small.
- **APNG / animated WebP / transparent WebM (VP9 alpha)** — quality, size, looping, transparency support, autoplay-in-extension caveats.
- **three.js / WebGL** and **Spline** embeds — are these overkill / too heavy here? When justified?
Give a clear winner for the web-component case specifically, and note if the answer differs for the hero vs the tiny badge.

**B) Authoring tools** — what should I use to actually CREATE the rolling-die asset?
- 3D: **Blender** (free), **Spline**, **Womp** — for rendering a die roll to frames/video.
- Motion/vector: **Rive** (great for looping interactive vector + small runtime), **Jitter**, **After Effects + Bodymovin/Lottie**, **Figma + plugins**.
- For a sprite sheet: how to render Blender frames → a packed sprite sheet (tools/scripts).
Recommend the fastest path for a non-expert to get a clean, seamless, transparent blue-die loop, and which tool pairs best with the render approach you picked in (A).

**Deliver:** a ranked top recommendation (tool to author + format to ship) for the web-component/extension case, a one-line note if the hero version should differ, rough file-size expectations, and links to the key tools/docs. Flag any extension-CSP or Shadow-DOM gotchas for the format you recommend.
