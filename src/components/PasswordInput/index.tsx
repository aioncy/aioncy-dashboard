import React, { useId, useRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import textInputStyles from '../TextInput/TextInput.module.scss'
import styles from './PasswordInput.module.scss'

export interface PasswordInputProps {
  id?: string
  label?: string
  hideLabel?: boolean
  placeholder?: string
  value?: string
  defaultValue?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  helperText?: string
  errorMessage?: string
  disabled?: boolean
  className?: string
}

const PasswordInput = ({
  id: idProp,
  label,
  hideLabel,
  placeholder = 'Place Holder',
  value,
  defaultValue,
  onChange,
  helperText,
  errorMessage,
  disabled,
  className,
}: PasswordInputProps) => {
  const [internalValue, setInternalValue] = useState(defaultValue ?? value ?? '')
  const [showPassword, setShowPassword] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const generatedId = useId()
  const id = idProp ?? generatedId

  const messageId = `${id}-message`
  const hasError = Boolean(errorMessage)
  const showMessage = hasError || Boolean(helperText)
  const isControlled = value !== undefined
  const displayValue = isControlled ? value : internalValue

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(e.target.value)
    onChange?.(e)
  }

  return (
    <div className={`flex w-full  flex-col gap-1 text-left ${className}`}>
      <label htmlFor={id} className={label && !hideLabel ? textInputStyles.label : textInputStyles.srOnly}>
        {label ?? placeholder ?? 'Password'}
      </label>
      <div
        className={`${styles.field} ${hasError ? styles.error : ''} ${disabled ? styles.disabled : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        <input
          id={id}
          ref={inputRef}
          type={showPassword ? 'text' : 'password'}
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          className={`${styles.input} ${showPassword ? '' : styles.masked}`}
          aria-invalid={hasError || undefined}
          aria-describedby={showMessage ? messageId : undefined}
        />
        <button
          type="button"
          className={styles.toggle}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
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

export default PasswordInput
