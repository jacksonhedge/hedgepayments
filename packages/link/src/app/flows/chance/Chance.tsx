import { h } from 'preact'
import { useState, useEffect, useCallback } from 'preact/hooks'
import type { FlowCtx } from '../flowCtx'
import type { Candidate } from './engine'
import {
  resolveEligibility, matchMarkets, calc, bounds,
  buildSeedCandidates, fetchPolymarketCandidates,
  round2, clamp, fmtExpiry,
} from './engine'
import { ConsumeConflictError } from '../../linkClient'

type View = 'intro' | 'config' | 'markets' | 'resolving' | 'result'
type Mode = 'flip-to-free' | 'win-it-back'

interface ChanceConfig {
  amount:   number
  currency: string
  mode:     Mode
  theme:    'light' | 'dark'
  country?: string
  region?:  string
}

interface PlacedBet {
  market: Candidate
  risk:   number
  winAt:  number
  payToday: number
}

const CSS = `
.ch-wrap{--ink:#15161c;--ink2:#3a3d49;--muted:#8a90a0;--line:#eceef2;--line2:#e2e5ea;--bg:#fff;--soft:#f6f7f9;--accent:#0e9f6e;--accent-dk:#0b8159;--chip:#eef7f2;--blue:#2b6ef6;font-family:ui-sans-serif,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;box-sizing:border-box;color:var(--ink)}
.ch-wrap *{box-sizing:border-box}
.ch-wrap.dark{--ink:#f3f4f7;--ink2:#c7cad4;--muted:#7c8190;--line:#23252d;--line2:#2c2f38;--bg:#16171d;--soft:#1d1f27;--chip:#16291f}
.ch-body{padding:8px 20px 4px;max-height:70vh;overflow-y:auto}
.ch-foot{padding:14px 20px 18px;border-top:1px solid transparent}
.ch-title{font-size:20px;font-weight:800;letter-spacing:-.02em;margin:6px 0 5px;line-height:1.15}
.ch-sub{color:var(--muted);font-size:13px;line-height:1.45;margin:0 0 14px}
.ch-hero{display:grid;place-items:center;padding:8px 0 6px}
.ch-badge{width:60px;height:60px;border-radius:18px;display:grid;place-items:center;font-size:28px;color:#fff;background:radial-gradient(120% 120% at 30% 20%,#14b87f,#0b8159);box-shadow:0 10px 26px rgba(11,129,89,.35)}
.ch-steps{margin:14px 0 4px;display:flex;flex-direction:column;gap:12px}
.ch-step-row{display:flex;gap:13px;align-items:flex-start}
.ch-step-no{width:26px;height:26px;border-radius:9px;background:var(--chip);color:var(--accent);font-weight:800;font-size:13px;display:grid;place-items:center;flex:none}
.ch-step-tx b{font-size:13.5px;font-weight:700;display:block}
.ch-step-tx span{font-size:12.5px;color:var(--muted)}
.ch-example{margin:16px 0 2px;padding:12px 14px;border-radius:13px;background:var(--soft);border:1px dashed var(--line2);font-size:12.5px;color:var(--ink2);text-align:center;line-height:1.5}
.ch-cta{width:100%;padding:15px;border:none;border-radius:13px;background:var(--accent);color:#fff;font-size:15px;font-weight:800;cursor:pointer;transition:background .15s,opacity .15s;box-shadow:0 8px 20px rgba(14,159,110,.28)}
.ch-cta:hover{background:var(--accent-dk)} .ch-cta:active{transform:translateY(1px)} .ch-cta:disabled{opacity:.4;cursor:default;box-shadow:none}
.ch-ghost{width:100%;margin-top:9px;padding:11px;border:none;background:transparent;color:var(--muted);font-weight:600;font-size:13px;cursor:pointer;border-radius:10px}
.ch-ghost:hover{color:var(--ink);background:var(--soft)}
.ch-sl{margin:18px 0}
.ch-sl-top{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:9px}
.ch-sl-lbl{font-size:13px;font-weight:700;color:var(--ink2)}
.ch-sl-val{font-size:19px;font-weight:800;letter-spacing:-.01em}
.ch-sl-val small{font-size:12px;font-weight:600;color:var(--muted);margin-left:4px}
.ch-rng{-webkit-appearance:none;appearance:none;width:100%;height:7px;border-radius:7px;background:var(--line2);outline:none;cursor:pointer}
.ch-rng::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:var(--accent);border:3px solid var(--bg);box-shadow:0 2px 9px rgba(14,159,110,.55);cursor:pointer}
.ch-rng.win::-webkit-slider-thumb{background:var(--blue)}
.ch-readout{margin-top:20px;background:var(--soft);border:1px solid var(--line);border-radius:16px;padding:15px 16px}
.ch-ro-main{display:flex;align-items:center;justify-content:space-between}
.ch-chance{font-size:30px;font-weight:800;letter-spacing:-.02em;line-height:1}
.ch-chance small{font-size:13px;color:var(--muted);font-weight:600;margin-left:5px}
.ch-odds-chip{font-size:12px;font-weight:700;color:var(--accent);background:var(--chip);padding:5px 11px;border-radius:20px}
.ch-ro-line{display:flex;justify-content:space-between;font-size:13px;color:var(--ink2);margin-top:11px;padding-top:11px;border-top:1px solid var(--line2)}
.ch-ro-line b{font-weight:800;color:var(--ink)}
.ch-ro-hint{font-size:12px;color:var(--muted);text-align:center;margin-top:11px}
.ch-rows{display:flex;flex-direction:column;gap:8px;padding-bottom:8px}
.ch-row{display:flex;align-items:center;gap:13px;width:100%;text-align:left;cursor:pointer;background:var(--bg);border:1px solid var(--line);border-radius:15px;padding:12px 13px;color:var(--ink);transition:border-color .15s,box-shadow .15s}
.ch-row:hover{border-color:var(--line2);background:var(--soft)}
.ch-row.on{border-color:var(--accent);background:var(--chip);box-shadow:0 0 0 2px var(--accent)}
.ch-row-mid{flex:1;min-width:0}
.ch-row-q{font-size:14px;font-weight:700;letter-spacing:-.01em;line-height:1.25}
.ch-row-sub{font-size:11.5px;color:var(--muted);margin-top:3px}
.ch-row-right{display:flex;align-items:center;gap:8px;flex:none}
.ch-row-val b{font-size:13.5px;font-weight:800;display:block;color:var(--accent)}
.ch-row-val small{font-size:10px;color:var(--muted)}
.ch-vdot{width:36px;height:36px;border-radius:11px;display:grid;place-items:center;font-size:16px;font-weight:900;color:#fff;background:radial-gradient(120% 120% at 30% 20%,#14b87f,#0b8159);flex:none}
.ch-place-bar{background:var(--soft);border:1px solid var(--line);border-radius:14px;padding:11px 14px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center}
.ch-place-bar .l{font-size:12px;color:var(--muted)} .ch-place-bar .l b{color:var(--ink);font-size:14px;display:block}
.ch-place-bar .r{text-align:right;font-size:12px;color:var(--muted)} .ch-place-bar .r b{color:var(--accent);font-size:15px;display:block}
.ch-err{color:#c0392b;font-size:12px;text-align:center;margin:8px 0 0;padding:8px;background:#fef2f2;border-radius:8px}
.ch-hs{display:flex;align-items:center;justify-content:center;gap:0;margin:24px 0 16px}
.ch-hs-node{width:62px;height:62px;border-radius:18px;display:grid;place-items:center;font-size:28px;color:#fff;background:radial-gradient(120% 120% at 30% 20%,#14b87f,#0b8159);box-shadow:0 8px 22px rgba(15,22,32,.12)}
.ch-hs-track{width:74px;height:3px;background:repeating-linear-gradient(90deg,var(--line2) 0 5px,transparent 5px 11px);position:relative;margin:0 -6px}
.ch-spin{width:42px;height:42px;border:3px solid var(--line2);border-top-color:var(--accent);border-radius:50%;margin:0 auto 14px;animation:chspin .8s linear infinite}
@keyframes chspin{to{transform:rotate(360deg)}}
.ch-result{text-align:center;padding:18px 4px 4px}
.ch-emoji{font-size:54px;line-height:1}
.ch-r-title{font-size:22px;font-weight:800;letter-spacing:-.02em;margin:12px 0 6px}
.ch-r-title.win{color:var(--accent)}
.ch-break{background:var(--soft);border:1px solid var(--line);border-radius:14px;padding:13px 16px;margin:18px auto 0;max-width:330px;text-align:left}
.ch-break-row{display:flex;justify-content:space-between;font-size:13.5px;padding:4px 0;color:var(--ink2)}
.ch-break-fin{font-weight:800;font-size:16px;color:var(--ink);border-top:1px solid var(--line2);padding-top:9px;margin-top:4px;display:flex;justify-content:space-between}
.ch-break-fin.win{color:var(--accent)}
.ch-note{text-align:center;color:var(--muted);font-size:11px;margin-top:12px;line-height:1.5}
.ch-state-box{text-align:center;padding:36px 16px;color:var(--muted)}
.ch-state-box .se{font-size:30px;margin-bottom:8px} .ch-state-box b{color:var(--ink);display:block;margin-bottom:4px;font-size:14.5px}
.ch-toolbar{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:4px 0 12px}
.ch-chips{display:flex;gap:7px}
.ch-chip{padding:6px 11px;border-radius:20px;border:1px solid var(--line2);background:var(--bg);color:var(--ink2);font-size:12px;font-weight:600;cursor:pointer;transition:all .15s}
.ch-chip.on{border-color:var(--accent);background:var(--chip);color:var(--accent)}
.ch-empty{text-align:center;color:var(--muted);padding:24px 8px;font-size:13px}
.ch-empty b{color:var(--ink);display:block;margin-bottom:3px}
`

function fmt(n: number): string { return Number(n).toLocaleString(undefined, { maximumFractionDigits: 2 }) }

export function Chance({ ctx }: { ctx: FlowCtx }) {
  const cfg: ChanceConfig = {
    amount:   Math.max(2, Number(ctx.config.amount) || 50),
    currency: String(ctx.config.currency || 'USD'),
    mode:     ctx.config.mode === 'win-it-back' ? 'win-it-back' : 'flip-to-free',
    theme:    ctx.config.theme === 'dark' ? 'dark' : 'light',
    country:  ctx.config.country as string | undefined,
    region:   ctx.config.region as string | undefined,
  }
  const flip = cfg.mode === 'flip-to-free'
  const elig = resolveEligibility(cfg.country, cfg.region)
  const b = bounds(cfg.amount)

  const [view, setView]           = useState<View>('intro')
  const [risk, setRisk]           = useState(Math.max(b.riskMin, Math.round(cfg.amount * 0.06)))
  const [win, setWin]             = useState(Math.round(cfg.amount * 0.5))
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loadingCands, setLoadingCands] = useState(false)
  const [picked, setPicked]       = useState<string | null>(null)
  const [consuming, setConsuming] = useState(false)
  const [consumeError, setConsumeError] = useState<string | null>(null)
  const [result, setResult]       = useState<{ won: boolean; placed: PlacedBet } | null>(null)

  useEffect(() => {
    if (document.getElementById('chance-link-css')) return
    const s = document.createElement('style')
    s.id = 'chance-link-css'
    s.textContent = CSS
    document.head.appendChild(s)
    return () => s.remove()
  }, [])

  const loadCandidates = useCallback(() => {
    if (!elig.eligible || loadingCands) return
    setLoadingCands(true)
    const now = Date.now()
    fetchPolymarketCandidates(now)
      .then(live => setCandidates(live && live.length >= 4 ? live : buildSeedCandidates(now)))
      .catch(() => setCandidates(buildSeedCandidates(now)))
      .finally(() => setLoadingCands(false))
  }, [elig.eligible, loadingCands])

  const goConfig = () => {
    ctx.emit('TRANSITION_VIEW', { view: 'config' })
    setView('config')
    if (candidates.length === 0) loadCandidates()
  }

  const goMarkets = () => {
    ctx.emit('TRANSITION_VIEW', { view: 'markets' })
    setPicked(null)
    setConsumeError(null)
    setView('markets')
  }

  const handlePlace = async () => {
    const market = candidates.find(c => c.marketId === picked)
    if (!market || consuming) return
    const winAt   = Math.min(cfg.amount, round2(risk / market.price))
    const payToday = flip ? round2(cfg.amount + risk) : cfg.amount
    const placedBet: PlacedBet = { market, risk, winAt, payToday }

    setConsuming(true)
    setConsumeError(null)
    try {
      await ctx.consume({ marketId: market.marketId, risk, winAt, mode: cfg.mode, venue: market.venue })
      ctx.emit('chance:PLACED', { marketId: market.marketId, question: market.question, venue: market.venue, risk, winAt, mode: cfg.mode })
      ctx.emit('TRANSITION_VIEW', { view: 'resolving' })
      setView('resolving')
      setTimeout(() => {
        const won = Math.random() < market.price // demo-only simulation
        setResult({ won, placed: placedBet })
        ctx.emit('chance:RESULT', {
          won,
          finalPrice: won ? Math.max(0, round2(payToday - winAt)) : payToday,
          amountBack: won ? winAt : 0,
        })
        ctx.emit('TRANSITION_VIEW', { view: 'result' })
        setView('result')
      }, 2100)
    } catch (e) {
      setConsuming(false)
      if (e instanceof ConsumeConflictError) {
        setConsumeError('This offer has already been placed.')
      } else {
        setConsumeError('Something went wrong — please try again or close.')
      }
    }
  }

  const handleDone = () => {
    if (!result) return
    const { won, placed } = result
    const winAt    = placed.winAt
    const payToday = placed.payToday
    ctx.success({
      won,
      mode: cfg.mode,
      market: { marketId: placed.market.marketId, question: placed.market.question, venue: placed.market.venue, price: placed.market.price },
      risk:       placed.risk,
      winAt,
      finalPrice: won ? Math.max(0, round2(payToday - winAt)) : payToday,
      amountBack: won ? winAt : 0,
    })
  }

  const wrapClass = `ch-wrap${cfg.theme === 'dark' ? ' dark' : ''}`

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (view === 'intro') {
    if (!elig.eligible) {
      return (
        <div class={wrapClass}>
          <div class="ch-body">
            <div class="ch-state-box">
              <div class="se">📍</div>
              <b>Chance is not available in your area yet</b>
              {elig.reason === 'state-restricted' ? 'Not offered in your state right now.' : 'Not offered in your region right now.'}
            </div>
          </div>
        </div>
      )
    }
    const exRisk = Math.max(1, Math.round(cfg.amount * 0.06))
    const exWin  = Math.round(cfg.amount * 0.5)
    return (
      <div class={wrapClass}>
        <div class="ch-body">
          <div class="ch-hero"><div class="ch-badge">✦</div></div>
          <div class="ch-title" style="text-align:center">Turn your order into a <span style="color:var(--accent)">win</span></div>
          <p class="ch-sub" style="text-align:center">
            Back a real market at checkout. If it hits, you {flip ? 'knock money off — up to a free order' : 'win money off your order'}. Either way, it ships.
          </p>
          <div class="ch-steps">
            <div class="ch-step-row"><span class="ch-step-no">1</span><span class="ch-step-tx"><b>{flip ? 'Set your risk & reward' : 'Pick your reward'}</b><span>{flip ? 'Choose how much to stake and the discount you want to win.' : 'Choose the discount you want a shot at — free to play.'}</span></span></div>
            <div class="ch-step-row"><span class="ch-step-no">2</span><span class="ch-step-tx"><b>We find a real market</b><span>A live Kalshi or Polymarket prop near your odds.</span></span></div>
            <div class="ch-step-row"><span class="ch-step-no">3</span><span class="ch-step-tx"><b>It hits? You save.</b><span>Your discount is applied. Miss, and your order still ships.</span></span></div>
          </div>
          <div class="ch-example">
            e.g. your <b>${fmt(cfg.amount)}</b> order → {flip ? <>risk <b>${fmt(exRisk)}</b></> : <b>free</b>} to win <b>${fmt(exWin)} ({Math.round(exWin / cfg.amount * 100)}% off)</b>
          </div>
        </div>
        <div class="ch-foot">
          <button class="ch-cta" onClick={goConfig}>Get started →</button>
          <button class="ch-ghost" onClick={() => ctx.exit()}>Maybe next time</button>
        </div>
      </div>
    )
  }

  // ── CONFIG ─────────────────────────────────────────────────────────────────
  if (view === 'config') {
    const safeRisk = clamp(risk, b.riskMin, b.riskMax)
    const safeWin  = clamp(win, b.winMin, b.winMax)
    const k = calc(cfg.amount, safeRisk, safeWin, cfg.mode)
    const matched = matchMarkets(candidates, safeRisk, safeWin)

    const onRiskChange = (v: number) => {
      const newRisk = clamp(v, b.riskMin, b.riskMax)
      setRisk(newRisk)
      if (safeWin <= newRisk) setWin(Math.min(b.winMax, newRisk + 1))
    }
    const onWinChange  = (v: number) => setWin(clamp(v, b.winMin, b.winMax))

    return (
      <div class={wrapClass}>
        <div class="ch-body">
          <div class="ch-title">Set your bet</div>
          <p class="ch-sub">Slide to choose your risk and the discount you want. We'll find real markets at those odds.</p>
          <div class="ch-sl">
            <div class="ch-sl-top">
              <span class="ch-sl-lbl">{flip ? 'How much to risk' : 'Your stake · on the house'}</span>
              <span class="ch-sl-val">${fmt(safeRisk)}</span>
            </div>
            <input class="ch-rng" type="range" min={b.riskMin} max={b.riskMax} step={1} value={safeRisk}
              onInput={(e) => onRiskChange(parseInt((e.target as HTMLInputElement).value, 10))} />
          </div>
          <div class="ch-sl">
            <div class="ch-sl-top">
              <span class="ch-sl-lbl">Discount you win</span>
              <span class="ch-sl-val">${fmt(safeWin)}<small>{k.discountPct}% off</small></span>
            </div>
            <input class="ch-rng win" type="range" min={b.winMin} max={b.winMax} step={1} value={safeWin}
              onInput={(e) => onWinChange(parseInt((e.target as HTMLInputElement).value, 10))} />
          </div>
          <div class="ch-readout">
            <div class="ch-ro-main">
              <div class="ch-chance">{k.chancePct}%<small>chance it hits</small></div>
              <span class="ch-odds-chip">{k.odds} odds</span>
            </div>
            <div class="ch-ro-line"><span>Pay today</span><b>${fmt(k.payToday)}</b></div>
            <div class="ch-ro-hint">
              {loadingCands
                ? 'Finding live markets…'
                : matched.length > 0
                  ? <><b>{matched.length}</b> live market{matched.length > 1 ? 's' : ''} near these odds</>
                  : 'No markets at these odds — try a bigger risk or smaller discount'}
            </div>
          </div>
        </div>
        <div class="ch-foot">
          <button class="ch-ghost" style="width:auto;padding:6px 12px;margin-bottom:8px" onClick={() => { ctx.emit('TRANSITION_VIEW', { view: 'intro' }); setView('intro') }}>‹</button>
          <button class="ch-cta" disabled={loadingCands || matched.length === 0} onClick={goMarkets}>
            {loadingCands ? 'Finding live markets…' : matched.length > 0 ? `Find ${matched.length} market${matched.length > 1 ? 's' : ''} →` : 'No markets at these odds'}
          </button>
        </div>
      </div>
    )
  }

  // ── MARKETS ────────────────────────────────────────────────────────────────
  if (view === 'markets') {
    const matched = matchMarkets(candidates, risk, win)
    const pickedMarket = matched.find(c => c.marketId === picked) ?? null
    const winAt   = pickedMarket ? Math.min(cfg.amount, round2(risk / pickedMarket.price)) : 0
    const payToday = flip ? round2(cfg.amount + risk) : cfg.amount

    return (
      <div class={wrapClass}>
        <div class="ch-body">
          <div class="ch-title">Markets near your odds</div>
          <p class="ch-sub">
            Risk <b>${fmt(risk)}</b> to win about <b>${fmt(win)}</b> · ~{Math.round(clamp(risk / win, 0.01, 0.97) * 100)}% chance. Pick one.
          </p>
          {matched.length === 0
            ? <div class="ch-empty"><b>No markets</b>Go back and adjust your risk or discount.</div>
            : <div class="ch-rows">
                {matched.map(m => (
                  <button key={m.marketId} class={`ch-row${picked === m.marketId ? ' on' : ''}`} onClick={() => { setPicked(m.marketId); setConsumeError(null) }}>
                    <div class="ch-vdot">P</div>
                    <div class="ch-row-mid">
                      <div class="ch-row-q">{m.question}{m.outcome !== 'Yes' ? ` — ${m.outcome}` : ''}</div>
                      <div class="ch-row-sub">Polymarket · {m.winProbPct}% chance · {fmtExpiry(m.resolves_at)}</div>
                    </div>
                    <div class="ch-row-right">
                      <div class="ch-row-val">
                        <b>win ${fmt(Math.min(cfg.amount, round2(risk / m.price)))}</b>
                        <small>{Math.round(Math.min(cfg.amount, round2(risk / m.price)) / cfg.amount * 100)}% off</small>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
          }
          {consumeError && <div class="ch-err">{consumeError}</div>}
        </div>
        <div class="ch-foot">
          <button class="ch-ghost" style="width:auto;padding:6px 12px;margin-bottom:8px" onClick={() => { ctx.emit('TRANSITION_VIEW', { view: 'config' }); setView('config') }}>‹</button>
          {pickedMarket && (
            <div class="ch-place-bar">
              <div class="l">Pay today<b>${fmt(payToday)}</b></div>
              <div class="r">if it hits<b>win ${fmt(winAt)} ({Math.round(winAt / cfg.amount * 100)}% off)</b></div>
            </div>
          )}
          <button class="ch-cta" disabled={!pickedMarket || consuming} onClick={handlePlace}>
            {consuming ? 'Placing…' : pickedMarket ? (flip ? `Risk $${fmt(risk)} & place` : 'Place — free to play') : 'Pick a market to place'}
          </button>
        </div>
      </div>
    )
  }

  // ── RESOLVING ──────────────────────────────────────────────────────────────
  if (view === 'resolving') {
    return (
      <div class={wrapClass}>
        <div class="ch-body" style="text-align:center;padding:24px 0 8px">
          <div class="ch-hs">
            <div class="ch-hs-node">✦</div>
            <div class="ch-hs-track" />
            <div class="ch-hs-node" style="background:#2b6ef6;font-size:14px;font-weight:900">P</div>
          </div>
          <div class="ch-r-title">Connecting to Polymarket…</div>
          <p class="ch-sub" style="text-align:center">Placing your position…</p>
        </div>
      </div>
    )
  }

  // ── RESULT ─────────────────────────────────────────────────────────────────
  if (view === 'result' && result) {
    const { won, placed } = result
    const winAt    = placed.winAt
    const payToday = placed.payToday
    const netPaid  = won ? Math.max(0, round2(payToday - winAt)) : payToday
    const offPct   = Math.round(winAt / cfg.amount * 100)
    return (
      <div class={wrapClass}>
        <div class="ch-body">
          <div class="ch-result">
            <div class="ch-emoji">{won ? '🎉' : '🪙'}</div>
            <div class={`ch-r-title${won ? ' win' : ''}`}>
              {won ? (winAt >= cfg.amount ? 'Your order\'s free!' : `You won $${fmt(winAt)} off!`) : 'So close!'}
            </div>
            <p class="ch-sub" style="text-align:center">
              "{placed.market.question}" resolved <b>{won ? 'Yes' : 'No'}</b> on Polymarket.
              {won ? ` ${offPct}% knocked off your order.` : ' Your order still ships.'}
            </p>
            <div class="ch-break">
              <div class="ch-break-row"><span>Order</span><span>${fmt(cfg.amount)}</span></div>
              {flip && <div class="ch-break-row"><span>Chance stake</span><span>+${fmt(placed.risk)}</span></div>}
              {won && <div class="ch-break-row"><span>Chance win-back</span><span style="color:var(--accent)">−${fmt(winAt)}</span></div>}
              <div class={`ch-break-fin${won ? ' win' : ''}`}><span>You paid</span><span>${fmt(netPaid)}</span></div>
            </div>
            <p class="ch-note">Powered by <b>Hedge Pay</b> · markets via Polymarket<br /><span style="font-size:9.5px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);background:var(--soft);border:1px dashed var(--line2);border-radius:20px;padding:3px 10px;display:inline-block;margin-top:6px">Demo settlement — real routing coming</span></p>
          </div>
        </div>
        <div class="ch-foot">
          <button class="ch-cta" onClick={handleDone}>Done</button>
        </div>
      </div>
    )
  }

  return null
}
