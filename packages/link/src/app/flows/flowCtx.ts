export interface FlowCtx {
  token:   string
  product: string
  config:  Record<string, unknown>
  emit:    (name: string, extra?: Record<string, unknown>) => void
  success: (result: unknown) => void
  exit:    (error?: any) => void
  consume: (result: unknown) => Promise<void>
}
