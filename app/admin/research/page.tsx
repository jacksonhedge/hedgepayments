'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { PAYOUT_TIERS } from '../../research/testerConfig'

// Hedge Research admin: testers, tests, assignments, and outbound SMS/email.
// Auth = ADMIN_SECRET bearer (same as /api/admin/send-email), kept in sessionStorage (cleared when the tab closes).

type Tester = { id: string; email: string; phone: string | null; first_name: string; last_name: string | null; age_bucket: string; state: string; platforms: string[]; verticals: string[]; status: string; sms_opt_in: boolean; email_opt_in: boolean; payout_method: string | null; payout_handle: string | null; notes: string | null; created_at: string; research_assignments: { id: string; status: string; test_id: string }[]; research_messages: { id: string; channel: string; sent_at: string }[] }
type Test = { id: string; title: string; platform_id: string | null; description: string | null; instructions: string | null; payout_cents: number; payout_max_cents: number | null; tier: string; est_minutes: number | null; status: string; starts_at: string | null; ends_at: string | null; research_platforms: { name: string } | null; research_assignments: { id: string; status: string; tester_id: string; paid_cents: number | null }[] }
type Platform = { id: string; slug: string; name: string; kind: string }
type Screener = { id: string; slug: string; title: string; intro: string | null; test_id: string | null; questions: any[]; status: string; created_at: string; research_tests: { title: string } | null; research_screener_responses: { id: string; tester_id: string | null; email: string; full_name: string | null; answers: Record<string, any>; qualified: boolean; disqualified_by: string | null; created_at: string }[] }
type RefStat = { code: string; owner_name: string; owner_email: string | null; owner_type: string; active: boolean; created_at: string; subscribes: number; applies: number; total: number; last_referral_at: string | null }
type RefEvent = { id: string; code: string; code_known: boolean; event: string; referred_email: string | null; created_at: string }
type Msg = { id: string; channel: string; subject: string | null; body: string; status: string; error: string | null; sent_at: string; research_testers: { first_name: string; email: string } | null }

const TESTER_STATUSES = ['applied', 'approved', 'active', 'paused', 'rejected']
const ASSIGN_STATUSES = ['invited', 'accepted', 'in_progress', 'submitted', 'approved', 'paid', 'declined']
const TEST_STATUSES = ['draft', 'recruiting', 'live', 'closed']

const inp = 'w-full border border-[#D4C5B0] rounded px-3 py-2 text-sm bg-white'
const btn = 'px-3 py-1.5 rounded text-sm bg-[#2C2416] text-[#FAF8F5] hover:bg-[#3D3024] disabled:opacity-50'
const btn2 = 'px-3 py-1.5 rounded text-sm border border-[#D4C5B0] text-[#2C2416] hover:bg-[#FAF8F5] disabled:opacity-50'

export default function ResearchAdmin() {
  const [secret, setSecret] = useState('')
  const [tab, setTab] = useState<'testers' | 'tests' | 'screeners' | 'messages' | 'referrals'>('testers')
  const [screeners, setScreeners] = useState<Screener[]>([])
  const [testers, setTesters] = useState<Tester[]>([])
  const [tests, setTests] = useState<Test[]>([])
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [refs, setRefs] = useState<{ stats: RefStat[]; recent: RefEvent[]; unknown: { code: string; n: number }[] }>({ stats: [], recent: [], unknown: [] })
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState({ q: '', status: '', state: '', platform: '', age: '' })
  const [toast, setToast] = useState('')
  const [err, setErr] = useState('')

  useEffect(() => { try { setSecret(sessionStorage.getItem('hedge_admin_secret') || '') } catch {} }, [])
  const saveSecret = (v: string) => { setSecret(v); try { sessionStorage.setItem('hedge_admin_secret', v) } catch {} }

  const api = useCallback(async (path: string, init?: RequestInit) => {
    const res = await fetch(`/api/admin/research/${path}`, { ...init, headers: { 'content-type': 'application/json', authorization: `Bearer ${secret}`, ...(init?.headers || {}) } })
    const j = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(j.error || `HTTP ${res.status}`)
    return j
  }, [secret])

  const reload = useCallback(async () => {
    if (!secret) return
    setErr('')
    try {
      const [t, x, m, sc, rf] = await Promise.all([api('testers'), api('tests'), api('messages'), api('screeners'), api('referrals')])
      setTesters(t.testers); setTests(x.tests); setPlatforms(x.platforms); setMsgs(m.messages); setScreeners(sc.screeners); setRefs(rf)
    } catch (e: any) { setErr(e.message) }
  }, [api, secret])
  useEffect(() => { reload() }, [reload])

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(''), 4000) }

  const visible = useMemo(() => testers.filter((t) => {
    const q = filter.q.toLowerCase()
    if (q && !`${t.first_name} ${t.last_name || ''} ${t.email} ${t.phone || ''}`.toLowerCase().includes(q)) return false
    if (filter.status && t.status !== filter.status) return false
    if (filter.state && t.state !== filter.state) return false
    if (filter.age && t.age_bucket !== filter.age) return false
    if (filter.platform && !t.platforms.includes(filter.platform)) return false
    return true
  }), [testers, filter])

  const toggleAll = () => setSelected(selected.size === visible.length ? new Set() : new Set(visible.map((t) => t.id)))
  const toggle = (id: string) => setSelected((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })

  if (!secret) {
    return (
      <div className="max-w-md">
        <h1 className="text-2xl mb-4">Hedge Research</h1>
        <p className="text-sm mb-2">Enter the admin secret (ADMIN_SECRET env var) to continue.</p>
        <input className={inp} type="password" placeholder="Admin secret" onKeyDown={(e) => { if (e.key === 'Enter') saveSecret((e.target as HTMLInputElement).value) }} />
      </div>
    )
  }

  const counts = TESTER_STATUSES.map((st) => [st, testers.filter((t) => t.status === st).length] as const)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl">Hedge Research</h1>
          <p className="text-sm text-[#6B5D4F]">{testers.length} testers · {counts.map(([s, n]) => `${n} ${s}`).join(' · ')}</p>
        </div>
        <div className="flex gap-2">
          <button className={btn2} onClick={reload}>Refresh</button>
          <button className={btn2} onClick={() => saveSecret('')}>Lock</button>
        </div>
      </div>
      {err && <div className="mb-4 p-3 rounded bg-red-50 text-red-800 text-sm">{err}</div>}
      {toast && <div className="mb-4 p-3 rounded bg-green-50 text-green-800 text-sm">{toast}</div>}

      <div className="flex gap-2 mb-6 border-b border-[#D4C5B0]">
        {(['testers', 'tests', 'screeners', 'messages', 'referrals'] as const).map((k) => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 text-sm capitalize ${tab === k ? 'border-b-2 border-[#2C2416] font-semibold' : 'text-[#6B5D4F]'}`}>{k}</button>
        ))}
      </div>

      {tab === 'testers' && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-4">
            <input className={`${inp} md:col-span-2`} placeholder="Search name, email, phone" value={filter.q} onChange={(e) => setFilter({ ...filter, q: e.target.value })} />
            <select className={inp} value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}><option value="">Any status</option>{TESTER_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
            <select className={inp} value={filter.age} onChange={(e) => setFilter({ ...filter, age: e.target.value })}><option value="">Any age</option><option>21+</option><option>18-20</option></select>
            <select className={inp} value={filter.state} onChange={(e) => setFilter({ ...filter, state: e.target.value })}><option value="">Any state</option>{Array.from(new Set(testers.map((t) => t.state))).sort().map((s) => <option key={s}>{s}</option>)}</select>
            <select className={inp} value={filter.platform} onChange={(e) => setFilter({ ...filter, platform: e.target.value })}><option value="">Any platform</option>{platforms.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}</select>
          </div>

          {selected.size > 0 && <Composer selected={Array.from(selected)} tests={tests} screeners={screeners} api={api} onDone={(m) => { flash(m); setSelected(new Set()); reload() }} />}

          <div className="overflow-x-auto bg-white border border-[#D4C5B0] rounded">
            <table className="w-full text-sm">
              <thead className="bg-[#FAF8F5] text-left">
                <tr>
                  <th className="p-2"><input type="checkbox" checked={visible.length > 0 && selected.size === visible.length} onChange={toggleAll} /></th>
                  <th className="p-2">Tester</th><th className="p-2">Contact</th><th className="p-2">State / Age</th><th className="p-2">Platforms</th><th className="p-2">Payout to</th><th className="p-2">Tests</th><th className="p-2">Status</th><th className="p-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {visible.map((t) => (
                  <tr key={t.id} className="border-t border-[#F0E8DD] align-top">
                    <td className="p-2"><input type="checkbox" checked={selected.has(t.id)} onChange={() => toggle(t.id)} /></td>
                    <td className="p-2"><div className="font-semibold">{t.first_name} {t.last_name}</div>{t.notes && <div className="text-xs text-[#6B5D4F]">{t.notes}</div>}</td>
                    <td className="p-2 text-xs"><div>{t.email}{!t.email_opt_in && ' 🚫'}</div><div>{t.phone || <span className="text-[#9a8b7a]">no phone</span>}{t.phone && !t.sms_opt_in && ' 🚫'}</div></td>
                    <td className="p-2">{t.state} · {t.age_bucket}</td>
                    <td className="p-2 text-xs max-w-[200px]">{t.platforms.join(', ') || '—'}</td>
                    <td className="p-2 text-xs">{t.payout_method ? `${t.payout_method}: ${t.payout_handle}` : <span className="text-red-700">not set</span>}</td>
                    <td className="p-2 text-xs">{t.research_assignments.length ? ASSIGN_STATUSES.map((s) => { const n = t.research_assignments.filter((a) => a.status === s).length; return n ? `${n} ${s}` : null }).filter(Boolean).join(', ') : '—'}<div className="text-[#9a8b7a]">{t.research_messages.length} msgs</div></td>
                    <td className="p-2">
                      <select className="border border-[#D4C5B0] rounded px-1 py-0.5 text-xs" value={t.status} onChange={async (e) => { try { await api('testers', { method: 'PATCH', body: JSON.stringify({ id: t.id, status: e.target.value }) }); reload() } catch (x: any) { setErr(x.message) } }}>
                        {TESTER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="p-2 text-xs">{new Date(t.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {visible.length === 0 && <tr><td colSpan={9} className="p-6 text-center text-[#6B5D4F]">No testers match.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'tests' && <TestsTab tests={tests} testers={testers} platforms={platforms} api={api} onChange={(m) => { flash(m); reload() }} onError={setErr} />}

      {tab === 'screeners' && <ScreenersTab screeners={screeners} tests={tests} api={api} onChange={(m) => { flash(m); reload() }} onError={setErr} onInvite={(ids) => { setSelected(new Set(ids)); setTab('testers') }} />}

      {tab === 'referrals' && <ReferralsTab data={refs} api={api} onChange={(m) => { flash(m); reload() }} onError={setErr} />}
      {tab === 'messages' && (
        <div className="bg-white border border-[#D4C5B0] rounded divide-y divide-[#F0E8DD]">
          {msgs.length === 0 && <div className="p-6 text-center text-[#6B5D4F] text-sm">No messages sent yet.</div>}
          {msgs.map((m) => (
            <div key={m.id} className="p-3 text-sm">
              <div className="flex justify-between text-xs text-[#6B5D4F]"><span>{m.channel.toUpperCase()} → {m.research_testers?.first_name} ({m.research_testers?.email})</span><span>{new Date(m.sent_at).toLocaleString()} · <span className={m.status === 'sent' ? 'text-green-700' : 'text-red-700'}>{m.status}{m.error ? `: ${m.error}` : ''}</span></span></div>
              {m.subject && <div className="font-semibold mt-1">{m.subject}</div>}
              <div className="whitespace-pre-wrap mt-1">{m.body}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Composer({ selected, tests, screeners, api, onDone }: { selected: string[]; tests: Test[]; screeners: Screener[]; api: (p: string, i?: RequestInit) => Promise<any>; onDone: (m: string) => void }) {
  const [channel, setChannel] = useState<'sms' | 'email'>('sms')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [testId, setTestId] = useState('')
  const [screenerId, setScreenerId] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const send = async () => {
    setBusy(true); setErr('')
    try {
      const r = await api('messages', { method: 'POST', body: JSON.stringify({ tester_ids: selected, channel, subject, body, test_id: testId || null, screener_id: screenerId || null }) })
      onDone(`${channel.toUpperCase()} sent to ${r.sent}${r.failed.length ? `, ${r.failed.length} failed (${r.failed.map((f: any) => f.reason).join('; ')})` : ''}`)
      setBody('')
    } catch (e: any) { setErr(e.message) } finally { setBusy(false) }
  }
  const invite = async () => {
    if (!testId) return setErr('Pick a test to invite to')
    setBusy(true); setErr('')
    try { const r = await api('assignments', { method: 'POST', body: JSON.stringify({ test_id: testId, tester_ids: selected }) }); onDone(`Invited ${r.invited} tester(s)`) } catch (e: any) { setErr(e.message) } finally { setBusy(false) }
  }

  return (
    <div className="mb-4 p-4 bg-white border border-[#2C2416] rounded">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="font-semibold text-sm">{selected.length} selected</span>
        <div className="flex rounded border border-[#D4C5B0] overflow-hidden text-sm">
          {(['sms', 'email'] as const).map((c) => <button key={c} onClick={() => setChannel(c)} className={`px-3 py-1 ${channel === c ? 'bg-[#2C2416] text-white' : ''}`}>{c.toUpperCase()}</button>)}
        </div>
        <select className="border border-[#D4C5B0] rounded px-2 py-1 text-sm" value={testId} onChange={(e) => setTestId(e.target.value)}>
          <option value="">No test linked</option>{tests.map((t) => <option key={t.id} value={t.id}>{t.title} ({t.status})</option>)}
        </select>
        <button className={btn2} disabled={busy || !testId} onClick={invite}>Invite selected to test</button>
        <select className="border border-[#D4C5B0] rounded px-2 py-1 text-sm" value={screenerId} onChange={(e) => setScreenerId(e.target.value)}>
          <option value="">No screener link</option>{screeners.filter((x) => x.status === 'open').map((x) => <option key={x.id} value={x.id}>Screener: {x.title}</option>)}
        </select>
      </div>
      {channel === 'email' && <input className={`${inp} mb-2`} placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />}
      <textarea className={`${inp} mb-2`} rows={channel === 'sms' ? 3 : 6} placeholder={channel === 'sms' ? 'Hey {{first_name}} — paid $100 study, 1 min to see if you qualify: {{screener_url}}' : 'Hi {{first_name}},\n\n…'} value={body} onChange={(e) => setBody(e.target.value)} />
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#6B5D4F]">Merge fields: {'{{first_name}} {{last_name}} {{email}} {{state}} {{test}} {{dashboard_url}} {{screener_url}}'}{channel === 'sms' && ` · ${body.length} chars`}</span>
        <button className={btn} disabled={busy || !body || (channel === 'email' && !subject)} onClick={send}>{busy ? 'Sending…' : `Send ${channel.toUpperCase()}`}</button>
      </div>
      {err && <p className="text-red-700 text-sm mt-2">{err}</p>}
    </div>
  )
}

function TestsTab({ tests, testers, platforms, api, onChange, onError }: { tests: Test[]; testers: Tester[]; platforms: Platform[]; api: (p: string, i?: RequestInit) => Promise<any>; onChange: (m: string) => void; onError: (m: string) => void }) {
  const [form, setForm] = useState({ title: '', platform_id: '', tier: 'standard', payout_dollars: '25', payout_max_dollars: '40', est_minutes: '25', description: '', instructions: '', status: 'recruiting', ends_at: '' })
  const applyTier = (key: string) => { const t = PAYOUT_TIERS.find((x) => x.key === key); if (t) setForm((f) => ({ ...f, tier: key, payout_dollars: String(t.pay), payout_max_dollars: String(t.max), est_minutes: String(t.minutes) })) }
  const [open, setOpen] = useState<string | null>(null)
  const byId = useMemo(() => Object.fromEntries(testers.map((t) => [t.id, t])), [testers])

  const create = async () => {
    if (!form.title) return onError('Title required')
    try { await api('tests', { method: 'POST', body: JSON.stringify({ ...form, ends_at: form.ends_at || null, platform_id: form.platform_id || null }) }); setForm({ ...form, title: '', description: '', instructions: '' }); onChange('Test created') } catch (e: any) { onError(e.message) }
  }
  const patchTest = async (id: string, patch: any) => { try { await api('tests', { method: 'PATCH', body: JSON.stringify({ id, ...patch }) }); onChange('Updated') } catch (e: any) { onError(e.message) } }
  const patchAssign = async (id: string, status: string, test?: Test) => {
    const body: any = { id, status }
    if (status === 'paid' && test) {
      const def = (test.payout_cents / 100).toFixed(0)
      const v = window.prompt(`Amount paid ($${def}${test.payout_max_cents ? `–$${(test.payout_max_cents / 100).toFixed(0)}` : ''})`, def)
      if (v === null) return
      body.paid_cents = Math.round(Number(v) * 100)
    }
    try { await api('assignments', { method: 'PATCH', body: JSON.stringify(body) }); onChange('Assignment updated') } catch (e: any) { onError(e.message) }
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white border border-[#D4C5B0] rounded p-4 space-y-2 h-fit">
        <h2 className="font-semibold">New test</h2>
        <input className={inp} placeholder="Title (e.g. FanDuel deposit + cash-out, NJ)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <select className={inp} value={form.platform_id} onChange={(e) => setForm({ ...form, platform_id: e.target.value })}><option value="">Platform…</option>{platforms.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        <div className="flex flex-wrap gap-1">
          {PAYOUT_TIERS.map((t) => <button key={t.key} type="button" onClick={() => applyTier(t.key)} className={`px-2 py-1 rounded text-xs border ${form.tier === t.key ? 'bg-[#2C2416] text-white border-[#2C2416]' : 'border-[#D4C5B0]'}`}>{t.label} ${t.pay}{t.max > t.pay ? `–${t.max}` : ''}</button>)}
        </div>
        <div className="flex gap-2">
          <input className={inp} type="number" min={10} max={100} placeholder="Min $" value={form.payout_dollars} onChange={(e) => setForm({ ...form, payout_dollars: e.target.value })} />
          <input className={inp} type="number" min={10} max={100} placeholder="Max $" value={form.payout_max_dollars} onChange={(e) => setForm({ ...form, payout_max_dollars: e.target.value })} />
          <input className={inp} type="number" placeholder="Min" title="Estimated minutes" value={form.est_minutes} onChange={(e) => setForm({ ...form, est_minutes: e.target.value })} />
        </div>
        <div className="flex gap-2">
          <select className={inp} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>{TEST_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
        </div>
        <input className={inp} type="date" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} />
        <textarea className={inp} rows={2} placeholder="Short description (testers see this)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <textarea className={inp} rows={4} placeholder="Instructions (shown once they accept)" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} />
        <button className={btn} onClick={create}>Create test</button>
      </div>

      <div className="md:col-span-2 space-y-3">
        {tests.length === 0 && <div className="text-sm text-[#6B5D4F]">No tests yet.</div>}
        {tests.map((t) => {
          const a = t.research_assignments
          const n = (s: string) => a.filter((x) => x.status === s).length
          return (
            <div key={t.id} className="bg-white border border-[#D4C5B0] rounded p-4">
              <div className="flex justify-between items-start gap-3">
                <div>
                  <div className="font-semibold">{t.title}</div>
                  <div className="text-xs text-[#6B5D4F]">{t.research_platforms?.name || 'No platform'} · {t.tier} · ${(t.payout_cents / 100).toFixed(0)}{t.payout_max_cents && t.payout_max_cents > t.payout_cents ? `–$${(t.payout_max_cents / 100).toFixed(0)}` : ''}{t.est_minutes ? ` · ~${t.est_minutes} min` : ''} · {a.length} assigned · {n('submitted')} to review · {n('paid')} paid{t.ends_at ? ` · due ${new Date(t.ends_at).toLocaleDateString()}` : ''}</div>
                </div>
                <div className="flex gap-2 items-center">
                  <select className="border border-[#D4C5B0] rounded px-1 py-0.5 text-xs" value={t.status} onChange={(e) => patchTest(t.id, { status: e.target.value })}>{TEST_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                  <button className={btn2} onClick={() => setOpen(open === t.id ? null : t.id)}>{open === t.id ? 'Hide' : 'Testers'}</button>
                </div>
              </div>
              {open === t.id && (
                <div className="mt-3 border-t border-[#F0E8DD] pt-3 space-y-1">
                  {a.length === 0 && <div className="text-xs text-[#6B5D4F]">Nobody assigned. Select testers on the Testers tab and use “Invite selected to test”.</div>}
                  {a.map((x) => {
                    const tt = byId[x.tester_id]
                    return (
                      <div key={x.id} className="flex justify-between items-center text-sm">
                        <span>{tt ? `${tt.first_name} ${tt.last_name || ''} · ${tt.state} · ${tt.email}` : x.tester_id}{tt?.payout_method ? <span className="text-xs text-[#6B5D4F]"> · {tt.payout_method} {tt.payout_handle}</span> : <span className="text-xs text-red-700"> · no payout method</span>}{x.status === 'paid' && x.paid_cents != null && <span className="text-xs text-green-700"> · paid ${(x.paid_cents / 100).toFixed(0)}</span>}</span>
                        <select className="border border-[#D4C5B0] rounded px-1 py-0.5 text-xs" value={x.status} onChange={(e) => patchAssign(x.id, e.target.value, t)}>{ASSIGN_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ScreenersTab({ screeners, tests, api, onChange, onError, onInvite }: { screeners: Screener[]; tests: Test[]; api: (p: string, i?: RequestInit) => Promise<any>; onChange: (m: string) => void; onError: (m: string) => void; onInvite: (testerIds: string[]) => void }) {
  const [slug, setSlug] = useState('betting-hero-apps'); const [testId, setTestId] = useState(''); const [open, setOpen] = useState<string | null>(null)
  const [editing, setEditing] = useState<Screener | null>(null); const [json, setJson] = useState('')
  const site = typeof window !== 'undefined' ? window.location.origin : ''

  const createTemplate = async () => {
    try { await api('screeners', { method: 'POST', body: JSON.stringify({ template: 'betting_hero', slug, test_id: testId || null }) }); onChange('Screener created from Betting Hero template') } catch (e: any) { onError(e.message) }
  }
  const startEdit = (sc: Screener) => { setEditing(sc); setJson(JSON.stringify({ title: sc.title, intro: sc.intro, questions: sc.questions }, null, 2)) }
  const saveEdit = async () => {
    if (!editing) return
    try { const p = JSON.parse(json); await api('screeners', { method: 'PATCH', body: JSON.stringify({ id: editing.id, ...p }) }); setEditing(null); onChange('Screener saved') } catch (e: any) { onError(e.message) }
  }
  const setStatus = async (id: string, status: string) => { try { await api('screeners', { method: 'PATCH', body: JSON.stringify({ id, status }) }); onChange('Updated') } catch (e: any) { onError(e.message) } }

  return (
    <div className="space-y-4">
      <div className="bg-white border border-[#D4C5B0] rounded p-4 flex flex-wrap gap-2 items-end">
        <div><div className="text-xs mb-1">New screener from template</div><input className={inp} value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="slug (url)" /></div>
        <select className={inp + ' w-auto'} value={testId} onChange={(e) => setTestId(e.target.value)}><option value="">Auto-assign qualified to test… (optional)</option>{tests.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}</select>
        <button className={btn} onClick={createTemplate}>Create Betting Hero–style screener</button>
        <span className="text-xs text-[#6B5D4F]">9 questions: availability → state → name → category use → app inventory (exclusive “none”) → casino/sports mix → payout platform → deposit consent. Edit the JSON after.</span>
      </div>

      {editing && (
        <div className="bg-white border border-[#2C2416] rounded p-4 space-y-2">
          <div className="font-semibold text-sm">Editing /research/s/{editing.slug}</div>
          <textarea className={`${inp} font-mono text-xs`} rows={22} value={json} onChange={(e) => setJson(e.target.value)} />
          <div className="text-xs text-[#6B5D4F]">Question fields: id, type (single|multi|text|yesno), prompt, options[], exclusive, required, disqualify[], maps_to (state|first_name|last_name|platforms|phone)</div>
          <div className="flex gap-2"><button className={btn} onClick={saveEdit}>Save</button><button className={btn2} onClick={() => setEditing(null)}>Cancel</button></div>
        </div>
      )}

      {screeners.map((sc) => {
        const r = sc.research_screener_responses; const q = r.filter((x) => x.qualified)
        const dqBy: Record<string, number> = {}; r.filter((x) => !x.qualified).forEach((x) => { dqBy[x.disqualified_by || '?'] = (dqBy[x.disqualified_by || '?'] || 0) + 1 })
        return (
          <div key={sc.id} className="bg-white border border-[#D4C5B0] rounded p-4">
            <div className="flex justify-between items-start gap-3 flex-wrap">
              <div>
                <div className="font-semibold">{sc.title} <span className="text-xs font-normal text-[#6B5D4F]">/research/s/{sc.slug}</span></div>
                <div className="text-xs text-[#6B5D4F]">{sc.questions.length} questions · {r.length} responses · {q.length} qualified{Object.keys(dqBy).length ? ` · out at: ${Object.entries(dqBy).map(([k, n]) => `${k} (${n})`).join(', ')}` : ''}{sc.research_tests ? ` · auto-assigns to “${sc.research_tests.title}”` : ''}</div>
                <div className="text-xs text-[#6B5D4F] mt-1">Open link: <span className="font-mono">{site}/research/s/{sc.slug}</span> · per-tester links via <span className="font-mono">{'{{screener_url}}'}</span> in the composer</div>
              </div>
              <div className="flex gap-2 items-center">
                <select className="border border-[#D4C5B0] rounded px-1 py-0.5 text-xs" value={sc.status} onChange={(e) => setStatus(sc.id, e.target.value)}>{['draft', 'open', 'closed'].map((x) => <option key={x}>{x}</option>)}</select>
                <button className={btn2} onClick={() => startEdit(sc)}>Edit</button>
                <button className={btn2} onClick={() => setOpen(open === sc.id ? null : sc.id)}>{open === sc.id ? 'Hide' : 'Responses'}</button>
                {q.length > 0 && <button className={btn} onClick={() => onInvite(q.map((x) => x.tester_id).filter(Boolean) as string[])}>Select {q.length} qualified →</button>}
              </div>
            </div>
            {open === sc.id && (
              <div className="mt-3 border-t border-[#F0E8DD] pt-3 overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="text-left text-[#6B5D4F]"><tr><th className="p-1">Who</th><th className="p-1">Result</th>{sc.questions.map((qq: any) => <th key={qq.id} className="p-1">{qq.id}</th>)}<th className="p-1">When</th></tr></thead>
                  <tbody>{r.map((x) => (
                    <tr key={x.id} className="border-t border-[#F0E8DD] align-top">
                      <td className="p-1 whitespace-nowrap">{x.full_name || '—'}<br /><span className="text-[#6B5D4F]">{x.email}</span></td>
                      <td className="p-1">{x.qualified ? <span className="text-green-700">qualified</span> : <span className="text-red-700">out: {x.disqualified_by}</span>}</td>
                      {sc.questions.map((qq: any) => <td key={qq.id} className="p-1 max-w-[160px]">{Array.isArray(x.answers[qq.id]) ? x.answers[qq.id].join(', ') : x.answers[qq.id] ?? ''}</td>)}
                      <td className="p-1 whitespace-nowrap">{new Date(x.created_at).toLocaleDateString()}</td>
                    </tr>))}
                    {r.length === 0 && <tr><td colSpan={3 + sc.questions.length} className="p-3 text-center text-[#6B5D4F]">No responses yet.</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function ReferralsTab({ data, api, onChange, onError }: { data: { stats: RefStat[]; recent: RefEvent[]; unknown: { code: string; n: number }[] }; api: (p: string, i?: RequestInit) => Promise<any>; onChange: (m: string) => void; onError: (m: string) => void }) {
  const [f, setF] = useState({ code: '', owner_name: '', owner_email: '', owner_type: 'chapter', notes: '' })
  const inp = 'border border-[#D4C5B0] rounded px-2 py-1.5 text-sm bg-white'
  const btn = 'px-3 py-1.5 rounded bg-[#2C2416] text-white text-sm'
  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    try { await api('referrals', { method: 'POST', body: JSON.stringify(f) }); setF({ code: '', owner_name: '', owner_email: '', owner_type: 'chapter', notes: '' }); onChange(`Code ${f.code.toUpperCase()} registered`) } catch (e: any) { onError(e.message) }
  }
  const toggle = async (code: string, active: boolean) => { try { await api('referrals', { method: 'PATCH', body: JSON.stringify({ code, active }) }); onChange(active ? 'Activated' : 'Deactivated') } catch (e: any) { onError(e.message) } }
  const link = (code: string) => `https://hedgepayments.com/research?ref=${code}`
  return (
    <div className="space-y-8">
      <form onSubmit={create} className="grid grid-cols-2 md:grid-cols-6 gap-2 items-end">
        <label className="text-xs">Code<input className={`${inp} w-full`} required value={f.code} onChange={(e) => setF({ ...f, code: e.target.value.toUpperCase() })} placeholder="SIGMACHI-PSU" /></label>
        <label className="text-xs">Owner<input className={`${inp} w-full`} required value={f.owner_name} onChange={(e) => setF({ ...f, owner_name: e.target.value })} placeholder="Sigma Chi · Penn State" /></label>
        <label className="text-xs">Owner email<input className={`${inp} w-full`} type="email" value={f.owner_email} onChange={(e) => setF({ ...f, owner_email: e.target.value })} /></label>
        <label className="text-xs">Type<select className={`${inp} w-full`} value={f.owner_type} onChange={(e) => setF({ ...f, owner_type: e.target.value })}>{['chapter', 'ambassador', 'partner', 'campaign', 'tester'].map((x) => <option key={x}>{x}</option>)}</select></label>
        <label className="text-xs">Notes<input className={`${inp} w-full`} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} /></label>
        <button className={btn}>Register code</button>
      </form>

      {data.unknown.length > 0 && (
        <div className="p-3 rounded bg-amber-50 text-amber-900 text-sm">
          <b>Unregistered codes used recently:</b> {data.unknown.map((u) => `${u.code} (${u.n})`).join(', ')} — register them above to start attributing.
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-[#6B5D4F]"><tr><th className="py-2">Code</th><th>Owner</th><th>Type</th><th className="text-right">Subscribes</th><th className="text-right">Applies</th><th className="text-right">Total</th><th>Last</th><th>Link</th><th></th></tr></thead>
          <tbody>
            {data.stats.map((r) => (
              <tr key={r.code} className={`border-t border-[#EADFCB] ${r.active ? '' : 'opacity-50'}`}>
                <td className="py-2 font-mono">{r.code}</td>
                <td>{r.owner_name}{r.owner_email ? <div className="text-xs text-[#6B5D4F]">{r.owner_email}</div> : null}</td>
                <td>{r.owner_type}</td>
                <td className="text-right">{r.subscribes}</td>
                <td className="text-right">{r.applies}</td>
                <td className="text-right font-semibold">{r.total}</td>
                <td className="text-xs">{r.last_referral_at ? new Date(r.last_referral_at).toLocaleDateString() : '—'}</td>
                <td><button type="button" className="text-xs underline" onClick={() => navigator.clipboard.writeText(link(r.code))}>copy</button></td>
                <td><button type="button" className="text-xs underline" onClick={() => toggle(r.code, !r.active)}>{r.active ? 'deactivate' : 'activate'}</button></td>
              </tr>
            ))}
            {data.stats.length === 0 && <tr><td colSpan={9} className="py-6 text-center text-[#6B5D4F]">No referral codes yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <div>
        <h3 className="font-semibold mb-2">Recent referrals</h3>
        <ul className="text-sm space-y-1">
          {data.recent.slice(0, 30).map((e) => (
            <li key={e.id} className="flex gap-3"><span className="text-xs text-[#6B5D4F] w-28">{new Date(e.created_at).toLocaleString()}</span><span className="font-mono">{e.code}</span><span>{e.event}</span><span className="text-[#6B5D4F]">{e.referred_email}</span>{!e.code_known && <span className="text-amber-700 text-xs">unregistered</span>}</li>
          ))}
          {data.recent.length === 0 && <li className="text-[#6B5D4F]">None yet.</li>}
        </ul>
      </div>
    </div>
  )
}
