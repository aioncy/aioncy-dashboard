import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import Modal from '../Modal'
import Button from '../Button'
import CheckIcon from '../CheckIcon'
import { PRIORITY_COLORS } from '../PriorityBadge'
import { avatarColor } from '../../lib/avatarColor'
import { COLLABORATORS } from '../../lib/dashboard'
import { TICKET_COLUMNS, type Ticket, type PriorityLevel } from '../../lib/tickets'
import styles from './TicketDetailModal.module.scss'

const PRIORITY_OPTIONS: { level: PriorityLevel; label: string }[] = [
  { level: 'low', label: 'Low' },
  { level: 'medium', label: 'Medium' },
  { level: 'high', label: 'High' },
  { level: 'urgent', label: 'Urgent' },
]

export interface TicketDetailModalProps {
  isOpen: boolean
  onClose: () => void
  ticket: Ticket | null
  columnId: string | null
  onUpdateTicket: (columnId: string, ticketId: string, updates: Partial<Ticket>) => void
  onMoveStatus: (columnId: string, ticketId: string, newColumnId: string) => void
  onAddComment: (columnId: string, ticketId: string, text: string) => void
}

type OpenField = 'assigned' | 'priority' | null

const TicketDetailModal = ({
  isOpen,
  onClose,
  ticket,
  columnId,
  onUpdateTicket,
  onMoveStatus,
  onAddComment,
}: TicketDetailModalProps) => {
  const [openField, setOpenField] = useState<OpenField>(null)
  const [commentText, setCommentText] = useState('')
  const fieldsRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) {
      setOpenField(null)
      setCommentText('')
    }
  }, [isOpen])

  useEffect(() => {
    if (!openField) return
    const handleClickOutside = (e: MouseEvent) => {
      if (fieldsRef.current && !fieldsRef.current.contains(e.target as Node)) setOpenField(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openField])

  if (!ticket || !columnId) return null

  const columnTitle = TICKET_COLUMNS.find((c) => c.id === columnId)?.title ?? columnId

  const handleSubmitComment = () => {
    const trimmed = commentText.trim()
    if (!trimmed) return
    onAddComment(columnId, ticket.id, trimmed)
    setCommentText('')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Ticket ${ticket.ticketNumber}`} width={995} height={630}>
      <div className={styles.body}>
        <div className={styles.leftCol}>
          <h1 className={styles.mainHeading}>{ticket.title}</h1>
          <p className={styles.description}>{ticket.description}</p>

          <div className={styles.fields} ref={fieldsRef}>
            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>Status</span>
              <div className={styles.statusControl}>
                <span className={styles.statusLabel}>{columnTitle}</span>
                <button
                  type="button"
                  className={styles.statusNext}
                  aria-label="Move to next status"
                  onClick={() => {
                    const currentIndex = TICKET_COLUMNS.findIndex((c) => c.id === columnId)
                    const nextColumn = TICKET_COLUMNS[(currentIndex + 1) % TICKET_COLUMNS.length]
                    onMoveStatus(columnId, ticket.id, nextColumn.id)
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>Assigned</span>
              <div className={styles.fieldControl}>
                <button
                  type="button"
                  className={styles.pill}
                  onClick={() => setOpenField((prev) => (prev === 'assigned' ? null : 'assigned'))}
                >
                  {ticket.assignee && (
                    <span className={styles.pillAvatar} style={{ background: avatarColor(ticket.assignee) }}>
                      {ticket.assignee.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span>{ticket.assignee ?? 'Unassigned'}</span>
                  <ChevronDown size={14} className={styles.pillChevron} />
                </button>
                {openField === 'assigned' && (
                  <div className={styles.menu}>
                    {COLLABORATORS.map((collaborator) => (
                      <div
                        key={collaborator.name}
                        className={styles.menuItem}
                        onClick={() => {
                          onUpdateTicket(columnId, ticket.id, { assignee: collaborator.name })
                          setOpenField(null)
                        }}
                      >
                        <span className={styles.menuAvatar} style={{ background: avatarColor(collaborator.name) }}>
                          {collaborator.name.charAt(0).toUpperCase()}
                        </span>
                        <span className={styles.menuLabel}>{collaborator.name}</span>
                        {collaborator.name === ticket.assignee && <CheckIcon size={18} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>Priority</span>
              <div className={styles.fieldControl}>
                <button
                  type="button"
                  className={styles.pill}
                  onClick={() => setOpenField((prev) => (prev === 'priority' ? null : 'priority'))}
                >
                  <span className={styles.priorityDot} style={{ background: PRIORITY_COLORS[ticket.priority].color }} />
                  <span>{ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}</span>
                  <ChevronDown size={14} className={styles.pillChevron} />
                </button>
                {openField === 'priority' && (
                  <div className={styles.menu}>
                    {PRIORITY_OPTIONS.map((option) => (
                      <div
                        key={option.level}
                        className={styles.menuItem}
                        onClick={() => {
                          onUpdateTicket(columnId, ticket.id, { priority: option.level })
                          setOpenField(null)
                        }}
                      >
                        <span className={styles.priorityDot} style={{ background: PRIORITY_COLORS[option.level].color }} />
                        <span className={styles.menuLabel}>{option.label}</span>
                        {option.level === ticket.priority && <CheckIcon size={18} />}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.sourceSection}>
            <span className={styles.sourceLabel}>Source</span>
            <div className={styles.sourceCard}>
              <span className={styles.sourceAvatar} style={{ background: avatarColor(ticket.source.name) }}>
                {ticket.source.name.charAt(0).toUpperCase()}
              </span>
              <div className={styles.sourceInfo}>
                <span className={styles.sourceName}>{ticket.source.name}</span>
                <span className={styles.sourceChannel}>{ticket.source.channel}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate({ to: '/conversations' })}>
                Go to conversation
              </Button>
            </div>
          </div>
        </div>

        <div className={styles.rightCol}>
          <div className={styles.commentsList}>
            {ticket.comments.length === 0 && <p className={styles.noComments}>No comments yet.</p>}
            {ticket.comments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <span className={styles.commentAvatar} style={{ background: avatarColor(comment.author) }}>
                  {comment.author.charAt(0).toUpperCase()}
                </span>
                <div className={styles.commentBody}>
                  <span className={styles.commentAuthor}>{comment.author}</span>
                  <p className={styles.commentText}>{comment.text}</p>
                  <button type="button" className={styles.replyLink}>
                    Reply
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.commentInput}>
            <textarea
              className={styles.commentTextarea}
              placeholder="Add a comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmitComment()
                }
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default TicketDetailModal
