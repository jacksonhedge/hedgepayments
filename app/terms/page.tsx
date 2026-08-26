import type { Metadata } from 'next'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import styles from '../privacy/legal.module.css'

export const metadata: Metadata = {
  title: 'Terms of Service | Hedge Payments',
  description:
    'Terms governing use of Hedge, Inc. services, including the round-up tool, ACH debit authorization and digital wallets.',
}

const EFFECTIVE = 'August 26, 2026'

export default function TermsOfService() {
  return (
    <main>
      <Navbar />
      <article className={styles.wrap}>
        <p className={styles.eyebrow}>Legal</p>
        <h1 className={styles.title}>Terms of Service</h1>
        <p className={styles.meta}>
          Hedge, Inc. &middot; Effective {EFFECTIVE} &middot;{' '}
          <a href="/privacy">Privacy Policy</a>
        </p>

        <ul className={styles.toc}>
          <li><a href="#agreement">1. Agreement</a></li>
          <li><a href="#services">2. The Services</a></li>
          <li><a href="#eligibility">3. Eligibility and accounts</a></li>
          <li><a href="#roundups">4. Round-ups</a></li>
          <li><a href="#ach">5. Bank account authorization (ACH)</a></li>
          <li><a href="#wallet">6. Wallets and transfers</a></li>
          <li><a href="#returns">7. Returned and failed payments</a></li>
          <li><a href="#partners">8. Business partners</a></li>
          <li><a href="#conduct">9. Acceptable use</a></li>
          <li><a href="#disclaimers">10. Disclaimers and limitation of liability</a></li>
          <li><a href="#disputes">11. Disputes and governing law</a></li>
          <li><a href="#general">12. General</a></li>
          <li><a href="#contact">13. Contact</a></li>
        </ul>

        <h2 id="agreement">1. Agreement</h2>
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) are a binding agreement between you and Hedge, Inc.
          (&ldquo;Hedge&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;) governing your use of our websites, round-up
          tool, digital wallet and related services (the &ldquo;Services&rdquo;), whether accessed directly or as a
          feature embedded in a business partner&rsquo;s app or site. By enrolling in or using the Services you
          accept these Terms and our <a href="/privacy">Privacy Policy</a>. If you do not agree, do not use the
          Services.
        </p>

        <h2 id="services">2. The Services</h2>
        <p>
          Hedge provides payments technology that businesses embed in their own products. Our round-up tool lets
          you round eligible transactions up to the nearest whole dollar and move the difference from your linked
          bank account into a digital wallet. Hedge is a technology provider and payment facilitator; we are not a
          bank, and wallet balances are not deposits insured by the FDIC unless expressly stated otherwise.
        </p>

        <h2 id="eligibility">3. Eligibility and accounts</h2>
        <ul>
          <li>You must be at least 18 years old, a U.S. resident, and the owner or authorized user of any bank
            account you link.</li>
          <li>You are responsible for the accuracy of the information you provide and for keeping your partner
            account credentials secure.</li>
          <li>We may suspend or close your access to the Services if we suspect fraud, abuse, a violation of these
            Terms, or if required by law or by our payment partners.</li>
        </ul>

        <h2 id="roundups">4. Round-ups</h2>
        <ul>
          <li>Round-ups are optional. You enable them through a partner&rsquo;s app and can turn them off at any
            time; changes apply to future transactions only.</li>
          <li>The round-up amount is the difference between an eligible transaction amount and the next whole
            dollar (or another rule the partner offers, such as a fixed amount or multiplier, which will be
            disclosed to you before you enroll). Transactions that are already a whole-dollar amount produce no
            round-up.</li>
          <li>Each partner program has a per-transaction ceiling and a daily cap. Round-ups that would exceed a cap
            are reduced or skipped.</li>
          <li>Round-ups are debited from your linked bank account by ACH, typically in one debit per eligible
            transaction. Debits are not real-time; they generally settle within 1&ndash;4 business days.</li>
        </ul>

        <h2 id="ach">5. Bank account authorization (ACH)</h2>
        <div className={styles.callout}>
          <p>
            By linking a bank account and enabling round-ups, you authorize Hedge, Inc. to debit the bank account
            you specify, electronically via the ACH network, for the round-up amounts arising from your use of the
            Services under the rules described in Section 4, until you revoke this authorization. Round-up amounts
            vary by transaction and will not exceed the per-transaction ceiling and daily cap disclosed to you at
            enrollment.
          </p>
        </div>
        <ul>
          <li>You may revoke this authorization at any time by turning off round-ups in the partner app, disconnecting
            your bank account, or emailing{' '}
            <a href="mailto:support@hedgepayments.com">support@hedgepayments.com</a>. Revocation takes effect for
            debits initiated after we process your request; allow up to 3 business days.</li>
          <li>You confirm you are authorized to grant this permission for the account and that the information you
            provided is accurate. Bank accounts entered manually may need to be verified with micro-deposits before
            debits begin.</li>
          <li>If a debit is returned or rejected by your bank, see Section 7. Your bank may charge you fees for
            returned items; those are your responsibility.</li>
          <li>We will send confirmation of this authorization to the email on file, and you may request a copy at any
            time.</li>
        </ul>

        <h2 id="wallet">6. Wallets and transfers</h2>
        <ul>
          <li>Settled round-ups are credited to a wallet. Depending on the partner program, the credit goes to your
            wallet, to the partner, or is split between them; the program terms disclosed at enrollment control.</li>
          <li>Newly credited funds may be subject to a short hold before they can be transferred, to allow for
            returned payments.</li>
          <li>Transfers between wallets and withdrawals are available only where the partner program supports them
            and are subject to verification, limits and applicable law.</li>
          <li>Wallet balances do not earn interest unless expressly stated. Hedge may hold funds with a licensed
            payment partner or bank on your behalf.</li>
        </ul>

        <h2 id="returns">7. Returned and failed payments</h2>
        <ul>
          <li>If a round-up debit fails or is returned (for example, insufficient funds, closed account, or a
            disputed debit), the corresponding wallet credit is reversed. If the funds have already been transferred
            out of the wallet, the wallet may carry a negative balance until it is repaid, and we may offset it
            against future credits.</li>
          <li>Repeated returns may result in round-ups being paused and your bank account being blocked from further
            debits.</li>
          <li>ACH debits may be disputed with your bank for up to 60 days for consumer accounts. If you believe a
            debit was unauthorized, contact us first at{' '}
            <a href="mailto:support@hedgepayments.com">support@hedgepayments.com</a> so we can resolve it quickly.</li>
        </ul>

        <h2 id="partners">8. Business partners</h2>
        <p>
          The Services are made available through independent business partners. Each partner is responsible for
          its own products, the transactions that trigger round-ups, and its own terms and privacy practices. Hedge
          is not a party to your relationship with a partner, does not control what a partner sells, and is not
          responsible for a partner&rsquo;s acts or omissions. Businesses that integrate the Services are bound by a
          separate Hedge merchant agreement.
        </p>

        <h2 id="conduct">9. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>link a bank account you are not authorized to use, or provide false information;</li>
          <li>use the Services for any unlawful purpose, money laundering, or to evade payment-network rules;</li>
          <li>interfere with, reverse engineer, or attempt to gain unauthorized access to the Services;</li>
          <li>use automated means to access the Services except through APIs we make available under a separate
            agreement.</li>
        </ul>

        <h2 id="disclaimers">10. Disclaimers and limitation of liability</h2>
        <p>
          THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY
          KIND, EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
          NON-INFRINGEMENT. WE DO NOT GUARANTEE THAT DEBITS OR TRANSFERS WILL BE COMPLETED BY ANY PARTICULAR TIME.
        </p>
        <p>
          TO THE FULLEST EXTENT PERMITTED BY LAW, HEDGE AND ITS OFFICERS, DIRECTORS, EMPLOYEES AND PARTNERS WILL NOT
          BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY LOSS OF
          PROFITS OR DATA, ARISING FROM YOUR USE OF THE SERVICES. OUR TOTAL LIABILITY FOR ANY CLAIM RELATING TO THE
          SERVICES IS LIMITED TO THE GREATER OF (A) THE TOTAL ROUND-UP AMOUNTS DEBITED FROM YOUR ACCOUNT IN THE
          TWELVE MONTHS BEFORE THE CLAIM AROSE, OR (B) ONE HUNDRED U.S. DOLLARS. Some jurisdictions do not allow
          these limitations, so they may not apply to you. Nothing in these Terms limits your rights under the
          Electronic Fund Transfer Act or other consumer-protection laws that cannot be waived.
        </p>

        <h2 id="disputes">11. Disputes and governing law</h2>
        <p>
          These Terms are governed by the laws of the State of Delaware and applicable U.S. federal law, without
          regard to conflict-of-laws principles. Before filing a claim, you agree to contact us at{' '}
          <a href="mailto:support@hedgepayments.com">support@hedgepayments.com</a> and give us 30 days to try to
          resolve it. Any dispute that is not resolved will be brought in the state or federal courts located in
          Delaware, and you consent to their jurisdiction. Each party waives any right to a jury trial to the extent
          permitted by law, and claims may be brought only on an individual basis and not as part of a class or
          representative action.
        </p>

        <h2 id="general">12. General</h2>
        <ul>
          <li>We may modify these Terms by posting a revised version with a new effective date; material changes will
            be notified through the Services or by email. Continued use after the effective date is acceptance.</li>
          <li>If any provision is unenforceable, the remainder stays in effect. Our failure to enforce a provision is
            not a waiver.</li>
          <li>You may not assign these Terms; we may assign them in connection with a merger, acquisition or sale of
            assets.</li>
          <li>These Terms, with the Privacy Policy and any program terms disclosed at enrollment, are the entire
            agreement between you and Hedge regarding the Services.</li>
        </ul>

        <h2 id="contact">13. Contact</h2>
        <p>
          Hedge, Inc.<br />
          Email: <a href="mailto:support@hedgepayments.com">support@hedgepayments.com</a><br />
          Web: <a href="https://hedgepayments.com">hedgepayments.com</a>
        </p>
      </article>
      <Footer />
    </main>
  )
}
