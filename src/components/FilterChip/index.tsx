import React from 'react'
import { X } from 'lucide-react'
import styles from './FilterChip.module.scss'

export interface FilterChipProps {
  icon?: React.ReactNode
  label: string
  prefix?: string
  onRemove?: () => void
  className?: string
}

const FilterChip = ({ icon, label, prefix, onRemove, className = '' }: FilterChipProps) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <span className={styles.buttonAnchor}>
        <span className={styles.tooltip} role="tooltip">
          Remove this filter
        </span>
        <button
          type="button"
          className={styles.remove}
          aria-label="Remove filter"
          onClick={onRemove}
        >
          <X size={12} />
        </button>
      </span>
      <div className={styles.chip}>
        {prefix && <span className={styles.prefix}>{prefix}</span>}
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={`${styles.label} ${prefix ? styles.labelStrong : ''}`}>{label}</span>
      </div>
    </div>
  )
}

export default FilterChip
