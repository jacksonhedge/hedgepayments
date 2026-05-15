import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Use service role for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  { auth: { autoRefreshToken: false, persistSession: false } }
)

// Bankroll test credentials
const BANKROLL_TEST_USER = {
  email: 'jackson@bankroll.live',
  password: 'Bankroll2024!',
  businessName: 'Bankroll',
  contactFirstName: 'Jackson',
  contactLastName: 'Fitzgerald',
}

export async function POST(request: NextRequest) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  try {
    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(u => u.email === BANKROLL_TEST_USER.email)

    let userId: string

    if (existingUser) {
      userId = existingUser.id
      console.log('Bankroll user already exists:', userId)
    } else {
      // Create auth user
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: BANKROLL_TEST_USER.email,
        password: BANKROLL_TEST_USER.password,
        email_confirm: true,
        user_metadata: {
          first_name: BANKROLL_TEST_USER.contactFirstName,
          last_name: BANKROLL_TEST_USER.contactLastName,
          business_name: BANKROLL_TEST_USER.businessName,
          account_type: 'business'
        }
      })

      if (authError) {
        console.error('Auth error:', authError)
        throw authError
      }

      userId = authData.user.id
      console.log('Created Bankroll auth user:', userId)
    }

    // Check if business account already exists
    const { data: existingAccount } = await supabaseAdmin
      .from('business_accounts')
      .select('id')
      .eq('auth_user_id', userId)
      .single()

    if (existingAccount) {
      return NextResponse.json({
        success: true,
        message: 'Bankroll account already exists',
        credentials: {
          email: BANKROLL_TEST_USER.email,
          password: BANKROLL_TEST_USER.password
        }
      })
    }

    // Create business account
    const { data: businessAccount, error: createError } = await supabaseAdmin
      .from('business_accounts')
      .insert({
        auth_user_id: userId,
        business_name: BANKROLL_TEST_USER.businessName,
        business_type: 'llc',
        contact_first_name: BANKROLL_TEST_USER.contactFirstName,
        contact_last_name: BANKROLL_TEST_USER.contactLastName,
        contact_email: BANKROLL_TEST_USER.email,
        website: 'https://bankroll.live',
        support_email: 'support@bankroll.live',

        // API Keys for Bankroll
        api_key_test: 'pk_test_bankroll_' + generateRandomString(32),
        api_secret_test: 'sk_test_bankroll_' + generateRandomString(32),
        api_key_live: 'pk_live_bankroll_' + generateRandomString(32),
        api_secret_live: 'sk_live_bankroll_' + generateRandomString(32),
        webhook_secret: 'whsec_bankroll_' + generateRandomString(32),

        // Address
        address_line1: '123 Finance Street',
        city: 'New York',
        state: 'NY',
        postal_code: '10001',
        country: 'US',

        // Business details
        business_description: 'Digital wallet and consumer fintech platform',
        years_in_business: 2,
        employee_count: '1-10',
        annual_revenue: '$100k-$500k',
        expected_monthly_volume: '$10k-$50k',

        // Products - all enabled for Bankroll
        coverpay_enabled: true,
        gateway_enabled: true,
        sidebet_enabled: true,
        coverpay_status: 'active',
        gateway_status: 'active',
        sidebet_status: 'active',

        // Balances (demo data)
        balance_cents: 1250000, // $12,500
        pending_balance_cents: 350000, // $3,500
        available_balance_cents: 900000, // $9,000

        // Status
        status: 'active',
        environment: 'test',
        onboarding_status: 'complete',
        onboarding_step: 4,
        onboarding_completed_at: new Date().toISOString(),

        // Branding
        branding: {
          logo_url: '/images/bankroll-logo.png',
          primary_color: '#10B981',
          secondary_color: '#059669'
        }
      })
      .select()
      .single()

    if (createError) {
      console.error('Create error:', createError)
      throw createError
    }

    return NextResponse.json({
      success: true,
      message: 'Bankroll account created successfully',
      businessId: businessAccount.id,
      credentials: {
        email: BANKROLL_TEST_USER.email,
        password: BANKROLL_TEST_USER.password
      }
    })

  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to seed Bankroll account' },
      { status: 500 }
    )
  }
}

function generateRandomString(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

// GET endpoint to check status
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 })
  }

  return NextResponse.json({
    message: 'POST to this endpoint to create Bankroll test account',
    credentials: {
      email: BANKROLL_TEST_USER.email,
      password: BANKROLL_TEST_USER.password
    }
  })
}
