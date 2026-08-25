export const US_STATES = ['AL','AK','AZ','AR','CA','CO','CT','DE','DC','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']
export const PAYOUT_TIERS = [
  { key: 'quick', label: 'Quick check', pay: 10, max: 15, minutes: 10, desc: 'One screen or flow. Sign-up, a deposit attempt, a short survey.' },
  { key: 'standard', label: 'Standard test', pay: 25, max: 40, minutes: 25, desc: 'Register, deposit, place a bet, cash out. Screen-recorded.' },
  { key: 'deep', label: 'Deep dive', pay: 50, max: 75, minutes: 45, desc: 'Full journey plus a competitor side-by-side and written feedback.' },
  { key: 'full', label: 'Full engagement', pay: 100, max: 100, minutes: 90, desc: 'Multi-day or multi-platform benchmark with an interview.' },
] as const
export const PAYOUT_METHODS = [
  { key: 'venmo', label: 'Venmo', hint: '@username' },
  { key: 'cashapp', label: 'Cash App', hint: '$cashtag' },
  { key: 'paypal', label: 'PayPal', hint: 'email or @handle' },
  { key: 'zelle', label: 'Zelle', hint: 'phone or email' },
] as const
export const VERTICALS = ['Prediction markets', 'Sports betting', 'Fantasy sports', 'Crypto', 'Investing', 'Payments']
export const ASSIGNMENT_LABEL: Record<string, string> = {
  invited: 'Invited', accepted: 'Accepted', in_progress: 'In progress', submitted: 'Submitted',
  approved: 'Approved', paid: 'Paid', declined: 'Declined',
}
export const TESTER_STATUS_LABEL: Record<string, string> = {
  applied: 'Application received', approved: 'Approved — waiting for a match', active: 'Active tester', paused: 'Paused', rejected: 'Not eligible',
}
