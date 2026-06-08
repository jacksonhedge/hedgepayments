export interface FlowCtx {
  token: string
  config: Record<string, unknown>
  emit: (name: string, extra?: Record<string, unknown>) => void
  success: (result: unknown) => void
  exit: (error?: any) => void
}

/** Each product flow implements mountFlow(root, ctx). Slice 0 ships this stub. */
export function mountHello(root: HTMLElement, ctx: FlowCtx): void {
  ctx.emit('TRANSITION_VIEW', { view: 'hello' })
  root.innerHTML =
    '<div style="padding:28px;text-align:center;font-family:system-ui">' +
    '<h2 style="margin:0 0 8px">Hedge Link</h2>' +
    '<p style="color:#667;margin:0 0 20px">Slice 0 shell — confirm to finish.</p>' +
    '<button data-act="confirm" style="padding:12px 20px;border:0;border-radius:10px;background:#0e9f6e;color:#fff;font-weight:700;cursor:pointer">Confirm →</button>' +
    '</div>'
  const btn = root.querySelector('button[data-act="confirm"]') as HTMLButtonElement
  btn.addEventListener('click', () => ctx.success({ flow: 'hello', confirmed: true }))
}
