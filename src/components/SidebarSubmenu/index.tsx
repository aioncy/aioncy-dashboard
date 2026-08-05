import { Link } from '@tanstack/react-router'
import type { MouseEvent } from 'react'
import styles from './SidebarSubmenu.module.scss'

export interface SidebarSubmenuItem {
  label: string
  to: string
  onClick?: () => void
}

export interface SidebarSubmenuProps {
  items: SidebarSubmenuItem[]
  open: boolean
}

const ITEM_HEIGHT = 36
const ITEM_GAP = 4

const SidebarSubmenu = ({ items, open }: SidebarSubmenuProps) => {
  const connectorHeight = items.length * ITEM_HEIGHT + Math.max(0, items.length - 1) * ITEM_GAP

  const handleItemClick = (event: MouseEvent, onClick?: () => void) => {
    event.stopPropagation()
    onClick?.()
  }

  return (
    <div className={`${styles.submenu} ${open ? styles.open : ''}`}>
      <div className={styles.inner}>
        <span className={styles.connector} style={{ height: connectorHeight }} aria-hidden="true" />
        <div className={styles.items}>
          {items.map((item) => (
            <Link
              key={item.label}
              to={item.to}
              className={styles.item}
              activeProps={{ className: styles.active }}
              onClick={(event) => handleItemClick(event, item.onClick)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SidebarSubmenu