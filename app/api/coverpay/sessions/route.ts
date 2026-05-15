import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Generate session token
function generateSessionToken(): string {
  const bytes = new Uint8Array(16)
  crypto.getRandomValues(bytes)
  return 'cps_' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('')
}

// POST /api/coverpay/sessions - Create a new checkout session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      publishableKey,
      amount,
      currency = 'USD',
      orderId,
      customer,
      successUrl,
      cancelUrl,
      metadata = {},
    } = body

    // Validate required fields
    if (!publishableKey) {
      return NextResponse.json(
        { error: 'publishableKey is required' },
        { status: 400 }
      )
    }

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'amount must be a positive number' },
        { status: 400 }
      )
    }

    // Look up business by publishable key
    const { data: business, error: businessError } = await supabase
      .from('business_accounts')
      .select('id, business_name, coverpay_status')
      .or(`api_key_test.eq.${publishableKey},api_key_live.eq.${publishableKey}`)
      .single()

    if (businessError || !business) {
      return NextResponse.json(
        { error: 'Invalid publishable key' },
        { status: 401 }
      )
    }

    // Check if CoverPay is enabled for this business
    if (business.coverpay_status !== 'active' && business.coverpay_status !== 'approved') {
      return NextResponse.json(
        { error: 'CoverPay is not enabled for this account' },
        { status: 403 }
      )
    }

    // Get enabled providers for this business
    const { data: providers } = await supabase
      .from('coverpay_merchant_providers')
      .select('provider_id, provider_name, priority')
      .eq('business_id', business.id)
      .eq('enabled', true)
      .order('priority')

    if (!providers || providers.length === 0) {
      return NextResponse.json(
        { error: 'No BNPL providers configured' },
        { status: 400 }
      )
    }

    // Create session
    const sessionToken = generateSessionToken()
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes

    const { data: session, error: sessionError } = await supabase
      .from('coverpay_sessions')
      .insert({
        session_token: sessionToken,
        business_id: business.id,
        amount,
        currency,
        order_id: orderId,
        customer_email: customer?.email,
        customer_phone: customer?.phone,
        customer_name: customer?.name,
        customer_data: customer || {},
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
        expires_at: expiresAt,
        status: 'pending',
      })
      .select()
      .single()

    if (sessionError) {
      console.error('Error creating session:', sessionError)
      return NextResponse.json(
        { error: 'Failed to create session' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        token: session.session_token,
        amount: session.amount,
        currency: session.currency,
        status: session.status,
        expiresAt: session.expires_at,
        providers: providers.map(p => ({
          id: p.provider_id,
          name: p.provider_name,
        })),
      },
    })
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
