import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import styles from './SidePanel.module.scss'

export interface SidePanelProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  width?: number
  children: React.ReactNode
  /** Pinned to the bottom of the panel, below the scrolling body. */
  footer?: React.ReactNode
  className?: string
}

const SidePanel = ({
  isOpen,
  onClose,
  title,
  width,
  children,
  footer,
  className = '',
}: SidePanelProps) => {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <aside
        className={`${styles.panel} ${className}`}
        style={width ? { width } : undefined}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          {title && <h2 className={styles.title}>{title}</h2>}
          <button type="button" className={styles.closeButton} aria-label="Close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className={styles.body}>{children}</div>

        {footer && <div className={styles.footer}>{footer}</div>}
      </aside>
    </div>
  )
}

export default SidePanel
