import { useState, type ReactNode } from 'react'
import { Menu } from 'lucide-react'
import { Outlet } from '@tanstack/react-router'
import Sidebar from '../Sidebar'
import styles from './DashboardLayout.module.scss'

export interface DashboardLayoutProps {
  children?: ReactNode
}

const WORKSPACE = { name: 'Acme', planTier: 'Essential' }

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = () => setSidebarOpen(false)

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation"
        >
          <Menu />
        </button>
      </div>

      {sidebarOpen && <div className={styles.backdrop} onClick={closeSidebar} aria-hidden="true" />}

      <div className={`${styles.sidebarWrap} ${sidebarOpen ? styles.open : ''}`}>
        <Sidebar workspace={WORKSPACE} onNavigate={closeSidebar} />
      </div>

      <main className={styles.main}>{children ?? <Outlet />}</main>
    </div>
  )
}

export default DashboardLayout
