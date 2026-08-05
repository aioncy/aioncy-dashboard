import OnboardingFlow from '../../components/OnboardingFlow'
import styles from './OnboardingPage.module.scss'

export function OnboardingPage() {
  return (
    <div className={styles.page}>
      <section className={styles.formSection} aria-label="Onboarding">
        <div className={styles.formColumn}>
          <OnboardingFlow />
        </div>
      </section>

      <aside className={styles.heroSection} aria-hidden="true">
        <img src="/login/rightImage.png" alt="" className={styles.heroImage} />
      </aside>
    </div>
  )
}
