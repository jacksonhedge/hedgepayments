import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// For client components
export function createClientComponentClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Fail closed in production: missing auth config must not silently produce a
    // client that looks valid. In dev/preview we allow a non-functional placeholder
    // so the marketing build can render without secrets.
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Supabase env vars are missing in production (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).'
      )
    }
    console.warn(
      '[supabase] Missing env vars — using a non-functional placeholder client (dev/preview only).'
    )
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key')
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
