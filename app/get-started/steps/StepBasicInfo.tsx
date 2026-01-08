'use client'

import { useState } from 'react'
import { OnboardingData } from '../page'

interface StepBasicInfoProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  errors: Record<string, string>
  setErrors: (errors: Record<string, string>) => void
  onNext: () => void
}

export default function StepBasicInfo({
  data,
  updateData,
  errors,
  setErrors,
  onNext
}: StepBasicInfoProps) {
  const [showPassword, setShowPassword] = useState(false)

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!data.businessName.trim()) {
      newErrors.businessName = 'Business name is required'
    }

    if (!data.contactFirstName.trim()) {
      newErrors.contactFirstName = 'First name is required'
    }

    if (!data.contactLastName.trim()) {
      newErrors.contactLastName = 'Last name is required'
    }

    if (!data.contactEmail.trim()) {
      newErrors.contactEmail = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
      newErrors.contactEmail = 'Please enter a valid email address'
    }

    if (!data.contactPhone.trim()) {
      newErrors.contactPhone = 'Phone number is required'
    }

    if (!data.password) {
      newErrors.password = 'Password is required'
    } else if (data.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      onNext()
    }
  }

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/)
    if (match) {
      const parts = [match[1], match[2], match[3]].filter(Boolean)
      if (parts.length === 0) return ''
      if (parts.length === 1) return parts[0]
      if (parts.length === 2) return `(${parts[0]}) ${parts[1]}`
      return `(${parts[0]}) ${parts[1]}-${parts[2]}`
    }
    return value
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Create Your Account</h2>
        <p className="text-gray-400">Let's start with your basic information</p>
      </div>

      <div className="space-y-6">
        {/* Business Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Business Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={data.businessName}
            onChange={(e) => updateData({ businessName: e.target.value })}
            className={`w-full px-4 py-3 bg-white/5 border ${
              errors.businessName ? 'border-red-500' : 'border-white/10'
            } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            placeholder="Your Company Inc."
          />
          {errors.businessName && (
            <p className="mt-1 text-sm text-red-400">{errors.businessName}</p>
          )}
        </div>

        {/* Contact Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              First Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={data.contactFirstName}
              onChange={(e) => updateData({ contactFirstName: e.target.value })}
              className={`w-full px-4 py-3 bg-white/5 border ${
                errors.contactFirstName ? 'border-red-500' : 'border-white/10'
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              placeholder="John"
            />
            {errors.contactFirstName && (
              <p className="mt-1 text-sm text-red-400">{errors.contactFirstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Last Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={data.contactLastName}
              onChange={(e) => updateData({ contactLastName: e.target.value })}
              className={`w-full px-4 py-3 bg-white/5 border ${
                errors.contactLastName ? 'border-red-500' : 'border-white/10'
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
              placeholder="Doe"
            />
            {errors.contactLastName && (
              <p className="mt-1 text-sm text-red-400">{errors.contactLastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Work Email <span className="text-red-400">*</span>
          </label>
          <input
            type="email"
            value={data.contactEmail}
            onChange={(e) => updateData({ contactEmail: e.target.value })}
            className={`w-full px-4 py-3 bg-white/5 border ${
              errors.contactEmail ? 'border-red-500' : 'border-white/10'
            } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            placeholder="john@company.com"
          />
          {errors.contactEmail && (
            <p className="mt-1 text-sm text-red-400">{errors.contactEmail}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Phone Number <span className="text-red-400">*</span>
          </label>
          <input
            type="tel"
            value={data.contactPhone}
            onChange={(e) => updateData({ contactPhone: formatPhoneNumber(e.target.value) })}
            className={`w-full px-4 py-3 bg-white/5 border ${
              errors.contactPhone ? 'border-red-500' : 'border-white/10'
            } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            placeholder="(555) 123-4567"
          />
          {errors.contactPhone && (
            <p className="mt-1 text-sm text-red-400">{errors.contactPhone}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Password <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={data.password}
              onChange={(e) => updateData({ password: e.target.value })}
              className={`w-full px-4 py-3 bg-white/5 border ${
                errors.password ? 'border-red-500' : 'border-white/10'
              } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12`}
              placeholder="Create a secure password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-400">{errors.password}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters</p>
        </div>
      </div>

      {/* Next Button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleNext}
          className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          Continue
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}
