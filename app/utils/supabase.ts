import { createClient } from '@supabase/supabase-js'

// Create clients only when needed and credentials are available
function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return null
  }

  return createClient(supabaseUrl, supabaseServiceKey)
}

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

// Export getter functions instead of initialized clients
export const supabaseAdmin = getSupabaseAdmin()
export const supabase = getSupabaseClient()

// Helper function to add a subscriber to the database
export async function addSubscriber(email: string, name: string) {
  try {
    // Check if Supabase is available
    if (!supabaseAdmin) {
      console.log('Supabase not configured, skipping database insertion')
      return { success: false, error: 'Supabase not configured' }
    }

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

// Helper function to add a deck viewer to the database
export async function addDeckViewer(email: string) {
  try {
    // Check if Supabase is available
    if (!supabaseAdmin) {
      console.log('Supabase not configured, skipping deck viewer insertion')
      return { success: false, error: 'Supabase not configured' }
    }

    console.log('Adding deck viewer to Supabase:', email)

    // Use the admin client to bypass RLS policies
    const { data, error } = await supabaseAdmin
      .from('deck_viewers')
      .insert([
        { email, viewed_at: new Date().toISOString() }
      ])
      .select()

    if (error) {
      // If duplicate email, just update the viewed_at timestamp
      if (error.code === '23505') {
        const { data: updateData, error: updateError } = await supabaseAdmin
          .from('deck_viewers')
          .update({ viewed_at: new Date().toISOString(), view_count: supabaseAdmin.rpc('increment_view_count') })
          .eq('email', email)
          .select()

        if (updateError) throw updateError
        return { success: true, data: updateData, isRepeatViewer: true }
      }
      throw error
    }

    return { success: true, data, isRepeatViewer: false }
  } catch (error) {
    console.error('Error adding deck viewer to Supabase:', error)
    return { success: false, error }
  }
}

// Helper function to get all deck viewers
export async function getDeckViewers() {
  try {
    if (!supabaseAdmin) {
      return { success: false, error: 'Supabase not configured', data: [] }
    }

    const { data, error } = await supabaseAdmin
      .from('deck_viewers')
      .select('*')
      .order('viewed_at', { ascending: false })

    if (error) throw error

    return { success: true, data }
  } catch (error) {
    console.error('Error fetching deck viewers:', error)
    return { success: false, error, data: [] }
  }
} 