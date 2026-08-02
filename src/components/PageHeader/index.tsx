import Breadcrumb, { type BreadcrumbItem } from '../Breadcrumb'
import Button from '../Button'
import styles from './PageHeader.module.scss'

export interface Collaborator {
  name: string
  avatarSrc?: string
}

export interface PageHeaderProps {
  title?: string
  breadcrumbItems?: BreadcrumbItem[]
  collaborators: Collaborator[]
  onShare?: () => void
  className?: string
}

const FALLBACK_COLORS = ['#1e293b', '#a153ff', '#3b82f6', '#d43a20', '#71717a']

const fallbackColor = (name: string) => {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) % 997
  }
  return FALLBACK_COLORS[hash % FALLBACK_COLORS.length]
}

const PageHeader = ({ title, breadcrumbItems, collaborators, onShare, className = '' }: PageHeaderProps) => {
  const showBreadcrumb = !!breadcrumbItems && breadcrumbItems.length > 0

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
        <div className={styles.avatarGroup}>
          {collaborators.map((collaborator) => (
            <span
              key={collaborator.name}
              className={styles.avatar}
              style={collaborator.avatarSrc ? undefined : { background: fallbackColor(collaborator.name) }}
            >
              {collaborator.avatarSrc ? (
                <img src={collaborator.avatarSrc} alt={collaborator.name} />
              ) : (
                collaborator.name.charAt(0).toUpperCase()
              )}
            </span>
          ))}
        </div>

        <Button variant="primary" onClick={onShare}>
          Share
        </Button>
      </div>
    </header>
  )
}

export default PageHeader
