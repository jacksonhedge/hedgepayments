import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/app/utils/supabase-server'

// Helper function to generate API keys
function generateApiKey(prefix: string): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let key = ''
  for (let i = 0; i < 48; i++) {
    key += chars[Math.floor(Math.random() * chars.length)]
  }
  return `${prefix}_${key}`
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient()

    const body = await request.json()

    const {
      authUserId,
      // Step 1: Basic Info
      businessName,
      contactFirstName,
      contactLastName,
      contactEmail,
      contactPhone,
      // Step 2: Business Details
      businessType,
      businessStructure,
      dbaName,
      website,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      ein,
      stateOfIncorporation,
      dateOfIncorporation,
      businessDescription,
      yearsInBusiness,
      employeeCount,
      annualRevenue,
      expectedMonthlyVolume,
      averageTransactionSize,
      isLicensed,
      gamingLicenses,
      // Step 3: Products
      products,
      productDetails
    } = body

    // Validate required fields
    if (!authUserId || !businessName || !contactEmail || !businessType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate API keys
    const apiKeyTest = generateApiKey('pk_test')
    const apiSecretTest = generateApiKey('sk_test')
    const webhookSecret = generateApiKey('whsec')

    // Create business account
    const { data: businessAccount, error: createError } = await supabase
      .from('business_accounts')
      .insert({
        auth_user_id: authUserId,
        // Basic info
        business_name: businessName,
        contact_first_name: contactFirstName,
        contact_last_name: contactLastName,
        contact_email: contactEmail,
        contact_phone: contactPhone,
        // Business details
        business_type: businessType,
        business_structure: businessStructure || null,
        dba_name: dbaName || null,
        website: website || null,
        address_line1: addressLine1 || null,
        address_line2: addressLine2 || null,
        city: city || null,
        state: state || null,
        postal_code: postalCode || null,
        country: country || 'US',
        // Underwriting
        ein: ein || null,
        state_of_incorporation: stateOfIncorporation || null,
        date_of_incorporation: dateOfIncorporation || null,
        business_description: businessDescription || null,
        years_in_business: yearsInBusiness ? parseInt(yearsInBusiness) : null,
        employee_count: employeeCount || null,
        annual_revenue: annualRevenue || null,
        expected_monthly_volume: expectedMonthlyVolume || null,
        average_transaction_size: averageTransactionSize || null,
        is_licensed: isLicensed || false,
        gaming_licenses: gamingLicenses || [],
        // Product status
        coverpay_status: products?.coverpay ? 'requested' : 'not_requested',
        coverpay_requested_at: products?.coverpay ? new Date().toISOString() : null,
        coverpay_config: products?.coverpay ? productDetails?.coverpay || {} : {},
        gateway_status: products?.gateway ? 'requested' : 'not_requested',
        gateway_requested_at: products?.gateway ? new Date().toISOString() : null,
        gateway_config: products?.gateway ? productDetails?.gateway || {} : {},
        sidebet_status: products?.sidebet ? 'requested' : 'not_requested',
        sidebet_requested_at: products?.sidebet ? new Date().toISOString() : null,
        sidebet_config: products?.sidebet ? productDetails?.sidebet || {} : {},
        // API Keys
        api_key_test: apiKeyTest,
        api_secret_test: apiSecretTest,
        webhook_secret: webhookSecret,
        // Status
        onboarding_status: 'profile_complete',
        onboarding_step: 4,
        onboarding_completed_at: new Date().toISOString()
      })
      .select()
      .single()

    if (createError) {
      console.error('Error creating business account:', createError)
      return NextResponse.json(
        { error: createError.message },
        { status: 500 }
      )
    }

    // Log onboarding event
    await supabase
      .from('onboarding_events')
      .insert({
        business_id: businessAccount.id,
        event_type: 'onboarding_completed',
        event_data: {
          products_selected: products,
          business_type: businessType
        }
      })

    // Create product requests if products were selected
    const productRequestInserts = []

    if (products?.coverpay) {
      productRequestInserts.push({
        business_id: businessAccount.id,
        product: 'coverpay',
        use_cases: productDetails?.coverpay?.useCases || [],
        expected_volume: productDetails?.coverpay?.expectedVolume || null,
        bnpl_providers_wanted: productDetails?.coverpay?.bnplProviders || []
      })
    }

    if (products?.gateway) {
      productRequestInserts.push({
        business_id: businessAccount.id,
        product: 'gateway',
        payment_methods_wanted: productDetails?.gateway?.paymentMethods || [],
        platforms: productDetails?.gateway?.platforms || []
      })
    }

    if (products?.sidebet) {
      productRequestInserts.push({
        business_id: businessAccount.id,
        product: 'sidebet',
        bank_connection_provider: productDetails?.sidebet?.bankProvider || null,
        round_up_destination: productDetails?.sidebet?.roundUpDestination || null
      })
    }

    if (productRequestInserts.length > 0) {
      await supabase
        .from('product_requests')
        .insert(productRequestInserts)
    }

    return NextResponse.json({
      success: true,
      businessId: businessAccount.id,
      message: 'Business account created successfully'
    })

  } catch (error: any) {
    console.error('Onboarding error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
