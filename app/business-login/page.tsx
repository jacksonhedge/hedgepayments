'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@/app/utils/supabase-client'
import AuthShell from '../components/auth/AuthShell'
import styles from '../components/auth/auth.module.css'

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
    <AuthShell
      eyebrow="● Merchant login"
      title="Welcome back"
      subtitle="Log in to your Hedge Payments dashboard."
      footer={<>New here? <Link href="/get-started" className={styles.link}>Start free</Link></>}
    >
      {loginError && <div className={styles.error}>{loginError}</div>}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Email address</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange}
            className={`${styles.input} ${errors.email ? styles.inputErr : ''}`} placeholder="you@company.com" />
          {errors.email && <span className={styles.fieldErr}>{errors.email}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange}
            className={`${styles.input} ${errors.password ? styles.inputErr : ''}`} placeholder="••••••••" />
          {errors.password && <span className={styles.fieldErr}>{errors.password}</span>}
        </div>
        <div className={styles.row}>
          <label className={styles.remember}>
            <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleChange} /> Remember me
          </label>
          <Link href="/forgot-password" className={styles.link}>Forgot password?</Link>
        </div>
        <button type="submit" disabled={isLoading} className={styles.submit}>
          {isLoading ? 'Logging in…' : 'Log in →'}
        </button>
      </form>
    </AuthShell>
  )
}
