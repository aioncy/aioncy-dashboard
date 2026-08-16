import { useState, type ReactNode } from 'react'
import { Menu } from 'lucide-react'
import { Outlet } from '@tanstack/react-router'
import Sidebar from '../Sidebar'
import type { Organization } from '../WorkspaceSwitcher'
import styles from './DashboardLayout.module.scss'

export interface DashboardLayoutProps {
  children?: ReactNode
}

const ORGANIZATIONS: Organization[] = [
  { id: 'acme', name: 'Acme', planTier: 'Essential', color: '#3b82f6' },
  { id: 'acme-corp', name: 'Acme Corp', planTier: 'Essential', color: '#3b82f6' },
  { id: 'evil-corp', name: 'Evil Corp', planTier: 'Essential', color: '#3f3f46' },
]

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeOrgId, setActiveOrgId] = useState(ORGANIZATIONS[0].id)

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
        <Sidebar
          organizations={ORGANIZATIONS}
          activeOrgId={activeOrgId}
          onSelectOrganization={setActiveOrgId}
          onNavigate={closeSidebar}
        />
      </div>

      <main className={styles.main}>{children ?? <Outlet />}</main>
    </div>
  )
}

export default DashboardLayout
