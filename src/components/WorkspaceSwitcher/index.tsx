import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { Briefcase, ChevronsUpDown, Plus } from 'lucide-react'
import styles from './WorkspaceSwitcher.module.scss'

export interface Organization {
  id: string
  name: string
  planTier?: string
  logoSrc?: string
  icon?: ReactNode
  color?: string
}

export interface WorkspaceSwitcherProps {
  organizations: Organization[]
  activeOrgId: string
  onSelectOrganization: (orgId: string) => void
  onAddOrganization?: () => void
}

const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform)
const shortcutModifierLabel = isMac ? '⌘' : 'Ctrl+'

const OrgAvatar = ({ org, size = 24 }: { org: Organization; size?: number }) => (
  <span
    className={styles.orgAvatarInner}
    style={
      {
        width: size,
        height: size,
        background: org.logoSrc ? undefined : org.color ?? '#3b82f6',
        '--icon-size': `${Math.round(size * 0.58)}px`,
      } as CSSProperties
    }
  >
    {org.logoSrc ? <img src={org.logoSrc} alt="" /> : (org.icon ?? <Briefcase aria-hidden="true" />)}
  </span>
)

const WorkspaceSwitcher = ({ organizations, activeOrgId, onSelectOrganization, onAddOrganization }: WorkspaceSwitcherProps) => {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const activeOrg = organizations.find((org) => org.id === activeOrgId) ?? organizations[0]

  useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      const modifierPressed = isMac ? event.metaKey : event.ctrlKey
      if (!modifierPressed) return

      const index = Number(event.key) - 1
      if (Number.isNaN(index) || index < 0 || index >= organizations.length) return

      event.preventDefault()
      onSelectOrganization(organizations[index].id)
      setOpen(false)
    }

    document.addEventListener('keydown', handleShortcut)
    return () => document.removeEventListener('keydown', handleShortcut)
  }, [organizations, onSelectOrganization])

  if (!activeOrg) return null

  return (
    <div className={styles.root} ref={rootRef}>
      {open && (
        <div className={styles.panel} role="menu" aria-label="Organizations">
          <div className={styles.panelHeader}>Organizations</div>
          <ul className={styles.orgList}>
            {organizations.map((org, index) => (
              <li key={org.id}>
                <button
                  type="button"
                  className={styles.orgItem}
                  role="menuitemradio"
                  aria-checked={org.id === activeOrg.id}
                  onClick={() => {
                    onSelectOrganization(org.id)
                    setOpen(false)
                  }}
                >
                  <span className={styles.orgAvatar}>
                    <OrgAvatar org={org} />
                  </span>
                  <span className={styles.orgName}>{org.name}</span>
                  {index < 9 && (
                    <span className={styles.shortcut} aria-hidden="true">
                      {shortcutModifierLabel}
                      {index + 1}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className={styles.addOrg}
            onClick={() => {
              onAddOrganization?.()
              setOpen(false)
            }}
          >
            <span className={styles.addIcon} aria-hidden="true">
              <Plus />
            </span>
            Add organization
          </button>
        </div>
      )}

      <button
        type="button"
        className={`${styles.card} ${open ? styles.cardActive : ''}`}
        onClick={() => setOpen((value) => !value)}
        aria-label={`Switch workspace: ${activeOrg.name}`}
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <span className={styles.avatar}>
          <OrgAvatar org={activeOrg} size={32} />
        </span>
        <span className={styles.info}>
          <span className={styles.title}>{activeOrg.name}</span>
          <span className={styles.subtitle}>{activeOrg.planTier}</span>
        </span>
        <span className={styles.chevron} aria-hidden="true">
          <ChevronsUpDown />
        </span>
      </button>
    </div>
  )
}

export default WorkspaceSwitcher
