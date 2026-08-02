import { Briefcase, ChevronsUpDown } from 'lucide-react'
import styles from './WorkspaceSwitcher.module.scss'

export interface WorkspaceSwitcherProps {
  logoSrc?: string
  workspaceName: string
  planTier: string
  onClick?: () => void
}

const WorkspaceSwitcher = ({ logoSrc, workspaceName, planTier, onClick }: WorkspaceSwitcherProps) => (
  <button type="button" className={styles.card} onClick={onClick} aria-label={`Switch workspace: ${workspaceName}`}>
    <span className={styles.avatar}>
      {logoSrc ? <img src={logoSrc} alt="" /> : <Briefcase aria-hidden="true" />}
    </span>
    <span className={styles.info}>
      <span className={styles.title}>{workspaceName}</span>
      <span className={styles.subtitle}>{planTier}</span>
    </span>
    <span className={styles.chevron} aria-hidden="true">
      <ChevronsUpDown />
    </span>
  </button>
)

export default WorkspaceSwitcher
