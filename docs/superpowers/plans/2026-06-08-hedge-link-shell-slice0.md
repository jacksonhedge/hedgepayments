# Hedge Link — Shell (Slice 0) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the product-agnostic, iframe-based Hedge Link shell — a `link.js` loader + a Preact iframe app + an origin-checked postMessage bridge + a trivial `hello` flow — so a host page can `Hedge.create({token,...}).open()` and get an isolated modal that emits Plaid-style events.

**Architecture:** New `packages/link/` workspace. The **loader** (`src/loader.ts`) runs in the host page, pre-warms a sandboxed iframe, and bridges postMessage → host callbacks. The **iframe app** (`src/app/*`, Preact) renders a shared shell + a pluggable flow and posts lifecycle events out. A shared **protocol** (`src/protocol.ts`) types the messages + metadata envelope. Token is **stubbed** (no real exchange — that's Slice 1).

**Tech Stack:** TypeScript, Vite (builds both the `link.js` bundle and the iframe app), Preact (iframe UI), Vitest + jsdom (tests).

**Spec:** `docs/superpowers/specs/2026-06-08-hedge-link-shell-design.md`

**Deploy note:** `packages/link/` is buildable + testable locally now. Hosting at `js.hedgepayments.com` (a dedicated Vercel project) is a later deploy gate; the app base URL is overridable via `window.__HEDGE_LINK_APP_BASE` for local/test.

---

## File Structure

```
packages/link/
├── package.json            workspace pkg: build (vite) + test (vitest); deps preact; dev vite/vitest/jsdom/typescript
├── tsconfig.json
├── vite.config.ts          two build outputs: link.js (loader, IIFE) + the iframe app (index.html)
├── index.html              iframe app entry (loads src/app/main.tsx)
├── src/
│   ├── protocol.ts         message types, Meta envelope, makeMeta(), isInbound()
│   ├── protocol.test.ts
│   ├── loader.ts           createLink(config) -> handler; window.Hedge; iframe+overlay+bridge
│   ├── loader.test.ts
│   ├── app/
│   │   ├── appBridge.ts    iframe side: receive INIT/OPEN/REQUEST_EXIT, send READY/EVENT/SUCCESS/EXIT
│   │   ├── appBridge.test.ts
│   │   ├── flows/hello.ts  the trivial flow: mountFlow(root, ctx)
│   │   ├── flows/hello.test.ts
│   │   ├── shell.tsx        themed shell wrapper (Preact)
│   │   └── main.tsx         bootstrap: wait for INIT, mount shell + flow, wire emit
│   └── README.md
```

---

## Task 0: Scaffold the `packages/link/` workspace

**Files:**
- Create: `packages/link/package.json`
- Create: `packages/link/tsconfig.json`
- Create: `packages/link/vitest.config.ts`

- [ ] **Step 1: Create `packages/link/package.json`**
```json
{
  "name": "@hedge/link",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "vite build",
    "test": "vitest run"
  },
  "dependencies": {
    "preact": "^10.22.0"
  },
  "devDependencies": {
    "vite": "^5.3.0",
    "vitest": "^1.6.0",
    "jsdom": "^24.0.0",
    "typescript": "^5.4.0"
  }
}
```

- [ ] **Step 2: Create `packages/link/tsconfig.json`**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "jsxImportSource": "preact",
    "strict": true,
    "skipLibCheck": true,
    "noEmit": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create `packages/link/vitest.config.ts`**
```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: { environment: 'jsdom', globals: true },
  esbuild: { jsx: 'automatic', jsxImportSource: 'preact' },
})
```

- [ ] **Step 4: Install + verify vitest runs**

Run: `cd packages/link && npm install && npx vitest run`
Expected: vitest runs and reports "No test files found" (exit 0 or a "no tests" notice — that's fine; the toolchain works).

- [ ] **Step 5: Commit**
```bash
cd ~/Projects/HedgePayments/website && git add packages/link/package.json packages/link/tsconfig.json packages/link/vitest.config.ts packages/link/package-lock.json && git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" commit -m "chore(link): scaffold @hedge/link workspace (vite + vitest)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```
(Omit package-lock.json from `git add` if it doesn't exist.)

---

## Task 1: Protocol — message types + metadata envelope

**Files:**
- Create: `packages/link/src/protocol.ts`
- Test: `packages/link/src/protocol.test.ts`

- [ ] **Step 1: Write the failing test** — `packages/link/src/protocol.test.ts`
```ts
import { describe, it, expect } from 'vitest'
import { makeMeta, isInbound } from './protocol'

describe('makeMeta', () => {
  it('stamps session_id, request_id, ISO timestamp, and merges extra', () => {
    const m = makeMeta('sess_1', { view: 'hello' })
    expect(m.session_id).toBe('sess_1')
    expect(m.request_id).toMatch(/^req_/)
    expect(() => new Date(m.timestamp).toISOString()).not.toThrow()
    expect(m.view).toBe('hello')
  })
})

describe('isInbound', () => {
  it('accepts a tagged hedge message and rejects anything else', () => {
    expect(isInbound({ hedge: true, type: 'READY' })).toBe(true)
    expect(isInbound({ type: 'READY' })).toBe(false)
    expect(isInbound(null)).toBe(false)
    expect(isInbound('READY')).toBe(false)
  })
})
```

- [ ] **Step 2: Run to verify it FAILS**

Run: `cd packages/link && npx vitest run protocol`
Expected: FAIL ("Cannot find module './protocol'").

- [ ] **Step 3: Implement** — `packages/link/src/protocol.ts`
```ts
export type Env = 'sandbox' | 'production'

export interface Theme { accent?: string; logoUrl?: string; radius?: number }

export interface HedgeError {
  error_type: string
  error_code: string
  error_message: string
  display_message?: string | null
}

export interface Meta {
  session_id: string
  request_id: string
  timestamp: string
  [k: string]: unknown
}

// loader -> iframe
export type OutboundMessage =
  | { hedge: true; type: 'INIT'; token: string; env: Env; theme?: Theme; receivedRedirectUri?: string }
  | { hedge: true; type: 'OPEN' }
  | { hedge: true; type: 'REQUEST_EXIT'; force: boolean }

// iframe -> loader
export type InboundMessage =
  | { hedge: true; type: 'READY' }
  | { hedge: true; type: 'RESIZE'; height: number }
  | { hedge: true; type: 'EVENT'; name: string; meta: Meta }
  | { hedge: true; type: 'SUCCESS'; result: unknown; meta: Meta }
  | { hedge: true; type: 'EXIT'; error: HedgeError | null; meta: Meta }

function rand(): string { return Math.random().toString(36).slice(2, 12) }

export function makeMeta(sessionId: string, extra: Record<string, unknown> = {}): Meta {
  return { session_id: sessionId, request_id: 'req_' + rand(), timestamp: new Date().toISOString(), ...extra }
}

export function isInbound(d: unknown): d is InboundMessage {
  return !!d && typeof d === 'object' && (d as any).hedge === true && typeof (d as any).type === 'string'
}
```

- [ ] **Step 4: Run to verify it PASSES**

Run: `cd packages/link && npx vitest run protocol`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**
```bash
cd ~/Projects/HedgePayments/website && git add packages/link/src/protocol.ts packages/link/src/protocol.test.ts && git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" commit -m "feat(link): protocol types + metadata envelope + tests

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 2: The loader — `Hedge.create` + iframe/overlay + bridge

**Files:**
- Create: `packages/link/src/loader.ts`
- Test: `packages/link/src/loader.test.ts`

- [ ] **Step 1: Write the failing test** — `packages/link/src/loader.test.ts`
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createLink } from './loader'

const APP = 'http://localhost:5174'
const APP_ORIGIN = 'http://localhost:5174'

function fromIframe(handlerIframe: HTMLIFrameElement, data: any) {
  // simulate the iframe posting a message to the host
  window.dispatchEvent(new MessageEvent('message', { data, origin: APP_ORIGIN, source: handlerIframe.contentWindow as Window }))
}
function theIframe() { return document.querySelector('iframe[data-hedge-link="iframe"]') as HTMLIFrameElement }
function overlay() { return document.querySelector('[data-hedge-link="overlay"]') as HTMLElement }

beforeEach(() => {
  document.body.innerHTML = ''
  ;(window as any).__HEDGE_LINK_APP_BASE = APP
})

describe('createLink', () => {
  it('pre-warms a sandboxed iframe inside a hidden overlay', () => {
    createLink({ token: 't' })
    const f = theIframe()
    expect(f).toBeTruthy()
    expect(f.getAttribute('sandbox')).toContain('allow-scripts')
    expect(overlay().style.display).toBe('none')
  })

  it('queues open() until READY, then reveals + sends INIT and OPEN', () => {
    const post = vi.spyOn(HTMLIFrameElement.prototype as any, 'contentWindow', 'get')
    const sent: any[] = []
    const h = createLink({ token: 'tok', env: 'sandbox', onLoad: vi.fn() })
    const f = theIframe()
    // intercept what the loader posts to the iframe
    ;(f.contentWindow as any).postMessage = (m: any) => sent.push(m)
    h.open()                          // before READY -> queued, overlay still hidden
    expect(overlay().style.display).toBe('none')
    fromIframe(f, { hedge: true, type: 'READY' })   // READY -> flush queued open
    expect(sent.some((m) => m.type === 'INIT' && m.token === 'tok' && m.env === 'sandbox')).toBe(true)
    expect(sent.some((m) => m.type === 'OPEN')).toBe(true)
    expect(overlay().style.display).toBe('block')
    post.mockRestore()
  })

  it('relays SUCCESS to onSuccess and hides the overlay', () => {
    const onSuccess = vi.fn()
    const h = createLink({ token: 't', onSuccess })
    const f = theIframe()
    ;(f.contentWindow as any).postMessage = () => {}
    fromIframe(f, { hedge: true, type: 'READY' })
    h.open()
    fromIframe(f, { hedge: true, type: 'SUCCESS', result: { ok: true }, meta: { session_id: 's', request_id: 'r', timestamp: 't' } })
    expect(onSuccess).toHaveBeenCalledWith({ ok: true }, expect.objectContaining({ session_id: 's' }))
    expect(overlay().style.display).toBe('none')
  })

  it('ignores messages from an unknown origin', () => {
    const onEvent = vi.fn()
    const h = createLink({ token: 't', onEvent })
    const f = theIframe()
    ;(f.contentWindow as any).postMessage = () => {}
    window.dispatchEvent(new MessageEvent('message', { data: { hedge: true, type: 'EVENT', name: 'OPEN', meta: {} }, origin: 'https://evil.example', source: f.contentWindow as Window }))
    expect(onEvent).not.toHaveBeenCalled()
  })

  it('destroy() removes the overlay/iframe and stops relaying', () => {
    const onEvent = vi.fn()
    const h = createLink({ token: 't', onEvent })
    const f = theIframe()
    h.destroy()
    expect(overlay()).toBeNull()
    fromIframe(f, { hedge: true, type: 'EVENT', name: 'OPEN', meta: {} })
    expect(onEvent).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 2: Run to verify it FAILS**

Run: `cd packages/link && npx vitest run loader`
Expected: FAIL ("Cannot find module './loader'").

- [ ] **Step 3: Implement** — `packages/link/src/loader.ts`
```ts
import { InboundMessage, OutboundMessage, Env, Theme, HedgeError, Meta, isInbound } from './protocol'

const DEFAULT_APP_BASE = 'https://js.hedgepayments.com/link/app'
function appBase(): string {
  return (typeof window !== 'undefined' && (window as any).__HEDGE_LINK_APP_BASE) || DEFAULT_APP_BASE
}
function appOrigin(): string { try { return new URL(appBase()).origin } catch { return '*' } }

export interface CreateConfig {
  token: string
  env?: Env
  theme?: Theme
  receivedRedirectUri?: string
  onSuccess?: (result: unknown, meta: Meta) => void
  onExit?: (error: HedgeError | null, meta: Meta) => void
  onEvent?: (name: string, meta: Meta) => void
  onLoad?: () => void
}

export interface LinkHandler {
  open(): void
  exit(opts?: { force?: boolean }): void
  destroy(): void
  readonly ready: boolean
  readonly error: Error | null
}

export function createLink(config: CreateConfig): LinkHandler {
  let ready = false
  let error: Error | null = null
  let openQueued = false
  let destroyed = false

  const overlay = document.createElement('div')
  overlay.setAttribute('data-hedge-link', 'overlay')
  overlay.style.cssText = 'position:fixed;inset:0;z-index:2147483600;display:none;background:rgba(8,6,20,.55);'

  const iframe = document.createElement('iframe')
  iframe.setAttribute('data-hedge-link', 'iframe')
  iframe.setAttribute('sandbox', 'allow-scripts allow-forms allow-popups allow-same-origin')
  iframe.setAttribute('allow', 'payment')
  iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;'
  iframe.src = appBase() + '/index.html'
  overlay.appendChild(iframe)
  document.body.appendChild(overlay)

  function post(msg: OutboundMessage) {
    const w = iframe.contentWindow
    if (w) w.postMessage(msg, appOrigin())
  }
  function reveal() { overlay.style.display = 'block' }
  function hide() { overlay.style.display = 'none' }
  function doOpen() { reveal(); post({ hedge: true, type: 'OPEN' }) }

  function onMessage(e: MessageEvent) {
    if (appOrigin() !== '*' && e.origin !== appOrigin()) return
    if (e.source !== iframe.contentWindow) return
    if (!isInbound(e.data)) return
    const m = e.data as InboundMessage
    if (m.type === 'READY') {
      ready = true
      post({ hedge: true, type: 'INIT', token: config.token, env: config.env || 'production', theme: config.theme, receivedRedirectUri: config.receivedRedirectUri })
      config.onLoad && config.onLoad()
      if (openQueued) { openQueued = false; doOpen() }
    } else if (m.type === 'EVENT') {
      config.onEvent && config.onEvent(m.name, m.meta)
    } else if (m.type === 'SUCCESS') {
      config.onSuccess && config.onSuccess(m.result, m.meta); hide()
    } else if (m.type === 'EXIT') {
      config.onExit && config.onExit(m.error, m.meta); hide()
    }
    // RESIZE: full-screen overlay ignores for Slice 0
  }
  window.addEventListener('message', onMessage)

  return {
    open() { if (destroyed) return; if (!ready) { openQueued = true; return } doOpen() },
    exit(opts) { post({ hedge: true, type: 'REQUEST_EXIT', force: !!(opts && opts.force) }); if (opts && opts.force) hide() },
    destroy() { destroyed = true; window.removeEventListener('message', onMessage); overlay.remove() },
    get ready() { return ready },
    get error() { return error },
  }
}

if (typeof window !== 'undefined') {
  ;(window as any).Hedge = (window as any).Hedge || { create: createLink }
}
```

- [ ] **Step 4: Run to verify it PASSES**

Run: `cd packages/link && npx vitest run loader`
Expected: PASS (5 tests).

- [ ] **Step 5: Commit**
```bash
cd ~/Projects/HedgePayments/website && git add packages/link/src/loader.ts packages/link/src/loader.test.ts && git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" commit -m "feat(link): loader (Hedge.create, pre-warm iframe, queued open, origin-checked bridge) + tests

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 3: iframe-side bridge + the `hello` flow

**Files:**
- Create: `packages/link/src/app/appBridge.ts`
- Create: `packages/link/src/app/flows/hello.ts`
- Test: `packages/link/src/app/appBridge.test.ts`
- Test: `packages/link/src/app/flows/hello.test.ts`

- [ ] **Step 1: Write the failing tests**

`packages/link/src/app/appBridge.test.ts`:
```ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createAppBridge } from './appBridge'

const HOST_ORIGIN = 'http://localhost:3000'

beforeEach(() => { (window as any).__HEDGE_LINK_HOST_ORIGIN = HOST_ORIGIN })

describe('createAppBridge', () => {
  it('calls onInit when an INIT arrives from the host origin and posts READY on start', () => {
    const posted: any[] = []
    ;(window as any).parent = { postMessage: (m: any) => posted.push(m) }
    const onInit = vi.fn()
    const bridge = createAppBridge({ onInit })
    bridge.start()
    expect(posted.some((m) => m.type === 'READY')).toBe(true)
    window.dispatchEvent(new MessageEvent('message', { data: { hedge: true, type: 'INIT', token: 'tok', env: 'sandbox' }, origin: HOST_ORIGIN }))
    expect(onInit).toHaveBeenCalledWith(expect.objectContaining({ token: 'tok' }))
  })

  it('emit() posts an EVENT with a metadata envelope', () => {
    const posted: any[] = []
    ;(window as any).parent = { postMessage: (m: any) => posted.push(m) }
    const bridge = createAppBridge({ onInit: vi.fn() })
    bridge.emit('OPEN', { view: 'hello' })
    const ev = posted.find((m) => m.type === 'EVENT')
    expect(ev.name).toBe('OPEN')
    expect(ev.meta.session_id).toBeTruthy()
    expect(ev.meta.timestamp).toBeTruthy()
    expect(ev.meta.view).toBe('hello')
  })

  it('success() posts SUCCESS with result + meta', () => {
    const posted: any[] = []
    ;(window as any).parent = { postMessage: (m: any) => posted.push(m) }
    const bridge = createAppBridge({ onInit: vi.fn() })
    bridge.success({ ok: true })
    const s = posted.find((m) => m.type === 'SUCCESS')
    expect(s.result).toEqual({ ok: true })
    expect(s.meta.session_id).toBeTruthy()
  })
})
```

`packages/link/src/app/flows/hello.test.ts`:
```ts
import { describe, it, expect, vi } from 'vitest'
import { mountHello } from './hello'

describe('mountHello', () => {
  it('renders a confirm button that emits SUCCESS', () => {
    const root = document.createElement('div')
    const ctx = { token: 't', config: {}, emit: vi.fn(), success: vi.fn(), exit: vi.fn() }
    mountHello(root, ctx as any)
    const btn = root.querySelector('button[data-act="confirm"]') as HTMLButtonElement
    expect(btn).toBeTruthy()
    btn.click()
    expect(ctx.success).toHaveBeenCalledWith(expect.objectContaining({ flow: 'hello' }))
  })
})
```

- [ ] **Step 2: Run to verify they FAIL**

Run: `cd packages/link && npx vitest run app`
Expected: FAIL ("Cannot find module './appBridge'" / './hello').

- [ ] **Step 3: Implement**

`packages/link/src/app/appBridge.ts`:
```ts
import { InboundMessage, OutboundMessage, makeMeta } from '../protocol'

function hostOrigin(): string {
  return (typeof window !== 'undefined' && (window as any).__HEDGE_LINK_HOST_ORIGIN) || '*'
}

export interface InitPayload { token: string; env: string; theme?: any; receivedRedirectUri?: string }
export interface AppBridge {
  start(): void
  emit(name: string, extra?: Record<string, unknown>): void
  success(result: unknown): void
  exit(error?: any): void
  readonly sessionId: string
}

export function createAppBridge(opts: { onInit: (init: InitPayload) => void }): AppBridge {
  const sessionId = 'sess_' + Math.random().toString(36).slice(2, 12)
  function send(msg: InboundMessage) {
    const parent = window.parent
    if (parent) parent.postMessage(msg, hostOrigin())
  }
  function onMessage(e: MessageEvent) {
    if (hostOrigin() !== '*' && e.origin !== hostOrigin()) return
    const d = e.data
    if (!d || d.hedge !== true) return
    const m = d as OutboundMessage
    if (m.type === 'INIT') opts.onInit({ token: m.token, env: m.env, theme: m.theme, receivedRedirectUri: m.receivedRedirectUri })
  }
  return {
    start() { window.addEventListener('message', onMessage); send({ hedge: true, type: 'READY' }) },
    emit(name, extra) { send({ hedge: true, type: 'EVENT', name, meta: makeMeta(sessionId, extra) }) },
    success(result) { send({ hedge: true, type: 'SUCCESS', result, meta: makeMeta(sessionId) }) },
    exit(error) { send({ hedge: true, type: 'EXIT', error: error || null, meta: makeMeta(sessionId) }) },
    get sessionId() { return sessionId },
  }
}
```

`packages/link/src/app/flows/hello.ts`:
```ts
export interface FlowCtx {
  token: string
  config: Record<string, unknown>
  emit: (name: string, extra?: Record<string, unknown>) => void
  success: (result: unknown) => void
  exit: (error?: any) => void
}

// Each product flow implements mountFlow(root, ctx). Slice 0 ships this stub.
export function mountHello(root: HTMLElement, ctx: FlowCtx): void {
  ctx.emit('TRANSITION_VIEW', { view: 'hello' })
  root.innerHTML =
    '<div style="padding:28px;text-align:center;font-family:system-ui">' +
    '<h2 style="margin:0 0 8px">Hedge Link</h2>' +
    '<p style="color:#667;margin:0 0 20px">Slice 0 shell — confirm to finish.</p>' +
    '<button data-act="confirm" style="padding:12px 20px;border:0;border-radius:10px;background:#0e9f6e;color:#fff;font-weight:700;cursor:pointer">Confirm →</button>' +
    '</div>'
  const btn = root.querySelector('button[data-act="confirm"]') as HTMLButtonElement
  btn.addEventListener('click', () => ctx.success({ flow: 'hello', confirmed: true }))
}
```

- [ ] **Step 4: Run to verify they PASS**

Run: `cd packages/link && npx vitest run app`
Expected: PASS (4 tests).

- [ ] **Step 5: Commit**
```bash
cd ~/Projects/HedgePayments/website && git add packages/link/src/app/appBridge.ts packages/link/src/app/appBridge.test.ts packages/link/src/app/flows/hello.ts packages/link/src/app/flows/hello.test.ts && git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" commit -m "feat(link): iframe app bridge + hello flow + tests

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 4: iframe app bootstrap (shell + main) + Vite build (link.js + app)

**Files:**
- Create: `packages/link/src/app/shell.tsx`
- Create: `packages/link/src/app/main.tsx`
- Create: `packages/link/index.html`
- Create: `packages/link/vite.config.ts`

- [ ] **Step 1: Create the shell** — `packages/link/src/app/shell.tsx`
```tsx
export function applyTheme(theme?: { accent?: string }) {
  if (theme?.accent) document.documentElement.style.setProperty('--hedge-accent', theme.accent)
}
```
(Slice 0 keeps the shell minimal — a theme hook. The flow renders its own body. Richer shell chrome is a later slice.)

- [ ] **Step 2: Create the app bootstrap** — `packages/link/src/app/main.tsx`
```tsx
import { createAppBridge } from './appBridge'
import { applyTheme } from './shell'
import { mountHello } from './flows/hello'

const root = document.getElementById('hedge-root') as HTMLElement

const bridge = createAppBridge({
  onInit: (init) => {
    applyTheme((init as any).theme)
    bridge.emit('OPEN')
    mountHello(root, {
      token: init.token,
      config: {},
      emit: (n, x) => bridge.emit(n, x),
      success: (r) => bridge.success(r),
      exit: (e) => bridge.exit(e),
    })
  },
})
bridge.start()
```

- [ ] **Step 3: Create the iframe HTML** — `packages/link/index.html`
```html
<!doctype html>
<html>
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>html,body{margin:0;height:100%;background:#fff;display:grid;place-items:center}</style>
  </head>
  <body><div id="hedge-root"></div><script type="module" src="/src/app/main.tsx"></script></body>
</html>
```

- [ ] **Step 4: Create the Vite build** — `packages/link/vite.config.ts`
```ts
import { defineConfig } from 'vite'

// Two outputs: the host-side loader (IIFE, single file) and the iframe app (index.html).
export default defineConfig(({ mode }) => {
  if (mode === 'loader') {
    return {
      build: {
        outDir: 'dist/loader',
        lib: { entry: 'src/loader.ts', name: 'Hedge', formats: ['iife'], fileName: () => 'link.js' },
      },
      esbuild: { jsx: 'automatic', jsxImportSource: 'preact' },
    }
  }
  return {
    build: { outDir: 'dist/app' },
    esbuild: { jsx: 'automatic', jsxImportSource: 'preact' },
  }
})
```
Update `packages/link/package.json` scripts:
```json
    "build": "vite build --mode loader && vite build",
```

- [ ] **Step 5: Build to verify both outputs**

Run: `cd packages/link && npm run build`
Expected: `dist/loader/link.js` exists (the loader IIFE) and `dist/app/index.html` + assets exist. Confirm: `test -f dist/loader/link.js && test -f dist/app/index.html && echo OK`.

- [ ] **Step 6: Run the full test suite**

Run: `cd packages/link && npx vitest run`
Expected: all suites pass (protocol + loader + app).

- [ ] **Step 7: Commit**
```bash
cd ~/Projects/HedgePayments/website && git add packages/link/src/app/shell.tsx packages/link/src/app/main.tsx packages/link/index.html packages/link/vite.config.ts packages/link/package.json && git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" commit -m "feat(link): iframe app bootstrap (shell+main) + vite build (link.js + app)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Task 5: Cross-origin integration check + README

**Files:**
- Create: `packages/link/README.md`
- Create: `packages/link/examples/host.html`

- [ ] **Step 1: Create an example host page** — `packages/link/examples/host.html`
```html
<!doctype html>
<html><body style="font-family:system-ui;padding:40px">
  <h1>Hedge Link — example host</h1>
  <button id="pay">Pay with Hedge</button>
  <pre id="log"></pre>
  <script>window.__HEDGE_LINK_APP_BASE = 'http://localhost:5174'</script>
  <script src="http://localhost:5173/dist/loader/link.js"></script>
  <script>
    const log = (s) => (document.getElementById('log').textContent += s + '\n')
    const link = Hedge.create({
      token: 'stub_token',
      env: 'sandbox',
      onLoad:  () => log('onLoad'),
      onEvent: (n, m) => log('event ' + n + ' @ ' + m.timestamp),
      onSuccess: (r, m) => log('SUCCESS ' + JSON.stringify(r)),
      onExit:  (e, m) => log('EXIT ' + (e ? e.error_code : 'clean')),
    })
    document.getElementById('pay').onclick = () => link.open()
  </script>
</body></html>
```

- [ ] **Step 2: Document the manual cross-origin check + write the README** — `packages/link/README.md`
```md
# @hedge/link — the Hedge Link drop-in shell (Slice 0)

Iframe-based, Plaid-Link-style drop-in. Loader (`src/loader.ts`) runs in the host page and bridges
postMessage to a sandboxed iframe app (`src/app/*`). Token is stubbed in Slice 0.

## Build & test
- `npm test`  — Vitest (protocol + loader + app)
- `npm run build` — emits `dist/loader/link.js` + `dist/app/`

## Local cross-origin demo (true isolation: two origins)
1. Serve the app on :5174 — `npx vite preview --outDir dist/app --port 5174` (after `npm run build`)
2. Serve the loader+example on :5173 — `npx vite --port 5173` (or `python3 -m http.server 5173`)
3. Open `http://localhost:5173/examples/host.html`, click "Pay with Hedge".
   Expect: modal opens, "Confirm" -> the host log shows `event OPEN`, `SUCCESS {...}`, modal closes.
   Isolation: the host page cannot read into the iframe (different origin) — that's the point.

## Embed contract (what a merchant writes)
```html
<script src="https://js.hedgepayments.com/link/stable/link.js"></script>
<script>
  const link = Hedge.create({ token, onSuccess, onExit, onEvent, onLoad })
  btn.onclick = () => link.open()
</script>
```

## Deploy (later)
Host `dist/loader/link.js` at `js.hedgepayments.com/link/stable/link.js` (stable channel, no SRI —
see spec) and `dist/app` at `js.hedgepayments.com/link/app`.
```

- [ ] **Step 3: Run the manual check once** (per README) and confirm the host log shows `OPEN` → `SUCCESS` and the modal closes. (Cross-origin true-isolation is environment-dependent; the jsdom suite covers the loader/app logic, this confirms the real two-origin handshake.)

- [ ] **Step 4: Commit**
```bash
cd ~/Projects/HedgePayments/website && git add packages/link/README.md packages/link/examples/host.html && git -c user.name="Jackson Fitzgerald" -c user.email="jacksonfitzgerald25@gmail.com" commit -m "docs(link): example host page + README (local cross-origin demo)

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

---

## Self-Review notes (addressed)

- **Spec coverage:** loader + `Hedge.create → {open,exit,destroy,ready,error}` ✓ (Task 2); pre-init + queued open ✓ (Task 2 test); origin-checked postMessage bridge ✓ (Tasks 2/3); metadata envelope `{session_id,request_id,timestamp}` ✓ (Tasks 1/3); event taxonomy (OPEN/TRANSITION_VIEW/SUCCESS/EXIT) ✓ (Task 3 hello + bridge); flow contract `mountFlow(root, ctx)` ✓ (Task 3); iframe app + shell + theming hook ✓ (Task 4); stable-channel loader build (`link.js`) ✓ (Task 4); cross-origin isolation check ✓ (Task 5). Two-tier errors: `onExit(error)` path wired in the loader/bridge (Task 2/3); the recoverable `onEvent('ERROR')` path is exercised when a product flow emits it (no product flow in Slice 0 — the plumbing exists).
- **Out of scope (unchanged):** real token verification (Slice 1), product flows (2–4), framework adapters + CSP docs + playground (5), `js.hedgepayments.com` deploy.
- **Type consistency:** `OutboundMessage`/`InboundMessage`/`Meta`/`makeMeta`/`isInbound`/`createLink`/`createAppBridge`/`mountHello`/`FlowCtx` names match across Tasks 1–4.
- **Placeholder scan:** none — every step has real code/commands.
