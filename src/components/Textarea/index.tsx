import React, { useEffect, useId, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import textInputStyles from '../TextInput/TextInput.module.scss'
import styles from './Textarea.module.scss'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  className?: string
}

const Textarea = ({ label, className = '', ...props }: TextareaProps) => {
  const id = useId()

  return (
    <div className={`flex w-full max-w-[360px] flex-col gap-1 text-left ${className}`}>
      <label htmlFor={id} className={label ? textInputStyles.label : textInputStyles.srOnly}>
        {label ?? props.placeholder ?? 'Text area'}
      </label>
      <textarea id={id} className={styles.textarea} {...props} />
    </div>
  )
}

export interface CopyTextareaProps {
  value: string
  className?: string
}

export const CopyTextarea = ({ value, className = '' }: CopyTextareaProps) => {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    },
    [],
  )

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      return
    }
    setCopied(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={`${styles.copyContainer} ${className}`}>
      <textarea className={styles.copyTextarea} value={value} readOnly aria-label="Content to copy" />
      <button type="button" className={styles.copyButton} onClick={handleCopy}>
        {copied ? <Check size={16} /> : <Copy size={16} />}
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  )
}

export default Textarea
