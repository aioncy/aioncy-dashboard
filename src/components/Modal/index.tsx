import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import styles from './Modal.module.scss'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  width?: number
  children: React.ReactNode
  className?: string
}

const Modal = ({ isOpen, onClose, title, width, children, className = '' }: ModalProps) => {
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
      <div
        className={`${styles.panel} ${className}`}
        style={width ? { width } : undefined}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {title && (
          <div className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button type="button" className={styles.closeButton} aria-label="Close" onClick={onClose}>
              <X size={18} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export default Modal
