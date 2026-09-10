import { useEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import Breadcrumb, { type BreadcrumbItem } from '../Breadcrumb'
import Button from '../Button'
import { avatarColor } from '../../lib/avatarColor'
import { CURRENT_USER } from '../../lib/dashboard'
import styles from './PageHeader.module.scss'

export interface Collaborator {
  name: string
  avatarSrc?: string
}

export interface PageHeaderUser {
  name: string
  email: string
  avatarSrc?: string
}

export interface PageHeaderProps {
  title?: string
  breadcrumbItems?: BreadcrumbItem[]
  collaborators: Collaborator[]
  user?: PageHeaderUser
  onShare?: () => void
  className?: string
}

const PageHeader = ({ title, breadcrumbItems, collaborators, user = CURRENT_USER, onShare, className = '' }: PageHeaderProps) => {
  const showBreadcrumb = !!breadcrumbItems && breadcrumbItems.length > 0
  const [menuOpen, setMenuOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!menuOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  return (
    <header className={`${styles.header} ${className}`}>
      <div>
        {showBreadcrumb ? (
          <Breadcrumb items={breadcrumbItems} />
        ) : (
          <h1 className={styles.title}>{title}</h1>
        )}
      </div>

      <div className={styles.right}>
        <div className={styles.account} ref={accountRef}>
          <button
            type="button"
            className={`${styles.accountTrigger} ${menuOpen ? styles.accountTriggerActive : ''}`}
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Open account menu"
            aria-expanded={menuOpen}
            aria-haspopup="menu"
          >
            <span className={styles.avatarGroup}>
              {collaborators.map((collaborator) => (
                <span
                  key={collaborator.name}
                  className={styles.avatar}
                  style={collaborator.avatarSrc ? undefined : { background: avatarColor(collaborator.name) }}
                >
                  {collaborator.avatarSrc ? (
                    <img src={collaborator.avatarSrc} alt={collaborator.name} />
                  ) : (
                    collaborator.name.charAt(0).toUpperCase()
                  )}
                </span>
              ))}
            </span>
            <ChevronDown className={styles.chevron} aria-hidden="true" />
          </button>

          {menuOpen && user && (
            <div className={styles.menu} role="menu">
              <div className={styles.userRow}>
                <span
                  className={styles.userAvatar}
                  style={user.avatarSrc ? undefined : { background: avatarColor(user.name) }}
                >
                  {user.avatarSrc ? (
                    <img src={user.avatarSrc} alt={user.name} />
                  ) : (
                    user.name.charAt(0).toUpperCase()
                  )}
                </span>
                <span className={styles.userText}>
                  <span className={styles.userName}>{user.name}</span>
                  <span className={styles.userEmail}>{user.email}</span>
                </span>
              </div>

              <button
                type="button"
                className={styles.menuItem}
                role="menuitem"
                onClick={() => {
                  setMenuOpen(false)
                  navigate({ to: '/account' })
                }}
              >
                Account settings
              </button>
            </div>
          )}
        </div>

        <Button variant="primary" onClick={onShare}>
          Share
        </Button>
      </div>
    </header>
  )
}

export default PageHeader
