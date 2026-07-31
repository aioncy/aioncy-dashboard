import React, { useId } from 'react'
import styles from './TextInput.module.scss'

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  helperText?: string
  errorMessage?: string
  className?: string
  trailingIcon?: React.ReactNode
}

const TextInput = ({
  label,
  helperText,
  errorMessage,
  className = '',
  trailingIcon,
  ...props
}: TextInputProps) => {
  const id = useId()
  const messageId = `${id}-message`
  const hasError = Boolean(errorMessage)
  const showMessage = hasError || Boolean(helperText)

  return (
    <div className={`flex w-full max-w-[360px] flex-col gap-1 text-left ${className}`}>
      <label htmlFor={id} className={label ? styles.label : styles.srOnly}>
        {label ?? props.placeholder ?? 'Text input'}
      </label>
      <div className={`${styles.inputBox} ${trailingIcon ? styles.withTrailingIcon : ''}`}>
        <input
          id={id}
          className={`${styles.input} ${hasError ? styles.error : ''}`}
          aria-invalid={hasError || undefined}
          aria-describedby={showMessage ? messageId : undefined}
          {...props}
        />
        {trailingIcon && <span className={styles.trailingIcon}>{trailingIcon}</span>}
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

export default TextInput
