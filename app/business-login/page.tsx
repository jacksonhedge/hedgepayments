'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { createClientComponentClient } from '@/app/utils/supabase-client'
import styles from './page.module.css'

export default function BusinessLogin() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loginError, setLoginError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      })
    }
    setLoginError(null)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.password) newErrors.password = 'Password is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)
    setLoginError(null)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })

      if (error) {
        setLoginError(error.message)
        setIsLoading(false)
        return
      }

      router.push('/dashboard')
    } catch (error: any) {
      setLoginError(error.message || 'An error occurred')
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.grid} aria-hidden />
      <div className={styles.scanlines} aria-hidden />

      <nav className={styles.nav}>
        <Link href="/" className={styles.logo}>
          HEDGE
        </Link>
        <Link href="/get-started" className={styles.navCta}>
          Insert Coin ▸
        </Link>
      </nav>

      <div className={styles.cardWrap}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{ width: '100%', maxWidth: 420 }}
        >
          <div className={styles.card}>
            <div className={styles.eyebrow}>● Merchant login</div>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.sub}>Log in to your Hedge Payments dashboard.</p>

            {loginError && <div className={styles.error}>{loginError}</div>}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div>
                <label className={styles.label}>Email address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.email ? styles.inputErr : ''}`}
                  placeholder="you@company.com"
                />
                {errors.email && <span className={styles.fieldErr}>{errors.email}</span>}
              </div>

              <div>
                <label className={styles.label}>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.password ? styles.inputErr : ''}`}
                  placeholder="••••••••"
                />
                {errors.password && <span className={styles.fieldErr}>{errors.password}</span>}
              </div>

              <div className={styles.row}>
                <label className={styles.remember}>
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  Remember me
                </label>
                <Link href="/forgot-password" className={styles.link}>
                  Forgot password?
                </Link>
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={styles.submit}
              >
                {isLoading ? 'Logging in…' : 'Log in →'}
              </motion.button>
            </form>

            <div className={styles.foot}>
              New here?{' '}
              <Link href="/get-started" className={styles.link}>
                Start free
              </Link>
            </div>
            <Link href="/" className={styles.back}>
              ← Back to home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}