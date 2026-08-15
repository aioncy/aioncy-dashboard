import { UserRound } from 'lucide-react'
import PriorityBadge from '../PriorityBadge'
import { avatarColor } from '../../lib/avatarColor'
import type { Ticket } from '../../lib/tickets'
import styles from './TicketCard.module.scss'

export interface TicketCardProps {
  ticket: Ticket
  dragging?: boolean
}

const TicketCard = ({ ticket, dragging = false }: TicketCardProps) => {
  return (
    <div className={`${styles.card} ${dragging ? styles.dragging : ''}`}>
      <div className={styles.body}>
        <h3 className={styles.title}>{ticket.title}</h3>
        <p className={styles.description}>{ticket.description}</p>
      </div>
      <div className={styles.footer}>
        <PriorityBadge level={ticket.priority} />
        {ticket.assignee ? (
          <span className={styles.avatar} style={{ background: avatarColor(ticket.assignee) }} title={ticket.assignee}>
            {ticket.assignee.charAt(0).toUpperCase()}
          </span>
        ) : (
          <span className={`${styles.avatar} ${styles.unassigned}`} title="Unassigned">
            <UserRound size={12} />
          </span>
        )}
      </div>
    </div>
  )
}

export default TicketCard
