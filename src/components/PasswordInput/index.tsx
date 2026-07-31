import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import TextInput from '../TextInput'

export interface PasswordInputProps {
  label?: string
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
  label,
  placeholder = 'Place Holder',
  value,
  defaultValue,
  onChange,
  helperText,
  errorMessage,
  disabled,
  className,
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <TextInput
      label={label}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      helperText={helperText}
      errorMessage={errorMessage}
      disabled={disabled}
      className={className}
      type={showPassword ? 'text' : 'password'}
      trailingIcon={
        <button
          type="button"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setShowPassword((prev) => !prev)}
          disabled={disabled}
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      }
    />
  )
}

export default PasswordInput
