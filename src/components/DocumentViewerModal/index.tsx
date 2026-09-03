import { useEffect, useRef } from 'react'
import { Pencil, Upload } from 'lucide-react'
import Button from '../Button'
import DetailsPanel, { type DocumentStatusTone } from '../DetailsPanel'
import styles from './DocumentViewerModal.module.scss'

export type { DocumentStatusTone }

export interface DocumentViewerModalProps {
  title: string
  status: string
  statusTone: DocumentStatusTone
  createdBy: string
  updatedAt: number
  updatedBy: string
  onClose: () => void
  onDelete: () => void
  onReUpload: (file: File) => void
}

/** Stand-in for the text a real extraction step would return for the document. */
const DOCUMENT_PREVIEW = {
  heading: 'AI-Workshop2_ipynb - Colaboratory',
  intro: ['Task Set-I: DataFrame Reading and Writing.', 'Answer the following:', 'Dataset: "bank.csv".'],
  bullets: [
    { text: 'Load the provided dataset and import in pandas.' },
    {
      text: 'Check info of the DataFrame and identify following:',
      ordered: [
        'columns with dtypes=object',
        'unique values of those columns.',
        'check for the  total number of null values in each column.',
      ],
    },
    {
      text: 'Drop all the columns with dtypes int and store into new DataFrame,  also write the DataFrame in ".csv" with name "banknumericdata.csv"',
    },
    { text: 'Read "banknumericdata.csv" and Find the summary statistics.', tight: true },
  ],
  code: 'from google.colab import files upload = files.upload()',
}

const DocumentViewerModal = ({
  title,
  status,
  statusTone,
  createdBy,
  updatedAt,
  updatedBy,
  onClose,
  onDelete,
  onReUpload,
}: DocumentViewerModalProps) => {
  const reUploadInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.main}>
          <div className={styles.mainHeader}>
            <span className={styles.mainHeaderTitle}>Document</span>

            <div className={styles.actions}>
              <Button variant="danger" onClick={onDelete}>
                Delete
              </Button>

              <input
                ref={reUploadInputRef}
                type="file"
                accept="application/pdf"
                className={styles.hiddenInput}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) onReUpload(file)
                  e.target.value = ''
                }}
              />
              <Button
                variant="outline"
                size="sm"
                icon={<Upload size={16} />}
                onClick={() => reUploadInputRef.current?.click()}
              >
                Re-Upload
              </Button>

              {/* Button's disabled treatment is a filled grey, so this keeps the outline look. */}
              <span className={styles.tooltipWrap} data-tooltip="Documents can't be edited">
                <button type="button" className={styles.editDisabled} disabled>
                  <Pencil size={16} />
                  Edit
                </button>
              </span>
            </div>
          </div>

          <div className={styles.content}>
            <h1 className={styles.docHeading}>{DOCUMENT_PREVIEW.heading}</h1>

            {DOCUMENT_PREVIEW.intro.map((line) => (
              <p key={line} className={styles.docText}>
                {line}
              </p>
            ))}

            <ul className={styles.docList}>
              {DOCUMENT_PREVIEW.bullets.map((bullet) => (
                <li
                  key={bullet.text}
                  className={`${styles.docListItem} ${
                    bullet.tight ? styles.docListItemTight : ''
                  }`}
                >
                  {bullet.text}
                  {bullet.ordered && (
                    <ol className={styles.docOrderedList}>
                      {bullet.ordered.map((entry) => (
                        <li key={entry}>{entry}</li>
                      ))}
                    </ol>
                  )}
                </li>
              ))}
            </ul>

            <pre className={styles.docCode}>{DOCUMENT_PREVIEW.code}</pre>
          </div>
        </div>

        <DetailsPanel
          type="Document"
          status={status}
          statusTone={statusTone}
          createdBy={createdBy}
          updatedAt={updatedAt}
          updatedBy={updatedBy}
          onClose={onClose}
        />
      </div>
    </div>
  )
}

export default DocumentViewerModal
