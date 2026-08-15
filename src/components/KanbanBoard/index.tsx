import { useState } from 'react'
import { Plus } from 'lucide-react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TicketCard from '../TicketCard'
import { TICKET_COLUMNS, type Ticket } from '../../lib/tickets'
import styles from './KanbanBoard.module.scss'

interface SortableCardProps {
  ticket: Ticket
  onOpen?: (ticket: Ticket) => void
}

const SortableCard = ({ ticket, onOpen }: SortableCardProps) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: ticket.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={() => onOpen?.(ticket)}>
      <TicketCard ticket={ticket} />
    </div>
  )
}

interface ColumnProps {
  id: string
  title: string
  tickets: Ticket[]
  onOpenTicket?: (columnId: string, ticket: Ticket) => void
}

const Column = ({ id, title, tickets, onOpenTicket }: ColumnProps) => {
  const { setNodeRef } = useDroppable({ id })

  return (
    <div className={styles.column}>
      <div className={styles.columnHeader}>
        <span className={styles.columnTitle}>
          {title} ({tickets.length})
        </span>
        <button type="button" className={styles.addButton} aria-label={`Add ticket to ${title}`}>
          <Plus size={16} />
        </button>
      </div>
      <SortableContext id={id} items={tickets.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div ref={setNodeRef} className={styles.columnBody}>
          {tickets.map((ticket) => (
            <SortableCard key={ticket.id} ticket={ticket} onOpen={(t) => onOpenTicket?.(id, t)} />
          ))}
        </div>
      </SortableContext>
    </div>
  )
}

const findContainer = (tickets: Record<string, Ticket[]>, id: string) => {
  if (tickets[id]) return id
  return Object.keys(tickets).find((key) => tickets[key].some((t) => t.id === id))
}

export interface KanbanBoardProps {
  tickets: Record<string, Ticket[]>
  onChange: (tickets: Record<string, Ticket[]>) => void
  onOpenTicket?: (columnId: string, ticket: Ticket) => void
  search?: string
}

const KanbanBoard = ({ tickets, onChange, onOpenTicket, search = '' }: KanbanBoardProps) => {
  const [activeTicket, setActiveTicket] = useState<Ticket | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const handleDragStart = (event: DragStartEvent) => {
    const container = findContainer(tickets, String(event.active.id))
    if (!container) return
    const ticket = tickets[container].find((t) => t.id === event.active.id)
    setActiveTicket(ticket ?? null)
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)

    const activeContainer = findContainer(tickets, activeId)
    const overContainer = findContainer(tickets, overId)

    if (!activeContainer || !overContainer || activeContainer === overContainer) return

    const activeItems = tickets[activeContainer]
    const overItems = tickets[overContainer]
    const activeIndex = activeItems.findIndex((t) => t.id === activeId)
    const overIndex = overItems.findIndex((t) => t.id === overId)

    const movedTicket = activeItems[activeIndex]
    const newActiveItems = activeItems.filter((t) => t.id !== activeId)
    const insertAt = overIndex >= 0 ? overIndex : overItems.length
    const newOverItems = [...overItems.slice(0, insertAt), movedTicket, ...overItems.slice(insertAt)]

    onChange({
      ...tickets,
      [activeContainer]: newActiveItems,
      [overContainer]: newOverItems,
    })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTicket(null)
    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)
    const container = findContainer(tickets, activeId)
    if (!container) return

    const overContainer = findContainer(tickets, overId)
    if (overContainer !== container) return

    const items = tickets[container]
    const activeIndex = items.findIndex((t) => t.id === activeId)
    const overIndex = items.findIndex((t) => t.id === overId)

    if (activeIndex !== overIndex && overIndex >= 0) {
      onChange({
        ...tickets,
        [container]: arrayMove(items, activeIndex, overIndex),
      })
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={styles.board}>
        {TICKET_COLUMNS.map((column) => {
          const columnTickets = tickets[column.id] ?? []
          const visibleTickets = search.trim()
            ? columnTickets.filter((t) => t.title.toLowerCase().includes(search.trim().toLowerCase()))
            : columnTickets
          return (
            <Column
              key={column.id}
              id={column.id}
              title={column.title}
              tickets={visibleTickets}
              onOpenTicket={onOpenTicket}
            />
          )
        })}
      </div>
      <DragOverlay>{activeTicket && <TicketCard ticket={activeTicket} dragging />}</DragOverlay>
    </DndContext>
  )
}

export default KanbanBoard
