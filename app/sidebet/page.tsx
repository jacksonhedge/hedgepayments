'use client'

import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import s from './page.module.css'

type Step = 'consent' | 'choose' | 'on'

const THRESHOLDS = [100, 500, 1000]
const money = (c: number) => `$${(c / 100).toFixed(2)}`

function LinkMock() {
  const [step, setStep] = useState<Step>('consent')
  const [threshold, setThreshold] = useState(500)
  const [boost, setBoost] = useState(1)
  const [rule, setRule] = useState<'CENTS' | 'DOLLAR'>('CENTS')
  const save = Math.min((rule === 'CENTS' ? 37 : 63) * boost, 100)

  return (
    <div className={s.mockWrap}>
      <div className={s.mockTabs} role="tablist" aria-label="Link steps">
        {(['consent', 'choose', 'on'] as Step[]).map((k, i) => (
          <button key={k} role="tab" aria-selected={step === k} className={step === k ? s.mockTabOn : s.mockTab} onClick={() => setStep(k)}>
            {i + 1}. {k === 'consent' ? 'Consent' : k === 'choose' ? 'Choose' : 'On'}
          </button>
        ))}
      </div>

      <div className={s.modal} role="dialog" aria-label="SideBet Link preview">
        {step === 'consent' && (
          <>
            <div className={s.lock}><i>AC</i><s /><i>SB</i></div>
            <h3 className={s.mTitle}>Acme Sportsbook rounds up your bets into savings</h3>
            <p className={s.mSub}>Link your bank once. The cents on every wager go into your wallet.</p>
            <div className={s.mRow}><i>◎</i><div><b>Nothing moves per purchase</b><span>Round-ups just add up.</span></div></div>
            <div className={s.mRow}><i>↗</i><div><b>One transfer at your threshold</b><span>One ACH debit when you reach it.</span></div></div>
            <div className={s.mRow}><i>✕</i><div><b>Cancel anytime</b><span>Turn it off in Acme.</span></div></div>
            <button className={s.mBtn} onClick={() => setStep('choose')}>Agree and continue</button>
            <button className={s.mLink} type="button">Not now</button>
            <p className={s.mLegal}>By continuing you authorize Acme Sportsbook (via Hedge, Inc.) to debit your linked bank for accrued round-ups, never more than {money(threshold)} per transfer unless you change it, until you cancel.</p>
          </>
        )}
        {step === 'choose' && (
          <>
            <h3 className={s.mTitle}>Choose your round-up</h3>
            <p className={s.mSub}>You can change this anytime.</p>
            <div className={s.mLabel}>Transfer when I reach</div>
            <div className={s.chips}>{THRESHOLDS.map((t) => <button key={t} className={t === threshold ? s.chipOn : s.chip} onClick={() => setThreshold(t)}>{money(t)}</button>)}</div>
            <div className={s.mLabel}>Round-up rule</div>
            <div className={s.seg}>
              <button className={rule === 'CENTS' ? s.segOn : ''} onClick={() => setRule('CENTS')}>Save the cents</button>
              <button className={rule === 'DOLLAR' ? s.segOn : ''} onClick={() => setRule('DOLLAR')}>Up to the next dollar</button>
            </div>
            <div className={s.mLabel}>Boost</div>
            <div className={s.chips}>{[1, 2, 3].map((b) => <button key={b} className={b === boost ? s.chipOn : s.chip} onClick={() => setBoost(b)}>{b}×</button>)}</div>
            <div className={s.example}>Bet <b>$4.37</b> → save <b>{money(save)}</b> · transfers at <b>{money(threshold)}</b></div>
            <button className={s.mBtn} onClick={() => setStep('on')}>Continue</button>
            <button className={s.mLink} type="button" onClick={() => { setThreshold(500); setBoost(1); setRule('CENTS'); setStep('on') }}>Use recommended</button>
          </>
        )}
        {step === 'on' && (
          <>
            <div className={s.ok}>✓</div>
            <h3 className={s.mTitle}>Round-ups are on</h3>
            <p className={s.mSub}>Stripe Test Bank ••6789 is linked to Acme Sportsbook.</p>
            <div className={s.kv}><span>Accrued so far</span><b>$2.72 / {money(threshold)}</b></div>
            <div className={s.bar}><div style={{ width: `${Math.min(100, Math.round((272 / threshold) * 100))}%` }} /></div>
            <div className={s.kv}><span>Rule</span><b>{rule === 'CENTS' ? 'Save the cents' : 'Next dollar'}{boost > 1 ? ` · ${boost}×` : ''}</b></div>
            <button className={s.mBtn} onClick={() => setStep('consent')}>Done</button>
            <button className={s.mLink} type="button" onClick={() => setStep('choose')}>Manage round-ups</button>
          </>
        )}
        <div className={s.mFoot}>Round-ups by SideBet</div>
      </div>
    </div>
  )
}

export default function SideBet() {
  return (
    <main className={s.page}>
      <Navbar />

      {/* Hero */}
      <section className={s.hero}>
        <div className={s.heroCopy}>
          <p className={s.eyebrow}>SideBet · Round-ups by Hedge</p>
          <h1 className={s.h1}>Plaid Link, for round-ups.</h1>
          <p className={s.lede}>
            One script tag turns any app into a savings engine. Your users link a bank once; the cents on every
            purchase accrue, and one ACH debit moves the money when it&rsquo;s worth moving. You set the rules.
          </p>
          <div className={s.ctas}>
            <a className={s.btnPrimary} href="/contact">Talk to us</a>
            <a className={s.btnGhost} href="https://sidebet-admin-jackson-fitzgeralds-projects.vercel.app/sdk-demo.html" target="_blank" rel="noopener noreferrer">Try the live demo ↗</a>
          </div>
          <ul className={s.proof}>
            <li><b>0</b><span>per-purchase debits — accrue first, transfer once</span></li>
            <li><b>$5</b><span>default transfer threshold; brands pick $1–$20</span></li>
            <li><b>30 min</b><span>link tokens; your API key never touches a browser</span></li>
          </ul>
        </div>
        <LinkMock />
      </section>

      {/* How the money moves */}
      <section className={s.section}>
        <p className={s.eyebrow}>How the money moves</p>
        <h2 className={s.h2}>Track every cent. Debit only when it counts.</h2>
        <div className={s.flow}>
          <div className={s.flowCard}>
            <span className={s.flowN}>1</span>
            <h3>Accrue</h3>
            <p>Each purchase posts a round-up — <code>$5.99 → $0.99</code> — to the user&rsquo;s running total. No bank needed yet; enrollment can come later.</p>
          </div>
          <div className={s.flowArrow} aria-hidden>→</div>
          <div className={s.flowCard}>
            <span className={s.flowN}>2</span>
            <h3>One debit</h3>
            <p>When the total crosses the threshold (or every Friday, if you prefer) the accrued round-ups become a single ACH debit. One PaymentIntent, one fee.</p>
          </div>
          <div className={s.flowArrow} aria-hidden>→</div>
          <div className={s.flowCard}>
            <span className={s.flowN}>3</span>
            <h3>Wallet</h3>
            <p>Settled funds land in a double-entry wallet — the user&rsquo;s, yours, or a split — with a settlement hold, transfer caps, and returns reversed automatically.</p>
          </div>
        </div>
      </section>

      {/* Brand controls */}
      <section className={s.sectionAlt}>
        <div className={s.split}>
          <div>
            <p className={s.eyebrow}>Brand presets</p>
            <h2 className={s.h2}>You decide the money rules. Users choose within them.</h2>
            <p className={s.body}>
              From the admin you publish a preset: which transfer thresholds to offer, the round-up rule, boosts,
              hard caps per purchase, day and week, where settled money goes, and the copy and logo in the modal.
              Every choice a user makes is validated against it — server-side, every time.
            </p>
            <ul className={s.checks}>
              <li>Threshold options &amp; default, or a weekly schedule</li>
              <li>Save-the-cents vs. next-dollar, 1×–5× boosts</li>
              <li>Per-purchase, daily and weekly caps</li>
              <li>Destination: user wallet, your wallet, or a split</li>
              <li>Logo, accent color, headline — previewed live before publishing</li>
            </ul>
          </div>
          <div className={s.presetCard}>
            <div className={s.presetHead}><span>Link preset</span><em>Published v6</em></div>
            <div className={s.presetRow}><span>Transfer at</span><div className={s.presetChips}><i>$1.00</i><i className={s.presetChipOn}>$5.00 ★</i><i>$10.00</i></div></div>
            <div className={s.presetRow}><span>Rule</span><b>Save the cents · boosts 1× 2× 3×</b></div>
            <div className={s.presetRow}><span>Caps</span><b>$1.00 / $20 / $50</b></div>
            <div className={s.presetRow}><span>Goes to</span><b>User&rsquo;s wallet</b></div>
            <div className={s.presetRow}><span>Users can change</span><b>threshold, rule</b></div>
            <div className={s.presetRow}><span>Accent</span><b><i className={s.swatch} /> #0A6E5C · AA ✓ 6.2:1</b></div>
          </div>
        </div>
      </section>

      {/* Integration */}
      <section className={s.section}>
        <p className={s.eyebrow}>Integration</p>
        <h2 className={s.h2}>An afternoon, not a quarter.</h2>
        <div className={s.codeGrid}>
          <div>
            <h3 className={s.codeTitle}>Your server: mint a link token</h3>
            <pre className={s.code}>{`POST /api/roundup/link-token
Authorization: Bearer <MERCHANT_KEY>

{ "consumerId": "user_123",
  "consumerEmail": "ada@example.com" }

→ { "linkToken": "slt_…", "expiresAt": "…" }`}</pre>
          </div>
          <div>
            <h3 className={s.codeTitle}>Your page: open Link</h3>
            <pre className={s.code}>{`<script src="https://api.sidebet…/sdk/sidebet.js"></script>

SideBet.create({
  linkToken,
  onSuccess: ({ bank, rules, accrual }) => …,
}).open();

// later: SideBet.settings({ linkToken }).open()`}</pre>
          </div>
          <div>
            <h3 className={s.codeTitle}>Each purchase: record it</h3>
            <pre className={s.code}>{`POST /api/roundup/initiate
{ "consumerId": "user_123",
  "transactionCents": 437 }

→ { "roundUpCents": 37,
    "accrual": { "accruedCents": 274,
                 "thresholdCents": 500 } }`}</pre>
          </div>
        </div>
        <p className={s.fine}>Webhooks for <code>roundup.settled</code>, <code>roundup.returned</code>, <code>roundup.settings_changed</code>. Idempotent ledger, signed PSP webhooks, per-wallet locks — stress-tested at 300 concurrent requests with zero drift.</p>
      </section>

      {/* Rails */}
      <section className={s.sectionAlt}>
        <p className={s.eyebrow}>Rails</p>
        <h2 className={s.h2}>Our rail by default. Yours if you have one.</h2>
        <div className={s.rails}>
          <div className={s.rail}><b>Stripe</b><span>Platform default. ACH Direct Debit with Financial Connections instant bank linking.</span></div>
          <div className={s.rail}><b>CoinFlow</b><span>Bring your own. ACH with USDC or fiat settlement — gaming-friendly.</span></div>
          <div className={s.rail}><b>Aeropay</b><span>Bring your own. Pay-by-bank built for iGaming, Aerosync linking.</span></div>
        </div>
      </section>

      {/* CTA */}
      <section className={s.cta}>
        <h2 className={s.h2}>See it with your logo on it.</h2>
        <p className={s.body}>We&rsquo;ll set up a preset for your brand and walk through the flow in 20 minutes.</p>
        <div className={s.ctas}>
          <a className={s.btnPrimary} href="/contact">Book a walkthrough</a>
          <a className={s.btnGhost} href="/developers">Read the docs</a>
        </div>
      </section>

      <Footer />
    </main>
  )
}
