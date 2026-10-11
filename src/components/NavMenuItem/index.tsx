import React from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import styles from './NavMenuItem.module.scss'

export interface NavMenuItemProps {
  icon: React.ReactNode
  label: string
  expandable?: boolean
  /** Trailing count or tag, e.g. unread notifications. Hidden when collapsed. */
  badge?: React.ReactNode
  expanded?: boolean
  href?: string
  onClick?: () => void
  collapsed?: boolean
  className?: string
}

const NavMenuItem = ({
  icon,
  label,
  expandable = false,
  badge,
  expanded = false,
  href,
  onClick,
  collapsed = false,
  className = '',
}: NavMenuItemProps) => {
  const itemClassName = `${styles.item} ${collapsed ? styles.collapsedItem : ''} ${className}`

  const content = collapsed ? (
    <span className={styles.icon}>{icon}</span>
  ) : (
    <>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
      {badge != null && <span className={styles.badge}>{badge}</span>}
      {expandable && (
        <span className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`} aria-hidden="true">
          <ChevronDown />
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <Link
        to={href}
        className={itemClassName}
        activeProps={{ className: styles.active }}
        onClick={onClick}
        title={collapsed ? label : undefined}
        aria-label={collapsed ? label : undefined}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      className={itemClassName}
      onClick={onClick}
      title={collapsed ? label : undefined}
      aria-label={collapsed ? label : undefined}
    >
      {content}
    </button>
  )
}

export default NavMenuItem
