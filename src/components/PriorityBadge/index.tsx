import styles from './PriorityBadge.module.scss'

export type PriorityLevel = 'low' | 'medium' | 'high'

export interface PriorityBadgeProps {
  level: PriorityLevel
  label?: string
  className?: string
}

const COLORS: Record<PriorityLevel, { background: string; color: string }> = {
  medium: { background: '#FFF3D6', color: '#EF7800' },
  high: { background: '#fce7f3', color: '#9d17ad' },
  low: { background: '#DBF3FF', color: '#0075AD' },
}

const PriorityBadge = ({ level, label, className = '' }: PriorityBadgeProps) => {
  const { background, color } = COLORS[level]

  return (
    <span
      className={`${styles.badge} ${className}`}
      style={{ background, color }}
    >
      {label ?? level.charAt(0).toUpperCase() + level.slice(1)}
    </span>
  )
}

export default PriorityBadge
