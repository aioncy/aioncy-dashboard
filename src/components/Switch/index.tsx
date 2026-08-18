import styles from './Switch.module.scss'

export interface SwitchProps {
  checked: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  'aria-label'?: string
}

const Switch = ({ checked, onChange, disabled, 'aria-label': ariaLabel }: SwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      className={`${styles.switch} ${checked ? styles.checked : ''}`}
      onClick={() => onChange?.(!checked)}
    >
      <span className={styles.thumb} />
    </button>
  )
}

export default Switch
