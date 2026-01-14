'use client'

import { useState } from 'react'
import { OnboardingData } from '../page'

interface StepBusinessDetailsProps {
  data: OnboardingData
  updateData: (data: Partial<OnboardingData>) => void
  errors: Record<string, string>
  setErrors: (errors: Record<string, string>) => void
  onNext: () => void
  onBack: () => void
}

const BUSINESS_TYPES = [
  { value: 'fintech', label: 'Fintech' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'sports_betting', label: 'Sports Betting' },
  { value: 'daily_fantasy', label: 'Daily Fantasy Sports' },
  { value: 'ecommerce', label: 'E-Commerce' },
  { value: 'saas', label: 'SaaS' },
  { value: 'marketplace', label: 'Marketplace' },
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'real_money_gaming', label: 'Real Money Gaming' },
  { value: 'sweepstakes', label: 'Sweepstakes' },
  { value: 'other', label: 'Other' }
]

const BUSINESS_STRUCTURES = [
  { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
  { value: 'llc', label: 'LLC' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'partnership', label: 'Partnership' },
  { value: 's_corp', label: 'S-Corp' },
  { value: 'non_profit', label: 'Non-Profit' },
  { value: 'other', label: 'Other' }
]

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY', 'DC'
]

const EMPLOYEE_COUNTS = [
  { value: '1-10', label: '1-10 employees' },
  { value: '11-50', label: '11-50 employees' },
  { value: '51-200', label: '51-200 employees' },
  { value: '201-500', label: '201-500 employees' },
  { value: '500+', label: '500+ employees' }
]

const REVENUE_RANGES = [
  { value: '0-100k', label: '$0 - $100K' },
  { value: '100k-500k', label: '$100K - $500K' },
  { value: '500k-1m', label: '$500K - $1M' },
  { value: '1m-5m', label: '$1M - $5M' },
  { value: '5m-10m', label: '$5M - $10M' },
  { value: '10m-50m', label: '$10M - $50M' },
  { value: '50m+', label: '$50M+' }
]

const VOLUME_RANGES = [
  { value: '0-50k', label: '$0 - $50K' },
  { value: '50k-100k', label: '$50K - $100K' },
  { value: '100k-500k', label: '$100K - $500K' },
  { value: '500k-1m', label: '$500K - $1M' },
  { value: '1m-5m', label: '$1M - $5M' },
  { value: '5m+', label: '$5M+' }
]

const GAMING_LICENSES = [
  { value: 'nj', label: 'New Jersey' },
  { value: 'pa', label: 'Pennsylvania' },
  { value: 'mi', label: 'Michigan' },
  { value: 'wv', label: 'West Virginia' },
  { value: 'co', label: 'Colorado' },
  { value: 'in', label: 'Indiana' },
  { value: 'ia', label: 'Iowa' },
  { value: 'tn', label: 'Tennessee' },
  { value: 'va', label: 'Virginia' },
  { value: 'az', label: 'Arizona' },
  { value: 'ct', label: 'Connecticut' },
  { value: 'ny', label: 'New York' },
  { value: 'la', label: 'Louisiana' },
  { value: 'md', label: 'Maryland' },
  { value: 'oh', label: 'Ohio' },
  { value: 'ma', label: 'Massachusetts' },
  { value: 'ky', label: 'Kentucky' },
  { value: 'nc', label: 'North Carolina' },
  { value: 'other', label: 'Other' }
]

export default function StepBusinessDetails({
  data,
  updateData,
  errors,
  setErrors,
  onNext,
  onBack
}: StepBusinessDetailsProps) {
  const isGamingRelated = ['gaming', 'sports_betting', 'daily_fantasy', 'real_money_gaming', 'sweepstakes'].includes(data.businessType)

  const validateStep = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!data.businessType) {
      newErrors.businessType = 'Business type is required'
    }

    if (!data.businessStructure) {
      newErrors.businessStructure = 'Business structure is required'
    }

    if (!data.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address is required'
    }

    if (!data.city.trim()) {
      newErrors.city = 'City is required'
    }

    if (!data.state) {
      newErrors.state = 'State is required'
    }

    if (!data.postalCode.trim()) {
      newErrors.postalCode = 'ZIP code is required'
    }

    if (!data.businessDescription.trim()) {
      newErrors.businessDescription = 'Business description is required'
    }

    if (!data.expectedMonthlyVolume) {
      newErrors.expectedMonthlyVolume = 'Expected monthly volume is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep()) {
      onNext()
    }
  }

  const toggleLicense = (license: string) => {
    const current = data.gamingLicenses || []
    if (current.includes(license)) {
      updateData({ gamingLicenses: current.filter(l => l !== license) })
    } else {
      updateData({ gamingLicenses: [...current, license] })
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Business Details</h2>
        <p className="text-gray-400">Tell us about your business for underwriting</p>
      </div>

      <div className="space-y-6">
        {/* Business Type & Structure Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Business Type <span className="text-red-400">*</span>
            </label>
            <select
              value={data.businessType}
              onChange={(e) => updateData({ businessType: e.target.value })}
              className={`w-full px-4 py-3 bg-white/5 border ${
                errors.businessType ? 'border-red-500' : 'border-white/10'
              } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            >
              <option value="" className="bg-slate-800">Select type...</option>
              {BUSINESS_TYPES.map(type => (
                <option key={type.value} value={type.value} className="bg-slate-800">
                  {type.label}
                </option>
              ))}
            </select>
            {errors.businessType && (
              <p className="mt-1 text-sm text-red-400">{errors.businessType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Business Structure <span className="text-red-400">*</span>
            </label>
            <select
              value={data.businessStructure}
              onChange={(e) => updateData({ businessStructure: e.target.value })}
              className={`w-full px-4 py-3 bg-white/5 border ${
                errors.businessStructure ? 'border-red-500' : 'border-white/10'
              } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            >
              <option value="" className="bg-slate-800">Select structure...</option>
              {BUSINESS_STRUCTURES.map(structure => (
                <option key={structure.value} value={structure.value} className="bg-slate-800">
                  {structure.label}
                </option>
              ))}
            </select>
            {errors.businessStructure && (
              <p className="mt-1 text-sm text-red-400">{errors.businessStructure}</p>
            )}
          </div>
        </div>

        {/* DBA & Website Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              DBA Name (if different)
            </label>
            <input
              type="text"
              value={data.dbaName}
              onChange={(e) => updateData({ dbaName: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Doing Business As..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Website
            </label>
            <input
              type="url"
              value={data.website}
              onChange={(e) => updateData({ website: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="https://yourcompany.com"
            />
          </div>
        </div>

        {/* Address Section */}
        <div className="border-t border-white/10 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Business Address</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address Line 1 <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={data.addressLine1}
                onChange={(e) => updateData({ addressLine1: e.target.value })}
                className={`w-full px-4 py-3 bg-white/5 border ${
                  errors.addressLine1 ? 'border-red-500' : 'border-white/10'
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                placeholder="123 Main Street"
              />
              {errors.addressLine1 && (
                <p className="mt-1 text-sm text-red-400">{errors.addressLine1}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                value={data.addressLine2}
                onChange={(e) => updateData({ addressLine2: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Suite 100"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  City <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={data.city}
                  onChange={(e) => updateData({ city: e.target.value })}
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    errors.city ? 'border-red-500' : 'border-white/10'
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="City"
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-400">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  State <span className="text-red-400">*</span>
                </label>
                <select
                  value={data.state}
                  onChange={(e) => updateData({ state: e.target.value })}
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    errors.state ? 'border-red-500' : 'border-white/10'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                >
                  <option value="" className="bg-slate-800">State</option>
                  {US_STATES.map(state => (
                    <option key={state} value={state} className="bg-slate-800">{state}</option>
                  ))}
                </select>
                {errors.state && (
                  <p className="mt-1 text-sm text-red-400">{errors.state}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  ZIP Code <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={data.postalCode}
                  onChange={(e) => updateData({ postalCode: e.target.value.replace(/\D/g, '').slice(0, 5) })}
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    errors.postalCode ? 'border-red-500' : 'border-white/10'
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  placeholder="12345"
                />
                {errors.postalCode && (
                  <p className="mt-1 text-sm text-red-400">{errors.postalCode}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Underwriting Section */}
        <div className="border-t border-white/10 pt-6">
          <h3 className="text-lg font-semibold text-white mb-4">Underwriting Information</h3>

          <div className="space-y-4">
            {/* EIN & State of Incorporation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  EIN (Tax ID)
                </label>
                <input
                  type="text"
                  value={data.ein}
                  onChange={(e) => {
                    const cleaned = e.target.value.replace(/\D/g, '').slice(0, 9)
                    const formatted = cleaned.length > 2 ? `${cleaned.slice(0, 2)}-${cleaned.slice(2)}` : cleaned
                    updateData({ ein: formatted })
                  }}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="XX-XXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  State of Incorporation
                </label>
                <select
                  value={data.stateOfIncorporation}
                  onChange={(e) => updateData({ stateOfIncorporation: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="" className="bg-slate-800">Select state...</option>
                  {US_STATES.map(state => (
                    <option key={state} value={state} className="bg-slate-800">{state}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Business Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Business Description <span className="text-red-400">*</span>
              </label>
              <textarea
                value={data.businessDescription}
                onChange={(e) => updateData({ businessDescription: e.target.value })}
                rows={3}
                className={`w-full px-4 py-3 bg-white/5 border ${
                  errors.businessDescription ? 'border-red-500' : 'border-white/10'
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none`}
                placeholder="Briefly describe your business and what services/products you offer..."
              />
              {errors.businessDescription && (
                <p className="mt-1 text-sm text-red-400">{errors.businessDescription}</p>
              )}
            </div>

            {/* Company Size & Revenue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Employee Count
                </label>
                <select
                  value={data.employeeCount}
                  onChange={(e) => updateData({ employeeCount: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="" className="bg-slate-800">Select range...</option>
                  {EMPLOYEE_COUNTS.map(range => (
                    <option key={range.value} value={range.value} className="bg-slate-800">
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Annual Revenue
                </label>
                <select
                  value={data.annualRevenue}
                  onChange={(e) => updateData({ annualRevenue: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="" className="bg-slate-800">Select range...</option>
                  {REVENUE_RANGES.map(range => (
                    <option key={range.value} value={range.value} className="bg-slate-800">
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Volume & Transaction Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Expected Monthly Volume <span className="text-red-400">*</span>
                </label>
                <select
                  value={data.expectedMonthlyVolume}
                  onChange={(e) => updateData({ expectedMonthlyVolume: e.target.value })}
                  className={`w-full px-4 py-3 bg-white/5 border ${
                    errors.expectedMonthlyVolume ? 'border-red-500' : 'border-white/10'
                  } rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                >
                  <option value="" className="bg-slate-800">Select range...</option>
                  {VOLUME_RANGES.map(range => (
                    <option key={range.value} value={range.value} className="bg-slate-800">
                      {range.label}
                    </option>
                  ))}
                </select>
                {errors.expectedMonthlyVolume && (
                  <p className="mt-1 text-sm text-red-400">{errors.expectedMonthlyVolume}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Average Transaction Size
                </label>
                <input
                  type="text"
                  value={data.averageTransactionSize}
                  onChange={(e) => updateData({ averageTransactionSize: e.target.value })}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="$100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gaming Licenses (conditional) */}
        {isGamingRelated && (
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-white mb-4">Gaming Licenses</h3>

            <div className="mb-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={data.isLicensed}
                  onChange={(e) => updateData({ isLicensed: e.target.checked })}
                  className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                />
                <span className="text-gray-300">We hold gaming/betting licenses</span>
              </label>
            </div>

            {data.isLicensed && (
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Select states where you are licensed:
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                  {GAMING_LICENSES.map(license => (
                    <button
                      key={license.value}
                      type="button"
                      onClick={() => toggleLicense(license.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        data.gamingLicenses.includes(license.value)
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {license.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
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
