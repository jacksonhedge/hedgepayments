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

    // Generate a referral code for this user upfront
    const userReferralCode = generateReferralCode(email);
    
    try {
      // First, try to see if the email already exists
      const { data: existingUser, error: queryError } = await supabase
        .from('waitlist')
        .select('id, own_referral_code')
        .eq('email', email)
        .single();

      if (existingUser) {
        console.log('Updating existing user:', existingUser);
        // Update existing record
        const { error: updateError } = await supabase
          .from('waitlist')
          .update({ 
            sportsbooks,
            referral_code: referralCode || null,
            own_referral_code: existingUser.own_referral_code || userReferralCode,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingUser.id);

        if (updateError) {
          console.error('Error updating waitlist record:', updateError);
          throw updateError;
        }
        
        return NextResponse.json({ 
          success: true, 
          referralCode: existingUser.own_referral_code || userReferralCode 
        });
      }
    } catch (err: any) {
      // If the error is because the user doesn't exist, that's fine
      // We'll create a new user below
      console.log('User lookup error (probably new user):', err);
    }
    
    // Create new waitlist record
    console.log('Creating new waitlist entry for:', email);
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
      throw insertError;
    }

    // Return success with the user's own referral code
    return NextResponse.json({ 
      success: true, 
      referralCode: userReferralCode 
    });
  } catch (error: any) {
    console.error('Error processing waitlist request:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error?.message || 'Unknown error',
        code: error?.code
      },
      { status: 500 }
    );
  }
} 