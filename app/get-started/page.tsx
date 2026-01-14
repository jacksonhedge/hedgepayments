'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@/app/utils/supabase-client'

// Step components
import StepBasicInfo from './steps/StepBasicInfo'
import StepBusinessDetails from './steps/StepBusinessDetails'
import StepProductSelection from './steps/StepProductSelection'
import StepReview from './steps/StepReview'

// Types
export interface OnboardingData {
  // Step 1: Basic Info
  businessName: string
  contactFirstName: string
  contactLastName: string
  contactEmail: string
  contactPhone: string
  password: string

  // Step 2: Business Details
  businessType: string
  businessStructure: string
  dbaName: string
  website: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string
  ein: string
  stateOfIncorporation: string
  dateOfIncorporation: string
  businessDescription: string
  yearsInBusiness: string
  employeeCount: string
  annualRevenue: string
  expectedMonthlyVolume: string
  averageTransactionSize: string
  isLicensed: boolean
  gamingLicenses: string[]

  // Step 3: Products
  products: {
    coverpay: boolean
    gateway: boolean
    sidebet: boolean
  }
  productDetails: {
    coverpay: {
      useCases: string[]
      expectedVolume: string
      bnplProviders: string[]
    }
    gateway: {
      paymentMethods: string[]
      platforms: string[]
    }
    sidebet: {
      bankProvider: string
      roundUpDestination: string
    }
  }
}

const initialData: OnboardingData = {
  businessName: '',
  contactFirstName: '',
  contactLastName: '',
  contactEmail: '',
  contactPhone: '',
  password: '',
  businessType: '',
  businessStructure: '',
  dbaName: '',
  website: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'US',
  ein: '',
  stateOfIncorporation: '',
  dateOfIncorporation: '',
  businessDescription: '',
  yearsInBusiness: '',
  employeeCount: '',
  annualRevenue: '',
  expectedMonthlyVolume: '',
  averageTransactionSize: '',
  isLicensed: false,
  gamingLicenses: [],
  products: {
    coverpay: false,
    gateway: false,
    sidebet: false
  },
  productDetails: {
    coverpay: {
      useCases: [],
      expectedVolume: '',
      bnplProviders: []
    },
    gateway: {
      paymentMethods: [],
      platforms: []
    },
    sidebet: {
      bankProvider: '',
      roundUpDestination: ''
    }
  }
}

const STEPS = [
  { id: 1, title: 'Account', description: 'Create your account' },
  { id: 2, title: 'Business', description: 'Business details' },
  { id: 3, title: 'Products', description: 'Select products' },
  { id: 4, title: 'Review', description: 'Review & submit' }
]

export default function GetStarted() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<OnboardingData>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const updateFormData = (data: Partial<OnboardingData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setSubmitError(null)

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.contactEmail,
        password: formData.password,
        options: {
          data: {
            first_name: formData.contactFirstName,
            last_name: formData.contactLastName,
            business_name: formData.businessName,
            account_type: 'business'
          }
        }
      })

      if (authError) throw authError

      // 2. Create business account via API
      const response = await fetch('/api/business/onboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authUserId: authData.user?.id,
          ...formData
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create business account')
      }

      // 3. Redirect to dashboard
      router.push('/dashboard?welcome=true')

    } catch (error: any) {
      console.error('Onboarding error:', error)
      setSubmitError(error.message || 'Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span className="text-white font-semibold text-xl">Hedge Payments</span>
          </Link>
          <Link
            href="/business-login"
            className="text-gray-300 hover:text-white text-sm"
          >
            Already have an account? Log in
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                      currentStep >= step.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className={`mt-2 text-xs ${currentStep >= step.id ? 'text-white' : 'text-gray-500'}`}>
                    {step.title}
                  </span>
                </div>
                {index < STEPS.length - 1 && (
                  <div
                    className={`w-full h-1 mx-2 rounded ${
                      currentStep > step.id ? 'bg-purple-600' : 'bg-white/10'
                    }`}
                    style={{ minWidth: '60px' }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-10"
        >
          {submitError && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200">
              {submitError}
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <StepBasicInfo
                  data={formData}
                  updateData={updateFormData}
                  errors={errors}
                  setErrors={setErrors}
                  onNext={nextStep}
                />
              )}
              {currentStep === 2 && (
                <StepBusinessDetails
                  data={formData}
                  updateData={updateFormData}
                  errors={errors}
                  setErrors={setErrors}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}
              {currentStep === 3 && (
                <StepProductSelection
                  data={formData}
                  updateData={updateFormData}
                  onNext={nextStep}
                  onBack={prevStep}
                />
              )}
              {currentStep === 4 && (
                <StepReview
                  data={formData}
                  onBack={prevStep}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-gray-400 text-sm mt-8">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-purple-400 hover:text-purple-300">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-purple-400 hover:text-purple-300">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}
