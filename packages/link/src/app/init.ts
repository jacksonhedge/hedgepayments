import type { LinkSession } from './linkClient'

export interface InitDeps {
  exchange:   (token: string) => Promise<LinkSession>
  consumeFn:  (token: string, result: unknown) => Promise<void>
  mount:      (root: HTMLElement, ctx: any) => void
}
export interface InitBridge {
  emit:    (name: string, extra?: Record<string, unknown>) => void
  success: (result: unknown) => void
  exit:    (error?: any) => void
}

export async function handleInit(
  root: HTMLElement,
  init: { token: string },
  bridge: InitBridge,
  deps: InitDeps,
): Promise<void> {
  try {
    const session = await deps.exchange(init.token)
    bridge.emit('OPEN')
    deps.mount(root, {
      token:   init.token,
      product: session.product,
      config:  session.config,
      emit:    (n: string, x?: Record<string, unknown>) => bridge.emit(n, x),
      success: (r: unknown) => bridge.success(r),
      exit:    (e?: any) => bridge.exit(e),
      consume: (result: unknown) => deps.consumeFn(init.token, result),
    })
  } catch (e: any) {
    bridge.exit({
      error_type:    'LINK_ERROR',
      error_code:    (e && e.error_code) || 'INVALID_LINK_TOKEN',
      error_message: String((e && e.message) || e),
    })
  }
}
