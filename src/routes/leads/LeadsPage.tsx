import { useEffect, useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  EllipsisVertical,
  Info,
  SlidersHorizontal,
  Trash2,
  UserRound,
} from "lucide-react";
import PageHeader from "../../components/PageHeader";
import SearchInput from "../../components/SearchInput";
import FilterChip from "../../components/FilterChip";
import Pagination from "../../components/Pagination";
import { COLLABORATORS, handleShare } from "../../lib/dashboard";
import { avatarColor } from "../../lib/avatarColor";
import styles from "./LeadsPage.module.scss";

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  aiScore: number;
  scoreColor: string;
  source: string;
  assignedTo: string;
  createdAt: number;
}

const DAY = 24 * 60 * 60 * 1000;
const NOW = Date.now();

const MOCK_LEADS: Lead[] = [
  {
    id: "lead-1",
    name: "Aryan Shrestha",
    email: "Sth.aryan07@gmail.com",
    phone: "9808226119",
    aiScore: 90,
    scoreColor: "#A153FF",
    source: "Website",
    assignedTo: "Aryan Shrestha",
    createdAt: NOW,
  },
  {
    id: "lead-2",
    name: "Apsan Rana Magar",
    email: "Apsan@gmail.com",
    phone: "9808096170",
    aiScore: 20,
    scoreColor: "#F59E0B",
    source: "WhatsApp",
    assignedTo: "Aryan Shrestha",
    createdAt: NOW - 3 * DAY,
  },
  {
    id: "lead-3",
    name: "Sanket Shrestha",
    email: "Thedorkid@gmail.com",
    phone: "9878096170",
    aiScore: 80,
    scoreColor: "#22C55E",
    source: "Instagram",
    assignedTo: "Aryan Shrestha",
    createdAt: NOW - 10 * DAY,
  },
  {
    id: "lead-4",
    name: "Prakash Shrestha",
    email: "Prakash09@gmail.com",
    phone: "980809898",
    aiScore: 10,
    scoreColor: "#EF4444",
    source: "Messenger",
    assignedTo: "Aryan Shrestha",
    createdAt: NOW - 45 * DAY,
  },
];

const DATE_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "All Dates" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
];

const matchesDateFilter = (createdAt: number, filter: string) => {
  if (filter === "all") return true;
  const ageInDays = (NOW - createdAt) / DAY;
  if (filter === "today") return ageInDays < 1;
  if (filter === "7d") return ageInDays < 7;
  if (filter === "30d") return ageInDays < 30;
  return true;
};

const PAGE_SIZE = 10;

const SOURCE_OPTIONS = Array.from(
  new Set(MOCK_LEADS.map((lead) => lead.source)),
);
const ASSIGNEE_OPTIONS = Array.from(
  new Set(MOCK_LEADS.map((lead) => lead.assignedTo)),
);

export function LeadsPage() {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [dateMenuOpen, setDateMenuOpen] = useState(false);
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [sourceFilter, setSourceFilter] = useState<string | null>(null);
  const [assigneeFilter, setAssigneeFilter] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const dateMenuRef = useRef<HTMLDivElement>(null);
  const actionMenuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterMenuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(e.target as Node)
      ) {
        setFilterMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [filterMenuOpen]);

  useEffect(() => {
    if (!dateMenuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        dateMenuRef.current &&
        !dateMenuRef.current.contains(e.target as Node)
      ) {
        setDateMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [dateMenuOpen]);

  useEffect(() => {
    if (!openActionMenuId) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(e.target as Node)
      ) {
        setOpenActionMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [openActionMenuId]);

  const visibleLeads = useMemo(() => {
    const query = search.trim().toLowerCase();
    return leads.filter((lead) => {
      const matchesSearch =
        !query ||
        lead.name.toLowerCase().includes(query) ||
        lead.email.toLowerCase().includes(query) ||
        lead.phone.includes(query);
      const matchesSource = !sourceFilter || lead.source === sourceFilter;
      const matchesAssignee =
        !assigneeFilter || lead.assignedTo === assigneeFilter;
      return (
        matchesSearch &&
        matchesSource &&
        matchesAssignee &&
        matchesDateFilter(lead.createdAt, dateFilter)
      );
    });
  }, [leads, search, dateFilter, sourceFilter, assigneeFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, dateFilter, sourceFilter, assigneeFilter]);

  const totalPages = Math.max(1, Math.ceil(visibleLeads.length / PAGE_SIZE));
  const paginatedLeads = visibleLeads.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const removeLead = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
    setOpenActionMenuId(null);
  };

  const activeDateLabel =
    DATE_FILTERS.find((f) => f.value === dateFilter)?.label ?? "All Dates";

  return (
    <div>
      <PageHeader
        title="Leads"
        collaborators={COLLABORATORS}
        onShare={handleShare}
      />

      <div className={styles.page}>
        <div className={styles.toolbar}>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            resultsCount={search.trim() ? visibleLeads.length : undefined}
          />
          {sourceFilter && (
            <FilterChip
              prefix="Source:"
              label={sourceFilter}
              onRemove={() => setSourceFilter(null)}
            />
          )}

          {assigneeFilter && (
            <FilterChip
              prefix="Assigned:"
              label={assigneeFilter}
              onRemove={() => setAssigneeFilter(null)}
            />
          )}

          <div className={styles.filterMenuWrapper} ref={filterMenuRef}>
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Filters"
              aria-haspopup="menu"
              aria-expanded={filterMenuOpen}
              onClick={() => setFilterMenuOpen((prev) => !prev)}
            >
              <SlidersHorizontal size={16} />
            </button>

            {filterMenuOpen && (
              <div className={styles.filterMenu} role="menu">
                <div className={styles.filterMenuGroup}>
                  <span className={styles.filterMenuGroupLabel}>Source</span>
                  {SOURCE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`${styles.filterMenuOption} ${
                        option === sourceFilter
                          ? styles.filterMenuOptionActive
                          : ""
                      }`}
                      onClick={() => {
                        setSourceFilter(option);
                        setFilterMenuOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <div className={styles.filterMenuGroup}>
                  <span className={styles.filterMenuGroupLabel}>
                    Assigned To
                  </span>
                  {ASSIGNEE_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={`${styles.filterMenuOption} ${
                        option === assigneeFilter
                          ? styles.filterMenuOptionActive
                          : ""
                      }`}
                      onClick={() => {
                        setAssigneeFilter(option);
                        setFilterMenuOpen(false);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className={styles.dateFilter} ref={dateMenuRef}>
            <button
              type="button"
              className={styles.dateFilterButton}
              aria-haspopup="listbox"
              aria-expanded={dateMenuOpen}
              onClick={() => setDateMenuOpen((prev) => !prev)}
            >
              {activeDateLabel}
              <ChevronDown size={16} />
            </button>

            {dateMenuOpen && (
              <ul className={styles.dateMenu} role="listbox">
                {DATE_FILTERS.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={option.value === dateFilter}
                      className={`${styles.dateMenuOption} ${
                        option.value === dateFilter
                          ? styles.dateMenuOptionActive
                          : ""
                      }`}
                      onClick={() => {
                        setDateFilter(option.value);
                        setDateMenuOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className={styles.table}>
          <div className={styles.headerRow}>
            <span className={styles.headerCell}>Name</span>
            <span className={styles.headerCell}>Contact</span>
            <span className={styles.headerCell}>
              AI Score
              <Info size={14} color="#A1A1AA" aria-hidden="true" />
            </span>
            <span className={styles.headerCell}>Source</span>
            <span className={styles.headerCell}>Assigned To</span>
            <span className={styles.headerCell} aria-hidden="true" />
          </div>

          {paginatedLeads.map((lead) => (
            <div key={lead.id} className={styles.row}>
              <span className={styles.nameCell}>{lead.name}</span>

              <span className={styles.contactCell}>
                <span className={styles.contactEmail}>{lead.email}</span>
                <span className={styles.contactPhone}>{lead.phone}</span>
              </span>

              <span className={styles.scoreCell}>
                <span className={styles.scoreTrack}>
                  <span
                    className={styles.scoreFill}
                    style={{
                      width: `${lead.aiScore}%`,
                      background: lead.scoreColor,
                    }}
                  />
                </span>
                <span className={styles.scoreValue}>{lead.aiScore}</span>
              </span>

              <span className={styles.sourceCell}>{lead.source}</span>

              <span className={styles.assignedCell}>
                <span
                  className={styles.assignedAvatar}
                  style={{ background: avatarColor(lead.assignedTo) }}
                >
                  <UserRound size={16} />
                </span>
                <span className={styles.assignedName}>{lead.assignedTo}</span>
              </span>

              <span className={styles.moreCell}>
                <button
                  type="button"
                  className={styles.moreButton}
                  aria-label="More actions"
                  onClick={() =>
                    setOpenActionMenuId((prev) =>
                      prev === lead.id ? null : lead.id,
                    )
                  }
                >
                  <EllipsisVertical size={16} />
                </button>

                {openActionMenuId === lead.id && (
                  <div className={styles.actionMenu} ref={actionMenuRef}>
                    <button
                      type="button"
                      className={styles.actionMenuItem}
                      onClick={() => removeLead(lead.id)}
                    >
                      <Trash2 size={14} />
                      Delete lead
                    </button>
                  </div>
                )}
              </span>
            </div>
          ))}

          {visibleLeads.length === 0 && (
            <div className={styles.emptyState}>No leads found.</div>
          )}
        </div>

        {visibleLeads.length > PAGE_SIZE && (
          <div className={styles.paginationRow}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
