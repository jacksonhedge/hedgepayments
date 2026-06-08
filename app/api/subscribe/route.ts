import { NextRequest, NextResponse } from 'next/server';
import { addSubscriber } from '../../utils/supabase';
import { notifySlack } from '@/lib/slack';

// ConvertKit credentials come from env. The form ID is public; the API key is a secret.
// NOTE: the previously hardcoded key (kit_672…) is in git history and MUST be rotated/revoked
// in the ConvertKit dashboard.
const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY || '';
const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID || '8047084';

export async function POST(req: NextRequest) {
  try {
    const { name, email, referralCode } = await req.json();

    if (!email || !name) {
      return NextResponse.json(
        { error: "Email and name are required" },
        { status: 400 }
      );
    }

    // First, save to Supabase
    const supabaseResult = await addSubscriber(email, name);
    
    if (!supabaseResult.success) {
      console.error('Error saving to Supabase:', supabaseResult.error);
      // Continue with ConvertKit anyway - we'll log the error but not fail the request
    } else {
      console.log('Successfully saved subscriber to Supabase:', supabaseResult.data);
      await notifySlack(`📧 New subscriber: ${name} <${email}>`);
    }

    // Split the name into first and last
    const nameParts = name.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    // If ConvertKit isn't configured, the Supabase save above is the source of truth — done.
    if (!CONVERTKIT_API_KEY) {
      const generatedRefCode = `${firstName.substring(0, 1)}${lastName ? lastName.substring(0, 1) : ''}${Math.floor(1000 + Math.random() * 9000)}`;
      return NextResponse.json({ success: supabaseResult.success, referralCode: generatedRefCode, supabase: supabaseResult.success, convertkit: false });
    }

    // Let's try a different approach - building the URL with query parameters
    // instead of using the JSON body as ConvertKit's API might be picky
    const url = new URL(`https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`);
    
    console.log('Submitting to ConvertKit with URL approach:', {
      url: url.toString(),
      formId: CONVERTKIT_FORM_ID,
      key: CONVERTKIT_API_KEY.substring(0, 10) + '...' // Log only part of the key for security
    });

    // ConvertKit API subscription
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: CONVERTKIT_API_KEY,
        email: email,
        first_name: firstName,
        fields: {
          last_name: lastName,
          referral_code: referralCode || ''
        }
      })
    });

    // Let's check if we have any response
    if (!response.ok) {
      console.error('ConvertKit API HTTP error:', response.status, response.statusText);
    }

    const responseText = await response.text();
    console.log('ConvertKit API raw response:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('ConvertKit API parsed response:', data);
    } catch (e) {
      console.error('Error parsing ConvertKit response:', e);
      
      // Even if ConvertKit fails, we've saved to Supabase
      if (supabaseResult.success) {
        return NextResponse.json({
          success: true,
          message: "Added to waitlist (saved to database only)",
          supabase: true,
          convertkit: false
        });
      }
      
      return NextResponse.json(
        { error: "Invalid response from ConvertKit" },
        { status: 500 }
      );
    }

    if (!data.subscription) {
      console.error('ConvertKit API error:', data);
      
      // If Supabase was successful, we can still consider this a success
      if (supabaseResult.success) {
        // Generate a referral code for this user
        const generatedRefCode = `${firstName.substring(0, 1)}${lastName ? lastName.substring(0, 1) : ''}${Math.floor(1000 + Math.random() * 9000)}`;
        
        return NextResponse.json({
          success: true,
          referralCode: generatedRefCode,
          message: "Added to waitlist (saved to database only)",
          supabase: true,
          convertkit: false
        });
      }
      
      return NextResponse.json(
        { error: data.message || "Failed to add to waitlist" },
        { status: 500 }
      );
    }

    // Generate a referral code for this user
    const generatedRefCode = `${firstName.substring(0, 1)}${lastName ? lastName.substring(0, 1) : ''}${Math.floor(1000 + Math.random() * 9000)}`;

    return NextResponse.json({
      success: true,
      referralCode: generatedRefCode,
      supabase: supabaseResult.success,
      convertkit: true
    });
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { error: "Failed to add to waitlist" },
      { status: 500 }
    );
  }
} 