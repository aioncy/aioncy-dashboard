import { ChevronRight } from 'lucide-react'
import styles from './Breadcrumb.module.scss'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

const Breadcrumb = ({ items, className = '' }: BreadcrumbProps) => (
  <nav aria-label="Breadcrumb" className={className}>
    <ol className={styles.list}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <li key={item.label} className={styles.item}>
            {index > 0 && <ChevronRight size={14} className={styles.separator} aria-hidden="true" />}
            {isLast ? (
              <span className={styles.current} aria-current="page">
                {item.label}
              </span>
            ) : (
              <a href={item.href} className={styles.link}>
                {item.label}
              </a>
            )}
          </li>
        )
      })}
    </ol>
  </nav>
)

export default Breadcrumb
