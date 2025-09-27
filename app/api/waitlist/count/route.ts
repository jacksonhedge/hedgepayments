import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    // Check if Supabase is configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

    // Return default count if Supabase is not configured (during build)
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ count: 0 });
    }

    // Initialize Supabase client only if credentials are available
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { count, error } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Error getting waitlist count:', error);
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error) {
    console.error('Error getting waitlist count:', error);
    return NextResponse.json({ count: 0 });
  }
}