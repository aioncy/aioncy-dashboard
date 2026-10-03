import { Briefcase, Send, X } from 'lucide-react'
import styles from './ChatWidgetPreview.module.scss'

export interface ChatWidgetPreviewProps {
  businessName?: string
  logoSrc?: string
  accentColor?: string
  greeting?: string
  sampleReply?: string
  placeholder?: string
  theme?: 'light' | 'dark'
  accentHeader?: boolean
  suggestedMessages?: string[]
  className?: string
}

const ChatWidgetPreview = ({
  businessName = 'Acme',
  logoSrc,
  accentColor = '#a153ff',
  greeting = 'Hi! What can I help you with?',
  sampleReply = 'Hi, I am interested in your social media marketing services',
  placeholder = 'Type a message...',
  theme = 'light',
  accentHeader = false,
  suggestedMessages = [],
  className = '',
}: ChatWidgetPreviewProps) => {
  const markColor = theme === 'dark' ? '#ffffff' : '#1A1A1A'

  return (
    <div
      className={`${styles.widget} ${theme === 'dark' ? styles.dark : ''} ${className}`}
    >
      <div
        className={`${styles.header} ${accentHeader ? styles.accentHeader : ''}`}
        style={accentHeader ? { background: accentColor } : undefined}
      >
        <div className={styles.identity}>
          <span className={styles.avatar} style={logoSrc ? undefined : { background: accentHeader ? '#ffffff26' : '#3b82f6' }}>
            {logoSrc ? <img src={logoSrc} alt="" /> : <Briefcase aria-hidden="true" />}
          </span>
          <p className={styles.name}>{businessName}</p>
        </div>
        <button type="button" className={styles.close} aria-label="Close chat">
          <X aria-hidden="true" />
        </button>
      </div>

      <div className={styles.messages}>
        <div className={`${styles.bubble} ${styles.bot}`}>{greeting}</div>
        <div
          className={`${styles.bubble} ${styles.visitor}`}
          style={{ background: accentColor }}
        >
          {sampleReply}
        </div>
      </div>

      {suggestedMessages.length > 0 && (
        <div className={styles.suggestions}>
          {suggestedMessages.map((message) => (
            <button
              key={message}
              type="button"
              className={styles.suggestionPill}
              tabIndex={-1}
            >
              {message}
            </button>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.poweredBy}>
          <svg
            className={styles.poweredByMark}
            width="11"
            height="13"
            viewBox="0 0 11 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <rect x="6.35938" width="3.87081" height="3.87081" rx="1.93541" fill={markColor} />
            <rect x="5.57617" width="3.87081" height="5.57581" rx="1.93541" transform="rotate(89.4575 5.57617 0)" fill={markColor} />
            <rect x="6.35938" y="4.60742" width="3.87081" height="7.46514" rx="1.93541" fill={markColor} />
            <rect x="3.62305" y="3.64062" width="3.87081" height="5.12647" rx="1.93541" transform="rotate(40.5353 3.62305 3.64062)" fill="#A153FF" />
          </svg>
          Powered by aioncy
        </div>

        <div className={styles.composer}>
          <input
            type="text"
            className={styles.input}
            placeholder={placeholder}
            readOnly
            tabIndex={-1}
            aria-label="Type a message"
          />
          <button
            type="button"
            className={styles.send}
            aria-label="Send message"
            tabIndex={-1}
            style={{ background: accentColor, color: '#ffffff' }}
          >
            <Send aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatWidgetPreview
