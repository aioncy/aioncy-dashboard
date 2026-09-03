import React, { useId } from 'react'
import styles from './TextInput.module.scss'

export interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  /** Keep the label for screen readers only. */
  hideLabel?: boolean
  helperText?: string
  errorMessage?: string
  className?: string
  trailingIcon?: React.ReactNode
}

const TextInput = ({
  label,
  hideLabel,
  helperText,
  errorMessage,
  className = '',
  trailingIcon,
  ...props
}: TextInputProps) => {
  const generatedId = useId()
  const id = props.id ?? generatedId
  const messageId = `${id}-message`
  const hasError = Boolean(errorMessage)
  const showMessage = hasError || Boolean(helperText)

  return (
    <div className={`flex w-full  flex-col gap-1 text-left ${className}`}>
      <label htmlFor={id} className={label && !hideLabel ? styles.label : styles.srOnly}>
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
          className={`text-[14px] leading-[140%] ${hasError ? 'text-[#D43A20]' : 'text-[#8C8C8C]'}`}
        >
          {errorMessage ?? helperText}
        </p>
      )}
    </div>
  )
}

export default TextInput
