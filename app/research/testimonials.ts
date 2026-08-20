// Tester notes shown in the ticker under the hero on /research.
//
// These are ILLUSTRATIVE entries — fictional names, generic site types, no real
// brands — and the ticker is labeled as such on the page. Replace with real,
// attributed quotes when you have them and flip `ILLUSTRATIVE` to false to
// drop the label.

export type Testimonial = {
  name: string
  segment: string
  app: string
  quote: string
  avatar?: string
}

export const ILLUSTRATIVE = true

export const TESTIMONIALS: Testimonial[] = [
  { name: 'Tyler R.', segment: 'Penn State · 21+', app: 'a sportsbook app', quote: 'Signup took under two minutes but the ID check failed twice on a glare. Had to retake it in a dark room.' },
  { name: 'Maya K.', segment: 'Ohio State · 21+', app: 'a prediction market', quote: 'Loved the market search. Couldn’t figure out what a contract actually paid out until I’d already bought.' },
  { name: 'Jordan P.', segment: 'Fantasy player · 18+', app: 'a DFS app', quote: 'Lineup builder is fast. The late-swap rule wasn’t explained anywhere and cost me an entry.' },
  { name: 'Chris D.', segment: 'Crypto user · 18+', app: 'a crypto exchange', quote: 'Instant ACH was great. Then the withdrawal hold was 7 days with no countdown shown in-app.' },
  { name: 'Sofia M.', segment: 'Investing · 18+', app: 'a brokerage app', quote: 'Onboarding asked for my employer three separate times. Felt like three different forms stitched together.' },
  { name: 'Ben W.', segment: 'Payments tester · 18+', app: 'a P2P payments app', quote: 'Sent $20 to a friend in one tap. Requesting it back took four screens.' },
  { name: 'Alexis T.', segment: 'Alabama · 21+', app: 'a sportsbook app', quote: 'Same-game parlay builder is the best I’ve used. Cash-out button disappeared mid-game twice though.' },
  { name: 'Nate H.', segment: 'Michigan · 21+', app: 'an online casino', quote: 'Slots load instantly. Finding the bonus wagering terms took me five minutes of tapping.' },
  { name: 'Priya S.', segment: 'Fantasy player · 18+', app: 'a season-long fantasy app', quote: 'League import from another provider worked first try. Draft room lagged on a slow connection.' },
  { name: 'Marcus J.', segment: 'Crypto user · 18+', app: 'a crypto wallet', quote: 'Seed phrase screen let me screenshot it with no warning. That’s a problem.' },
  { name: 'Hannah L.', segment: 'Indiana · 21+', app: 'a prediction market', quote: 'Deposit via debit was declined with no reason. Switched to bank link and it went through fine.' },
  { name: 'Derek F.', segment: 'Investing · 18+', app: 'a brokerage app', quote: 'Fractional shares were easy. The order confirmation didn’t show the estimated fee until after.' },
  { name: 'Kayla B.', segment: 'Payments tester · 18+', app: 'a neobank', quote: 'Card arrived in three days. Virtual card wasn’t usable until the physical one was activated — odd.' },
  { name: 'Ethan C.', segment: 'Penn State · 21+', app: 'a sportsbook app', quote: 'Live odds update fast. Bet slip cleared itself when I switched tabs to check a score.' },
  { name: 'Olivia G.', segment: 'Ohio State · 21+', app: 'an online casino', quote: 'Responsible-gaming limits were easy to set. Raising them later had a 24-hour delay, which I liked.' },
  { name: 'Liam N.', segment: 'Fantasy player · 18+', app: 'a DFS app', quote: 'Contest entry fees were clear. Prize structure was buried behind a tiny “i” icon.' },
  { name: 'Ava R.', segment: 'Crypto user · 18+', app: 'a crypto exchange', quote: 'Price alerts worked well. 2FA reset required emailing support and took two days.' },
  { name: 'Jake M.', segment: 'Georgia · 21+', app: 'a prediction market', quote: 'Settlement was fast once the event ended. Still not clear who decides the outcome on edge cases.' },
  { name: 'Grace H.', segment: 'Investing · 18+', app: 'a robo-advisor', quote: 'Risk quiz was five questions. Portfolio explanation was genuinely helpful.' },
  { name: 'Ryan O.', segment: 'Payments tester · 18+', app: 'a BNPL provider', quote: 'Checkout split was seamless. Couldn’t find a way to pay off early from the app.' },
  { name: 'Zoe A.', segment: 'Michigan · 21+', app: 'a sportsbook app', quote: 'Promo said “bet $5 get $150” — the bonus came as six $25 tokens with a 7-day expiry. Fine, but say so up front.' },
  { name: 'Caleb V.', segment: 'Alabama · 21+', app: 'an online casino', quote: 'Withdrawal to the same card I deposited with was rejected. Had to add a bank account.' },
  { name: 'Lauren E.', segment: 'Fantasy player · 18+', app: 'a best-ball app', quote: 'Drafting on mobile is smooth. Push notification came 30 seconds after my pick was auto-made.' },
  { name: 'Isaiah T.', segment: 'Crypto user · 18+', app: 'a crypto exchange', quote: 'Spread on the “instant buy” was way wider than the advanced view. Most people won’t notice.' },
  { name: 'Emma D.', segment: 'Indiana · 21+', app: 'a prediction market', quote: 'Geolocation check passed on wifi, failed on cellular in the same room.' },
  { name: 'Noah S.', segment: 'Investing · 18+', app: 'a brokerage app', quote: 'Transfer from my old broker took 6 business days. App said 3–5.' },
  { name: 'Chloe P.', segment: 'Payments tester · 18+', app: 'a P2P payments app', quote: 'Adding a second bank account triggered a full re-verification. Ten minutes gone.' },
  { name: 'Mason K.', segment: 'Penn State · 21+', app: 'a sportsbook app', quote: 'Player props were deep. Searching for a player by last name only returned nothing.' },
  { name: 'Lily W.', segment: 'Georgia · 21+', app: 'an online casino', quote: 'Live dealer stream was crisp. Chat moderation was nonexistent.' },
  { name: 'Aiden B.', segment: 'Fantasy player · 18+', app: 'a DFS app', quote: 'Deposit bonus matched instantly. Contest lobby filters reset every time I backed out.' },
  { name: 'Natalie C.', segment: 'Crypto user · 18+', app: 'a crypto wallet', quote: 'Swapping tokens was one screen. Gas estimate was off by 3x at peak.' },
  { name: 'Owen M.', segment: 'Ohio State · 21+', app: 'a prediction market', quote: 'Limit orders worked. Market orders on thin books filled at surprising prices with no warning.' },
  { name: 'Ella J.', segment: 'Investing · 18+', app: 'a brokerage app', quote: 'Tax documents were easy to find. Dividend reinvestment toggle was hidden in a sub-sub-menu.' },
  { name: 'Logan R.', segment: 'Payments tester · 18+', app: 'a neobank', quote: 'Direct deposit set up in one tap. Mobile check deposit rejected a perfectly flat check twice.' },
  { name: 'Sophie T.', segment: 'Michigan · 21+', app: 'a sportsbook app', quote: 'Cash-out offers were fair. App logged me out every time my phone locked.' },
  { name: 'Gavin H.', segment: 'Alabama · 21+', app: 'an online casino', quote: 'Game library is huge. Searching by provider isn’t possible.' },
  { name: 'Mia L.', segment: 'Fantasy player · 18+', app: 'a season-long fantasy app', quote: 'Trade block UI was great. Commissioner tools on mobile are missing half the desktop features.' },
  { name: 'Carter F.', segment: 'Crypto user · 18+', app: 'a crypto exchange', quote: 'Staking was two taps. Unstaking warning about the 21-day lock was in grey 10pt text.' },
  { name: 'Abby N.', segment: 'Indiana · 21+', app: 'a prediction market', quote: 'Sports markets settled same-day. Political markets took 48 hours with no status update.' },
  { name: 'Dylan G.', segment: 'Investing · 18+', app: 'a robo-advisor', quote: 'Recurring deposit scheduling was simple. Changing the amount meant cancelling and recreating it.' },
  { name: 'Hailey S.', segment: 'Payments tester · 18+', app: 'a BNPL provider', quote: 'Approval was instant at checkout. The payment reminder email went to spam.' },
  { name: 'Austin W.', segment: 'Penn State · 21+', app: 'a sportsbook app', quote: 'Odds boosts were front and center. Bet history didn’t show boosted vs. standard odds.' },
  { name: 'Sadie K.', segment: 'Georgia · 21+', app: 'an online casino', quote: 'Welcome bonus terms were in plain English. Rare.' },
  { name: 'Evan P.', segment: 'Fantasy player · 18+', app: 'a DFS app', quote: 'Player news feed updated faster than the sportsbook I had open next to it.' },
  { name: 'Brooke D.', segment: 'Crypto user · 18+', app: 'a crypto wallet', quote: 'Recovery flow worked on a new phone. Took three tries to scan the QR under normal lighting.' },
  { name: 'Cole A.', segment: 'Ohio State · 21+', app: 'a prediction market', quote: 'Liked the position P&L view. No way to export trade history.' },
  { name: 'Jenna M.', segment: 'Investing · 18+', app: 'a brokerage app', quote: 'Options approval was a six-question form. Exercise button was nowhere in the position view.' },
  { name: 'Trevor B.', segment: 'Payments tester · 18+', app: 'a P2P payments app', quote: 'Instant transfer fee was 1.75%. Standard was free but said “1–3 days” and took 4.' },
  { name: 'Kendall R.', segment: 'Michigan · 21+', app: 'a sportsbook app', quote: 'Deposit with a debit card was instant. First withdrawal needed a utility bill upload.' },
  { name: 'Parker L.', segment: 'Alabama · 21+', app: 'an online casino', quote: 'Loyalty points were visible everywhere. What they were worth in dollars was not.' },
]
