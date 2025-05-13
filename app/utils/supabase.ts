import { createClient } from '@supabase/supabase-js'

// Create a single supabase client for the entire app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Use service role for server-side operations to bypass RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Regular client for client-side operations
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Helper function to add a subscriber to the database
export async function addSubscriber(email: string, name: string) {
  try {
    console.log('Adding subscriber to Supabase using service role key')
    
    // Use the admin client to bypass RLS policies
    const { data, error } = await supabaseAdmin
      .from('subscribers')
      .insert([
        { email, name, subscribed_at: new Date().toISOString() }
      ])
      .select()
    
    if (error) throw error
    
    return { success: true, data }
  } catch (error) {
    console.error('Error adding subscriber to Supabase:', error)
    return { success: false, error }
  }
} 