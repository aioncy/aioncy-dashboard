import { useEffect, useRef, useState } from 'react'
import { ChevronRight, Clock, Pin, CircleCheck, UserPlus, User } from 'lucide-react'
import { avatarColor } from '../../lib/avatarColor'
import styles from './ActionMenu.module.scss'

export interface ActionMenuAssignee {
  name: string
}

export interface ActionMenuProps {
  assignees: ActionMenuAssignee[]
  onAssignTo?: (name: string) => void
  onSnooze?: (option: string) => void
  onPinChat?: () => void
  onCloseConversation?: () => void
  onClose: () => void
  className?: string
}

const SNOOZE_OPTIONS = [
  { label: 'Later today', time: 'In 3 hour' },
  { label: 'Tomorrow', time: 'Sun 9am' },
  { label: 'One week', time: 'Sat 8pm' },
  { label: 'One month', time: 'Jun 30' },
]

type SubmenuKey = 'assign' | 'snooze' | null

const ActionMenu = ({ assignees, onAssignTo, onSnooze, onPinChat, onCloseConversation, onClose, className = '' }: ActionMenuProps) => {
  const [activeSubmenu, setActiveSubmenu] = useState<SubmenuKey>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) onClose()
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose])

  return (
    <div className={`${styles.container} ${className}`} ref={containerRef}>
      <div className={styles.menu}>
        <div
          className={`${styles.item} ${activeSubmenu === 'assign' ? styles.itemActive : ''}`}
          onMouseEnter={() => setActiveSubmenu('assign')}
        >
          <UserPlus size={16} className={styles.icon} />
          <span className={styles.label}>Assign to</span>
          <ChevronRight size={16} className={styles.chevron} />
        </div>

        <div
          className={`${styles.item} ${activeSubmenu === 'snooze' ? styles.itemActive : ''}`}
          onMouseEnter={() => setActiveSubmenu('snooze')}
        >
          <Clock size={16} className={styles.icon} />
          <span className={styles.label}>Snooze conversation</span>
          <ChevronRight size={16} className={styles.chevron} />
        </div>

        <div
          className={styles.item}
          onMouseEnter={() => setActiveSubmenu(null)}
          onClick={() => {
            onPinChat?.()
            onClose()
          }}
        >
          <Pin size={16} className={styles.icon} />
          <span className={styles.label}>Pin chat</span>
        </div>

        <div
          className={styles.item}
          onMouseEnter={() => setActiveSubmenu(null)}
          onClick={() => {
            onCloseConversation?.()
            onClose()
          }}
        >
          <CircleCheck size={16} className={styles.icon} />
          <span className={styles.label}>Close conversation</span>
        </div>
      </div>

      {activeSubmenu === 'assign' && (
        <div className={styles.submenu} style={{ top: 0 }}>
          {assignees.map((assignee) => (
            <div
              key={assignee.name}
              className={styles.item}
              onClick={() => {
                onAssignTo?.(assignee.name)
                onClose()
              }}
            >
              <span className={styles.avatar} style={{ background: avatarColor(assignee.name) }}>
                <User size={12} />
              </span>
              <span className={styles.label}>{assignee.name}</span>
            </div>
          ))}
        </div>
      )}

      {activeSubmenu === 'snooze' && (
        <div className={styles.submenu} style={{ top: 42 }}>
          {SNOOZE_OPTIONS.map((option) => (
            <div
              key={option.label}
              className={styles.item}
              onClick={() => {
                onSnooze?.(option.label)
                onClose()
              }}
            >
              <span className={styles.label}>{option.label}</span>
              <span className={styles.trailingText}>{option.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ActionMenu
