import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export function generateStaticParams() {
  return [{ id: 'placeholder' }]
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/coverpay/sessions/[id] - Get session details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id

    // Support both UUID and session token lookup
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId)

    const query = supabase
      .from('coverpay_sessions')
      .select('*')

    const { data: session, error } = isUUID
      ? await query.eq('id', sessionId).single()
      : await query.eq('session_token', sessionId).single()

    if (error || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      // Update status to expired
      await supabase
        .from('coverpay_sessions')
        .update({ status: 'expired' })
        .eq('id', session.id)

      return NextResponse.json(
        { error: 'Session expired' },
        { status: 410 }
      )
    }

    // Get enabled providers for this business
    const { data: providers } = await supabase
      .from('coverpay_merchant_providers')
      .select('provider_id, provider_name, priority, config')
      .eq('business_id', session.business_id)
      .eq('enabled', true)
      .order('priority')

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        token: session.session_token,
        amount: session.amount,
        currency: session.currency,
        status: session.status,
        orderId: session.order_id,
        customer: {
          email: session.customer_email,
          phone: session.customer_phone,
          name: session.customer_name,
        },
        selectedProvider: session.selected_provider,
        eligibilityResults: session.eligibility_results,
        providersAttempted: session.providers_attempted,
        expiresAt: session.expires_at,
        createdAt: session.created_at,
        providers: providers?.map(p => ({
          id: p.provider_id,
          name: p.provider_name,
          config: p.config,
        })) || [],
      },
    })
  } catch (error) {
    console.error('Error fetching session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/coverpay/sessions/[id] - Update session
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionId = params.id
    const body = await request.json()
    const { status, selectedProvider, providerSessionId, providerOrderId } = body

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (status) updates.status = status
    if (selectedProvider) updates.selected_provider = selectedProvider
    if (providerSessionId) updates.provider_session_id = providerSessionId
    if (providerOrderId) updates.provider_order_id = providerOrderId

    const { data: session, error } = await supabase
      .from('coverpay_sessions')
      .update(updates)
      .eq('session_token', sessionId)
      .select()
      .single()

    if (error) {
      return NextResponse.json(
        { error: 'Failed to update session' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        status: session.status,
        selectedProvider: session.selected_provider,
      },
    })
  } catch (error) {
    console.error('Error updating session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
