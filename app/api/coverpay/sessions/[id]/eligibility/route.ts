import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export function generateStaticParams() {
  return [{ id: 'placeholder' }]
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Mock eligibility check - in production, this would call actual provider APIs
async function checkProviderEligibility(
  providerId: string,
  amount: number,
  customer: { email?: string; phone?: string; name?: string },
  credentials: Record<string, string>,
  testMode: boolean
): Promise<{
  eligible: boolean
  reason?: string
  plans?: Array<{
    id: string
    name: string
    installments: number
    amount: number
    apr?: number
  }>
  limit?: number
}> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500))

  // In test mode, simulate based on provider and amount
  if (testMode) {
    const minAmounts: Record<string, number> = {
      klarna: 35,
      affirm: 50,
      afterpay: 35,
      sezzle: 35,
    }

    const maxAmounts: Record<string, number> = {
      klarna: 1500,
      affirm: 17500,
      afterpay: 2000,
      sezzle: 2500,
    }

    const minAmount = minAmounts[providerId] || 35
    const maxAmount = maxAmounts[providerId] || 1500

    if (amount < minAmount) {
      return {
        eligible: false,
        reason: `Minimum order amount is $${minAmount}`,
      }
    }

    if (amount > maxAmount) {
      return {
        eligible: false,
        reason: `Maximum order amount is $${maxAmount}`,
      }
    }

    // Generate mock payment plans
    const plans = []

    // Pay in 4
    if (amount >= minAmount) {
      plans.push({
        id: `${providerId}_pay4`,
        name: 'Pay in 4',
        installments: 4,
        amount: Math.round(amount / 4 * 100) / 100,
        apr: 0,
      })
    }

    // Monthly (for higher amounts on Affirm/Klarna)
    if ((providerId === 'affirm' || providerId === 'klarna') && amount >= 100) {
      plans.push({
        id: `${providerId}_monthly_6`,
        name: '6 Monthly Payments',
        installments: 6,
        amount: Math.round(amount / 6 * 100) / 100,
        apr: providerId === 'affirm' ? 0 : 9.99,
      })

      if (amount >= 500) {
        plans.push({
          id: `${providerId}_monthly_12`,
          name: '12 Monthly Payments',
          installments: 12,
          amount: Math.round(amount / 12 * 100) / 100,
          apr: providerId === 'affirm' ? 0 : 14.99,
        })
      }
    }

    return {
      eligible: true,
      plans,
      limit: maxAmount,
    }
  }

  // Production: Call actual provider API
  // This would be implemented per provider
  return {
    eligible: false,
    reason: 'Production API not implemented',
  }
}

// POST /api/coverpay/sessions/[id]/eligibility - Check eligibility across all providers
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionToken = params.id

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

    // Update session status
    await supabase
      .from('coverpay_sessions')
      .update({ status: 'eligibility_check' })
      .eq('id', session.id)

    // Get enabled providers
    const { data: providers } = await supabase
      .from('coverpay_merchant_providers')
      .select('*')
      .eq('business_id', session.business_id)
      .eq('enabled', true)
      .order('priority')

    if (!providers || providers.length === 0) {
      return NextResponse.json(
        { error: 'No providers configured' },
        { status: 400 }
      )
    }

    // Check eligibility with each provider in parallel
    const eligibilityResults: Record<string, {
      eligible: boolean
      reason?: string
      plans?: Array<{
        id: string
        name: string
        installments: number
        amount: number
        apr?: number
      }>
      limit?: number
      priority: number
    }> = {}

    const customer = {
      email: session.customer_email,
      phone: session.customer_phone,
      name: session.customer_name,
    }

    await Promise.all(
      providers.map(async (provider) => {
        const result = await checkProviderEligibility(
          provider.provider_id,
          parseFloat(session.amount),
          customer,
          provider.credentials_encrypted,
          provider.test_mode
        )

        eligibilityResults[provider.provider_id] = {
          ...result,
          priority: provider.priority,
        }
      })
    )

    // Update session with eligibility results
    await supabase
      .from('coverpay_sessions')
      .update({
        eligibility_results: eligibilityResults,
        status: 'pending',
      })
      .eq('id', session.id)

    // Sort providers by priority and filter eligible ones
    const eligibleProviders = Object.entries(eligibilityResults)
      .filter(([, result]) => result.eligible)
      .sort((a, b) => a[1].priority - b[1].priority)
      .map(([providerId, result]) => ({
        id: providerId,
        name: providers.find(p => p.provider_id === providerId)?.provider_name || providerId,
        plans: result.plans || [],
        limit: result.limit,
      }))

    const declinedProviders = Object.entries(eligibilityResults)
      .filter(([, result]) => !result.eligible)
      .map(([providerId, result]) => ({
        id: providerId,
        name: providers.find(p => p.provider_id === providerId)?.provider_name || providerId,
        reason: result.reason,
      }))

    return NextResponse.json({
      success: true,
      eligibility: {
        eligible: eligibleProviders.length > 0,
        providers: eligibleProviders,
        declined: declinedProviders,
        recommendedProvider: eligibleProviders[0] || null,
      },
    })
  } catch (error) {
    console.error('Eligibility check error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
