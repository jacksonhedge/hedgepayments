'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'

// Hedge Research admin: testers, tests, assignments, and outbound SMS/email.
// Auth = ADMIN_SECRET bearer (same as /api/admin/send-email), kept in sessionStorage (cleared when the tab closes).

type Tester = { id: string; email: string; phone: string | null; first_name: string; last_name: string | null; age_bucket: string; state: string; platforms: string[]; verticals: string[]; status: string; sms_opt_in: boolean; email_opt_in: boolean; notes: string | null; created_at: string; research_assignments: { id: string; status: string; test_id: string }[]; research_messages: { id: string; channel: string; sent_at: string }[] }
type Test = { id: string; title: string; platform_id: string | null; description: string | null; instructions: string | null; payout_cents: number; status: string; starts_at: string | null; ends_at: string | null; research_platforms: { name: string } | null; research_assignments: { id: string; status: string; tester_id: string }[] }
type Platform = { id: string; slug: string; name: string; kind: string }
type Msg = { id: string; channel: string; subject: string | null; body: string; status: string; error: string | null; sent_at: string; research_testers: { first_name: string; email: string } | null }

const TESTER_STATUSES = ['applied', 'approved', 'active', 'paused', 'rejected']
const ASSIGN_STATUSES = ['invited', 'accepted', 'in_progress', 'submitted', 'approved', 'paid', 'declined']
const TEST_STATUSES = ['draft', 'recruiting', 'live', 'closed']

const inp = 'w-full border border-[#D4C5B0] rounded px-3 py-2 text-sm bg-white'
const btn = 'px-3 py-1.5 rounded text-sm bg-[#2C2416] text-[#FAF8F5] hover:bg-[#3D3024] disabled:opacity-50'
const btn2 = 'px-3 py-1.5 rounded text-sm border border-[#D4C5B0] text-[#2C2416] hover:bg-[#FAF8F5] disabled:opacity-50'

export default function ResearchAdmin() {
  const [secret, setSecret] = useState('')
  const [tab, setTab] = useState<'testers' | 'tests' | 'messages'>('testers')
  const [testers, setTesters] = useState<Tester[]>([])
  const [tests, setTests] = useState<Test[]>([])
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [msgs, setMsgs] = useState<Msg[]>([])
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
      const [t, x, m] = await Promise.all([api('testers'), api('tests'), api('messages')])
      setTesters(t.testers); setTests(x.tests); setPlatforms(x.platforms); setMsgs(m.messages)
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
        {(['testers', 'tests', 'messages'] as const).map((k) => (
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

          {selected.size > 0 && <Composer selected={Array.from(selected)} tests={tests} api={api} onDone={(m) => { flash(m); setSelected(new Set()); reload() }} />}

          <div className="overflow-x-auto bg-white border border-[#D4C5B0] rounded">
            <table className="w-full text-sm">
              <thead className="bg-[#FAF8F5] text-left">
                <tr>
                  <th className="p-2"><input type="checkbox" checked={visible.length > 0 && selected.size === visible.length} onChange={toggleAll} /></th>
                  <th className="p-2">Tester</th><th className="p-2">Contact</th><th className="p-2">State / Age</th><th className="p-2">Platforms</th><th className="p-2">Tests</th><th className="p-2">Status</th><th className="p-2">Joined</th>
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
                    <td className="p-2 text-xs">{t.research_assignments.length ? ASSIGN_STATUSES.map((s) => { const n = t.research_assignments.filter((a) => a.status === s).length; return n ? `${n} ${s}` : null }).filter(Boolean).join(', ') : '—'}<div className="text-[#9a8b7a]">{t.research_messages.length} msgs</div></td>
                    <td className="p-2">
                      <select className="border border-[#D4C5B0] rounded px-1 py-0.5 text-xs" value={t.status} onChange={async (e) => { try { await api('testers', { method: 'PATCH', body: JSON.stringify({ id: t.id, status: e.target.value }) }); reload() } catch (x: any) { setErr(x.message) } }}>
                        {TESTER_STATUSES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="p-2 text-xs">{new Date(t.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
                {visible.length === 0 && <tr><td colSpan={8} className="p-6 text-center text-[#6B5D4F]">No testers match.</td></tr>}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'tests' && <TestsTab tests={tests} testers={testers} platforms={platforms} api={api} onChange={(m) => { flash(m); reload() }} onError={setErr} />}

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

function Composer({ selected, tests, api, onDone }: { selected: string[]; tests: Test[]; api: (p: string, i?: RequestInit) => Promise<any>; onDone: (m: string) => void }) {
  const [channel, setChannel] = useState<'sms' | 'email'>('sms')
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [testId, setTestId] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const send = async () => {
    setBusy(true); setErr('')
    try {
      const r = await api('messages', { method: 'POST', body: JSON.stringify({ tester_ids: selected, channel, subject, body, test_id: testId || null }) })
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
      </div>
      {channel === 'email' && <input className={`${inp} mb-2`} placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} />}
      <textarea className={`${inp} mb-2`} rows={channel === 'sms' ? 3 : 6} placeholder={channel === 'sms' ? 'Hey {{first_name}} — a paid {{test}} test is ready. Details: {{dashboard_url}}' : 'Hi {{first_name}},\n\n…'} value={body} onChange={(e) => setBody(e.target.value)} />
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#6B5D4F]">Merge fields: {'{{first_name}} {{last_name}} {{email}} {{state}} {{test}} {{dashboard_url}}'}{channel === 'sms' && ` · ${body.length} chars`}</span>
        <button className={btn} disabled={busy || !body || (channel === 'email' && !subject)} onClick={send}>{busy ? 'Sending…' : `Send ${channel.toUpperCase()}`}</button>
      </div>
      {err && <p className="text-red-700 text-sm mt-2">{err}</p>}
    </div>
  )
}

function TestsTab({ tests, testers, platforms, api, onChange, onError }: { tests: Test[]; testers: Tester[]; platforms: Platform[]; api: (p: string, i?: RequestInit) => Promise<any>; onChange: (m: string) => void; onError: (m: string) => void }) {
  const [form, setForm] = useState({ title: '', platform_id: '', payout_dollars: '25', description: '', instructions: '', status: 'recruiting', ends_at: '' })
  const [open, setOpen] = useState<string | null>(null)
  const byId = useMemo(() => Object.fromEntries(testers.map((t) => [t.id, t])), [testers])

  const create = async () => {
    if (!form.title) return onError('Title required')
    try { await api('tests', { method: 'POST', body: JSON.stringify({ ...form, ends_at: form.ends_at || null, platform_id: form.platform_id || null }) }); setForm({ ...form, title: '', description: '', instructions: '' }); onChange('Test created') } catch (e: any) { onError(e.message) }
  }
  const patchTest = async (id: string, patch: any) => { try { await api('tests', { method: 'PATCH', body: JSON.stringify({ id, ...patch }) }); onChange('Updated') } catch (e: any) { onError(e.message) } }
  const patchAssign = async (id: string, status: string) => { try { await api('assignments', { method: 'PATCH', body: JSON.stringify({ id, status }) }); onChange('Assignment updated') } catch (e: any) { onError(e.message) } }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="bg-white border border-[#D4C5B0] rounded p-4 space-y-2 h-fit">
        <h2 className="font-semibold">New test</h2>
        <input className={inp} placeholder="Title (e.g. FanDuel deposit + cash-out, NJ)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <select className={inp} value={form.platform_id} onChange={(e) => setForm({ ...form, platform_id: e.target.value })}><option value="">Platform…</option>{platforms.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
        <div className="flex gap-2">
          <input className={inp} type="number" placeholder="Payout $" value={form.payout_dollars} onChange={(e) => setForm({ ...form, payout_dollars: e.target.value })} />
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
                  <div className="text-xs text-[#6B5D4F]">{t.research_platforms?.name || 'No platform'} · ${(t.payout_cents / 100).toFixed(0)} · {a.length} assigned · {n('submitted')} to review · {n('paid')} paid{t.ends_at ? ` · due ${new Date(t.ends_at).toLocaleDateString()}` : ''}</div>
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
                        <span>{tt ? `${tt.first_name} ${tt.last_name || ''} · ${tt.state} · ${tt.email}` : x.tester_id}</span>
                        <select className="border border-[#D4C5B0] rounded px-1 py-0.5 text-xs" value={x.status} onChange={(e) => patchAssign(x.id, e.target.value)}>{ASSIGN_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
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
