import React, { useState } from 'react'
import { CircleAlert, X } from 'lucide-react'
import styles from './AlertBar.module.scss'

export interface AlertBarProps {
  message: React.ReactNode
  icon?: React.ReactNode
  actionLabel?: string
  onAction?: () => void
  dismissible?: boolean
  onDismiss?: () => void
  className?: string
}

const AlertBar = ({
  message,
  icon,
  actionLabel,
  onAction,
  dismissible = false,
  onDismiss,
  className = '',
}: AlertBarProps) => {
  const [hidden, setHidden] = useState(false)

  if (hidden) return null

  return (
    <div className={`${styles.bar} ${className}`}>
      <div className={styles.left}>
        <span className={styles.icon}>{icon ?? <CircleAlert size={20} />}</span>
        <span className={styles.message}>{message}</span>
      </div>
      <div className={styles.right}>
        {actionLabel && (
          <a
            className={styles.action}
            href={onAction ? '#action' : undefined}
            onClick={onAction ? (e) => { e.preventDefault(); onAction() } : undefined}
          >
            {actionLabel}
          </a>
        )}
        {dismissible && (
          <button
            type="button"
            className={styles.close}
            aria-label="Dismiss alert"
            onClick={() => {
              if (onDismiss) onDismiss()
              else setHidden(true)
            }}
          >
            <X size={20} />
          </button>
        )}
      </div>
    </div>
  )
}

export default AlertBar
