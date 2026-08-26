export type QType = 'single' | 'multi' | 'text' | 'yesno'
export type Question = {
  id: string
  type: QType
  prompt: string
  help?: string
  options?: string[]
  exclusive?: string        // option that clears the others (e.g. "None of the above")
  required?: boolean
  disqualify?: string[]     // answers that end the screener as not-a-match
  maps_to?: 'state' | 'first_name' | 'last_name' | 'platforms' | 'phone'
}
export type Screener = {
  id: string; slug: string; title: string; intro: string | null; test_id: string | null
  questions: Question[]; status: 'draft' | 'open' | 'closed'
}
export type Answers = Record<string, string | string[]>

export const US_STATE_NAMES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']
const ABBR = ['AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY']
export const stateAbbr = (name: string) => { const i = US_STATE_NAMES.indexOf(name); return i >= 0 ? ABBR[i] : name.slice(0, 2).toUpperCase() }

// App names → research_platforms slugs where we have one; others kept as lowercase slugs.
export const platformSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '')

export function evaluate(questions: Question[], answers: Answers): { qualified: boolean; disqualified_by: string | null } {
  for (const q of questions) {
    if (!q.disqualify?.length) continue
    const a = answers[q.id]
    const vals = Array.isArray(a) ? a : a == null ? [] : [a]
    if (vals.some((v) => q.disqualify!.includes(v))) return { qualified: false, disqualified_by: q.id }
  }
  return { qualified: true, disqualified_by: null }
}

// Replica of the Betting Hero / Great Question screener structure.
export const BETTING_HERO_TEMPLATE: { title: string; intro: string; questions: Question[] } = {
  title: 'Help us build a better product experience',
  intro: 'This is a short, unpaid questionnaire (under a minute) to see if you qualify for a paid 1-hour interview: two 30-minute sessions testing two separate betting apps. It pays $100, plus we reimburse a $10–$20 deposit you make during the session. If you only qualify for one app, it is $50 for 30 minutes. Sessions are first-come, first-served; if selected you will get a scheduling email.',
  questions: [
    { id: 'available', type: 'yesno', prompt: 'Are you willing and available to take part in a paid 1-hour video interview during the study window?', required: true, disqualify: ['No'] },
    { id: 'state', type: 'single', prompt: 'Which state do you live in?', options: US_STATE_NAMES, required: true, maps_to: 'state' },
    { id: 'first_name', type: 'text', prompt: 'First name', required: true, maps_to: 'first_name' },
    { id: 'last_name', type: 'text', prompt: 'Last name', required: true, maps_to: 'last_name' },
    { id: 'used_any', type: 'yesno', prompt: 'Have you ever used any online sports betting, casino, prediction market or DFS products?', required: true, disqualify: ['No'] },
    { id: 'apps', type: 'multi', prompt: 'Which online sports betting / casino apps have you ever created an account with? (select all that apply)', options: ['FanDuel','DraftKings','bet365','BetMGM','Fanatics','BetRivers','Caesars','theScore Bet','Hard Rock','Hollywood Casino','Other','None of the above'], exclusive: 'None of the above', required: true, disqualify: ['None of the above'], maps_to: 'platforms' },
    { id: 'mix', type: 'single', prompt: 'Roughly what percentage of your gambling is online casino versus online sports betting?', options: ['100% casino / 0% sports','90% casino / 10% sports','70% casino / 30% sports','50% casino / 50% sports','30% casino / 70% sports','10% casino / 90% sports','0% casino / 100% sports'], required: true },
    { id: 'payout_ok', type: 'yesno', prompt: 'Payment is sent by direct deposit through our payout platform. If you do not already have an account there, are you willing to create one to get paid?', required: true, disqualify: ['No'] },
    { id: 'deposit_ok', type: 'yesno', prompt: 'During the interview you will download an app on your mobile device, create an account, and make a $10–$20 deposit (reimbursed). Do you agree?', required: true, disqualify: ['No'] },
  ],
}
