import { useState, type FormEvent } from 'react'
import { Briefcase, Send, X } from 'lucide-react'
import LogoMark from '../LogoMark'
import styles from './ChatWidgetPreview.module.scss'

interface SentMessage {
  id: string
  text: string
}

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
  const [sent, setSent] = useState<SentMessage[]>([])
  const [draft, setDraft] = useState('')
  const [suggestionsUsed, setSuggestionsUsed] = useState(false)

  const sendText = (text: string) => {
    if (!text) return
    setSent((prev) => [...prev, { id: `${Date.now()}`, text }])
    setSuggestionsUsed(true)
  }

  const send = (event: FormEvent) => {
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    sendText(text)
    setDraft('')
  }

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
        {sent.map((message) => (
          <div
            key={message.id}
            className={`${styles.bubble} ${styles.visitor}`}
            style={{ background: accentColor }}
          >
            {message.text}
          </div>
        ))}
      </div>

      {suggestedMessages.length > 0 && !suggestionsUsed && (
        <div className={styles.suggestions}>
          {suggestedMessages.map((message) => (
            <button
              key={message}
              type="button"
              className={styles.suggestionPill}
              onClick={() => sendText(message)}
            >
              {message}
            </button>
          ))}
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.poweredBy}>
          <LogoMark
            className={styles.poweredByMark}
            markColor={theme === 'dark' ? '#ffffff' : 'black'}
          />
          Powered by aioncy
        </div>

        <form className={styles.composer} onSubmit={send}>
          <input
            type="text"
            className={styles.input}
            placeholder={placeholder}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="Type a message"
          />
          <button
            type="submit"
            className={styles.send}
            aria-label="Send message"
            style={draft.trim() ? { background: accentColor, color: '#ffffff' } : undefined}
          >
            <Send aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatWidgetPreview
