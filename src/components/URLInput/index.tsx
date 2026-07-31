import React, { useId, useRef } from 'react'
import textInputStyles from '../TextInput/TextInput.module.scss'
import styles from './URLInput.module.scss'

export interface URLInputProps {
  prefix?: string
  suffix?: string
  label?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  helperText?: string
  errorMessage?: string
  disabled?: boolean
  className?: string
}

const URLInput = ({
  prefix = 'https://',
  suffix = '.com',
  label,
  placeholder,
  value,
  onChange,
  helperText,
  errorMessage,
  disabled,
  className,
}: URLInputProps) => {
  const id = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const messageId = `${id}-message`
  const hasError = Boolean(errorMessage)
  const showMessage = hasError || Boolean(helperText)
  const hasValue = Boolean(value)

  return (
    <div className={`flex w-full max-w-[360px] flex-col gap-1 text-left ${className}`}>
      <label htmlFor={id} className={label ? textInputStyles.label : textInputStyles.srOnly}>
        {label ?? placeholder ?? 'URL'}
      </label>
      <div
        className={`${styles.field} ${hasError ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        {prefix && (
          <span className={`${styles.affix} ${hasValue ? styles.prefixActive : ''}`}>{prefix}</span>
        )}
        <input
          id={id}
          ref={inputRef}
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={styles.input}
          aria-invalid={hasError || undefined}
          aria-describedby={showMessage ? messageId : undefined}
        />
        {suffix && <span className={styles.affix}>{suffix}</span>}
      </div>
      {showMessage && (
        <p
          id={messageId}
          className={`text-sm leading-[140%] ${hasError ? 'text-[#D43A20]' : 'text-[#8C8C8C]'}`}
        >
          {errorMessage ?? helperText}
        </p>
      )}
    </div>
  )
}

export default URLInput
