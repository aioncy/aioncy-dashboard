import { LoaderCircle, X } from 'lucide-react'
import { avatarColor } from '../../lib/avatarColor'
import styles from './DetailsPanel.module.scss'

export type DocumentStatusTone = 'live' | 'processing' | 'draft' | 'failed' | 'inactive'

export interface DetailsPanelProps {
  /** Rendered as a badge, e.g. "Document" or "Manual". */
  type: string
  status: string
  statusTone: DocumentStatusTone
  createdBy: string
  updatedAt: number
  updatedBy: string
  onClose: () => void
}

const relativeTime = (timestamp: number) => {
  const seconds = Math.max(0, Math.round((Date.now() - timestamp) / 1000))
  if (seconds < 60) return 'Few seconds ago'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.round(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

const Avatar = ({ name }: { name: string }) => (
  <span className={styles.avatar} style={{ background: avatarColor(name) }} aria-hidden="true">
    {name.charAt(0).toUpperCase()}
  </span>
)

const STATUS_TONE_CLASSES: Record<DocumentStatusTone, string> = {
  live: styles.toneLive,
  processing: styles.toneProcessing,
  draft: styles.toneDraft,
  failed: styles.toneFailed,
  inactive: styles.toneInactive,
}

const DetailsPanel = ({
  type,
  status,
  statusTone,
  createdBy,
  updatedAt,
  updatedBy,
  onClose,
}: DetailsPanelProps) => (
  <aside className={styles.details}>
    <div className={styles.detailsHeader}>
      <span className={styles.detailsTitle}>Details</span>
      <button type="button" className={styles.closeButton} aria-label="Close" onClick={onClose}>
        <X size={18} />
      </button>
    </div>

    <div className={styles.detailsRows}>
      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Type</span>
        <span className={styles.detailValue}>
          <span className={styles.typeBadge}>{type}</span>
        </span>
      </div>

      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Status</span>
        <span className={`${styles.detailValue} ${STATUS_TONE_CLASSES[statusTone]}`}>
          {statusTone === 'processing' ? (
            <LoaderCircle size={16} className={styles.statusSpinner} aria-hidden="true" />
          ) : (
            <span className={styles.statusIndicator} aria-hidden="true">
              <span className={styles.statusDot} />
            </span>
          )}
          <span className={styles.detailValueText}>{status}</span>
        </span>
      </div>

      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Created by</span>
        <span className={styles.detailValue}>
          <Avatar name={createdBy} />
          <span className={styles.detailValueText}>{createdBy}</span>
        </span>
      </div>

      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Last updated</span>
        <span className={styles.detailValue}>
          <span className={styles.detailValueText}>{relativeTime(updatedAt)}</span>
        </span>
      </div>

      <div className={styles.detailRow}>
        <span className={styles.detailLabel}>Last updated by</span>
        <span className={styles.detailValue}>
          <Avatar name={updatedBy} />
          <span className={styles.detailValueText}>{updatedBy}</span>
        </span>
      </div>
    </div>
  </aside>
)

export default DetailsPanel
