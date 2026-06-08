import { createClient } from '@supabase/supabase-js'

// Browser-safe Supabase client — anon key only, never the service role.
export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)
