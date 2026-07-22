import React from 'react'
import styles from './TextInput.module.scss'

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'disabled' | 'readOnly'
  inputSize?: 'sm' | 'md' | 'lg'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const TextInput = ({ 
  variant = 'default', 
  inputSize = 'md', 
  leftIcon, 
  rightIcon, 
  className = '', 
  disabled,
  readOnly,
  ...props 
}: TextInputProps) => {
  const isDisabled = disabled || variant === 'disabled'
  const isReadOnly = readOnly || variant === 'readOnly'

  return (
    <div className={`${styles.inputWrapper} ${styles[inputSize]} ${leftIcon ? styles.withLeftIcon : ''} ${rightIcon ? styles.withRightIcon : ''}`}>
      {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
      <input
        className={`${styles.input} ${styles[variant]} ${isDisabled ? styles.disabled : ''} ${isReadOnly ? styles.readOnly : ''} ${className}`}
        disabled={isDisabled}
        readOnly={isReadOnly}
        {...props}
      />
      {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
    </div>
  )
}

export default TextInput
