import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import SidePanel from '../SidePanel'
import Tabs, { type TabItem } from '../Tabs'
import TextInput from '../TextInput'
import URLInput from '../URLInput'
import Button from '../Button'
import CheckIcon from '../CheckIcon'
import styles from './WebsiteSyncPanel.module.scss'

export type WebsiteSyncMode = 'create' | 'edit'

type StepValue = 'connect' | 'pages' | 'review'

export interface WebsiteSyncPayload {
  title: string
  host: string
  link: string
  pages: string[]
  syncFrequency: string
}

export interface WebsiteSyncPanelProps {
  mode: WebsiteSyncMode
  /** Host without protocol or TLD, e.g. "demoapp". */
  initialHost?: string
  initialTitle?: string
  onClose: () => void
  onSubmit: (payload: WebsiteSyncPayload) => void
}

/** Pages the crawler reports back for the entered host. */
const DISCOVERED_PAGES = ['/blog', '/terms', '/services', '/product']

const CREATE_STEPS: StepValue[] = ['connect', 'pages', 'review']
const EDIT_STEPS: StepValue[] = ['pages', 'review']

const STEP_LABELS: Record<StepValue, string> = {
  connect: 'Connect',
  pages: 'Pages',
  review: 'Review',
}

const WebsiteSyncPanel = ({
  mode,
  initialHost = '',
  initialTitle = '',
  onClose,
  onSubmit,
}: WebsiteSyncPanelProps) => {
  // The caller mounts this panel only while it is open (keyed per source), so
  // state initialises from props instead of being reset in an effect.
  const steps = mode === 'create' ? CREATE_STEPS : EDIT_STEPS
  const [step, setStep] = useState<StepValue>(steps[0])
  const [host, setHost] = useState(initialHost)
  const [title, setTitle] = useState(initialTitle)
  const [selectedPages, setSelectedPages] = useState<string[]>(
    mode === 'edit' ? DISCOVERED_PAGES : [],
  )

  const stepIndex = steps.indexOf(step)
  const rootUrl = `https://${host.trim() || 'yourcompany'}.com`
  const link = `www.${host.trim() || 'yourcompany'}.com`
  const syncFrequency = mode === 'create' ? 'Every month' : 'Every week'

  const allSelected = selectedPages.length === DISCOVERED_PAGES.length
  const someSelected = selectedPages.length > 0 && !allSelected

  const tabs = useMemo<TabItem[]>(
    () =>
      steps.map((value, index) => ({
        value,
        label: STEP_LABELS[value],
        icon: index < stepIndex ? <CheckIcon size={16} /> : undefined,
      })),
    [steps, stepIndex],
  )

  const togglePage = (page: string) => {
    setSelectedPages((prev) =>
      prev.includes(page) ? prev.filter((p) => p !== page) : [...prev, page],
    )
  }

  const toggleAll = () => {
    setSelectedPages((prev) => (prev.length === DISCOVERED_PAGES.length ? [] : DISCOVERED_PAGES))
  }

  const goToStep = (value: string) => {
    // Steps behave as a stepper: you can go back to a completed step, not skip ahead.
    if (steps.indexOf(value as StepValue) <= stepIndex) setStep(value as StepValue)
  }

  const goNext = () => {
    const next = steps[stepIndex + 1]
    if (!next) return
    if (step === 'connect' && !title.trim()) setTitle(host.trim())
    setStep(next)
  }

  const goPrevious = () => {
    const previous = steps[stepIndex - 1]
    if (previous) setStep(previous)
  }

  const handleSubmit = () => {
    onSubmit({
      title: title.trim() || host.trim(),
      host: host.trim(),
      link,
      pages: selectedPages,
      syncFrequency,
    })
  }

  const canContinue = step === 'connect' ? Boolean(host.trim()) : Boolean(title.trim())
  const isLastStep = stepIndex === steps.length - 1
  const submitLabel = mode === 'create' ? 'Sync website' : 'Save and re-sync'

  const footer =
    mode === 'create' ? (
      <>
        {stepIndex > 0 && (
          <Button variant="outline" size="sm" className={styles.footerStart} onClick={goPrevious}>
            Previous
          </Button>
        )}
        {isLastStep ? (
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {submitLabel}
          </Button>
        ) : (
          <Button variant="primary" size="sm" disabled={!canContinue} onClick={goNext}>
            Next
          </Button>
        )}
      </>
    ) : (
      <>
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        {isLastStep ? (
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            {submitLabel}
          </Button>
        ) : (
          <Button variant="primary" size="sm" disabled={!canContinue} onClick={goNext}>
            Next
          </Button>
        )}
      </>
    )

  return (
    <SidePanel
      isOpen
      onClose={onClose}
      title={mode === 'create' ? 'Sync website' : 'Website settings'}
      footer={footer}
    >
      <Tabs tabs={tabs} value={step} onChange={goToStep} />

      {step === 'connect' && (
        <div className={styles.step}>
          <img
            className={styles.heroImage}
            src="/wingman/sync-website.png"
            alt=""
          />

          <div className={styles.section}>
            <div className={styles.headingGroup}>
              <h3 className={styles.sectionTitle}>Main website link</h3>
              <p className={styles.sectionSubtitle}>Manage your wingman&apos;s working hours</p>
            </div>
            <URLInput
              label="Main website link"
              hideLabel
              placeholder="demoapp"
              value={host}
              onChange={(e) => setHost(e.target.value)}
            />
          </div>
        </div>
      )}

      {step === 'pages' && (
        <div className={styles.step}>
          <TextInput
            label="Title"
            value={title}
            placeholder="demoapp"
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className={styles.section}>
            <div className={styles.headingGroup}>
              <h3 className={styles.sectionTitle}>Review pages to sync</h3>
              <p className={styles.sectionSubtitle}>Manage your wingman&apos;s working hours</p>
            </div>

            <div className={styles.tree}>
              <div className={styles.treeRow}>
                <span className={styles.treeCaret} aria-hidden="true">
                  <ChevronDown size={16} />
                </span>
                <input
                  id="sync-pages-all"
                  type="checkbox"
                  className={styles.checkbox}
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected
                  }}
                  onChange={toggleAll}
                />
                <label className={styles.treeLabel} htmlFor="sync-pages-all">
                  {rootUrl}
                </label>
              </div>

              {DISCOVERED_PAGES.map((page) => (
                <div key={page} className={styles.treeRow}>
                  <span className={styles.treeIndent} aria-hidden="true" />
                  <input
                    id={`sync-page-${page.replace('/', '')}`}
                    type="checkbox"
                    className={styles.checkbox}
                    checked={selectedPages.includes(page)}
                    onChange={() => togglePage(page)}
                  />
                  <label
                    className={styles.treeLabel}
                    htmlFor={`sync-page-${page.replace('/', '')}`}
                  >
                    {page}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 'review' && (
        <div className={styles.step}>
          <div className={styles.section}>
            <div className={styles.headingGroup}>
              <h3 className={styles.sectionTitle}>Review and finish</h3>
              <p className={styles.sectionSubtitle}>Manage your wingman&apos;s working hours</p>
            </div>

            <div className={styles.summaryCard}>
              <div className={styles.summaryGroup}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Source</span>
                  <span className={styles.summaryValue}>Website</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabelMuted}>Link</span>
                  <a
                    className={styles.summaryLink}
                    href={`https://${link}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {link}
                  </a>
                </div>
              </div>

              <div className={styles.summaryGroup}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Sync frequency</span>
                  <span className={styles.summaryValue}>{syncFrequency}</span>
                </div>
              </div>

              <div className={styles.summaryGroup}>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Content</span>
                  <span className={styles.summaryValue}>
                    {selectedPages.length} {selectedPages.length === 1 ? 'page' : 'pages'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </SidePanel>
  )
}

export default WebsiteSyncPanel
