import { useState } from 'react'
import { Ban, CircleDashed, CircleDot, EllipsisVertical, LoaderCircle, UserRound } from 'lucide-react'
import PriorityBadge from '../PriorityBadge'
import { avatarColor } from '../../lib/avatarColor'
import { TICKET_COLUMNS, type Ticket } from '../../lib/tickets'
import styles from './TicketListView.module.scss'

const STATUS_ICONS: Record<string, typeof CircleDashed> = {
  todo: CircleDashed,
  'in-progress': LoaderCircle,
  waiting: Ban,
  resolved: CircleDot,
}

export interface TicketListViewProps {
  tickets: Record<string, Ticket[]>
  search?: string
  onOpenTicket?: (columnId: string, ticket: Ticket) => void
}

const TicketListView = ({ tickets, search = '', onOpenTicket }: TicketListViewProps) => {
  const [collapsed, setCollapsed] = useState<string[]>([])

  const toggleSection = (id: string) => {
    setCollapsed((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  return (
    <div className={styles.list}>
      {TICKET_COLUMNS.map((column) => {
        const columnTickets = tickets[column.id] ?? []
        const visibleTickets = search.trim()
          ? columnTickets.filter((t) => t.title.toLowerCase().includes(search.trim().toLowerCase()))
          : columnTickets
        const isCollapsed = collapsed.includes(column.id)
        const StatusIcon = STATUS_ICONS[column.id] ?? CircleDashed

        return (
          <div key={column.id} className={styles.section}>
            <button
              type="button"
              className={styles.sectionHeader}
              onClick={() => toggleSection(column.id)}
              aria-expanded={!isCollapsed}
            >
              <StatusIcon size={14} className={styles.statusIcon} />
              <span className={styles.sectionTitle}>{column.title}</span>
              <span className={styles.sectionCount}>{visibleTickets.length}</span>
            </button>

            {!isCollapsed && (
              <div className={styles.rows}>
                {visibleTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={styles.row}
                    onClick={() => onOpenTicket?.(column.id, ticket)}
                  >
                    <span className={styles.rowTitle}>{ticket.title}</span>
                    <span className={styles.priorityCell}>
                      <PriorityBadge level={ticket.priority} />
                    </span>
                    <span className={styles.assigneeCell}>
                      {ticket.assignee ? (
                        <>
                          <span className={styles.assigneeAvatar} style={{ background: avatarColor(ticket.assignee) }}>
                            {ticket.assignee.charAt(0).toUpperCase()}
                          </span>
                          <span className={styles.assigneeName}>{ticket.assignee}</span>
                        </>
                      ) : (
                        <>
                          <span className={`${styles.assigneeAvatar} ${styles.unassigned}`}>
                            <UserRound size={16} />
                          </span>
                          <span className={`${styles.assigneeName} ${styles.unassignedText}`}>Unassigned</span>
                        </>
                      )}
                    </span>
                    <button
                      type="button"
                      className={styles.moreButton}
                      aria-label="More actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <EllipsisVertical size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default TicketListView
