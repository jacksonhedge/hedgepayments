import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Function to generate a unique referral code
function generateReferralCode(email: string): string {
  // Create a hash of the email + timestamp to ensure uniqueness
  const hash = crypto.createHash('md5').update(email + Date.now().toString()).digest('hex');
  // Return first 8 characters of the hash (or adjust length as needed)
  return hash.substring(0, 8).toUpperCase();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, referralCode, sportsbooks } = body;

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
      .select('id, own_referral_code')
      .eq('email', email)
      .maybeSingle();

    let userReferralCode;

    if (existingUser) {
      userReferralCode = existingUser.own_referral_code || generateReferralCode(email);
      
      // Update existing record with new preferences
      const { error: updateError } = await supabase
        .from('waitlist')
        .update({ 
          sportsbooks,
          referral_code: referralCode || null,
          own_referral_code: userReferralCode,
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
      // Generate a unique referral code for this user
      userReferralCode = generateReferralCode(email);
      
      // Create new waitlist record
      const { error: insertError } = await supabase
        .from('waitlist')
        .insert({
          email,
          sportsbooks,
          referral_code: referralCode || null,
          own_referral_code: userReferralCode,
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

    // Return success with the user's own referral code
    return NextResponse.json({ 
      success: true, 
      referralCode: userReferralCode 
    });
  } catch (error) {
    console.error('Error processing waitlist request:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 