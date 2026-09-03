import type { ReactNode } from 'react'
import styles from './Tabs.module.scss'

export interface TabItem {
  label: string
  value: string
  /** Rendered before the label — e.g. a CheckIcon on a completed step. */
  icon?: ReactNode
}

export interface TabsProps {
  tabs: TabItem[]
  value: string
  onChange: (value: string) => void
  className?: string
}

const Tabs = ({ tabs, value, onChange, className = '' }: TabsProps) => (
  <div className={`${styles.tabs} ${className}`} role="tablist">
    {tabs.map((tab) => (
      <button
        key={tab.value}
        type="button"
        role="tab"
        aria-selected={tab.value === value}
        className={`${styles.tab} ${tab.value === value ? styles.active : ''}`}
        onClick={() => onChange(tab.value)}
      >
        {tab.icon}
        {tab.label}
      </button>
    ))}
  </div>
)

export default Tabs
