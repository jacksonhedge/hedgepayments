import Link from 'next/link'
import AuthShell from '../components/auth/AuthShell'
import styles from '../components/auth/auth.module.css'

export default function UserLogin() {
  return (
    <AuthShell
      eyebrow="● For Users"
      title="Welcome back"
      subtitle="Log in to your Chance wallet."
      footer={<>Don&apos;t have an account? <Link href="/signup" className={styles.link}>Sign up</Link></>}
    >
      <form className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="email">Email address</label>
          <input className={styles.input} type="email" id="email" placeholder="you@email.com" required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">Password</label>
          <input className={styles.input} type="password" id="password" placeholder="••••••••" required />
        </div>
        <div className={styles.row}>
          <label className={styles.remember}><input type="checkbox" /> Remember me</label>
          <Link href="/forgot-password" className={styles.link}>Forgot password?</Link>
        </div>
        <button className={styles.submit} type="submit">Log in →</button>
      </form>
    </AuthShell>
  )
}
