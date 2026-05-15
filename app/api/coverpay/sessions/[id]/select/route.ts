import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export function generateStaticParams() {
  return [{ id: 'placeholder' }]
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Mock create checkout with provider - in production, this would call actual provider APIs
async function createProviderCheckout(
  providerId: string,
  amount: number,
  customer: { email?: string; phone?: string; name?: string },
  orderId: string | null,
  successUrl: string | null,
  cancelUrl: string | null,
  credentials: Record<string, string>,
  testMode: boolean
): Promise<{
  success: boolean
  checkoutUrl?: string
  sessionId?: string
  orderId?: string
  error?: string
}> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500))

  if (testMode) {
    // Return mock sandbox URLs
    const sandboxUrls: Record<string, string> = {
      klarna: 'https://playground.klarna.com/checkout/',
      affirm: 'https://sandbox.affirm.com/checkout/',
      afterpay: 'https://portal-sandbox.afterpay.com/checkout/',
      sezzle: 'https://sandbox.checkout.sezzle.com/',
    }

    const baseUrl = sandboxUrls[providerId] || 'https://checkout.example.com/'
    const mockSessionId = `${providerId}_${Date.now()}_${Math.random().toString(36).substring(7)}`

    return {
      success: true,
      checkoutUrl: `${baseUrl}${mockSessionId}?return_url=${encodeURIComponent(successUrl || '')}`,
      sessionId: mockSessionId,
      orderId: `${providerId.toUpperCase()}-${Date.now()}`,
    }
  }

  // Production: Call actual provider API
  return {
    success: false,
    error: 'Production API not implemented',
  }
}

// POST /api/coverpay/sessions/[id]/select - Select a provider and get checkout URL
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionToken = params.id
    const body = await request.json()
    const { providerId, planId } = body

    if (!providerId) {
      return NextResponse.json(
        { error: 'providerId is required' },
        { status: 400 }
      )
    }

    // Get session
    const { data: session, error: sessionError } = await supabase
      .from('coverpay_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      return NextResponse.json(
        { error: 'Session expired' },
        { status: 410 }
      )
    }

    // Check if provider is eligible
    const eligibility = session.eligibility_results?.[providerId]
    if (!eligibility?.eligible) {
      return NextResponse.json(
        { error: 'Provider not eligible for this session' },
        { status: 400 }
      )
    }

    // Get provider credentials
    const { data: provider, error: providerError } = await supabase
      .from('coverpay_merchant_providers')
      .select('*')
      .eq('business_id', session.business_id)
      .eq('provider_id', providerId)
      .eq('enabled', true)
      .single()

    if (providerError || !provider) {
      return NextResponse.json(
        { error: 'Provider not configured' },
        { status: 400 }
      )
    }

    // Create checkout with provider
    const checkoutResult = await createProviderCheckout(
      providerId,
      parseFloat(session.amount),
      {
        email: session.customer_email,
        phone: session.customer_phone,
        name: session.customer_name,
      },
      session.order_id,
      session.success_url,
      session.cancel_url,
      provider.credentials_encrypted,
      provider.test_mode
    )

    if (!checkoutResult.success) {
      // If this provider fails, try the next one (waterfall)
      return NextResponse.json(
        {
          success: false,
          error: checkoutResult.error,
          tryNext: true,
        },
        { status: 422 }
      )
    }

    // Update session with selected provider
    const providersAttempted = session.providers_attempted || []
    if (!providersAttempted.includes(providerId)) {
      providersAttempted.push(providerId)
    }

    await supabase
      .from('coverpay_sessions')
      .update({
        status: 'provider_selected',
        selected_provider: providerId,
        provider_session_id: checkoutResult.sessionId,
        provider_order_id: checkoutResult.orderId,
        providers_attempted: providersAttempted,
      })
      .eq('id', session.id)

    return NextResponse.json({
      success: true,
      checkout: {
        provider: providerId,
        providerName: provider.provider_name,
        checkoutUrl: checkoutResult.checkoutUrl,
        sessionId: checkoutResult.sessionId,
        orderId: checkoutResult.orderId,
        planId: planId,
      },
    })
  } catch (error) {
    console.error('Provider selection error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
