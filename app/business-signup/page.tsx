'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
// import { createBusinessAccount } from '@/lib/firebase/auth'

export default function BusinessSignUp() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    businessType: '',
    expectedVolume: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.businessName) newErrors.businessName = 'Business name is required'
    if (!formData.contactName) newErrors.contactName = 'Contact name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.phone) newErrors.phone = 'Phone number is required'
    if (!formData.businessType) newErrors.businessType = 'Business type is required'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    
    try {
      // Temporarily disabled for Firebase hosting migration
      // const { user, businessData } = await createBusinessAccount({
      //   email: formData.email,
      //   password: formData.password,
      //   businessName: formData.businessName,
      //   contactName: formData.contactName,
      //   phone: formData.phone,
      //   website: formData.website,
      //   businessType: formData.businessType,
      //   expectedVolume: formData.expectedVolume
      // })

      // Success! Redirect to dashboard
      console.log('Business signup temporarily disabled during migration')
      router.push('/dashboard')
    } catch (error: any) {
      setErrors({
        submit: error.message || 'Failed to create account. Please try again.'
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-8 md:p-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">
            Business Sign Up
          </h1>
          <p className="text-gray-300 text-center mb-8">
            Join Hedge Payments to access our payment infrastructure
          </p>

          {errors.submit && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-100 px-4 py-3 rounded-lg mb-6">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white bg-opacity-20 border ${errors.businessName ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors`}
                  placeholder="Your Business Inc."
                />
                {errors.businessName && <p className="text-red-400 text-sm mt-1">{errors.businessName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Contact Name *
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white bg-opacity-20 border ${errors.contactName ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors`}
                  placeholder="John Doe"
                />
                {errors.contactName && <p className="text-red-400 text-sm mt-1">{errors.contactName}</p>}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Business Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white bg-opacity-20 border ${errors.email ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors`}
                  placeholder="contact@business.com"
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white bg-opacity-20 border ${errors.phone ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors`}
                  placeholder="+1 (555) 123-4567"
                />
                {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-2">
                Website (Optional)
              </label>
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white bg-opacity-20 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="https://www.yourbusiness.com"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Business Type *
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white bg-opacity-20 border ${errors.businessType ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors`}
                >
                  <option value="" className="bg-gray-800">Select business type</option>
                  <option value="fintech" className="bg-gray-800">Fintech</option>
                  <option value="gaming" className="bg-gray-800">Gaming/Sports Betting</option>
                  <option value="ecommerce" className="bg-gray-800">E-commerce</option>
                  <option value="saas" className="bg-gray-800">SaaS</option>
                  <option value="marketplace" className="bg-gray-800">Marketplace</option>
                  <option value="other" className="bg-gray-800">Other</option>
                </select>
                {errors.businessType && <p className="text-red-400 text-sm mt-1">{errors.businessType}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Expected Monthly Volume
                </label>
                <select
                  name="expectedVolume"
                  value={formData.expectedVolume}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white bg-opacity-20 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="" className="bg-gray-800">Select volume</option>
                  <option value="0-10k" className="bg-gray-800">$0 - $10,000</option>
                  <option value="10k-50k" className="bg-gray-800">$10,000 - $50,000</option>
                  <option value="50k-100k" className="bg-gray-800">$50,000 - $100,000</option>
                  <option value="100k-500k" className="bg-gray-800">$100,000 - $500,000</option>
                  <option value="500k+" className="bg-gray-800">$500,000+</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white bg-opacity-20 border ${errors.password ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors`}
                  placeholder="••••••••"
                />
                {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white bg-opacity-20 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-600'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors`}
                  placeholder="••••••••"
                />
                {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="mr-2"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-300">
                I agree to the <Link href="/terms" className="text-purple-400 hover:text-purple-300">Terms of Service</Link> and <Link href="/privacy" className="text-purple-400 hover:text-purple-300">Privacy Policy</Link>
              </label>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-purple-600 text-white rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </motion.button>
          </form>

          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 bg-opacity-50 text-gray-400">Or sign up with</span>
              </div>
            </div>

            <motion.button
              type="button"
              onClick={() => {/* Implement Google Sign Up */}}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-4 w-full py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </motion.button>
          </div>

          <p className="text-center text-gray-300 mt-6">
            Already have an account?{' '}
            <Link href="/business-login" className="text-purple-400 hover:text-purple-300 font-medium">
              Log In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}