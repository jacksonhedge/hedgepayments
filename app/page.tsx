'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)

  // Add scroll listener for navbar effect
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', () => {
      setIsScrolled(window.scrollY > 20)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Hedge Payments
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-12">
            Modern payment infrastructure for the digital economy
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/business-signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors"
              >
                Sign Up - Business
              </motion.button>
            </Link>
            
            <Link href="/business-login">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-900 transition-all"
              >
                Login - Business
              </motion.button>
            </Link>
            
            <a href="https://bankroll.live" target="_blank" rel="noopener noreferrer">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-green-600 text-white rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors"
              >
                Visit Bankroll
              </motion.button>
            </a>
          </div>
        </motion.div>

        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-white text-center mb-16"
          >
            Our Products
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 hover:bg-opacity-20 transition-all"
            >
              <h3 className="text-2xl font-semibold text-white mb-4">Payment Processing</h3>
              <p className="text-gray-300">
                Secure, fast, and reliable payment processing for modern businesses
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 hover:bg-opacity-20 transition-all"
            >
              <h3 className="text-2xl font-semibold text-white mb-4">Round-Ups API</h3>
              <p className="text-gray-300">
                Innovative spare change solutions for savings and investments
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8 hover:bg-opacity-20 transition-all"
            >
              <h3 className="text-2xl font-semibold text-white mb-4">Banking Infrastructure</h3>
              <p className="text-gray-300">
                Complete banking solutions with ACH, wire transfers, and more
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}