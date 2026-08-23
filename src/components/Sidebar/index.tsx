import React, { useState } from 'react'
import { Home, MessageSquare, Ticket, Bot, User, LineChart, Settings, Headphones, Briefcase } from 'lucide-react'
import Logo from '../Logo'
import LogoMark from '../LogoMark'
import NavMenuItem from '../NavMenuItem'
import SidebarSubmenu, { type SidebarSubmenuItem } from '../SidebarSubmenu'
import WorkspaceSwitcher, { type Organization } from '../WorkspaceSwitcher'
import styles from './Sidebar.module.scss'

export interface SidebarProps {
  organizations: Organization[]
  activeOrgId: string
  onSelectOrganization: (orgId: string) => void
  onAddOrganization?: () => void
  onSignOut?: () => void
  className?: string
  onNavigate?: () => void
  collapsible?: boolean
}

interface NavItem {
  route: string
  label: string
  icon: React.ReactNode
  expandable?: boolean
  children?: SidebarSubmenuItem[]
}

const mainNavItems: NavItem[] = [
  { route: 'dashboard', label: 'Dashboard', icon: <Home /> },
  { route: 'conversations', label: 'Conversations', icon: <MessageSquare /> },
  { route: 'tickets', label: 'Tickets', icon: <Ticket /> },
  {
    route: 'wingman-ai',
    label: 'Wingman AI',
    icon: <Bot />,
    expandable: true,
    children: [
      { label: 'AI Control', to: '/wingman-ai/control' },
      { label: 'Train', to: '/wingman-ai/train' },
      { label: 'Channels', to: '/wingman-ai/channels' },
    ],
  },
  { route: 'leads', label: 'Leads', icon: <User /> },
  { route: 'analytics', label: 'Analytics', icon: <LineChart /> },
]

const secondaryNavItems: NavItem[] = [
  { route: 'settings', label: 'Settings', icon: <Settings /> },
  { route: 'help-support', label: 'Help & Support', icon: <Headphones /> },
]

const Sidebar = ({
  organizations,
  activeOrgId,
  onSelectOrganization,
  onAddOrganization,
  onSignOut,
  className = '',
  onNavigate,
  collapsible = false,
}: SidebarProps) => {
  const [isWingmanOpen, setIsWingmanOpen] = useState(true)

  const activeOrg = organizations.find((org) => org.id === activeOrgId) ?? organizations[0]

  const fullBody = (
    <>
      <div className={styles.header}>
        <Logo />
      </div>

      <nav className={styles.mainNav} aria-label="Main">
        {mainNavItems.map((item) => (
          <React.Fragment key={item.route}>
            <NavMenuItem
              icon={item.icon}
              label={item.label}
              href={item.children ? undefined : `/${item.route}`}
              expandable={item.expandable}
              expanded={item.children ? isWingmanOpen : false}
              onClick={item.children ? () => setIsWingmanOpen((open) => !open) : onNavigate}
            />
            {item.children && <SidebarSubmenu items={item.children} open={isWingmanOpen} />}
          </React.Fragment>
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
          organizations={organizations}
          activeOrgId={activeOrgId}
          onSelectOrganization={onSelectOrganization}
          onAddOrganization={onAddOrganization}
          onSignOut={onSignOut}
        />
      </div>
    </>
  )

  if (!collapsible) {
    return <aside className={`${styles.sidebar} ${className}`}>{fullBody}</aside>
  }

  return (
    <div className={`${styles.railWrapper} ${className}`}>
      <div className={styles.rail}>
        <div className={styles.railHeader}>
          <LogoMark className={styles.railLogo} />
        </div>

        <nav className={styles.railNav} aria-label="Main">
          {mainNavItems.map((item) => (
            <NavMenuItem
              key={item.route}
              icon={item.icon}
              label={item.label}
              href={`/${item.route}`}
              collapsed
            />
          ))}
        </nav>

        <div className={styles.spacer} />

        <div className={styles.railBottom}>
          <nav className={styles.railNav} aria-label="Secondary">
            {secondaryNavItems.map((item) => (
              <NavMenuItem
                key={item.route}
                icon={item.icon}
                label={item.label}
                href={`/${item.route}`}
                collapsed
              />
            ))}
          </nav>

          {activeOrg && (
            <span
              className={styles.railOrgAvatar}
              title={activeOrg.name}
              style={{ background: activeOrg.logoSrc ? undefined : activeOrg.color ?? '#3b82f6' }}
            >
              {activeOrg.logoSrc ? (
                <img src={activeOrg.logoSrc} alt="" />
              ) : (
                activeOrg.icon ?? <Briefcase size={16} aria-hidden="true" />
              )}
            </span>
          )}
        </div>
      </div>

      <div className={styles.expandedPanel}>{fullBody}</div>
    </div>
  )
}

export default Sidebar
