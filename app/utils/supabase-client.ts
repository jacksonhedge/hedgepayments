import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// For client components
export function createClientComponentClient() {
  // During build time, env vars may not be available
  // Return a placeholder that will be properly initialized at runtime
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client during build that won't be used
    return createBrowserClient('https://placeholder.supabase.co', 'placeholder-key')
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}
