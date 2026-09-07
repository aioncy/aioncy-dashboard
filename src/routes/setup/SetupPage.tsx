import { useState } from 'react'
import { ChevronRight, Circle } from 'lucide-react'
import PageHeader from '../../components/PageHeader'
import Button from '../../components/Button'
import { COLLABORATORS, handleShare } from '../../lib/dashboard'
import { useSetupProgress, type SetupStepId } from '../../lib/setupProgress'
import styles from './SetupPage.module.scss'

interface SetupStep {
  id: SetupStepId
  title: string
  description: string
  /** Shown once the step is done — the step keeps its place in the list. */
  completedDescription: string
  action: string
  secondaryAction?: string
  image: string
}

const STEPS: SetupStep[] = [
  {
    id: 'channels',
    title: 'Set up your channels to connect with your customers',
    description:
      'Connect Instagram, WhatsApp, Messenger, and your website so every customer message reaches you in one place.',
    completedDescription:
      'Manage your conversations across all channels: Messanger, Whatsapp, and socials Support your customer wherever they are directly from your aioncy conversation.',
    action: 'Setup channel',
    image: '/get%20set%20flow/first.png',
  },
  {
    id: 'train',
    title: 'Train AI to power your wingman',
    description:
      'Add your website, business FAQs, and documents so your AI can answer exactly like you.',
    completedDescription:
      'Your AI is trained on your website, FAQs, and documents. Add more sources any time to keep its answers sharp.',
    action: 'Train now',
    image: '/get%20set%20flow/second.png',
  },
  {
    id: 'deploy',
    title: 'Deploy your channels',
    description: 'Turn on your AI and start replying to customers automatically, 24/7.',
    completedDescription:
      'Your AI is live and replying to customers automatically, 24/7. Pause or adjust it any time from Channels.',
    action: 'Deploy now',
    secondaryAction: 'Skip for now',
    image: '/get%20set%20flow/third.png',
  },
]

export function SetupPage() {
  const { completed, total, completeStep: markStepComplete } = useSetupProgress()
  const [expandedId, setExpandedId] = useState(STEPS[0].id)

  const completeStep = (id: SetupStepId) => {
    const done = completed.includes(id) ? completed : [...completed, id]
    markStepComplete(id)
    const next = STEPS.find((step) => !done.includes(step.id))
    if (next) setExpandedId(next.id)
  }

  const expandedStep = STEPS.find((step) => step.id === expandedId) ?? STEPS[0]

  return (
    <div>
      <PageHeader title="Setup" collaborators={COLLABORATORS} onShare={handleShare} />

      <div className={styles.page}>
        <div className={styles.heading}>
          Get set up
          <span className={styles.dot} aria-hidden="true" />
          <span className={styles.progress}>{completed.length} / {total} steps</span>
        </div>

        <div className={styles.card}>
          <div className={styles.steps}>
            {STEPS.map((step, index) => {
              const isDone = completed.includes(step.id)
              const isExpanded = step.id === expandedId
              const isLast = index === STEPS.length - 1

              return (
                <div
                  key={step.id}
                  className={`${styles.step} ${isExpanded ? styles.stepExpanded : styles.stepCollapsed} ${
                    isLast ? styles.stepLast : ''
                  }`}
                >
                  {isExpanded ? (
                    <>
                      <div className={styles.stepHeader}>
                        <Circle className={styles.stepIcon} aria-hidden="true" />
                        <p className={`${styles.stepTitle} ${isDone ? styles.stepTitleDone : ''}`}>
                          {step.title}
                        </p>
                      </div>

                      <div className={styles.stepBody}>
                        <p className={styles.stepDescription}>
                          {isDone ? step.completedDescription : step.description}
                        </p>
                        <div className={styles.stepActions}>
                          <Button
                            variant="primary"
                            size="sm"
                            disabled={isDone}
                            onClick={() => completeStep(step.id)}
                          >
                            {step.action}
                          </Button>
                          {step.secondaryAction && !isDone && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => completeStep(step.id)}
                            >
                              {step.secondaryAction}
                            </Button>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <button
                      type="button"
                      className={styles.stepHeaderButton}
                      onClick={() => setExpandedId(step.id)}
                      aria-expanded={false}
                    >
                      <Circle className={styles.stepIcon} aria-hidden="true" />
                      <span className={`${styles.stepTitle} ${isDone ? styles.stepTitleDone : ''}`}>
                        {step.title}
                      </span>
                      <ChevronRight className={styles.stepChevron} aria-hidden="true" />
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          <div className={styles.illustration}>
            <img src={expandedStep.image} alt="" />
          </div>
        </div>
      </div>
    </div>
  )
}
