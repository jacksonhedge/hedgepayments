// Usage: ADMIN_SECRET=... node scripts/research-stress.mjs   (SITE=http://localhost:3000 for local)
// Afterwards delete rows: testers where email like 'jacksonfitzgerald25+hrtest-%', tests titled 'Stress test %', screeners slug 'stress-%'.
// End-to-end stress test of the Hedge Research backend on production.
// Creates clearly-tagged test rows (attribution.test=true, emails +hrtest-<run>@) so they can be deleted after.
const SITE = process.env.SITE || 'https://hedgepayments.com'
const ADMIN = process.env.ADMIN_SECRET
const RUN = Date.now().toString(36)
const results = []
const ok = (name, pass, detail = '') => { results.push({ name, pass, detail }); console.log(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? ' — ' + detail : ''}`) }
const j = async (path, init = {}, admin = false) => {
  const r = await fetch(SITE + path, { ...init, headers: { 'content-type': 'application/json', ...(admin ? { authorization: `Bearer ${ADMIN}` } : {}), ...(init.headers || {}) } })
  let body = null; try { body = await r.json() } catch {}
  return { status: r.status, body }
}
const email = (tag) => `jacksonfitzgerald25+hrtest-${RUN}-${tag}@gmail.com`
const attr = (extra) => ({ utm_source: 'stresstest', utm_campaign: `run-${RUN}`, landing_path: '/research', device: 'desktop', test: true, ...extra })

// 1. Public pages render
for (const p of ['/research', '/research/signup', '/research/dashboard']) {
  const r = await fetch(SITE + p); ok(`GET ${p}`, r.status === 200, `HTTP ${r.status}`)
}

// 2. Signup validation + happy path + duplicate protection
let r = await j('/api/research/apply', { method: 'POST', body: JSON.stringify({ email: 'bad', first_name: 'X', state: 'PA', age_bucket: '21+' }) })
ok('apply rejects bad email', r.status === 400, JSON.stringify(r.body))
r = await j('/api/research/apply', { method: 'POST', body: JSON.stringify({ email: email('a'), first_name: 'Stress', last_name: 'TesterA', state: 'pa', age_bucket: '21+', phone: '(412) 555-0100', platforms: ['fanduel', 'kalshi'], verticals: ['Sports betting'], payout_method: 'venmo', payout_handle: '@stress-a', attribution: attr({ utm_medium: 'social', referrer: 'instagram.com' }) }) })
ok('apply creates tester', r.status === 200 && r.body?.success, JSON.stringify(r.body))
r = await j('/api/research/apply', { method: 'POST', body: JSON.stringify({ email: email('a'), first_name: 'HIJACK', state: 'NY', age_bucket: '18-20' }) })
ok('apply on existing email returns success but does not leak/overwrite', r.status === 200 && r.body?.returning === undefined, JSON.stringify(r.body))
// 20 parallel signups
const burst = await Promise.all(Array.from({ length: 20 }, (_, i) => j('/api/research/apply', { method: 'POST', body: JSON.stringify({ email: email(`b${i}`), first_name: `Burst${i}`, state: ['PA', 'NJ', 'NY', 'OH'][i % 4], age_bucket: i % 3 ? '21+' : '18-20', platforms: i % 2 ? ['draftkings'] : ['polymarket'], attribution: attr({ src: i % 2 ? 'ig_story' : 'tiktok_bio' }) }) })))
ok('20 parallel signups all 200', burst.every((x) => x.status === 200), `${burst.filter((x) => x.status === 200).length}/20`)

// 3. Admin auth
r = await j('/api/admin/research/testers', {}, false); ok('admin route rejects missing bearer', r.status === 401)
r = await j('/api/admin/research/testers', { headers: { authorization: 'Bearer wrong' } }); ok('admin route rejects wrong bearer', r.status === 401)
r = await j('/api/admin/research/testers', {}, true); ok('admin lists testers', r.status === 200 && Array.isArray(r.body?.testers), `${r.body?.testers?.length} testers`)
const testers = r.body?.testers || []
const a = testers.find((t) => t.email === email('a'))
ok('tester A persisted with normalized data', !!a && a.phone === '+14125550100' && a.state === 'PA' && a.payout_method === 'venmo' && a.platforms.includes('kalshi'), a ? `${a.phone} ${a.state} ${a.payout_method} [${a.platforms}]` : 'not found')
ok('tester A not overwritten by hijack attempt', !!a && a.first_name === 'Stress' && a.state === 'PA')
ok('attribution stored + source label derived', !!a && a.signup_source === `stresstest / run-${RUN}` && a.attribution?.referrer === 'instagram.com' && a.signup_path === '/research/signup', a ? `${a.signup_source} · ${a.signup_path}` : '')
const burstRows = testers.filter((t) => t.email.includes(`hrtest-${RUN}-b`))
ok('burst rows all persisted', burstRows.length === 20, `${burstRows.length}/20`)
ok('src-based source labels', burstRows.every((t) => ['stresstest / run-' + RUN].includes(t.signup_source)), burstRows[0]?.signup_source)

// 4. Tests + assignments
r = await j('/api/admin/research/tests', { method: 'POST', body: JSON.stringify({ title: `Stress test ${RUN}`, tier: 'full', payout_dollars: 100, payout_max_dollars: 100, est_minutes: 60, status: 'recruiting', description: 'stress' }) }, true)
ok('create test', r.status === 200 && r.body?.test?.payout_cents === 10000, JSON.stringify(r.body?.test?.payout_cents))
const testId = r.body?.test?.id
r = await j('/api/admin/research/tests', { method: 'POST', body: JSON.stringify({ title: 'Too cheap', payout_dollars: 5 }) }, true)
ok('test payout below $10 rejected by DB constraint', r.status === 500 && /payout/.test(r.body?.error || ''), r.body?.error)
r = await j('/api/admin/research/assignments', { method: 'POST', body: JSON.stringify({ test_id: testId, tester_ids: [a.id, ...burstRows.slice(0, 5).map((t) => t.id)] }) }, true)
ok('invite 6 testers', r.status === 200 && r.body?.invited === 6, JSON.stringify(r.body))
r = await j('/api/admin/research/assignments', { method: 'POST', body: JSON.stringify({ test_id: testId, tester_ids: [a.id] }) }, true)
ok('re-invite is idempotent', r.status === 200)

// 5. Screener: template → open link → disqualify → qualify via eid → auto-assign → duplicate blocked
r = await j('/api/admin/research/screeners', { method: 'POST', body: JSON.stringify({ template: 'betting_hero', slug: `stress-${RUN}`, test_id: testId }) }, true)
ok('create Betting Hero screener', r.status === 200 && r.body?.screener?.questions?.length === 9, `${r.body?.screener?.questions?.length} questions`)
const scId = r.body?.screener?.id
r = await j(`/api/research/screener/stress-${RUN}`)
ok('public screener GET (open link)', r.status === 200 && r.body?.invitee === null)
r = await j(`/api/research/screener/stress-${RUN}?eid=${a.invite_token}`)
ok('screener GET with eid locks invitee', r.status === 200 && r.body?.invitee?.email === email('a'), JSON.stringify(r.body?.invitee))
const base = { available: 'Yes', state: 'New Jersey', first_name: 'Screen', last_name: 'Er', used_any: 'Yes', apps: ['FanDuel', 'BetMGM'], mix: '50% casino / 50% sports', payout_ok: 'Yes', deposit_ok: 'Yes' }
r = await j(`/api/research/screener/stress-${RUN}`, { method: 'POST', body: JSON.stringify({ email: email('dq'), full_name: 'DQ Person', answers: { ...base, apps: ['None of the above'] }, consent: { storage: true, deletion: true }, attribution: attr({}) }) })
ok('open-link disqualifying answer → qualified=false, tester created', r.status === 200 && r.body?.qualified === false, JSON.stringify(r.body))
r = await j(`/api/research/screener/stress-${RUN}`, { method: 'POST', body: JSON.stringify({ email: email('x'), full_name: 'No Consent', answers: base, consent: { storage: false, deletion: true } }) })
ok('missing required consent rejected', r.status === 400)
r = await j(`/api/research/screener/stress-${RUN}`, { method: 'POST', body: JSON.stringify({ eid: a.invite_token, email: 'ignored@example.com', full_name: 'Stress TesterA', answers: base, consent: { storage: true, deletion: true, future: true } }) })
ok('eid submit qualifies + ignores typed email', r.status === 200 && r.body?.qualified === true, JSON.stringify(r.body))
r = await j(`/api/research/screener/stress-${RUN}?eid=${a.invite_token}`)
ok('eid GET now reports already completed', r.body?.invitee?.already === true)
r = await j('/api/admin/research/screeners', {}, true)
const sc = (r.body?.screeners || []).find((s) => s.id === scId)
ok('screener responses recorded (2)', sc?.research_screener_responses?.length === 2, `${sc?.research_screener_responses?.length}`)
r = await j('/api/admin/research/testers', {}, true)
const a2 = (r.body?.testers || []).find((t) => t.id === a.id)
ok('eid response mapped answers onto tester (state NJ, platforms from apps)', a2?.state === 'NJ' && a2?.platforms?.includes('betmgm'), `${a2?.state} [${a2?.platforms}]`)
ok('qualified tester assigned to linked test', a2?.research_assignments?.some((x) => x.test_id === testId))
const dq = (r.body?.testers || []).find((t) => t.email === email('dq'))
ok('open-link screener created tester with signup_path', dq?.signup_path === `/research/s/stress-${RUN}` && dq?.signup_source === `stresstest / run-${RUN}`, `${dq?.signup_path} · ${dq?.signup_source}`)

// 6. Messaging: real email to Jackson (design check), SMS expected failure captured with reason, log rows written
r = await j('/api/admin/research/messages', { method: 'POST', body: JSON.stringify({ tester_ids: [a.id], channel: 'email', subject: `[Stress ${RUN}] Hedge Research design check for {{first_name}}`, eyebrow: 'Paid study · $100', body: `Hi {{first_name}},\n\nThis is the branded email template, sent by the stress test against production. Your test: {{test}}.\n\nIf this looks right in your inbox, the email pipeline is good.`, cta_label: 'Open your dashboard', cta_url: '{{dashboard_url}}', test_id: testId }) }, true)
ok('email send (to Jackson +hrtest alias)', r.status === 200 && r.body?.sent === 1, JSON.stringify(r.body))
r = await j('/api/admin/research/messages', { method: 'POST', body: JSON.stringify({ tester_ids: [a.id], channel: 'sms', body: 'Stress SMS {{first_name}}' }) }, true)
ok('sms send returns structured failure reason (Twilio still 20003)', r.status === 200 && r.body?.failed?.[0]?.reason?.includes('20003'), r.body?.failed?.[0]?.reason)
r = await j('/api/admin/research/messages', { method: 'POST', body: JSON.stringify({ tester_ids: burstRows.slice(0, 3).map((t) => t.id), channel: 'email', subject: 'x', body: 'y' }) }, true)
ok('email to 3 recipients', r.status === 200 && r.body?.sent === 3, JSON.stringify({ sent: r.body?.sent, failed: r.body?.failed }))
r = await j(`/api/admin/research/messages?tester_id=${a.id}`, {}, true)
ok('message log for tester A has 2 rows', r.body?.messages?.length === 2, `${r.body?.messages?.length}`)
r = await j('/api/admin/research/twilio-check', {}, true)
ok('twilio-check reachable', r.status === 200 && r.body?.twilio, JSON.stringify(r.body?.twilio))

// 7. Read-load: 30 parallel admin list calls
const t0 = Date.now()
const loads = await Promise.all(Array.from({ length: 30 }, () => j('/api/admin/research/testers', {}, true)))
ok('30 parallel admin reads', loads.every((x) => x.status === 200), `${Date.now() - t0}ms total`)

console.log(`\n${results.filter((x) => x.pass).length}/${results.length} passed · run ${RUN}`)
console.log(JSON.stringify({ run: RUN, testId, scId }, null, 0))
