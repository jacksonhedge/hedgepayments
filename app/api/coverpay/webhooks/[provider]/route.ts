import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export function generateStaticParams() {
  return [
    { provider: 'klarna' },
    { provider: 'affirm' },
    { provider: 'afterpay' },
    { provider: 'sezzle' },
  ]
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Verify webhook signature (provider-specific)
async function verifyWebhookSignature(
  providerId: string,
  payload: string,
  signature: string | null,
  secret: string
): Promise<boolean> {
  // Each provider has different signature verification methods
  // This is a placeholder - implement actual verification per provider

  switch (providerId) {
    case 'klarna':
      // Klarna uses HMAC-SHA256
      return true // Implement actual verification
    case 'affirm':
      // Affirm uses custom header verification
      return true
    case 'afterpay':
      // Afterpay uses HMAC-SHA256
      return true
    case 'sezzle':
      // Sezzle uses custom auth
      return true
    default:
      return true
  }
}

// Map provider event types to our standard events
function mapEventType(providerId: string, providerEvent: string): string {
  const eventMappings: Record<string, Record<string, string>> = {
    klarna: {
      checkout_complete: 'payment.authorized',
      order_canceled: 'payment.cancelled',
      refund_initiated: 'payment.refunded',
    },
    affirm: {
      checkout_completed: 'payment.authorized',
      checkout_canceled: 'payment.cancelled',
      charge_refunded: 'payment.refunded',
    },
    afterpay: {
      APPROVED: 'payment.authorized',
      DECLINED: 'payment.declined',
      CANCELLED: 'payment.cancelled',
    },
    sezzle: {
      order_complete: 'payment.authorized',
      order_cancelled: 'payment.cancelled',
      refund_complete: 'payment.refunded',
    },
  }

  return eventMappings[providerId]?.[providerEvent] || providerEvent
}

// POST /api/coverpay/webhooks/[provider] - Handle provider webhooks
export async function POST(
  request: NextRequest,
  { params }: { params: { provider: string } }
) {
  const providerId = params.provider

  try {
    const rawBody = await request.text()
    const payload = JSON.parse(rawBody)

    // Get signature from headers
    const signatureHeaders: Record<string, string> = {
      klarna: 'klarna-signature',
      affirm: 'x-affirm-signature',
      afterpay: 'x-afterpay-signature',
      sezzle: 'x-sezzle-signature',
    }
    const signatureHeader = signatureHeaders[providerId] || 'x-signature'
    const signature = request.headers.get(signatureHeader)

    // Extract provider-specific session/order ID
    let providerSessionId: string | null = null
    let providerOrderId: string | null = null
    let eventType: string = payload.event_type || payload.type || payload.event || 'unknown'

    switch (providerId) {
      case 'klarna':
        providerSessionId = payload.session_id
        providerOrderId = payload.order_id
        eventType = payload.event_type
        break
      case 'affirm':
        providerSessionId = payload.checkout_id
        providerOrderId = payload.charge_id
        eventType = payload.type
        break
      case 'afterpay':
        providerSessionId = payload.token
        providerOrderId = payload.id
        eventType = payload.status
        break
      case 'sezzle':
        providerSessionId = payload.session_uuid
        providerOrderId = payload.order_uuid
        eventType = payload.event
        break
    }

    // Find the session by provider session ID
    const { data: session } = await supabase
      .from('coverpay_sessions')
      .select('*')
      .eq('provider_session_id', providerSessionId)
      .single()

    // Get webhook secret for verification
    let webhookSecret = ''
    let businessId: string | null = null

    if (session) {
      businessId = session.business_id

      const { data: business } = await supabase
        .from('business_accounts')
        .select('webhook_secret')
        .eq('id', session.business_id)
        .single()

      webhookSecret = business?.webhook_secret || ''
    }

    // Verify signature
    const signatureValid = await verifyWebhookSignature(
      providerId,
      rawBody,
      signature,
      webhookSecret
    )

    // Log webhook event
    const { data: webhookLog } = await supabase
      .from('coverpay_webhook_logs')
      .insert({
        business_id: businessId,
        provider_id: providerId,
        event_type: mapEventType(providerId, eventType),
        session_id: session?.id,
        provider_event_id: payload.id || payload.event_id,
        raw_payload: payload,
        headers: Object.fromEntries(request.headers.entries()),
        signature_valid: signatureValid,
      })
      .select()
      .single()

    if (!signatureValid) {
      await supabase
        .from('coverpay_webhook_logs')
        .update({
          processed: true,
          processing_error: 'Invalid signature',
        })
        .eq('id', webhookLog?.id)

      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      )
    }

    if (!session) {
      await supabase
        .from('coverpay_webhook_logs')
        .update({
          processed: true,
          processing_error: 'Session not found',
        })
        .eq('id', webhookLog?.id)

      // Still return 200 to acknowledge receipt
      return NextResponse.json({ received: true, processed: false })
    }

    // Process the event
    const standardEvent = mapEventType(providerId, eventType)
    let newStatus = session.status
    let transactionId: string | null = null

    switch (standardEvent) {
      case 'payment.authorized':
        newStatus = 'authorized'

        // Create transaction record
        const { data: transaction } = await supabase
          .from('coverpay_transactions')
          .insert({
            session_id: session.id,
            business_id: session.business_id,
            provider_id: providerId,
            provider_txn_id: providerOrderId,
            amount: session.amount,
            currency: session.currency,
            status: 'authorized',
            customer_email: session.customer_email,
            order_id: session.order_id,
            provider_response: payload,
            authorized_at: new Date().toISOString(),
          })
          .select()
          .single()

        transactionId = transaction?.id
        break

      case 'payment.captured':
        newStatus = 'captured'

        // Update transaction
        await supabase
          .from('coverpay_transactions')
          .update({
            status: 'captured',
            captured_at: new Date().toISOString(),
          })
          .eq('session_id', session.id)
          .eq('provider_id', providerId)
        break

      case 'payment.declined':
        // Don't immediately fail - this might trigger waterfall to next provider
        const attempted = session.providers_attempted || []
        const eligibleProviders = Object.keys(session.eligibility_results || {})
          .filter(p => session.eligibility_results[p]?.eligible)

        const nextProvider = eligibleProviders.find(p => !attempted.includes(p))

        if (nextProvider) {
          // There's another provider to try
          newStatus = 'pending'
        } else {
          // All providers exhausted
          newStatus = 'failed'
        }
        break

      case 'payment.cancelled':
        newStatus = 'cancelled'

        // Update any existing transaction
        await supabase
          .from('coverpay_transactions')
          .update({ status: 'cancelled' })
          .eq('session_id', session.id)
          .eq('provider_id', providerId)
        break

      case 'payment.refunded':
        // Update transaction
        await supabase
          .from('coverpay_transactions')
          .update({
            status: 'refunded',
            refunded_amount: payload.refund_amount || session.amount,
          })
          .eq('session_id', session.id)
          .eq('provider_id', providerId)
        break
    }

    // Update session status
    await supabase
      .from('coverpay_sessions')
      .update({
        status: newStatus,
        completed_at: ['authorized', 'captured', 'failed', 'cancelled'].includes(newStatus)
          ? new Date().toISOString()
          : null,
      })
      .eq('id', session.id)

    // Update webhook log as processed
    await supabase
      .from('coverpay_webhook_logs')
      .update({
        processed: true,
        processed_at: new Date().toISOString(),
        transaction_id: transactionId,
      })
      .eq('id', webhookLog?.id)

    // Forward to merchant webhook if configured
    const { data: business } = await supabase
      .from('business_accounts')
      .select('webhook_url')
      .eq('id', session.business_id)
      .single()

    if (business?.webhook_url) {
      // Fire and forget - don't wait for response
      fetch(business.webhook_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: standardEvent,
          session: {
            id: session.id,
            token: session.session_token,
            orderId: session.order_id,
            status: newStatus,
          },
          provider: providerId,
          transactionId,
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {}) // Ignore errors
    }

    return NextResponse.json({
      received: true,
      processed: true,
      event: standardEvent,
      newStatus,
    })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
