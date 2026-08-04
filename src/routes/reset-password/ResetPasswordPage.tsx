import React, { useState } from 'react'
import Button from '../../components/Button'
import TextInput from '../../components/TextInput'
import LogoMark from '../../components/LogoMark'
import styles from './ResetPasswordPage.module.scss'

export function ResetPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const maskEmail = (addr: string) => {
    const [local, domain] = addr.split('@')
    if (!local || !domain) return addr
    const visible = local.slice(0, Math.min(6, local.length))
    return `${visible}*****@${domain}`
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleResend = (e: React.MouseEvent) => {
    e.preventDefault()
    setSubmitted(false)
  }

  return (
    <div className={styles.page}>
      <section className={styles.formSection} aria-label="Reset password form">
        <div className={styles.formColumn}>
          <div className={styles.header}>
            <LogoMark />
            {submitted ? (
              <>
                <h1 className={styles.title}>Check your email</h1>
                <p className={styles.confirmText}>
                  We've sent a confirmation link to{' '}
                  <span className={styles.confirmEmail}>{maskEmail(email)}</span>.
                </p>
                <p className={styles.confirmSubtext}>
                  Confirm your email to reset your password.
                </p>
                <div className={styles.resendGap}>
                  <p className={styles.resendPrompt}>
                    Didn't receive a link?{' '}
                    <button
                      type="button"
                      className={styles.resendLink}
                      onClick={handleResend}
                    >
                      Resend
                    </button>
                  </p>
                </div>
              </>
            ) : (
              <>
                <h1 className={styles.title}>Reset Password</h1>
                <p className={styles.subtext}>
                  Enter your email to receive instructions to reset your password.
                </p>
              </>
            )}
          </div>

          {!submitted && (
            <form onSubmit={handleSubmit} noValidate>
              <TextInput
                label="Email"
                type="email"
                placeholder="Sth.aryan@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className={styles.emailField}
              />

              <div className={styles.submitGap}>
                <Button variant="primary" size="lg" className="w-full" type="submit">
                  Reset password
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>

      <aside className={styles.heroSection} aria-hidden="true">
        <img src="/login/rightImage.png" alt="" className={styles.heroImage} />
      </aside>
    </div>
  )
}
