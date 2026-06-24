'use client'
import GlassPanel from '../glass/GlassPanel'
import CountUp from './CountUp'
import styles from './sections.module.css'

const SNIPPET = `<script src="https://hedgepayments.com/embed/chance.js"></script>

<chance-checkout amount="50" mode="flip-to-free"></chance-checkout>`

export default function BusinessesSection() {
  return (
    <section id="businesses" className={styles.section} aria-labelledby="biz-h">
      <div className={styles.inner}>
        <p className={styles.kicker} style={{ color: 'var(--cyan)' }}>For Businesses</p>
        <h2 id="biz-h" className={styles.h2}>A payments layer that lifts conversion and AOV.</h2>
        <p className={styles.lead}>
          SideBet, Chance, and full payment rails — Debit, ACH and more — white-labeled via Coinflow,
          powered by Hedge. One drop-in turns checkout into a reason to come back.
        </p>

        {/* Dev-first: add Chance in ~5 lines */}
        <div className={styles.devRow}>
          <div className={styles.devCopy}>
            <h3 className={styles.cardTitle}>Add Chance in ~5 lines</h3>
            <p className={styles.cardText}>
              Drop one script tag and a custom element. No redirects, no rebuild.
            </p>
            <a className={styles.devLink} href="/docs">Read the docs →</a>
          </div>
          <GlassPanel className={styles.code} reactive contentClassName={styles.codeBody}>
            <pre className={styles.pre} aria-label="Chance embed snippet"><code>{SNIPPET}</code></pre>
          </GlassPanel>
        </div>

        {/* Illustrative metrics */}
        <div className={styles.metrics}>
          <div className={styles.metric}><span className={styles.metricBig}><CountUp to={18} suffix="%" /></span><span className={styles.statLabel}>conversion lift</span></div>
          <div className={styles.metric}><span className={styles.metricBig}><CountUp to={23} suffix="%" /></span><span className={styles.statLabel}>higher AOV</span></div>
          <div className={styles.metric}><span className={styles.metricBig}><CountUp to={2.4} suffix="x" decimals={1} /></span><span className={styles.statLabel}>repeat-purchase rate</span></div>
        </div>
        <p className={styles.fineprint}>Illustrative figures for demonstration.</p>

        {/* Trust + money model */}
        <div className={styles.cards}>
          <GlassPanel className={styles.card} reactive contentClassName={styles.cardBody}>
            <h3 className={styles.cardTitle}>Built for trust</h3>
            <p className={styles.cardText}>KYC, custody, and responsible-play controls — Hedge routes to real markets, never the house.</p>
          </GlassPanel>
          <GlassPanel className={styles.card} reactive contentClassName={styles.cardBody}>
            <h3 className={styles.cardTitle}>The win-it-back loop</h3>
            <p className={styles.cardText}>A free-order chance on every cart is a reason to return — a defensible retention engine.</p>
          </GlassPanel>
          <GlassPanel className={styles.card} reactive contentClassName={styles.cardBody}>
            <h3 className={styles.cardTitle}>Aligned economics</h3>
            <p className={styles.cardText}>Interchange + a transparent take rate + the widget as SaaS. We grow when you grow.</p>
          </GlassPanel>
        </div>

        <p className={styles.poweredBy}>Powered by Hedge · white-labeled via Coinflow</p>
      </div>
    </section>
  )
}
