import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Browser-safe Supabase client — anon key only, never the service role.
//
// Built lazily on first property access: an eager createClient('', '') throws
// "supabaseUrl is required" during `next build` prerendering when the env
// vars aren't set (as on Vercel), which fails the entire deploy.
let client: SupabaseClient | null = null

function getClient(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
    )
  }
  return client
}

export const supabaseBrowser: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const real = getClient() as unknown as Record<string | symbol, unknown>
    const value = real[prop]
    return typeof value === 'function' ? (value as Function).bind(real) : value
  },
})
