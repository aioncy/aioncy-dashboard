import { useEffect, useState } from 'react'
import SidePanel from '../SidePanel'
import FileDropzone from '../FileDropzone'
import FileUploadCard from '../FileUploadCard'
import Button from '../Button'
import styles from './UploadDocumentPanel.module.scss'

type UploadStatus = 'uploading' | 'default' | 'error'

interface UploadItem {
  id: string
  file: File
  progress: number
  status: UploadStatus
}

export interface UploadDocumentPanelProps {
  onClose: () => void
  onSubmit: (files: File[]) => void
}

const MAX_SIZE_MB = 50
const PROGRESS_STEP = 12
const PROGRESS_INTERVAL_MS = 260

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const UploadDocumentPanel = ({ onClose, onSubmit }: UploadDocumentPanelProps) => {
  const [items, setItems] = useState<UploadItem[]>([])

  const hasUploading = items.some((item) => item.status === 'uploading')

  // No backend to report real progress, so the transfer is advanced on a timer.
  useEffect(() => {
    if (!hasUploading) return
    const timer = setInterval(() => {
      setItems((prev) =>
        prev.map((item) => {
          if (item.status !== 'uploading') return item
          const progress = Math.min(100, item.progress + PROGRESS_STEP)
          return progress >= 100
            ? { ...item, progress: 100, status: 'default' as const }
            : { ...item, progress }
        }),
      )
    }, PROGRESS_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [hasUploading])

  const handleFileSelect = (file: File) => {
    setItems((prev) => [
      ...prev,
      {
        id: `${file.name}-${Date.now()}`,
        file,
        progress: 0,
        status: 'uploading',
      },
    ])
  }

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const handleRetry = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, progress: 0, status: 'uploading' as const } : item,
      ),
    )
  }

  const readyFiles = items.filter((item) => item.status === 'default').map((item) => item.file)

  return (
    <SidePanel
      isOpen
      onClose={onClose}
      title="Upload PDF"
      footer={
        <Button
          variant="primary"
          size="sm"
          disabled={readyFiles.length === 0}
          onClick={() => onSubmit(readyFiles)}
        >
          Next
        </Button>
      }
    >
      <div className={styles.step}>
        <div className={styles.section}>
          <div className={styles.headingGroup}>
            <h3 className={styles.sectionTitle}>Upload PDF</h3>
            <p className={styles.sectionSubtitle}>Manage your wingman&apos;s working hours</p>
          </div>

          <FileDropzone
            accept="application/pdf"
            maxSizeMB={MAX_SIZE_MB}
            onFileSelect={handleFileSelect}
            className={styles.dropzone}
          />
        </div>

        {items.length > 0 && (
          <div className={styles.section}>
            <span className={styles.uploadedLabel}>Uploaded</span>
            <div className={styles.uploadedList}>
              {items.map((item) => (
                <FileUploadCard
                  key={item.id}
                  className={styles.uploadCard}
                  fileName={item.file.name}
                  fileSize={formatSize(item.file.size)}
                  status={item.status}
                  progress={item.progress}
                  onRemove={() => handleRemove(item.id)}
                  onRetry={() => handleRetry(item.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </SidePanel>
  )
}

export default UploadDocumentPanel
