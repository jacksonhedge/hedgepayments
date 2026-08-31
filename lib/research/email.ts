// Branded HTML email for Hedge Research. Table-based, inline styles, light theme
// (dark-mode-safe colors), 600px max, PNG logo (email clients block SVG).
const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://hedgepayments.com'
const GREEN = '#1EB05A'
const INK = '#0b0b0c'
const MUTED = '#6b6b70'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// Plain text → paragraphs. Blank line = new paragraph; single newline = <br>.
function paragraphs(text: string) {
  return text.trim().split(/\n\s*\n/).map((p) =>
    `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${INK};">${esc(p).replace(/\n/g, '<br/>')}</p>`).join('')
}

export type ResearchEmailOpts = {
  body: string
  preheader?: string
  cta?: { label: string; url: string } | null
  eyebrow?: string          // e.g. "Paid study · $100"
  footerNote?: string
  code?: string             // one-time verification code, shown in a box above the CTA
}

export function renderResearchEmail(o: ResearchEmailOpts): string {
  const cta = o.cta && o.cta.url && o.cta.label
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:8px 0 24px;"><tr><td style="border-radius:10px;background:${GREEN};">
         <a href="${esc(o.cta.url)}" style="display:inline-block;padding:14px 26px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;border-radius:10px;font-family:Helvetica,Arial,sans-serif;">${esc(o.cta.label)} &rarr;</a>
       </td></tr></table>
       <p style="margin:0 0 20px;font-size:12px;line-height:1.5;color:${MUTED};">Button not working? Copy this link: <a href="${esc(o.cta.url)}" style="color:${GREEN};word-break:break-all;">${esc(o.cta.url)}</a></p>`
    : ''
  const code = o.code
    ? `<table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin:4px 0 24px;"><tr><td style="background:#f3f9f5;border:1px solid #cfe8d8;border-radius:10px;padding:14px 26px;">
         <span style="font-family:'Courier New',Courier,monospace;font-size:26px;font-weight:700;letter-spacing:0.3em;color:${INK};">${esc(o.code)}</span>
       </td></tr></table>`
    : ''
  return `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>Hedge Research</title></head>
<body style="margin:0;padding:0;background:#f3f3f4;font-family:Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">
${o.preheader ? `<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(o.preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>` : ''}
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f3f3f4;"><tr><td align="center" style="padding:32px 16px;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:600px;">
    <tr><td style="padding:0 8px 18px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0"><tr>
        <td style="padding-right:10px;"><img src="${SITE}/email/hedge-mark.png" width="42" height="24" alt="" style="display:block;border:0;"></td>
        <td style="font-size:14px;font-weight:700;letter-spacing:0.12em;color:${INK};">HEDGE <span style="color:${GREEN};font-weight:500;letter-spacing:0.06em;">Research</span></td>
      </tr></table>
    </td></tr>
    <tr><td style="background:#ffffff;border:1px solid #e6e6e9;border-radius:16px;padding:36px 36px 24px;">
      ${o.eyebrow ? `<p style="margin:0 0 14px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${GREEN};font-weight:700;">${esc(o.eyebrow)}</p>` : ''}
      ${paragraphs(o.body)}
      ${code}
      ${cta}
    </td></tr>
    <tr><td style="padding:20px 8px 0;font-size:12px;line-height:1.6;color:${MUTED};">
      ${esc(o.footerNote || 'You\'re receiving this because you applied to test with Hedge Research. Every completed test pays $10–$100.')}<br/>
      <a href="${SITE}/research/dashboard" style="color:${MUTED};">Manage notifications</a> &nbsp;·&nbsp; <a href="${SITE}/research" style="color:${MUTED};">hedgepayments.com/research</a><br/>
      Hedge, Inc. · Pittsburgh, PA
    </td></tr>
  </table>
</td></tr></table>
</body></html>`
}
