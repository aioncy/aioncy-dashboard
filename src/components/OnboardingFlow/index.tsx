import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import Button from '../Button'
import TextInput from '../TextInput'
import URLInput from '../URLInput'
import LogoMark from '../LogoMark'
import { saveOnboarding } from '../../lib/onboarding'
import styles from './OnboardingFlow.module.scss'

export interface OnboardingData {
  companyName: string
  companySize?: string
  website?: string
  referralSource?: string
  otherSource?: string
}

const COMPANY_SIZES = ['Startup (1-9)', 'Small business (10-20)', 'Mid-market (20 - 40)', 'Enterprise (70+)']
const REFERRAL_SOURCES = ['Instagram', 'Tiktok', 'Facebook', 'Friends', 'Others']
const TOTAL_STEPS = 4

interface SelectionChipProps {
  label: string
  selected: boolean
  onClick: () => void
}

const SelectionChip = ({ label, selected, onClick }: SelectionChipProps) => (
  <button
    type="button"
    className={`${styles.chip} ${selected ? styles.chipSelected : ''}`}
    onClick={onClick}
    aria-pressed={selected}
  >
    {label}
  </button>
)

const OnboardingFlow = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [companyName, setCompanyName] = useState('')
  const [companySize, setCompanySize] = useState('')
  const [website, setWebsite] = useState('')
  const [referralSource, setReferralSource] = useState('')
  const [otherSource, setOtherSource] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isOthersSelected = referralSource === 'Others'

  let canContinue = false
  switch (step) {
    case 1:
      canContinue = companyName.trim().length > 0
      break
    case 2:
      canContinue = Boolean(companySize)
      break
    case 3:
      canContinue = true
      break
    case 4:
      canContinue = Boolean(referralSource) && (referralSource !== 'Others' || otherSource.trim().length > 0)
      break
  }

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      await saveOnboarding({ companyName, companySize, website, referralSource, otherSource })
      navigate({ to: '/dashboard' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleNext = () => {
    if (isSubmitting || !canContinue) return
    if (step === TOTAL_STEPS) {
      handleSubmit()
      return
    }
    setStep(step + 1)
  }

  const handleBack = () => {
    if (isSubmitting || step === 1) return
    setStep(step - 1)
  }

  const handleSkip = () => {
    if (step < TOTAL_STEPS) setStep(step + 1)
  }

  return (
    <div className={styles.column}>
      <div
        className={styles.progress}
        role="progressbar"
        aria-label={`Step ${step} of ${TOTAL_STEPS}`}
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-valuenow={step}
      >
        {Array.from({ length: TOTAL_STEPS }, (_, index) => (
          <span
            key={index}
            className={`${styles.segment} ${index < step ? styles.segmentActive : ''}`}
          />
        ))}
      </div>

      <div className={styles.header}>
        <LogoMark className={styles.logo} />
        {step === 3 && (
          <Button variant="outline" size="sm" onClick={handleSkip}>
            Skip
          </Button>
        )}
      </div>

      <div className={styles.body}>
        {step === 1 && (
          <>
            <h1 className={styles.title}>What's the name of your company?</h1>
            <TextInput
              label="Company name"
              placeholder="Enter your company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              autoComplete="organization"
            />
          </>
        )}

        {step === 2 && (
          <>
            <h1 className={styles.title}>What's your company size?</h1>
            <div className={styles.chips}>
              {COMPANY_SIZES.map((size) => (
                <SelectionChip
                  key={size}
                  label={size}
                  selected={companySize === size}
                  onClick={() => setCompanySize(size)}
                />
              ))}
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className={styles.title}>Paste your website link to train your AI agent</h1>
            <URLInput
              label="Website link (recommended)"
              placeholder="yourcompany"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </>
        )}

        {step === 4 && (
          <>
            <h1 className={styles.title}>Lastly, where did you hear about us?</h1>
            <div className={styles.chips}>
              {REFERRAL_SOURCES.map((source) => (
                <SelectionChip
                  key={source}
                  label={source}
                  selected={referralSource === source}
                  onClick={() => setReferralSource(source)}
                />
              ))}
            </div>
            <div className={`${styles.otherField} ${isOthersSelected ? styles.otherFieldVisible : ''}`}>
              <TextInput
                label="Other source"
                placeholder="How did you hear about us?"
                value={otherSource}
                onChange={(e) => setOtherSource(e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      <div className={styles.actions}>
        {step > 1 && (
          <Button variant="outline" className={styles.back} onClick={handleBack} disabled={isSubmitting}>
            Back
          </Button>
        )}
        <Button
          variant="primary"
          className={`${styles.continue} ${isSubmitting ? styles.continueLoading : ''}`}
          onClick={handleNext}
          disabled={!canContinue || isSubmitting}
          icon={isSubmitting ? <span className={styles.spinner} aria-hidden="true" /> : undefined}
        >
          {step === TOTAL_STEPS ? 'Submit' : 'Continue'}
        </Button>
      </div>
    </div>
  )
}

export default OnboardingFlow
