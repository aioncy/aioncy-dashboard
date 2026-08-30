import { useEffect, useMemo, useRef, useState } from "react";
import {
  Book,
  Bookmark,
  Check,
  ChevronDown,
  Clock,
  Copy,
  EllipsisVertical,
  Flag,
  Image,
  Info,
  LaptopMinimal,
  MessageCircle,
  MessageCircleMore,
  Paperclip,
  Plus,
  Send,
  Smile,
  User,
  UserRound,
  X,
} from "lucide-react";
import PriorityBadge, {
  type PriorityLevel,
} from "../../components/PriorityBadge";
import Button from "../../components/Button";
import SearchInput from "../../components/SearchInput";
import PageHeader from "../../components/PageHeader";
import Modal from "../../components/Modal";
import { COLLABORATORS, handleShare } from "../../lib/dashboard";
import styles from "./ConversationsPage.module.scss";

type PreviewKind = "text" | "unread";

interface Message {
  id: string;
  from: "contact" | "agent";
  text: string;
  time: string;
}

interface Ticket {
  id: string;
  title: string;
  subtitle: string;
  priority: PriorityLevel;
  status?: string;
  assignee?: string | null;
}

interface Note {
  id: string;
  author: string;
  timeAgo: string;
  text: string;
}

interface ActivityEntry {
  id: string;
  text: string;
  timestamp: number;
}

interface ContactDetails {
  phone: string;
  email: string;
  address: string;
  source: string;
  sourceIcon: string;
  aiScore: number;
  summary: string;
  tickets: Ticket[];
  notes: Note[];
}

interface Conversation {
  id: string;
  name: string;
  headerEmail: string;
  avatarSrc?: string;
  time: string;
  preview: string;
  previewKind: PreviewKind;
  online?: boolean;
  bookmarked?: boolean;
  aiPaused?: boolean;
  assignedToMe?: boolean;
  unassigned?: boolean;
  closed?: boolean;
  assignedAgent?: string | null;
  handedOver?: boolean;
  messages: Message[];
  activityLog?: ActivityEntry[];
  details: ContactDetails;
}

const makeDetails = (
  name: string,
  email: string,
  source: string,
  sourceIcon: string,
): ContactDetails => ({
  phone: "9800000000",
  email,
  address: "Kathmandu, Nepal",
  source,
  sourceIcon,
  aiScore: 60,
  summary: "I need help with the product.",
  tickets: [
    {
      id: `${name}-ticket-1`,
      title: "Follow up",
      subtitle: "Check in on open request...",
      priority: "low",
    },
  ],
  notes: [],
});

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "c1",
    name: "Kiran Shrestha",
    headerEmail: "kiran.shrestha@gmail.com",
    avatarSrc: "/avatars/avatar-1.svg",
    time: "10:00",
    preview: "Hello there! I am Aryan Shr...",
    previewKind: "text",
    online: true,
    assignedToMe: true,
    messages: [
      {
        id: "c1-m1",
        from: "contact",
        text: "Hello there! I am Aryan Shrestha's colleague, reaching out on his behalf.",
        time: "10:00 am",
      },
    ],
    details: makeDetails(
      "Kiran Shrestha",
      "kiran.shrestha@gmail.com",
      "Website",
      "",
    ),
  },
  {
    id: "c2",
    name: "Prakash Shrestha",
    headerEmail: "Prakash09@gmail.com",
    avatarSrc: "/avatars/avatar-2.svg",
    time: "10:00",
    preview: "+4 new messages",
    previewKind: "unread",
    online: true,
    messages: [
      {
        id: "c2-m1",
        from: "contact",
        text: "+4 new messages",
        time: "10:00 am",
      },
    ],
    details: makeDetails(
      "Prakash Shrestha",
      "Prakash09@gmail.com",
      "Instagram",
      "/social/insta.png",
    ),
  },
  {
    id: "c3",
    name: "Aryan Shrestha",
    headerEmail: "Sth.aryan@gmail.com",
    time: "10:00",
    preview: "Hello there! I am Aryan Shrest...",
    previewKind: "text",
    online: true,
    bookmarked: true,
    assignedToMe: true,
    assignedAgent: "Aryan Shrestha",
    messages: [
      {
        id: "c3-m1",
        from: "contact",
        text: "Hi, I am interested in your social media marketing services",
        time: "10:00 am",
      },
      {
        id: "c3-m2",
        from: "agent",
        text:
          "Hello! Thank you for reaching out. I would be happy to help you with our social media marketing services. We offer comprehensive packages that include content creation, posting schedules, and analytics. What specific platforms are you looking to focus on?",
        time: "10:00 am",
      },
    ],
    activityLog: [
      {
        id: "seed-1",
        text: "Assigned to Apsan Rana Magar",
        timestamp: Date.now() - 10 * 60 * 1000,
      },
      {
        id: "seed-2",
        text: "Note added",
        timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
      },
      { id: "seed-3", text: "Pinned", timestamp: Date.now() - 10 * 1000 },
      {
        id: "seed-4",
        text: "Snoozed until tomorrow",
        timestamp: Date.now() - 60 * 60 * 1000,
      },
      {
        id: "seed-5",
        text: "Closed",
        timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000,
      },
      { id: "seed-6", text: "AI paused", timestamp: Date.now() - 22 * 1000 },
    ],
    details: {
      phone: "9808226119",
      email: "Sth.aryan07@gmail.com",
      address: "Chabahil, Mitrapark",
      source: "Whatsapp",
      sourceIcon: "/social/whatsapp.png",
      aiScore: 90,
      summary: "Hi, I am interested in your social media marketing services",
      tickets: [
        {
          id: "aryan-ticket-1",
          title: "Push the product1",
          subtitle: "Discuss feature and push him into...",
          priority: "medium",
        },
        {
          id: "aryan-ticket-2",
          title: "Push the product1",
          subtitle: "Discuss feature and push him into...",
          priority: "low",
        },
      ],
      notes: [
        {
          id: "aryan-note-1",
          author: "prakash",
          timeAgo: "2hr ago",
          text: "High-quality lead. Follow up with...",
        },
      ],
    },
  },
  {
    id: "c4",
    name: "Sudan Gurung",
    headerEmail: "sudan.gurung@gmail.com",
    avatarSrc: "/avatars/avatar-3.svg",
    time: "10:00",
    preview: "I need help with the product.",
    previewKind: "text",
    messages: [
      {
        id: "c4-m1",
        from: "contact",
        text: "I need help with the product.",
        time: "10:00 am",
      },
    ],
    details: makeDetails(
      "Sudan Gurung",
      "sudan.gurung@gmail.com",
      "Instagram",
      "/social/insta.png",
    ),
  },
  {
    id: "c5",
    name: "Prakash Shrestha",
    headerEmail: "Prakash09@gmail.com",
    avatarSrc: "/avatars/avatar-4.svg",
    time: "10:00",
    preview: "I need help with the product.",
    previewKind: "text",
    messages: [
      {
        id: "c5-m1",
        from: "contact",
        text: "I need help with the product.",
        time: "10:00 am",
      },
    ],
    details: makeDetails(
      "Prakash Shrestha",
      "Prakash09@gmail.com",
      "Instagram",
      "/social/insta.png",
    ),
  },
  {
    id: "c6",
    name: "Prakash Shrestha",
    headerEmail: "Prakash09@gmail.com",
    avatarSrc: "/avatars/avatar-5.svg",
    time: "10:00",
    preview: "I need help with the product.",
    previewKind: "text",
    messages: [
      {
        id: "c6-m1",
        from: "contact",
        text: "I need help with the product.",
        time: "10:00 am",
      },
    ],
    details: makeDetails(
      "Prakash Shrestha",
      "Prakash09@gmail.com",
      "Instagram",
      "/social/insta.png",
    ),
  },
  {
    id: "c7",
    name: "Prakash Shrestha",
    headerEmail: "Prakash09@gmail.com",
    avatarSrc: "/avatars/avatar-2.svg",
    time: "10:00",
    preview: "I need help with the product.",
    previewKind: "text",
    messages: [
      {
        id: "c7-m1",
        from: "contact",
        text: "I need help with the product.",
        time: "10:00 am",
      },
    ],
    details: makeDetails(
      "Prakash Shrestha",
      "Prakash09@gmail.com",
      "Instagram",
      "/social/insta.png",
    ),
  },
  {
    id: "c8",
    name: "Prakash Shrestha",
    headerEmail: "Prakash09@gmail.com",
    avatarSrc: "/avatars/avatar-1.svg",
    time: "10:00",
    preview: "I need help with the product.",
    previewKind: "text",
    messages: [
      {
        id: "c8-m1",
        from: "contact",
        text: "I need help with the product.",
        time: "10:00 am",
      },
    ],
    details: makeDetails(
      "Prakash Shrestha",
      "Prakash09@gmail.com",
      "Instagram",
      "/social/insta.png",
    ),
  },
];

const SNOOZED_IDS_DEFAULT = new Set(["c5"]);

type FilterValue =
  | "all"
  | "assigned"
  | "unassigned"
  | "bookmarked"
  | "closed"
  | "website"
  | "instagram"
  | "whatsapp"
  | "messenger";

const CHANNEL_FILTERS: {
  value: FilterValue;
  label: string;
  icon?: React.ReactNode;
  iconSrc?: string;
}[] = [
  { value: "all", label: "All chats", icon: <MessageCircleMore size={16} /> },
  { value: "website", label: "Website", icon: <LaptopMinimal size={16} /> },
  { value: "instagram", label: "Instagram", iconSrc: "/social/insta.png" },
  { value: "whatsapp", label: "WhatsApp", iconSrc: "/social/whatsapp.png" },
  { value: "messenger", label: "Messenger", iconSrc: "/social/messanger.png" },
];

const TOP_FILTERS: {
  value: FilterValue;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "assigned",
    label: "Assigned to me",
    icon: (
      <img
        src="/avatars/avatar-1.svg"
        alt=""
        className={styles.filterAvatar}
      />
    ),
  },
  {
    value: "unassigned",
    label: "Unassigned",
    icon: (
      <span className={styles.unassignedAvatar}>
        <UserRound size={14} />
      </span>
    ),
  },
  { value: "bookmarked", label: "Bookmarked", icon: <Bookmark size={16} /> },
  { value: "closed", label: "Closed", icon: <Check size={16} /> },
];

const ASSIGNEES: { name: string; avatarSrc: string }[] = [
  { name: "Aryan Shrestha", avatarSrc: "/avatars/avatar-1.svg" },
  { name: "Apsan Rana Magar", avatarSrc: "/avatars/avatar-2.svg" },
  { name: "Sanket Shrestha", avatarSrc: "/avatars/avatar-3.svg" },
  { name: "Prakash Shrestha", avatarSrc: "/avatars/avatar-4.svg" },
];

const STATUS_OPTIONS = ["Open", "In-progress", "Resolved", "Closed"];

const PRIORITY_OPTIONS: { value: PriorityLevel; label: string }[] = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

interface Macro {
  id: string;
  icon: string;
  name: string;
  text: string;
}

const MACROS: Macro[] = [
  {
    id: "open",
    icon: "🔥",
    name: "Open conversation",
    text: "👋 Hi {{firstName}},\n\nThanks so much for reaching out! I'd love to learn more about what you need — could you share a few more details?",
  },
  {
    id: "close",
    icon: "✅",
    name: "Close conversation",
    text: "👋 Hi {{firstName}},\n\nThank you for reaching out to us. We've received your message and are happy to help. Our team is currently reviewing your request and will get back to you as soon as possible.\n\nBest regards,\nAcme",
  },
  {
    id: "collection",
    icon: "📋",
    name: "Collection templete",
    text: "👋 Hi {{firstName}},\n\nThis is a friendly reminder that your invoice is still outstanding. Please let us know if you have any questions or need help completing payment.",
  },
];

const SNOOZE_OPTIONS: { label: string; time: string }[] = [
  { label: "Later today", time: "In 3 hour" },
  { label: "Tomorrow", time: "Sun 9am" },
  { label: "One week", time: "Sat 8pm" },
  { label: "One month", time: "Jun 30" },
];

const formatNow = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "pm" : "am";
  hours = hours % 12 === 0 ? 12 : hours % 12;
  return `${hours}:${minutes} ${period}`;
};

let messageIdCounter = 0;
const nextMessageId = () => `msg-${messageIdCounter++}`;

let activityIdCounter = 0;
const nextActivityId = () => `activity-${activityIdCounter++}`;

const formatRelativeTime = (timestamp: number) => {
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mth ago`;
};

export function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>(
    INITIAL_CONVERSATIONS,
  );
  const [snoozedIds, setSnoozedIds] = useState<Set<string>>(
    SNOOZED_IDS_DEFAULT,
  );
  const [tab, setTab] = useState<"all" | "snoozed">("all");
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState("c3");
  const [draft, setDraft] = useState("");
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [filter, setFilter] = useState<FilterValue>("all");
  const [chatsOpen, setChatsOpen] = useState(true);
  const [openHeaderMenu, setOpenHeaderMenu] = useState<
    "assignee" | "snooze" | "more" | null
  >(null);

  const assigneeMenuRef = useRef<HTMLDivElement>(null);
  const snoozeMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openHeaderMenu) return;
    const refs = {
      assignee: assigneeMenuRef,
      snooze: snoozeMenuRef,
      more: moreMenuRef,
    };
    const activeRef = refs[openHeaderMenu];
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        activeRef.current &&
        !activeRef.current.contains(e.target as Node)
      ) {
        setOpenHeaderMenu(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [openHeaderMenu]);

  const [isMacrosOpen, setIsMacrosOpen] = useState(false);
  const [macroSearch, setMacroSearch] = useState("");
  const [selectedMacroId, setSelectedMacroId] = useState(MACROS[1].id);
  const [macroAction, setMacroAction] = useState<"close" | "snooze" | null>(
    null,
  );

  const [isCreateTicketOpen, setIsCreateTicketOpen] = useState(false);
  const [ticketTitle, setTicketTitle] = useState("");
  const [ticketDescription, setTicketDescription] = useState("");
  const [ticketStatus, setTicketStatus] = useState(STATUS_OPTIONS[1]);
  const [ticketAssignee, setTicketAssignee] = useState<string | null>(
    ASSIGNEES[0].name,
  );
  const [ticketPriority, setTicketPriority] = useState<PriorityLevel | null>(
    null,
  );
  const [openTicketDropdown, setOpenTicketDropdown] = useState<
    "status" | "assignee" | "priority" | null
  >(null);

  const ticketStatusRef = useRef<HTMLDivElement>(null);
  const ticketAssigneeRef = useRef<HTMLDivElement>(null);
  const ticketPriorityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openTicketDropdown) return;
    const refs = {
      status: ticketStatusRef,
      assignee: ticketAssigneeRef,
      priority: ticketPriorityRef,
    };
    const activeRef = refs[openTicketDropdown];
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        activeRef.current &&
        !activeRef.current.contains(e.target as Node)
      ) {
        setOpenTicketDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [openTicketDropdown]);

  const matchesFilter = (conversation: Conversation) => {
    switch (filter) {
      case "assigned":
        return !!conversation.assignedToMe;
      case "unassigned":
        return !!conversation.unassigned;
      case "bookmarked":
        return !!conversation.bookmarked;
      case "closed":
        return !!conversation.closed;
      case "website":
      case "instagram":
      case "whatsapp":
      case "messenger":
        return conversation.details.source.toLowerCase() === filter;
      default:
        return true;
    }
  };

  const visibleConversations = useMemo(() => {
    const query = search.trim().toLowerCase();
    return conversations.filter((conversation) => {
      const inTab =
        tab === "all" ? true : snoozedIds.has(conversation.id);
      const matchesQuery =
        !query || conversation.name.toLowerCase().includes(query);
      return inTab && matchesQuery && matchesFilter(conversation);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations, tab, search, snoozedIds, filter]);

  const filterCounts = useMemo(
    () => ({
      assigned: conversations.filter((c) => c.assignedToMe).length,
      unassigned: conversations.filter((c) => c.unassigned).length,
      bookmarked: conversations.filter((c) => c.bookmarked).length,
      closed: conversations.filter((c) => c.closed).length,
      all: conversations.length,
      website: conversations.filter(
        (c) => c.details.source.toLowerCase() === "website",
      ).length,
      instagram: conversations.filter(
        (c) => c.details.source.toLowerCase() === "instagram",
      ).length,
      whatsapp: conversations.filter(
        (c) => c.details.source.toLowerCase() === "whatsapp",
      ).length,
      messenger: conversations.filter(
        (c) => c.details.source.toLowerCase() === "messenger",
      ).length,
    }),
    [conversations],
  );

  const activeConversation = conversations.find((c) => c.id === activeId);

  const updateConversation = (
    id: string,
    updater: (conversation: Conversation) => Conversation,
  ) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? updater(c) : c)),
    );
  };

  const logActivity = (id: string, text: string) => {
    updateConversation(id, (c) => ({
      ...c,
      activityLog: [
        ...(c.activityLog ?? []),
        { id: nextActivityId(), text, timestamp: Date.now() },
      ],
    }));
  };

  const handleSend = () => {
    const text = draft.trim();
    if (!text || !activeConversation) return;
    updateConversation(activeConversation.id, (c) => ({
      ...c,
      messages: [
        ...c.messages,
        { id: nextMessageId(), from: "agent", text, time: formatNow() },
      ],
    }));
    setDraft("");
    setAttachedImage(null);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAttachedImage(URL.createObjectURL(file));
    e.target.value = "";
  };

  const toggleBookmark = () => {
    if (!activeConversation) return;
    const nowBookmarked = !activeConversation.bookmarked;
    updateConversation(activeConversation.id, (c) => ({
      ...c,
      bookmarked: nowBookmarked,
    }));
    logActivity(activeConversation.id, nowBookmarked ? "Pinned" : "Unpinned");
  };

  const toggleAiPaused = () => {
    if (!activeConversation) return;
    const nowPaused = !activeConversation.aiPaused;
    updateConversation(activeConversation.id, (c) => ({
      ...c,
      aiPaused: nowPaused,
    }));
    logActivity(activeConversation.id, nowPaused ? "AI paused" : "AI resumed");
  };

  const toggleSnooze = () => {
    if (!activeConversation) return;
    const wasSnoozed = snoozedIds.has(activeConversation.id);
    setSnoozedIds((prev) => {
      const next = new Set(prev);
      if (next.has(activeConversation.id)) next.delete(activeConversation.id);
      else next.add(activeConversation.id);
      return next;
    });
    logActivity(activeConversation.id, wasSnoozed ? "Unsnoozed" : "Snoozed");
  };

  const applySnooze = (label: string) => {
    if (!activeConversation) return;
    setSnoozedIds((prev) => new Set(prev).add(activeConversation.id));
    logActivity(
      activeConversation.id,
      `Snoozed until ${label.toLowerCase()}`,
    );
    setOpenHeaderMenu(null);
  };

  const setAssignedAgent = (name: string | null) => {
    if (!activeConversation) return;
    updateConversation(activeConversation.id, (c) => ({
      ...c,
      assignedAgent: name,
      handedOver: false,
    }));
    logActivity(
      activeConversation.id,
      name ? `Assigned to ${name}` : "Unassigned",
    );
    setOpenHeaderMenu(null);
  };

  const requestTakeover = () => {
    if (!activeConversation) return;
    updateConversation(activeConversation.id, (c) => ({
      ...c,
      handedOver: true,
    }));
    logActivity(activeConversation.id, "Takeover requested");
  };

  const convertToLead = () => {
    if (activeConversation) {
      logActivity(activeConversation.id, "Converted to lead");
    }
    setOpenHeaderMenu(null);
  };

  const closeConversation = () => {
    if (!activeConversation) return;
    updateConversation(activeConversation.id, (c) => ({
      ...c,
      closed: true,
    }));
    logActivity(activeConversation.id, "Closed");
    setOpenHeaderMenu(null);
  };

  const openMacros = () => {
    if (!activeConversation) return;
    setMacroSearch("");
    setSelectedMacroId(MACROS[1].id);
    setMacroAction(null);
    setIsMacrosOpen(true);
  };

  const confirmMacro = () => {
    if (!activeConversation) return;
    const macro = MACROS.find((m) => m.id === selectedMacroId);
    if (macro) {
      const firstName = activeConversation.name.split(" ")[0];
      setDraft(macro.text.replaceAll("{{firstName}}", firstName));
    }
    if (macroAction === "close") closeConversation();
    if (macroAction === "snooze") applySnooze(SNOOZE_OPTIONS[0].label);
    setIsMacrosOpen(false);
  };

  const openCreateTicket = () => {
    if (!activeConversation) return;
    setTicketTitle("");
    setTicketDescription("");
    setTicketStatus(STATUS_OPTIONS[1]);
    setTicketAssignee(activeConversation.assignedAgent ?? ASSIGNEES[0].name);
    setTicketPriority(null);
    setOpenTicketDropdown(null);
    setIsCreateTicketOpen(true);
  };

  const saveTicket = () => {
    if (!activeConversation || !ticketTitle.trim()) return;
    updateConversation(activeConversation.id, (c) => ({
      ...c,
      details: {
        ...c.details,
        tickets: [
          ...c.details.tickets,
          {
            id: nextMessageId(),
            title: ticketTitle.trim(),
            subtitle: ticketDescription.trim() || "No description",
            priority: ticketPriority ?? "low",
            status: ticketStatus,
            assignee: ticketAssignee,
          },
        ],
      },
    }));
    setIsCreateTicketOpen(false);
  };

  const submitNote = () => {
    const text = noteDraft.trim();
    if (!text || !activeConversation) return;
    updateConversation(activeConversation.id, (c) => ({
      ...c,
      details: {
        ...c.details,
        notes: [
          {
            id: nextMessageId(),
            author: "prakash",
            timeAgo: "just now",
            text,
          },
          ...c.details.notes,
        ],
      },
    }));
    logActivity(activeConversation.id, "Note added");
    setNoteDraft("");
    setAddingNote(false);
  };

  return (
    <div className={styles.root}>
      <PageHeader
        title="Conversations"
        collaborators={COLLABORATORS}
        onShare={handleShare}
      />

      <div className={styles.page}>
        <div className={styles.filtersPanel}>
          <nav className={styles.filterNav} aria-label="Conversation filters">
            {TOP_FILTERS.map((item) => (
              <button
                key={item.value}
                type="button"
                className={`${styles.filterItem} ${
                  filter === item.value ? styles.filterItemActive : ""
                }`}
                onClick={() =>
                  setFilter((prev) => (prev === item.value ? "all" : item.value))
                }
              >
                <span className={styles.filterIcon}>{item.icon}</span>
                <span className={styles.filterLabel}>{item.label}</span>
                <span className={styles.filterCount}>
                  {filterCounts[item.value]}
                </span>
              </button>
            ))}
          </nav>

          <hr className={styles.filterDivider} />

          <div className={styles.chatsGroup}>
            <button
              type="button"
              className={styles.chatsGroupHeader}
              aria-expanded={chatsOpen}
              onClick={() => setChatsOpen((prev) => !prev)}
            >
              <span className={styles.chatsGroupIcon}>
                <MessageCircle size={16} />
              </span>
              <span className={styles.chatsGroupLabel}>Chats</span>
              <ChevronDown
                size={14}
                className={`${styles.chatsChevron} ${
                  chatsOpen ? styles.chatsChevronOpen : ""
                }`}
              />
            </button>

            {chatsOpen && (
              <div className={styles.channelList}>
                {CHANNEL_FILTERS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`${styles.filterItem} ${styles.channelItem} ${
                      filter === item.value ? styles.filterItemActive : ""
                    }`}
                    onClick={() => setFilter(item.value)}
                  >
                    <span className={styles.filterIcon}>
                      {item.iconSrc ? (
                        <img
                          src={item.iconSrc}
                          alt=""
                          className={styles.channelIconImg}
                        />
                      ) : (
                        item.icon
                      )}
                    </span>
                    <span className={styles.filterLabel}>{item.label}</span>
                    <span className={styles.filterCount}>
                      {filterCounts[item.value]}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.listPanel}>
        <div className={styles.searchRow}>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search messages"
            className={styles.searchInput}
          />
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={`${styles.tab} ${tab === "all" ? styles.tabActive : ""}`}
            onClick={() => setTab("all")}
          >
            All ({conversations.length})
          </button>
          <button
            type="button"
            className={`${styles.tab} ${tab === "snoozed" ? styles.tabActive : ""}`}
            onClick={() => setTab("snoozed")}
          >
            Snoozed ({snoozedIds.size})
          </button>
        </div>

        <div className={styles.list}>
          {visibleConversations.map((conversation) => (
            <button
              key={conversation.id}
              type="button"
              className={`${styles.row} ${
                conversation.id === activeId ? styles.rowActive : ""
              }`}
              onClick={() => setActiveId(conversation.id)}
            >
              <span className={styles.avatarWrap}>
                <span className={styles.avatar}>
                  {conversation.avatarSrc ? (
                    <img src={conversation.avatarSrc} alt="" />
                  ) : (
                    <User size={16} />
                  )}
                </span>
                {conversation.online && (
                  <span className={styles.onlineDot} aria-hidden="true" />
                )}
              </span>

              <span className={styles.rowBody}>
                <span className={styles.rowTop}>
                  <span className={styles.rowName}>{conversation.name}</span>
                  <span className={styles.rowTime}>{conversation.time}</span>
                </span>
                <span className={styles.rowBottom}>
                  <span
                    className={`${styles.rowPreview} ${
                      conversation.previewKind === "unread"
                        ? styles.rowPreviewUnread
                        : ""
                    }`}
                  >
                    {conversation.preview}
                  </span>
                  {conversation.bookmarked && (
                    <button
                      type="button"
                      className={styles.rowBookmark}
                      aria-label="Remove bookmark"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateConversation(conversation.id, (c) => ({
                          ...c,
                          bookmarked: !c.bookmarked,
                        }));
                      }}
                    >
                      <Bookmark size={14} fill="currentColor" />
                    </button>
                  )}
                  {conversation.previewKind === "unread" && (
                    <span className={styles.unreadDot} aria-hidden="true" />
                  )}
                </span>
              </span>
            </button>
          ))}

          {visibleConversations.length === 0 && (
            <div className={styles.emptyState}>No conversations found.</div>
          )}
        </div>
      </div>

      {activeConversation ? (
        <>
          <div className={styles.chatPanel}>
            <div className={styles.chatHeader}>
              <span className={styles.avatarWrap}>
                <span className={styles.avatar}>
                  {activeConversation.avatarSrc ? (
                    <img src={activeConversation.avatarSrc} alt="" />
                  ) : (
                    <User size={16} />
                  )}
                </span>
                {activeConversation.online && (
                  <span className={styles.onlineDot} aria-hidden="true" />
                )}
              </span>
              <span className={styles.chatHeaderName}>
                {activeConversation.name}
              </span>

              <div className={styles.chatHeaderActions}>
                <div className={styles.headerMenuWrapper} ref={assigneeMenuRef}>
                  <button
                    type="button"
                    className={styles.assigneeAvatar}
                    title={
                      activeConversation.assignedAgent
                        ? `Assigned to ${activeConversation.assignedAgent}`
                        : "Unassigned"
                    }
                    aria-haspopup="menu"
                    aria-expanded={openHeaderMenu === "assignee"}
                    onClick={() =>
                      setOpenHeaderMenu((prev) =>
                        prev === "assignee" ? null : "assignee",
                      )
                    }
                  >
                    {(() => {
                      const assignee = ASSIGNEES.find(
                        (a) => a.name === activeConversation.assignedAgent,
                      );
                      return assignee ? (
                        <img src={assignee.avatarSrc} alt="" />
                      ) : (
                        <User size={16} />
                      );
                    })()}
                  </button>

                  {openHeaderMenu === "assignee" && (
                    <div className={styles.headerMenu} role="menu">
                      {ASSIGNEES.map((assignee) => (
                        <button
                          key={assignee.name}
                          type="button"
                          className={styles.headerMenuItem}
                          onClick={() => setAssignedAgent(assignee.name)}
                        >
                          <img
                            src={assignee.avatarSrc}
                            alt=""
                            className={styles.headerMenuAvatar}
                          />
                          <span className={styles.headerMenuLabel}>
                            {assignee.name}
                          </span>
                          {activeConversation.assignedAgent ===
                            assignee.name && (
                            <Check
                              size={16}
                              className={styles.headerMenuCheck}
                            />
                          )}
                        </button>
                      ))}
                      <button
                        type="button"
                        className={styles.headerMenuItem}
                        onClick={() => setAssignedAgent(null)}
                      >
                        <User size={16} className={styles.headerMenuIcon} />
                        <span className={styles.headerMenuLabel}>None</span>
                        {!activeConversation.assignedAgent && (
                          <Check size={16} className={styles.headerMenuCheck} />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <span className={styles.tooltipAnchor}>
                  <span className={styles.tooltip}>Bookmark chat</span>
                  <button
                    type="button"
                    className={`${styles.headerIconButton} ${
                      activeConversation.bookmarked ? styles.headerIconActive : ""
                    }`}
                    aria-label="Bookmark chat"
                    aria-pressed={activeConversation.bookmarked}
                    onClick={toggleBookmark}
                  >
                    <Bookmark
                      size={16}
                      fill={activeConversation.bookmarked ? "currentColor" : "none"}
                    />
                  </button>
                </span>

                <div className={styles.headerMenuWrapper} ref={snoozeMenuRef}>
                  <span className={styles.tooltipAnchor}>
                    <span className={styles.tooltip}>
                      {snoozedIds.has(activeConversation.id)
                        ? "Unsnooze chat"
                        : "Snooze chat"}
                    </span>
                    <button
                      type="button"
                      className={`${styles.headerIconButton} ${
                        snoozedIds.has(activeConversation.id)
                          ? styles.headerIconActive
                          : ""
                      }`}
                      aria-label="Snooze chat"
                      aria-haspopup="menu"
                      aria-expanded={openHeaderMenu === "snooze"}
                      onClick={() => {
                        if (snoozedIds.has(activeConversation.id)) {
                          toggleSnooze();
                        } else {
                          setOpenHeaderMenu((prev) =>
                            prev === "snooze" ? null : "snooze",
                          );
                        }
                      }}
                    >
                      <Clock size={16} />
                    </button>
                  </span>

                  {openHeaderMenu === "snooze" && (
                    <div className={styles.headerMenu} role="menu">
                      {SNOOZE_OPTIONS.map((option) => (
                        <button
                          key={option.label}
                          type="button"
                          className={styles.headerMenuItem}
                          onClick={() => applySnooze(option.label)}
                        >
                          <span className={styles.headerMenuLabel}>
                            {option.label}
                          </span>
                          <span className={styles.headerMenuTime}>
                            {option.time}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.headerMenuWrapper} ref={moreMenuRef}>
                  <button
                    type="button"
                    className={styles.headerIconButton}
                    aria-label="More actions"
                    aria-haspopup="menu"
                    aria-expanded={openHeaderMenu === "more"}
                    onClick={() =>
                      setOpenHeaderMenu((prev) =>
                        prev === "more" ? null : "more",
                      )
                    }
                  >
                    <EllipsisVertical size={16} />
                  </button>

                  {openHeaderMenu === "more" && (
                    <div
                      className={`${styles.headerMenu} ${styles.headerMenuRight}`}
                      role="menu"
                    >
                      <button
                        type="button"
                        className={styles.headerMenuItem}
                        onClick={convertToLead}
                      >
                        <User size={16} className={styles.headerMenuIcon} />
                        <span className={styles.headerMenuLabel}>
                          Convert to lead
                        </span>
                      </button>
                      <button
                        type="button"
                        className={styles.headerMenuItem}
                        onClick={closeConversation}
                      >
                        <Check size={16} className={styles.headerMenuIcon} />
                        <span className={styles.headerMenuLabel}>
                          Close conversation
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className={styles.messages}>
              <span className={styles.dateDivider}>Today</span>

              {activeConversation.messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.messageRow} ${
                    message.from === "agent" ? styles.messageRowAgent : ""
                  }`}
                >
                  {message.from === "contact" && (
                    <span className={styles.messageAvatar}>
                      {activeConversation.avatarSrc ? (
                        <img src={activeConversation.avatarSrc} alt="" />
                      ) : (
                        <User size={16} />
                      )}
                    </span>
                  )}

                  <div className={styles.messageColumn}>
                    <div
                      className={`${styles.bubble} ${
                        message.from === "agent" ? styles.bubbleAgent : ""
                      }`}
                    >
                      {message.text}
                    </div>
                    <span
                      className={`${styles.messageTime} ${
                        message.from === "agent"
                          ? styles.messageTimeAgent
                          : ""
                      }`}
                    >
                      {message.time}
                    </span>
                  </div>

                  {message.from === "agent" && (
                    <span className={styles.messageAvatar}>
                      <User size={16} />
                    </span>
                  )}
                </div>
              ))}

              {(activeConversation.activityLog ?? []).map((activity) => (
                <span key={activity.id} className={styles.activityEntry}>
                  {activity.text} · {formatRelativeTime(activity.timestamp)}
                </span>
              ))}
            </div>

            {activeConversation.assignedAgent &&
            !activeConversation.handedOver ? (
              <div className={styles.handoffBanner}>
                <span className={styles.handoffAvatar}>
                  {(() => {
                    const assignee = ASSIGNEES.find(
                      (a) => a.name === activeConversation.assignedAgent,
                    );
                    return assignee ? (
                      <img src={assignee.avatarSrc} alt="" />
                    ) : (
                      <User size={14} />
                    );
                  })()}
                </span>
                <span className={styles.handoffText}>
                  <strong>{activeConversation.assignedAgent}</strong> is
                  handling this conversation
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={requestTakeover}
                >
                  Request takeover
                </Button>
              </div>
            ) : (
              <div className={styles.composer}>
                {attachedImage && (
                  <div className={styles.composerImagePreview}>
                    <img src={attachedImage} alt="" />
                    <button
                      type="button"
                      className={styles.composerImageRemove}
                      aria-label="Remove image"
                      onClick={() => setAttachedImage(null)}
                    >
                      <X size={8} />
                    </button>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={imageInputRef}
                  onChange={handleImageSelect}
                  className={styles.hiddenFileInput}
                />
                <input
                  type="text"
                  className={styles.composerInput}
                  placeholder="Type a message..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  aria-label="Type a message"
                />
                <div className={styles.composerRow}>
                  <div className={styles.composerIcons}>
                    <span className={styles.tooltipAnchor}>
                      <span className={styles.tooltip}>Insert macro</span>
                      <button
                        type="button"
                        className={styles.composerIconButton}
                        aria-label="Insert macro"
                        onClick={openMacros}
                      >
                        <Book size={16} />
                      </button>
                    </span>
                    <span className={styles.tooltipAnchor}>
                      <span className={styles.tooltip}>Add an emoji</span>
                      <button
                        type="button"
                        className={styles.composerIconButton}
                        aria-label="Add an emoji"
                      >
                        <Smile size={16} />
                      </button>
                    </span>
                    <span className={styles.tooltipAnchor}>
                      <span className={styles.tooltip}>Add an image</span>
                      <button
                        type="button"
                        className={styles.composerIconButton}
                        aria-label="Add an image"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <Image size={16} />
                      </button>
                    </span>
                    <span className={styles.tooltipAnchor}>
                      <span className={styles.tooltip}>Attach a file</span>
                      <button
                        type="button"
                        className={styles.composerIconButton}
                        aria-label="Attach a file"
                      >
                        <Paperclip size={16} />
                      </button>
                    </span>
                  </div>

                  <div className={styles.composerActions}>
                    <button
                      type="button"
                      className={styles.resumeAiLink}
                      onClick={toggleAiPaused}
                    >
                      {activeConversation.aiPaused ? "Resume AI" : "Pause AI"}
                    </button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={<Send size={14} />}
                      onClick={handleSend}
                    >
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={styles.contactPanel}>
            <div className={styles.contactHeader}>
              <span className={styles.avatarWrap}>
                <span className={styles.avatar}>
                  {activeConversation.avatarSrc ? (
                    <img src={activeConversation.avatarSrc} alt="" />
                  ) : (
                    <User size={18} />
                  )}
                </span>
                {activeConversation.online && (
                  <span className={styles.onlineDot} aria-hidden="true" />
                )}
              </span>
              <span className={styles.contactHeaderText}>
                <span className={styles.contactName}>
                  {activeConversation.name}
                </span>
                <span className={styles.contactEmail}>
                  {activeConversation.headerEmail}
                </span>
              </span>
            </div>

            <div className={styles.infoList}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Phone number</span>
                <span className={styles.infoValue}>
                  {activeConversation.details.phone}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Email</span>
                <a
                  className={styles.infoLink}
                  href={`mailto:${activeConversation.details.email}`}
                >
                  {activeConversation.details.email}
                </a>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Address</span>
                <span className={styles.infoValue}>
                  {activeConversation.details.address}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Source</span>
                <span className={styles.infoSource}>
                  {activeConversation.details.sourceIcon && (
                    <img
                      src={activeConversation.details.sourceIcon}
                      alt=""
                      className={styles.sourceIcon}
                    />
                  )}
                  {activeConversation.details.source}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>AI score</span>
                <span className={styles.infoValue}>
                  {activeConversation.details.aiScore}%
                </span>
              </div>
            </div>

            <div className={styles.summaryBox}>
              <span className={styles.summaryLabel}>
                AI summary
                <Info size={14} color="#A1A1AA" aria-hidden="true" />
              </span>
              <p className={styles.summaryText}>
                {activeConversation.details.summary}
              </p>
            </div>

            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Tickets</span>
              <button
                type="button"
                className={styles.sectionLink}
                onClick={openCreateTicket}
              >
                Add ticket
              </button>
            </div>

            <div className={styles.ticketList}>
              {activeConversation.details.tickets.map((ticket) => (
                <div key={ticket.id} className={styles.ticketCard}>
                  <div className={styles.ticketBody}>
                    <span className={styles.ticketTitle}>{ticket.title}</span>
                    <span className={styles.ticketSubtitle}>
                      {ticket.subtitle}
                    </span>
                  </div>
                  <div className={styles.ticketFooter}>
                    <PriorityBadge level={ticket.priority} />
                    <span className={styles.ticketAvatar}>
                      {(() => {
                        const assignee = ASSIGNEES.find(
                          (a) => a.name === ticket.assignee,
                        );
                        return assignee ? (
                          <img src={assignee.avatarSrc} alt="" />
                        ) : (
                          <User size={12} />
                        );
                      })()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.sectionHeader}>
              <span className={styles.sectionTitle}>Notes</span>
              <button
                type="button"
                className={styles.sectionLink}
                onClick={() => setAddingNote((prev) => !prev)}
              >
                Add note
              </button>
            </div>

            {addingNote && (
              <div className={styles.noteComposer}>
                <textarea
                  className={styles.noteTextarea}
                  placeholder="Write a note..."
                  value={noteDraft}
                  onChange={(e) => setNoteDraft(e.target.value)}
                />
                <Button variant="primary" size="sm" onClick={submitNote}>
                  Save note
                </Button>
              </div>
            )}

            <div className={styles.noteList}>
              {activeConversation.details.notes.map((note) => (
                <div key={note.id} className={styles.noteItem}>
                  <div className={styles.noteMetaRow}>
                    <span className={styles.noteAvatar}>
                      <User size={12} />
                    </span>
                    <span className={styles.noteMeta}>
                      {note.author} - {note.timeAgo}
                    </span>
                  </div>
                  <p className={styles.noteText}>{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        </>
        ) : (
          <div className={styles.chatPanel}>
            <div className={styles.emptyState}>Select a conversation</div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isMacrosOpen}
        onClose={() => setIsMacrosOpen(false)}
        title={activeConversation?.name ?? "Macros"}
        width={620}
      >
        {activeConversation && (
          <div className={styles.macrosBody}>
            <div className={styles.macrosSearchRow}>
              <SearchInput
                value={macroSearch}
                onChange={(e) => setMacroSearch(e.target.value)}
                className={styles.macrosSearchInput}
              />
              <button
                type="button"
                className={styles.macrosIconButton}
                aria-label="New macro"
              >
                <Plus size={16} />
              </button>
              <button
                type="button"
                className={styles.macrosIconButton}
                aria-label="Duplicate macro"
              >
                <Copy size={16} />
              </button>
            </div>

            <div className={styles.macrosContent}>
              <div className={styles.macrosList}>
                {MACROS.filter((m) =>
                  m.name
                    .toLowerCase()
                    .includes(macroSearch.trim().toLowerCase()),
                ).map((macro) => (
                  <button
                    key={macro.id}
                    type="button"
                    className={`${styles.macrosListItem} ${
                      macro.id === selectedMacroId
                        ? styles.macrosListItemActive
                        : ""
                    }`}
                    onClick={() => setSelectedMacroId(macro.id)}
                  >
                    <span aria-hidden="true">{macro.icon}</span>
                    {macro.name}
                  </button>
                ))}
              </div>

              <div className={styles.macrosPreview}>
                {(() => {
                  const macro = MACROS.find((m) => m.id === selectedMacroId);
                  if (!macro) {
                    return (
                      <p className={styles.macrosEmptyState}>
                        Select a macro to preview it.
                      </p>
                    );
                  }
                  const [greeting, ...rest] = macro.text.split(
                    `{{firstName}}`,
                  );
                  return (
                    <>
                      <p className={styles.macrosPreviewGreeting}>
                        {greeting}
                        <span className={styles.macrosPreviewPill}>
                          First name
                        </span>
                        {rest.join("")}
                      </p>

                      <div className={styles.macrosPreviewActions}>
                        <button
                          type="button"
                          className={`${styles.macrosActionChip} ${
                            macroAction === "close"
                              ? styles.macrosActionChipActive
                              : ""
                          }`}
                          onClick={() =>
                            setMacroAction((prev) =>
                              prev === "close" ? null : "close",
                            )
                          }
                        >
                          <Check size={14} />
                          Close
                        </button>
                        <button
                          type="button"
                          className={`${styles.macrosActionChip} ${
                            macroAction === "snooze"
                              ? styles.macrosActionChipActive
                              : ""
                          }`}
                          onClick={() =>
                            setMacroAction((prev) =>
                              prev === "snooze" ? null : "snooze",
                            )
                          }
                        >
                          <Clock size={14} />
                          Snooze
                        </button>
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>

            <div className={styles.macrosFooter}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsMacrosOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={confirmMacro}>
                Confirm
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isCreateTicketOpen}
        onClose={() => setIsCreateTicketOpen(false)}
        title="Create Ticket"
        width={520}
      >
        <div className={styles.ticketModalBody}>
          <input
            type="text"
            className={styles.ticketTitleInput}
            placeholder="Title"
            value={ticketTitle}
            onChange={(e) => setTicketTitle(e.target.value)}
            autoFocus
          />
          <textarea
            className={styles.ticketDescriptionInput}
            placeholder="Add description"
            value={ticketDescription}
            onChange={(e) => setTicketDescription(e.target.value)}
          />

          <div className={styles.ticketFieldRow}>
            <div className={styles.ticketDropdownWrapper} ref={ticketStatusRef}>
              <button
                type="button"
                className={styles.ticketDropdownTrigger}
                onClick={() =>
                  setOpenTicketDropdown((prev) =>
                    prev === "status" ? null : "status",
                  )
                }
              >
                <span className={styles.ticketDropdownLabel}>
                  {ticketStatus}
                </span>
                <ChevronDown size={14} />
              </button>

              {openTicketDropdown === "status" && (
                <div className={styles.ticketDropdownMenu} role="menu">
                  {STATUS_OPTIONS.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={styles.ticketDropdownItem}
                      onClick={() => {
                        setTicketStatus(option);
                        setOpenTicketDropdown(null);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div
              className={styles.ticketDropdownWrapper}
              ref={ticketAssigneeRef}
            >
              <button
                type="button"
                className={styles.ticketDropdownTrigger}
                onClick={() =>
                  setOpenTicketDropdown((prev) =>
                    prev === "assignee" ? null : "assignee",
                  )
                }
              >
                {(() => {
                  const assignee = ASSIGNEES.find(
                    (a) => a.name === ticketAssignee,
                  );
                  return assignee ? (
                    <img
                      src={assignee.avatarSrc}
                      alt=""
                      className={styles.ticketDropdownAvatar}
                    />
                  ) : (
                    <User size={16} />
                  );
                })()}
                <span className={styles.ticketDropdownLabel}>
                  {ticketAssignee ?? "Unassigned"}
                </span>
                <ChevronDown size={14} />
              </button>

              {openTicketDropdown === "assignee" && (
                <div className={styles.ticketDropdownMenu} role="menu">
                  {ASSIGNEES.map((assignee) => (
                    <button
                      key={assignee.name}
                      type="button"
                      className={styles.ticketDropdownItem}
                      onClick={() => {
                        setTicketAssignee(assignee.name);
                        setOpenTicketDropdown(null);
                      }}
                    >
                      <img
                        src={assignee.avatarSrc}
                        alt=""
                        className={styles.ticketDropdownAvatar}
                      />
                      {assignee.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div
              className={styles.ticketDropdownWrapper}
              ref={ticketPriorityRef}
            >
              <button
                type="button"
                className={styles.ticketDropdownTrigger}
                onClick={() =>
                  setOpenTicketDropdown((prev) =>
                    prev === "priority" ? null : "priority",
                  )
                }
              >
                <Flag size={14} />
                <span className={styles.ticketDropdownLabel}>
                  {ticketPriority
                    ? PRIORITY_OPTIONS.find((p) => p.value === ticketPriority)
                        ?.label
                    : "Priority"}
                </span>
                <ChevronDown size={14} />
              </button>

              {openTicketDropdown === "priority" && (
                <div className={styles.ticketDropdownMenu} role="menu">
                  {PRIORITY_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={styles.ticketDropdownItem}
                      onClick={() => {
                        setTicketPriority(option.value);
                        setOpenTicketDropdown(null);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.ticketModalFooter}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreateTicketOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={saveTicket}
              disabled={!ticketTitle.trim()}
            >
              Save Ticket
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
