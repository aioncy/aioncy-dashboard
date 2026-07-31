import { File, FileWarning, LoaderCircle, RefreshCw, X } from 'lucide-react'
import styles from './FileUploadCard.module.scss'

export interface FileUploadCardProps {
  fileName: string
  fileSize?: string
  status: 'default' | 'uploading' | 'error'
  progress?: number
  onRemove: () => void
  onRetry?: () => void
}

const FileUploadCard = ({
  fileName,
  fileSize,
  status,
  progress,
  onRemove,
  onRetry,
}: FileUploadCardProps) => {
  return (
    <div className={`${styles.card} ${styles[status]}`}>
      <div className={`${styles.iconBox} ${styles[status]}`}>
        {status === 'default' && <File size={16} />}
        {status === 'uploading' && <LoaderCircle size={16} className={styles.spinner} />}
        {status === 'error' && <FileWarning size={16} />}
      </div>
      <div className={styles.textColumn}>
        <span className={`${styles.title} ${styles[status]}`}>{fileName}</span>
        <span className={`${styles.meta} ${styles[status]}`}>
          {status === 'default' && fileSize}
          {status === 'uploading' && `Uploading · ${progress ?? 0}%`}
          {status === 'error' && 'Upload failed. Try again.'}
        </span>
      </div>
      <div className={styles.actions}>
        {status === 'error' && (
          <button
            type="button"
            className={styles.actionButton}
            aria-label="Retry upload"
            onClick={onRetry}
          >
            <RefreshCw size={16} />
          </button>
        )}
        <button
          type="button"
          className={styles.actionButton}
          aria-label={status === 'uploading' ? 'Cancel upload' : 'Remove file'}
          onClick={onRemove}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}

export default FileUploadCard
