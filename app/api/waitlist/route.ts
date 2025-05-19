import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, sportsbooks } = body;

    // Basic validation
    if (!email || !sportsbooks || !Array.isArray(sportsbooks) || sportsbooks.length === 0) {
      return NextResponse.json(
        { error: 'Email and at least one sportsbook selection are required' },
        { status: 400 }
      );
    }

    // Check if email already exists in waitlist
    const { data: existingUser } = await supabase
      .from('waitlist')
      .select('id')
      .eq('email', email)
      .maybeSingle();

    if (existingUser) {
      // Update existing record with new preferences
      const { error: updateError } = await supabase
        .from('waitlist')
        .update({ 
          sportsbooks,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingUser.id);

      if (updateError) {
        console.error('Error updating waitlist record:', updateError);
        return NextResponse.json(
          { error: 'Failed to update waitlist preferences' },
          { status: 500 }
        );
      }
    } else {
      // Create new waitlist record
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert({
          email,
          sportsbooks,
          created_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('Error creating waitlist record:', insertError);
        return NextResponse.json(
          { error: 'Failed to join waitlist' },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing waitlist request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 