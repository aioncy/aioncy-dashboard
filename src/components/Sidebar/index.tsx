import React from 'react'
import { Home, MessageSquare, Ticket, Bot, User, LineChart, Settings, Headphones } from 'lucide-react'
import Logo from '../Logo'
import NavMenuItem from '../NavMenuItem'
import WorkspaceSwitcher from '../WorkspaceSwitcher'
import styles from './Sidebar.module.scss'

export interface SidebarProps {
  workspace: { name: string; planTier: string; logoSrc?: string }
  className?: string
  onNavigate?: () => void
}

interface NavItem {
  route: string
  label: string
  icon: React.ReactNode
  expandable?: boolean
}

const mainNavItems: NavItem[] = [
  { route: 'dashboard', label: 'Dashboard', icon: <Home /> },
  { route: 'conversations', label: 'Conversations', icon: <MessageSquare /> },
  { route: 'tickets', label: 'Tickets', icon: <Ticket /> },
  { route: 'wingman-ai', label: 'Wingman AI', icon: <Bot />, expandable: true },
  { route: 'leads', label: 'Leads', icon: <User /> },
  { route: 'analytics', label: 'Analytics', icon: <LineChart /> },
]

const secondaryNavItems: NavItem[] = [
  { route: 'settings', label: 'Settings', icon: <Settings /> },
  { route: 'help-support', label: 'Help & Support', icon: <Headphones /> },
]

const Sidebar = ({ workspace, className = '', onNavigate }: SidebarProps) => (
  <aside className={`${styles.sidebar} ${className}`}>
    <div className={styles.header}>
      <Logo />
    </div>

    <nav className={styles.mainNav} aria-label="Main">
      {mainNavItems.map((item) => (
        <NavMenuItem
          key={item.route}
          icon={item.icon}
          label={item.label}
          href={`/${item.route}`}
          expandable={item.expandable}
          onClick={onNavigate}
        />
      ))}
    </nav>

    <div className={styles.spacer} />

    <div className={styles.bottom}>
      <nav className={styles.secondaryNav} aria-label="Secondary">
        {secondaryNavItems.map((item) => (
          <NavMenuItem
            key={item.route}
            icon={item.icon}
            label={item.label}
            href={`/${item.route}`}
            onClick={onNavigate}
          />
        ))}
      </nav>

      <WorkspaceSwitcher
        workspaceName={workspace.name}
        planTier={workspace.planTier}
        logoSrc={workspace.logoSrc}
      />
    </div>
  </aside>
)

export default Sidebar
