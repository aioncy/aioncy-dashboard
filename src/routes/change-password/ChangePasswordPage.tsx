import React, { useState } from 'react'
import Button from '../../components/Button'
import PasswordInput from '../../components/PasswordInput'
import LogoMark from '../../components/LogoMark'
import styles from './ChangePasswordPage.module.scss'

export function ChangePasswordPage() {
  const [password, setPassword] = useState('')
  const [rePassword, setRePassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className={styles.page}>
      <section className={styles.formSection} aria-label="Change password form">
        <div className={styles.formColumn}>
          <div className={styles.header}>
            <LogoMark />
            <h1 className={styles.title}>Change Password</h1>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.passwordField}>
              <label className={styles.fieldLabel} htmlFor="new-password">
                New password
              </label>
              <PasswordInput
                id="new-password"
                label="New password"
                hideLabel
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className={styles.passwordField}>
              <label className={styles.fieldLabel} htmlFor="re-enter-password">
                Re-enter password
              </label>
              <PasswordInput
                id="re-enter-password"
                label="Re-enter password"
                hideLabel
                placeholder="Password"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
              />
            </div>

            <div className={styles.submitGap}>
              <Button variant="primary" size="lg" className="w-full" type="submit">
                Update password
              </Button>
            </div>
          </form>
        </div>
      </section>

      <aside className={styles.heroSection} aria-hidden="true">
        <img src="/login/rightImage.png" alt="" className={styles.heroImage} />
      </aside>
    </div>
  )
}
