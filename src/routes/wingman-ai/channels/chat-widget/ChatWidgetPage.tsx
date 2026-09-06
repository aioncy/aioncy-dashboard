import { useState, type ChangeEvent } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronLeft, GalleryVerticalEnd, Info, Upload } from 'lucide-react'
import PageHeader from '../../../../components/PageHeader'
import Tabs from '../../../../components/Tabs'
import Button from '../../../../components/Button'
import TextInput from '../../../../components/TextInput'
import Textarea, { CopyTextarea } from '../../../../components/Textarea'
import Switch from '../../../../components/Switch'
import ChatWidgetPreview from '../../../../components/ChatWidgetPreview'
import { COLLABORATORS, handleShare } from '../../../../lib/dashboard'
import styles from './ChatWidgetPage.module.scss'

const TABS = [
  { label: 'Content', value: 'content' },
  { label: 'Style', value: 'style' },
  { label: 'Embed', value: 'embed' },
]

const EMBED_SNIPPET = `<script src="https://cdn.aioncy.ai/widget.js" data-widget-id="acme" defer></script>`

interface WidgetConfig {
  displayName: string
  initialMessage: string
  useMobileMessage: boolean
  showSuggestedMessages: boolean
  messagePlaceholder: string
  theme: 'light' | 'dark'
  logoSrc?: string
  primaryColor: string
  accentHeader: boolean
}

const DEFAULT_CONFIG: WidgetConfig = {
  displayName: '',
  initialMessage: 'Hi! What can I help you with?',
  useMobileMessage: false,
  showSuggestedMessages: false,
  messagePlaceholder: '',
  theme: 'light',
  primaryColor: '#a153ff',
  accentHeader: false,
}

export function ChatWidgetPage() {
  const [activeTab, setActiveTab] = useState('content')
  const [savedConfig, setSavedConfig] = useState(DEFAULT_CONFIG)
  const [config, setConfig] = useState(DEFAULT_CONFIG)

  const isDirty = (Object.keys(config) as (keyof WidgetConfig)[]).some(
    (key) => config[key] !== savedConfig[key],
  )

  const update = <K extends keyof WidgetConfig>(key: K, value: WidgetConfig[K]) =>
    setConfig((previous) => ({ ...previous, [key]: value }))

  const handleLogoUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    update('logoSrc', URL.createObjectURL(file))
  }

  return (
    <div className={styles.page}>
      <PageHeader
        breadcrumbItems={[
          { label: 'Channels', href: '/wingman-ai/channels' },
          { label: 'Chat Widget' },
        ]}
        collaborators={COLLABORATORS}
        onShare={handleShare}
      />

      <div className={styles.body}>
        <aside className={styles.panel}>
          <div className={styles.panelScroll}>
            <div className={styles.panelHead}>
              <div className={styles.backRow}>
                <Link to="/wingman-ai/channels" className={styles.backLink}>
                  <ChevronLeft aria-hidden="true" />
                  Back to channels
                </Link>
              </div>

              <div className={styles.titleBlock}>
                <div className={styles.titleRow}>
                  <h2 className={styles.title}>Chat widget</h2>
                </div>
                <Tabs
                  tabs={TABS}
                  value={activeTab}
                  onChange={setActiveTab}
                  className={styles.tabs}
                />
              </div>
            </div>

            {activeTab === 'content' && (
              <div className={styles.panelBody}>
                <TextInput
                  className={styles.field}
                  label="Display name"
                  placeholder="Enter display name"
                  value={config.displayName}
                  onChange={(event) => update('displayName', event.target.value)}
                />

                <div className={styles.section}>
                  <Textarea
                    className={styles.field}
                    label="Initial message"
                    value={config.initialMessage}
                    onChange={(event) => update('initialMessage', event.target.value)}
                  />

                  <div className={styles.toggleRow}>
                    <div className={styles.toggleLabel}>
                      Use different initial message on mobile
                      <Info className={styles.infoIcon} aria-hidden="true" />
                    </div>
                    <Switch
                      checked={config.useMobileMessage}
                      onChange={(checked) => update('useMobileMessage', checked)}
                      aria-label="Use different initial message on mobile"
                    />
                  </div>
                </div>

                <div className={styles.section}>
                  <div className={`${styles.toggleRow} ${styles.toggleRowFilled}`}>
                    <div className={styles.toggleLabel}>
                      Show suggested messages
                      <Info className={styles.infoIcon} aria-hidden="true" />
                    </div>
                    <Switch
                      checked={config.showSuggestedMessages}
                      onChange={(checked) => update('showSuggestedMessages', checked)}
                      aria-label="Show suggested messages"
                    />
                  </div>
                </div>

                <TextInput
                  className={styles.field}
                  label="Message placeholder"
                  placeholder="Message..."
                  value={config.messagePlaceholder}
                  onChange={(event) => update('messagePlaceholder', event.target.value)}
                />
              </div>
            )}

            {activeTab === 'style' && (
              <div className={styles.panelBody}>
                <div className={styles.section}>
                  <div className={styles.field}>
                    <p className={styles.fieldLabel}>Appearance</p>
                    <div className={styles.themeCards}>
                      {(['light', 'dark'] as const).map((option) => (
                        <button
                          key={option}
                          type="button"
                          className={`${styles.themeCard} ${config.theme === option ? styles.themeCardActive : ''}`}
                          onClick={() => update('theme', option)}
                          aria-pressed={config.theme === option}
                        >
                          <span
                            className={`${styles.themeThumb} ${option === 'dark' ? styles.themeThumbDark : ''}`}
                          >
                            <span className={styles.themeWindow}>
                              <span className={styles.themeBar} />
                              <span className={styles.themeBlock}>
                                <span className={styles.themeBlockBar} />
                              </span>
                            </span>
                          </span>
                          <span className={styles.themeFooter}>
                            {option === 'light' ? 'Light' : 'Dark'}
                            <span
                              className={`${styles.radio} ${config.theme === option ? styles.radioActive : ''}`}
                            />
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={styles.section}>
                  <p className={styles.fieldLabel}>Widget profile picture</p>
                  <div className={styles.uploadRow}>
                    <div className={styles.uploadInfo}>
                      <span className={styles.uploadThumb}>
                        {config.logoSrc ? (
                          <img src={config.logoSrc} alt="" />
                        ) : (
                          <GalleryVerticalEnd aria-hidden="true" />
                        )}
                      </span>
                      <p className={styles.uploadHint}>JPG, PNG, and SVG up to 1MB</p>
                    </div>
                    <label className={styles.uploadButton}>
                      <Upload aria-hidden="true" />
                      Upload
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/svg+xml"
                        className={styles.fileInput}
                        onChange={handleLogoUpload}
                      />
                    </label>
                  </div>
                </div>

                <div className={styles.sectionLast}>
                  <div className={styles.colorRow}>
                    <p className={styles.fieldLabel}>Primary color</p>
                    <label className={styles.colorChip}>
                      <span
                        className={styles.colorSwatch}
                        style={{ background: config.primaryColor }}
                      />
                      {config.primaryColor.toUpperCase()}
                      <input
                        type="color"
                        value={config.primaryColor}
                        onChange={(event) => update('primaryColor', event.target.value)}
                        className={styles.colorInput}
                        aria-label="Primary color"
                      />
                    </label>
                  </div>

                  <div className={`${styles.toggleRow} ${styles.toggleRowFilled}`}>
                    <div className={styles.toggleLabel}>Use primary color for header</div>
                    <Switch
                      checked={config.accentHeader}
                      onChange={(checked) => update('accentHeader', checked)}
                      aria-label="Use primary color for header"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'embed' && (
              <div className={styles.panelBody}>
                <div className={styles.steps}>
                  <div className={styles.stepWithCode}>
                    <div className={styles.step}>
                      <p className={styles.stepTitle}>Step 1: Copy the code </p>
                      <p className={styles.stepText}>
                        Add this code to your site to install the AI-powered chat widget.
                      </p>
                    </div>

                    <CopyTextarea value={EMBED_SNIPPET} />
                  </div>

                  <div className={styles.step}>
                    <p className={styles.stepTitle}>Step 2: Open your website's code</p>
                    <p className={styles.stepText}>
                      Go to your website's HTML file, or the code/embed section of your website
                      builder (WordPress, Wix, Shopify, etc.).
                    </p>
                  </div>

                  <div className={styles.stepGroup}>
                    <div className={styles.step}>
                      <p className={styles.stepTitle}>Step 3: Paste the code</p>
                      <p className={styles.stepText}>Paste the code in the following place:</p>
                    </div>
                    <p className={styles.stepText}>
                      {'Before the closing </body> tag (Recommended) — keeps your site loading fast for visitors'}
                    </p>
                  </div>

                  <div className={styles.step}>
                    <p className={styles.stepTitle}>Step 4: Save and publish</p>
                    <p className={styles.stepText}>Save your changes and publish your website.</p>
                  </div>
                </div>
              </div>
            )}

          </div>

          {isDirty && (
            <div className={styles.savePopup} role="status">
              <div className={styles.savePopupText}>
                You have unsaved changes. Do you wish to save them?
              </div>
              <div className={styles.savePopupActions}>
                <Button
                  variant="outline"
                  size="sm"
                  className={styles.savePopupButton}
                  onClick={() => setConfig(savedConfig)}
                >
                  Discard
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  className={styles.savePopupButton}
                  onClick={() => setSavedConfig(config)}
                >
                  Save changes
                </Button>
              </div>
            </div>
          )}
        </aside>

        <section className={styles.preview}>
          <ChatWidgetPreview
            businessName={config.displayName.trim() || 'Acme'}
            greeting={config.initialMessage}
            placeholder={config.messagePlaceholder.trim() || 'Type a message...'}
            logoSrc={config.logoSrc}
            accentColor={config.primaryColor}
            theme={config.theme}
            accentHeader={config.accentHeader}
          />
        </section>
      </div>
    </div>
  )
}
