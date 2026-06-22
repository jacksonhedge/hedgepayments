import { createClient } from '@supabase/supabase-js'

// Browser-safe Supabase client — anon key only, never the service role.
// Lazy singleton so module-level evaluation doesn't throw when env vars are absent (e.g. build time).
let _client: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowser() {
  if (!_client) {
    _client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
  }
  return _client
}

// Convenience alias for components that reference this directly.
export const supabaseBrowser: ReturnType<typeof createClient> = new Proxy({} as ReturnType<typeof createClient>, {
  get(_target, prop) {
    return (getSupabaseBrowser() as any)[prop]
  },
})
