import React, { useState } from 'react'
import { Link } from '@tanstack/react-router'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import PasswordInput from '../../components/PasswordInput'
import LogoMark from '../../components/LogoMark'
import styles from './LoginPage.module.scss'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M17.64 9.20453C17.64 8.56635 17.5827 7.95271 17.4764 7.36362H9V10.8449H13.8436C13.635 11.9699 13.0009 12.9231 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9454 17.64 9.20453Z"
      fill="#4285F4"
    />
    <path
      d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.64909 14.4204 4.67181 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9831 5.48182 18 9 18Z"
      fill="#34A853"
    />
    <path
      d="M3.96409 10.71C3.78409 10.17 3.68182 9.59316 3.68182 9C3.68182 8.40684 3.78409 7.83 3.96409 7.29V4.95816H0.957273C0.347727 6.17316 0 7.54773 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z"
      fill="#FBBC05"
    />
    <path
      d="M9 3.57955C10.3214 3.57955 11.5077 4.03363 12.4405 4.92543L15.0218 2.3441C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95816L3.96409 7.29C4.67182 5.16272 6.64909 3.57955 9 3.57955Z"
      fill="#EA4335"
    />
  </svg>
)

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className={styles.page}>
      <section className={styles.formSection} aria-label="Sign in form">
        <div className={styles.formColumn}>
          <div className={styles.header}>
            <LogoMark />
            <h1 className={styles.title}>Sign in to aioncy</h1>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <Button variant="outline" size="lg" className="w-full" type="button" icon={<GoogleIcon />}>
              Sign in with Google
            </Button>

            <div className={styles.divider} role="separator" aria-label="or">
              <span className={styles.dividerLine} />
              <span className={styles.dividerText}>OR</span>
              <span className={styles.dividerLine} />
            </div>

            <div className={styles.fields}>
              <TextInput
                label="Email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className={styles.emailField}
              />

              <div className={styles.passwordRow}>
                <label className={styles.passwordLabel} htmlFor="login-password">
                  Password
                </label>
                <Link to="/reset-password" className={styles.forgotLink}>
                  Forgot password?
                </Link>
              </div>
              <PasswordInput
                id="login-password"
                label="Password"
                hideLabel
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className={styles.submitGap}>
                <Button variant="primary" size="lg" className="w-full" type="submit">
                  Sign In
                </Button>
              </div>
            </div>
          </form>

          <p className={styles.footer}>
            Don't have an account?{' '}
            <Link to="/signup" className={styles.signupLink}>
              Sign up
            </Link>
          </p>
        </div>
      </section>

      <aside className={styles.heroSection} aria-hidden="true">
        <img src="/login/rightImage.png" alt="" className={styles.heroImage} />
      </aside>
    </div>
  )
}