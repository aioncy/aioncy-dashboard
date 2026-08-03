import React, { useState } from 'react'
import styles from './DropdownButton.module.scss'

export interface DropdownButtonProps {
  label: string
  icon?: React.ReactNode
  trailingIcon: 'chevron' | 'close'
  expanded?: boolean
  active?: boolean
  onClick?: () => void
  onClear?: () => void
  className?: string
}

const ChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ChevronUp = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 10L8 6L4 10" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const DropdownButton = ({
  label,
  icon,
  trailingIcon,
  expanded = false,
  active = false,
  onClick,
  onClear,
  className = '',
}: DropdownButtonProps) => {
  const [internalExpanded, setInternalExpanded] = useState(expanded)
  const isExpanded = expanded !== undefined ? expanded : internalExpanded
  const isActive = trailingIcon === 'close' ? active : isExpanded

  const handleToggle = () => {
    if (trailingIcon === 'chevron') {
      if (onClick) {
        onClick()
      } else {
        setInternalExpanded(!internalExpanded)
      }
    } else if (onClear) {
      onClear()
    }
  }

  return (
    <button
      type="button"
      className={`${styles.button} ${isActive ? styles.active : ''} ${className}`}
      onClick={handleToggle}
      aria-expanded={trailingIcon === 'chevron' ? isExpanded : undefined}
    >
      {icon && <span className={styles.icon}>{icon}</span>}
      <span className={styles.label}>{label}</span>
      <span className={styles.trailingIcon}>
        {trailingIcon === 'chevron' ? (isExpanded ? <ChevronUp /> : <ChevronDown />) : <CloseIcon />}
      </span>
    </button>
  )
}

export default DropdownButton
