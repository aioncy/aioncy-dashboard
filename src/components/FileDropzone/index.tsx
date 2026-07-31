import { useId, useRef, useState } from 'react'
import CloudUploadIcon from '../CloudUploadIcon'
import styles from './FileDropzone.module.scss'

export interface FileDropzoneProps {
  accept?: string
  maxSizeMB?: number
  onFileSelect: (file: File) => void
  className?: string
}

const typeLabels: Record<string, string> = {
  'application/pdf': 'PDF',
  'image/*': 'Image',
  'image/png': 'PNG',
  'image/jpeg': 'JPEG',
  'text/plain': 'Text',
  'application/zip': 'ZIP',
  'application/msword': 'Word',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
}

const formatAccept = (accept: string): string => {
  const labels = accept
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => typeLabels[part.toLowerCase()] ?? part)
  return labels.join(', ')
}

const FileDropzone = ({ accept, maxSizeMB, onFileSelect, className = '' }: FileDropzoneProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const dragDepth = useRef(0)
  const id = useId()

  const typeLabel = accept ? formatAccept(accept) : null
  const formatText = typeLabel ? `${typeLabel} format` : null
  const sizeText = maxSizeMB ? `Max file size: ${maxSizeMB}MB` : null
  const subtext = [formatText, sizeText ? `(${sizeText})` : null].filter(Boolean).join(' ')

  const isValidFile = (file: File): boolean => {
    if (accept) {
      const types = accept.split(',').map((t) => t.trim().toLowerCase())
      const ok = types.some(
        (t) =>
          t === file.type.toLowerCase() ||
          (t.endsWith('/*') && file.type.toLowerCase().startsWith(t.slice(0, -1))),
      )
      if (!ok) return false
    }
    if (maxSizeMB && file.size > maxSizeMB * 1024 * 1024) return false
    return true
  }

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return
    const file = files[0]
    if (isValidFile(file)) onFileSelect(file)
  }

  return (
    <label
      htmlFor={id}
      className={`${styles.dropzone} ${isDragging ? styles.active : ''} ${className}`}
      onDragEnter={(e) => {
        e.preventDefault()
        dragDepth.current += 1
        setIsDragging(true)
      }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => {
        e.preventDefault()
        dragDepth.current = Math.max(0, dragDepth.current - 1)
        if (dragDepth.current === 0) setIsDragging(false)
      }}
      onDrop={(e) => {
        e.preventDefault()
        dragDepth.current = 0
        setIsDragging(false)
        handleFiles(e.dataTransfer.files)
      }}
    >
      <input
        id={id}
        type="file"
        className={styles.input}
        accept={accept}
        onChange={(e) => {
          handleFiles(e.target.files)
          e.target.value = ''
        }}
      />
      <CloudUploadIcon size={24} />
      <p className={styles.heading}>
        Drag and drop file, or <span className={styles.browse}>Browse</span>
      </p>
      {subtext && <p className={styles.subtext}>{subtext}</p>}
    </label>
  )
}

export default FileDropzone
