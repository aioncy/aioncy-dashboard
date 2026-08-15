import { useEffect, useRef, useState } from 'react'
import { Ban, Bold, Paperclip, Smile, User, Users } from 'lucide-react'
import Modal from '../Modal'
import TextInput from '../TextInput'
import Button from '../Button'
import DropdownButton from '../DropdownButton'
import ActionMenu from '../ActionMenu'
import { COLLABORATORS } from '../../lib/dashboard'
import { avatarColor } from '../../lib/avatarColor'
import styles from './CreateMacroModal.module.scss'

const CURRENT_USER = 'Aryan Shrestha'

export interface CreateMacroPayload {
  title: string
  body: string
  availableFor: string[]
}

export interface CreateMacroModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (macro: CreateMacroPayload) => void
}

const CreateMacroModal = ({ isOpen, onClose, onSave }: CreateMacroModalProps) => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState(
    "Thank you for reaching out to us. We've received your message and are happy to help. Our team is currently reviewing your request and will get back to you as soon as possible.\n\nBest regards,\nAcme",
  )
  const [availableFor, setAvailableFor] = useState<string[]>([])
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false)
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false)
  const availabilityRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    setTitle('')
    setAvailableFor([])
    setIsAvailabilityOpen(false)
    setIsActionMenuOpen(false)
  }, [isOpen])

  useEffect(() => {
    if (!isAvailabilityOpen) return
    const handleClickOutside = (e: MouseEvent) => {
      if (availabilityRef.current && !availabilityRef.current.contains(e.target as Node)) {
        setIsAvailabilityOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isAvailabilityOpen])

  const toggleCollaborator = (name: string) => {
    setAvailableFor((prev) => (prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]))
  }

  const handleSave = () => {
    if (!title.trim()) return
    onSave({ title: title.trim(), body, availableFor })
    onClose()
  }

  const isEveryoneSelected = availableFor.length === COLLABORATORS.length
  const isNoneSelected = availableFor.length === 0

  const availabilityLabel = isNoneSelected ? 'None' : isEveryoneSelected ? 'Everyone' : `${availableFor.length} selected`

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Marco">
      <TextInput
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <div className={styles.editor}>
        <div className={styles.editorBody}>
          <p className={styles.greeting}>
            👋 Hi <span className={styles.pill}>First name</span>,
          </p>
          <textarea
            className={styles.textarea}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Write your message..."
          />
          <div className={styles.actionMenuAnchor}>
            <button type="button" className={styles.addAction} onClick={() => setIsActionMenuOpen((prev) => !prev)}>
              Add a action
            </button>
            {isActionMenuOpen && (
              <div className={styles.actionMenuPopover}>
                <ActionMenu
                  assignees={COLLABORATORS}
                  onClose={() => setIsActionMenuOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
        <div className={styles.toolbar}>
          <button type="button" className={styles.toolbarButton} aria-label="Insert emoji">
            <Smile size={16} />
          </button>
          <button type="button" className={styles.toolbarButton} aria-label="Bold">
            <Bold size={16} />
          </button>
          <button type="button" className={styles.toolbarButton} aria-label="Attach file">
            <Paperclip size={16} />
          </button>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.availability} ref={availabilityRef}>
          <span className={styles.availabilityLabel}>Available for</span>
          <DropdownButton
            label={availabilityLabel}
            icon={<User size={14} />}
            trailingIcon="chevron"
            expanded={isAvailabilityOpen}
            onClick={() => setIsAvailabilityOpen((prev) => !prev)}
          />
          {isAvailabilityOpen && (
            <div className={styles.availabilityMenu}>
              <div
                className={styles.availabilityOption}
                onClick={() => setAvailableFor(COLLABORATORS.map((c) => c.name))}
              >
                <span className={`${styles.availabilityIcon} ${styles.neutralIcon}`}>
                  <Users size={12} />
                </span>
                <span className={styles.availabilityName}>Everyone</span>
                <input type="checkbox" readOnly checked={isEveryoneSelected} onClick={(e) => e.stopPropagation()} />
              </div>

              {COLLABORATORS.map((collaborator) => (
                <div
                  key={collaborator.name}
                  className={styles.availabilityOption}
                  onClick={() => toggleCollaborator(collaborator.name)}
                >
                  <span className={styles.availabilityIcon} style={{ background: avatarColor(collaborator.name) }}>
                    {collaborator.name.charAt(0).toUpperCase()}
                  </span>
                  <span className={styles.availabilityName}>
                    {collaborator.name}
                    {collaborator.name === CURRENT_USER ? ' (Me)' : ''}
                  </span>
                  <input
                    type="checkbox"
                    readOnly
                    checked={availableFor.includes(collaborator.name)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              ))}

              <div className={styles.availabilityOption} onClick={() => setAvailableFor([])}>
                <span className={`${styles.availabilityIcon} ${styles.neutralIcon}`}>
                  <Ban size={12} />
                </span>
                <span className={styles.availabilityName}>None</span>
                <input type="checkbox" readOnly checked={isNoneSelected} onClick={(e) => e.stopPropagation()} />
              </div>
            </div>
          )}
        </div>

        <div className={styles.actions}>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={!title.trim()}>
            Save Marco
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default CreateMacroModal
