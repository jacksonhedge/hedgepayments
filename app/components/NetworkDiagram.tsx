'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function NetworkDiagram() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Consumer app (wallet) on the left
  const consumerApp = {
    name: 'Digital Wallet',
    icon: '💳',
    position: { x: 15, y: 50 },
    color: '#8B5CF6'
  }

  // Payment methods on the right
  const paymentMethods = [
    { name: 'Bankroll', icon: '🏦', position: { x: 85, y: 25 }, color: '#10B981' },
    { name: 'Visa', icon: '💳', position: { x: 85, y: 40 }, color: '#1A56DB' },
    { name: 'Venmo', icon: '💸', position: { x: 85, y: 55 }, color: '#3D95CE' },
    { name: 'PayPal', icon: '🅿️', position: { x: 85, y: 70 }, color: '#FFC439' },
    { name: 'Kalshi', icon: '📊', position: { x: 85, y: 85 }, color: '#6366F1' }
  ]

  return (
    <section className="py-20 px-4 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            The Payment Infrastructure Hub
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Connecting digital wallets to every payment method your users need
          </p>
        </motion.div>

        <div className="relative h-[500px] md:h-[600px]">
          {/* SVG for connection lines */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 1 }}
          >
            {/* Lines from consumer app to center */}
            {isVisible && (
              <motion.line
                x1="15%"
                y1="50%"
                x2="50%"
                y2="50%"
                stroke="url(#gradient1)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            )}

            {/* Lines from center to payment methods */}
            {isVisible && paymentMethods.map((method, index) => (
              <motion.line
                key={method.name}
                x1="50%"
                y1="50%"
                x2={`${method.position.x}%`}
                y2={`${method.position.y}%`}
                stroke="url(#gradient2)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 1.5, delay: index * 0.1, ease: "easeInOut" }}
              />
            ))}

            {/* Gradient definitions */}
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#EC4899" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#EC4899" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Animated particles along lines */}
            {isVisible && typeof window !== 'undefined' && (
              <>
                <circle r="4" fill="#8B5CF6">
                  <animateMotion
                    dur="3s"
                    repeatCount="indefinite"
                    path={`M 150,250 L 500,250`}
                  />
                </circle>
                {paymentMethods.map((method, index) => (
                  <circle key={`particle-${method.name}`} r="4" fill="#EC4899">
                    <animateMotion
                      dur="3s"
                      repeatCount="indefinite"
                      begin={`${index * 0.5}s`}
                      path={`M 500,250 L 850,${250 + (index - 2) * 75}`}
                    />
                  </circle>
                ))}
              </>
            )}
          </svg>

          {/* Consumer App Node */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute"
            style={{
              left: `${consumerApp.position.x}%`,
              top: `${consumerApp.position.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10
            }}
          >
            <div className="group">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                <div className="relative bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-6 border border-purple-400/20 shadow-2xl">
                  <div className="text-4xl mb-2">{consumerApp.icon}</div>
                  <div className="text-white font-semibold">{consumerApp.name}</div>
                  <div className="text-purple-200 text-sm mt-1">Consumer App</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Center Hub - Hedge Logo */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
            style={{ zIndex: 20 }}
          >
            <div className="relative group">
              {/* Pulsing ring effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-pulse blur-2xl opacity-50"></div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 animate-ping"></div>

              {/* Main hub */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-purple-600 via-pink-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20">
                <div className="text-white">
                  <div className="text-3xl md:text-4xl font-bold">Hedge</div>
                  <div className="text-xs text-center opacity-80">Payments Hub</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Method Nodes */}
          {paymentMethods.map((method, index) => (
            <motion.div
              key={method.name}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
              className="absolute"
              style={{
                left: `${method.position.x}%`,
                top: `${method.position.y}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 10
              }}
            >
              <div className="group">
                <div className="relative">
                  <div
                    className="absolute inset-0 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity"
                    style={{ backgroundColor: method.color }}
                  ></div>
                  <div
                    className="relative bg-gradient-to-br rounded-xl p-4 border shadow-xl backdrop-blur-sm"
                    style={{
                      background: `linear-gradient(135deg, ${method.color}20, ${method.color}40)`,
                      borderColor: `${method.color}40`
                    }}
                  >
                    <div className="text-2xl mb-1 text-center">{method.icon}</div>
                    <div className="text-white text-sm font-medium">{method.name}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Floating particles for ambiance */}
          {typeof window !== 'undefined' && [...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400 rounded-full"
              initial={{
                x: Math.random() * 1000,
                y: Math.random() * 600,
                opacity: 0
              }}
              animate={{
                x: Math.random() * 1000,
                y: Math.random() * 600,
                opacity: [0, 0.5, 0]
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-gray-300 max-w-3xl mx-auto text-lg">
            Hedge Payments acts as the central infrastructure layer, seamlessly connecting
            consumer applications with a diverse ecosystem of payment providers, enabling
            instant, secure transactions across multiple platforms.
          </p>
        </motion.div>
      </div>
    </section>
  )
}