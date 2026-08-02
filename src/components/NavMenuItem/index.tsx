import React from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronDown } from 'lucide-react'
import styles from './NavMenuItem.module.scss'

export interface NavMenuItemProps {
  icon: React.ReactNode
  label: string
  expandable?: boolean
  href?: string
  onClick?: () => void
}

const NavMenuItem = ({ icon, label, expandable = false, href, onClick }: NavMenuItemProps) => {
  const content = (
    <>
      <span className={styles.icon}>{icon}</span>
      <span className={styles.label}>{label}</span>
      {expandable && (
        <span className={styles.chevron} aria-hidden="true">
          <ChevronDown />
        </span>
      )}
    </>
  )

  if (href) {
    return (
      <Link to={href} className={styles.item} activeProps={{ className: styles.active }} onClick={onClick}>
        {content}
      </Link>
    )
  }

  return (
    <button type="button" className={styles.item} onClick={onClick}>
      {content}
    </button>
  )
}

export default NavMenuItem
