import React from 'react'
import { ChevronRight, User } from 'lucide-react'
import CheckIcon from '../CheckIcon'
import styles from './DropdownListItem.module.scss'

export interface DropdownListItemProps {
  label: string
  leading?: 'none' | 'dot' | 'avatar' | 'dashedIcon'
  avatarSrc?: string
  trailing?: 'none' | 'check' | 'chevron' | 'checkbox' | 'text'
  trailingText?: string
  selected?: boolean
  destructive?: boolean
  onClick?: () => void
}

const DropdownListItem = ({
  label,
  leading = 'none',
  avatarSrc,
  trailing = 'none',
  trailingText,
  selected = false,
  destructive = false,
  onClick,
}: DropdownListItemProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onClick?.()
    }
  }

  return (
    <div
      className={`${styles.item} ${selected ? styles.selected : ''}`}
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      {leading === 'dot' && <span className={styles.dot} aria-hidden="true" />}
      {leading === 'avatar' &&
        (avatarSrc ? (
          <img className={styles.avatar} src={avatarSrc} alt="" />
        ) : (
          <span className={`${styles.avatar} ${styles.avatarFallback}`} aria-hidden="true">
            <User size={14} />
          </span>
        ))}
      {leading === 'dashedIcon' && (
        <svg
          className={styles.dashedIcon}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="9" stroke="#71717A" strokeWidth="1.5" strokeDasharray="3 2" />
        </svg>
      )}
      <span className={`${styles.label} ${destructive ? styles.destructive : ''}`}>{label}</span>
      {trailing === 'check' && selected && <CheckIcon size={20} className={styles.trailing} />}
      {trailing === 'chevron' && <ChevronRight size={16} className={styles.chevron} />}
      {trailing === 'checkbox' && (
        <input
          type="checkbox"
          className={styles.checkbox}
          aria-label={label}
          onClick={(e) => e.stopPropagation()}
        />
      )}
      {trailing === 'text' && trailingText && <span className={styles.trailingText}>{trailingText}</span>}
    </div>
  )
}

export default DropdownListItem
