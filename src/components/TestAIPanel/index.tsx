import { useEffect, useRef, useState, type FormEvent } from 'react'
import { Briefcase, Send, X } from 'lucide-react'
import LogoMark from '../LogoMark'
import styles from './TestAIPanel.module.scss'

interface TestMessage {
  id: string
  author: 'bot' | 'visitor'
  text: string
}

const CANNED_REPLY =
  'Hello! Thank you for reaching out. I would be happy to help you with our social media marketing services. We offer comprehensive packages that include content creation, posting schedules, and analytics. What specific platforms are you looking to focus on?'

const SUGGESTIONS = ['How can i checkout?', 'Show collections', 'Can i cancel my order?']

export interface TestAIPanelProps {
  open: boolean
  onClose: () => void
  title?: string
  initialMessages?: TestMessage[]
}

const DEFAULT_MESSAGES: TestMessage[] = [
  { id: 'm1', author: 'visitor', text: 'Hi, I am interested in your social media marketing services' },
  { id: 'm2', author: 'bot', text: CANNED_REPLY },
]

const TestAIPanel = ({
  open,
  onClose,
  title = 'Test',
  initialMessages = DEFAULT_MESSAGES,
}: TestAIPanelProps) => {
  const [messages, setMessages] = useState<TestMessage[]>(initialMessages)
  const [draft, setDraft] = useState('')
  const messagesRef = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)

  useEffect(() => {
    const node = messagesRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [messages])

  const sendMessage = (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const id = `sent-${(nextId.current += 1)}`
    setMessages((prev) => [
      ...prev,
      { id, author: 'visitor', text: trimmed },
      { id: `${id}-reply`, author: 'bot', text: CANNED_REPLY },
    ])
    setDraft('')
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    sendMessage(draft)
  }

  if (!open) return null

  return (
    <div className={styles.panel} role="dialog" aria-label={`${title} chat`}>
      <div className={styles.header}>
        <div className={styles.identity}>
          <span className={styles.avatar}>
            <Briefcase aria-hidden="true" />
          </span>
          <p className={styles.name}>{title}</p>
        </div>
        <button type="button" className={styles.close} onClick={onClose} aria-label="Close chat">
          <X aria-hidden="true" />
        </button>
      </div>

      <div className={styles.messages} ref={messagesRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.bubble} ${
              message.author === 'bot' ? styles.bot : styles.visitor
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>

      <div className={styles.suggestions}>
        {SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className={styles.suggestion}
            onClick={() => sendMessage(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.poweredBy}>
          <LogoMark className={styles.poweredByMark} />
          Powered by aioncy
        </div>

        <form className={styles.composer} onSubmit={submit}>
          <input
            type="text"
            className={styles.input}
            placeholder="Type a message..."
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label="Type a message"
          />
          <button
            type="submit"
            className={`${styles.send} ${draft.trim() ? styles.sendActive : ''}`}
            aria-label="Send message"
          >
            <Send aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default TestAIPanel
