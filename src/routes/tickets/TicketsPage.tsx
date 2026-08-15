import { useState } from "react";
import { Kanban, List, SlidersHorizontal } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import SearchInput from "../../components/SearchInput";
import KanbanBoard from "../../components/KanbanBoard";
import TicketListView from "../../components/TicketListView";
import TicketDetailModal from "../../components/TicketDetailModal";
import { COLLABORATORS, handleShare } from "../../lib/dashboard";
import {
  INITIAL_TICKETS,
  type Ticket,
  type TicketComment,
} from "../../lib/tickets";
import styles from "./TicketsPage.module.scss";

export function TicketsPage() {
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [tickets, setTickets] =
    useState<Record<string, Ticket[]>>(INITIAL_TICKETS);
  const [selected, setSelected] = useState<{
    columnId: string;
    ticketId: string;
  } | null>(null);

  const selectedTicket = selected
    ? (tickets[selected.columnId]?.find((t) => t.id === selected.ticketId) ??
      null)
    : null;

  const handleOpenTicket = (columnId: string, ticket: Ticket) => {
    setSelected({ columnId, ticketId: ticket.id });
  };

  const handleUpdateTicket = (
    columnId: string,
    ticketId: string,
    updates: Partial<Ticket>,
  ) => {
    setTickets((prev) => ({
      ...prev,
      [columnId]: prev[columnId].map((t) =>
        t.id === ticketId ? { ...t, ...updates } : t,
      ),
    }));
  };

  const handleMoveStatus = (
    fromColumnId: string,
    ticketId: string,
    toColumnId: string,
  ) => {
    if (fromColumnId === toColumnId) return;
    setTickets((prev) => {
      const ticket = prev[fromColumnId]?.find((t) => t.id === ticketId);
      if (!ticket) return prev;
      return {
        ...prev,
        [fromColumnId]: prev[fromColumnId].filter((t) => t.id !== ticketId),
        [toColumnId]: [...(prev[toColumnId] ?? []), ticket],
      };
    });
    setSelected((prev) =>
      prev && prev.ticketId === ticketId
        ? { columnId: toColumnId, ticketId }
        : prev,
    );
  };

  const handleAddComment = (
    columnId: string,
    ticketId: string,
    text: string,
  ) => {
    setTickets((prev) => ({
      ...prev,
      [columnId]: prev[columnId].map((t) => {
        if (t.id !== ticketId) return t;
        const comment: TicketComment = {
          id: `comment-${t.comments.length}-${ticketId}`,
          author: "Prakash Shrestha",
          text,
        };
        return { ...t, comments: [...t.comments, comment] };
      }),
    }));
  };

  return (
    <div>
      <PageHeader
        title="Tickets"
        collaborators={COLLABORATORS}
        onShare={handleShare}
      />

      <div className={styles.page}>
        <div className={styles.toolbar}>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Filters"
          >
            <SlidersHorizontal size={16} />
          </button>
          <button
            type="button"
            className={`${styles.iconButton} ${styles.viewToggle}`}
            aria-label={
              viewMode === "board"
                ? "Switch to list view"
                : "Switch to board view"
            }
            onClick={() =>
              setViewMode((prev) => (prev === "board" ? "list" : "board"))
            }
          >
            {viewMode === "board" ? <List size={16} /> : <Kanban size={16} />}
          </button>
        </div>

        {viewMode === "board" ? (
          <KanbanBoard
            tickets={tickets}
            onChange={setTickets}
            onOpenTicket={handleOpenTicket}
            search={search}
          />
        ) : (
          <TicketListView
            tickets={tickets}
            search={search}
            onOpenTicket={handleOpenTicket}
          />
        )}
      </div>

      <TicketDetailModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        ticket={selectedTicket}
        columnId={selected?.columnId ?? null}
        onUpdateTicket={handleUpdateTicket}
        onMoveStatus={handleMoveStatus}
        onAddComment={handleAddComment}
      />
    </div>
  );
}
