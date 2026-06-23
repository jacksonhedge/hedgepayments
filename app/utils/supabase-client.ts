import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// For client components
export function createClientComponentClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // Fail closed at runtime in the browser: in production a real client session
    // must not be faked. During static-export prerender (no window) we must NOT
    // throw, or the build fails — return a non-functional placeholder instead.
    if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
      throw new Error(
        'Supabase env vars are missing in production (NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY).'
      )
    }
    if (typeof window !== 'undefined') {
      console.warn(
        '[supabase] Missing env vars — using a non-functional placeholder client (dev/preview only).'
      )
    }
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key')
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
