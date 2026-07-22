import React, { useState } from 'react'
import styles from './Dropdown.module.scss'

export interface DropdownProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'active' | 'withClose'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isOpen?: boolean
  onToggle?: () => void
}

const Dropdown = ({ 
  variant = 'default', 
  size = 'md', 
  children, 
  leftIcon, 
  rightIcon, 
  isOpen = false,
  onToggle,
  className = '', 
  ...props 
}: DropdownProps) => {
  const [internalOpen, setInternalOpen] = useState(isOpen)
  
  const handleToggle = () => {
    if (onToggle) {
      onToggle()
    } else {
      setInternalOpen(!internalOpen)
    }
  }

  const isDropdownOpen = onToggle !== undefined ? isOpen : internalOpen

  return (
    <button
      className={`${styles.dropdown} ${styles[variant]} ${styles[size]} ${leftIcon ? styles.withLeftIcon : ''} ${rightIcon ? styles.withRightIcon : ''} ${isDropdownOpen ? styles.open : ''} ${className}`}
      onClick={handleToggle}
      {...props}
    >
      {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
      {children}
      {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
    </button>
  )
}

export default Dropdown
