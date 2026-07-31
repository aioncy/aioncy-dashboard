import { Fragment } from 'react'
import CheckIcon from '../CheckIcon'
import styles from './PermissionMenu.module.scss'

export interface PermissionMenuItem {
  title: string
  subtitle?: string
  selected?: boolean
  destructive?: boolean
  dividerBefore?: boolean
  onClick?: () => void
}

export interface PermissionMenuProps {
  items: PermissionMenuItem[]
  className?: string
}

const PermissionMenu = ({ items, className = '' }: PermissionMenuProps) => (
  <div className={`${styles.menu} ${className}`} role="menu">
    {items.map((item, i) => (
      <Fragment key={i}>
        {item.dividerBefore && <div className={styles.divider} role="separator" />}
        <button
          type="button"
          role="menuitemradio"
          aria-checked={item.selected}
          aria-disabled={item.destructive}
          className={`${styles.item} ${item.subtitle ? styles.withSubtitle : ''} ${
            item.selected ? styles.selected : ''
          }`}
          onClick={item.onClick}
        >
          <span className={styles.text}>
            <span className={`${styles.title} ${item.destructive ? styles.destructive : ''}`}>
              {item.title}
            </span>
            {item.subtitle && <span className={styles.subtitle}>{item.subtitle}</span>}
          </span>
          {item.selected && <CheckIcon size={20} className={styles.check} />}
        </button>
      </Fragment>
    ))}
  </div>
)

export default PermissionMenu
