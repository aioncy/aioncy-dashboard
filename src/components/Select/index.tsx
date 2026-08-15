import React, { useId } from 'react'
import { ChevronDown } from 'lucide-react'
import textInputStyles from '../TextInput/TextInput.module.scss'
import styles from './Select.module.scss'

export interface SelectOption {
  label: string
  value: string
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string
  helperText?: string
  options: SelectOption[]
  className?: string
}

const Select = ({ label, helperText, options, className = '', ...props }: SelectProps) => {
  const id = useId()
  const messageId = `${id}-message`

  return (
    <div className={`flex w-full flex-col gap-1 text-left ${className}`}>
      <label htmlFor={id} className={label ? textInputStyles.label : textInputStyles.srOnly}>
        {label ?? 'Select'}
      </label>
      <div className={styles.field}>
        <select
          id={id}
          className={styles.select}
          aria-describedby={helperText ? messageId : undefined}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <span className={styles.chevron} aria-hidden="true">
          <ChevronDown size={16} />
        </span>
      </div>
      {helperText && (
        <p id={messageId} className="text-[14px] leading-[140%] text-[#8C8C8C]">
          {helperText}
        </p>
      )}
    </div>
  )
}

export default Select
