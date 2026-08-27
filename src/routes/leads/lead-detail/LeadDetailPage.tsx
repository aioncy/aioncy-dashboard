import { useMemo, useState } from "react";
import {
  Book,
  Clock,
  EllipsisVertical,
  Image,
  Info,
  Paperclip,
  Send,
  Smile,
  Star,
  User,
} from "lucide-react";
import { Link } from "@tanstack/react-router";
import PageHeader from "../../../components/PageHeader";
import Button from "../../../components/Button";
import Modal from "../../../components/Modal";
import { COLLABORATORS, handleShare } from "../../../lib/dashboard";
import { leadDetailRoute } from "./index";
import styles from "./LeadDetailPage.module.scss";

interface Message {
  id: string;
  from: "contact" | "agent";
  text: string;
  time: string;
}

interface Note {
  id: string;
  author: string;
  timeAgo: string;
  text: string;
}

interface LeadDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  source: string;
  sourceIcon: string;
  addedOn: string;
  aiScore: number;
  conversationTitle: string;
  messages: Message[];
  notes: Note[];
}

const LEAD_DETAILS: Record<string, LeadDetail> = {
  "lead-1": {
    id: "lead-1",
    name: "Aryan Shrestha",
    email: "Sth.aryan07@gmail.com",
    phone: "9808226119",
    address: "Chabahil, Mitrapark",
    source: "WhatsApp",
    sourceIcon: "/social/whatsapp.png",
    addedOn: "20/08/2026",
    aiScore: 90,
    conversationTitle: "",
    messages: [
      {
        id: "lead-1-m1",
        from: "contact",
        text: "Hi, I am interested in your social media marketing services",
        time: "10:00 am",
      },
      {
        id: "lead-1-m2",
        from: "agent",
        text:
          "Hello! Thank you for reaching out. I would be happy to help you with our social media marketing services. We offer comprehensive packages that include content creation, posting schedules, and analytics. What specific platforms are you looking to focus on?",
        time: "10:00 am",
      },
      {
        id: "lead-1-m3",
        from: "contact",
        text: "Mainly Instagram and Facebook for my boutique",
        time: "10:00 am",
      },
    ],
    notes: [
      {
        id: "lead-1-n1",
        author: "prakash",
        timeAgo: "2hr ago",
        text: "High-quality lead. Follow up with custom proposal.",
      },
    ],
  },
  "lead-2": {
    id: "lead-2",
    name: "Apsan Rana Magar",
    email: "Apsan@gmail.com",
    phone: "9808096170",
    address: "Baneshwor, Kathmandu",
    source: "WhatsApp",
    sourceIcon: "/social/whatsapp.png",
    addedOn: "17/08/2026",
    aiScore: 20,
    conversationTitle: "",
    messages: [
      {
        id: "lead-2-m1",
        from: "contact",
        text: "I need help with the product.",
        time: "10:00 am",
      },
    ],
    notes: [],
  },
  "lead-3": {
    id: "lead-3",
    name: "Sanket Shrestha",
    email: "Thedorkid@gmail.com",
    phone: "9878096170",
    address: "Patan, Lalitpur",
    source: "Instagram",
    sourceIcon: "/social/insta.png",
    addedOn: "10/08/2026",
    aiScore: 80,
    conversationTitle: "",
    messages: [
      {
        id: "lead-3-m1",
        from: "contact",
        text: "I need help with the product.",
        time: "10:00 am",
      },
    ],
    notes: [],
  },
  "lead-4": {
    id: "lead-4",
    name: "Prakash Shrestha",
    email: "Prakash09@gmail.com",
    phone: "980809898",
    address: "Kathmandu, Nepal",
    source: "Messenger",
    sourceIcon: "/social/messanger.png",
    addedOn: "06/07/2026",
    aiScore: 10,
    conversationTitle: "",
    messages: [
      {
        id: "lead-4-m1",
        from: "contact",
        text: "I need help with the product.",
        time: "10:00 am",
      },
    ],
    notes: [],
  },
};

const AI_SCORE_TICKS = 44;

let titleMeasureCtx: CanvasRenderingContext2D | null = null;
const measureTitleWidth = (text: string) => {
  if (!titleMeasureCtx) {
    titleMeasureCtx = document.createElement("canvas").getContext("2d");
  }
  if (!titleMeasureCtx) return 0;
  titleMeasureCtx.font = "400 14px Geist, system-ui, sans-serif";
  return titleMeasureCtx.measureText(text).width;
};

const formatNow = () => {
  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "pm" : "am";
  hours = hours % 12 === 0 ? 12 : hours % 12;
  return `${hours}:${minutes} ${period}`;
};

let messageIdCounter = 0;
const nextMessageId = () => `lead-msg-${messageIdCounter++}`;

export function LeadDetailPage() {
  const { leadId } = leadDetailRoute.useParams();
  const seed = LEAD_DETAILS[leadId];

  const [messages, setMessages] = useState<Message[]>(seed?.messages ?? []);
  const [notes, setNotes] = useState<Note[]>(seed?.notes ?? []);
  const [conversationTitle, setConversationTitle] = useState(
    seed?.conversationTitle ?? "",
  );
  const [starred, setStarred] = useState(false);
  const [draft, setDraft] = useState("");
  const [addingNote, setAddingNote] = useState(false);
  const [noteDraft, setNoteDraft] = useState("");

  const titleInputWidth = useMemo(
    () =>
      Math.max(
        1,
        measureTitleWidth(conversationTitle || "Add conversation title") + 2,
      ),
    [conversationTitle],
  );

  if (!seed) {
    return (
      <div className={styles.notFound}>
        <p>Lead not found.</p>
        <Link to="/leads" className={styles.backLink}>
          Back to Leads
        </Link>
      </div>
    );
  }

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      { id: nextMessageId(), from: "agent", text, time: formatNow() },
    ]);
    setDraft("");
  };

  const submitNote = () => {
    const text = noteDraft.trim();
    if (!text) return;
    setNotes((prev) => [
      { id: nextMessageId(), author: "prakash", timeAgo: "just now", text },
      ...prev,
    ]);
    setNoteDraft("");
    setAddingNote(false);
  };

  return (
    <div className={styles.root}>
      <PageHeader
        breadcrumbItems={[
          { label: "Leads", href: "/leads" },
          { label: seed.name },
        ]}
        collaborators={COLLABORATORS}
        onShare={handleShare}
      />

      <div className={styles.page}>
        <div className={styles.infoPanel}>
          <div className={styles.contactHeader}>
            <span className={styles.avatar}>
              <User size={16} />
            </span>
            <span className={styles.contactHeaderText}>
              <span className={styles.contactName}>{seed.name}</span>
              <span className={styles.contactEmail}>{seed.email}</span>
            </span>
          </div>

          <div className={styles.infoList}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Source</span>
              <span className={styles.infoSource}>
                {seed.sourceIcon && (
                  <img
                    src={seed.sourceIcon}
                    alt=""
                    className={styles.sourceIcon}
                  />
                )}
                {seed.source}
              </span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Phone number</span>
              <span className={styles.infoValue}>{seed.phone}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Email</span>
              <a
                className={styles.infoLink}
                href={`mailto:${seed.email}`}
              >
                {seed.email}
              </a>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Address</span>
              <span className={styles.infoValue}>{seed.address}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Added on</span>
              <span className={styles.infoValue}>{seed.addedOn}</span>
            </div>
          </div>

          <div className={styles.scoreSection}>
            <span className={styles.scoreLabel}>
              AI Score
              <Info size={14} color="#A1A1AA" aria-hidden="true" />
            </span>
            <span className={styles.scoreValue}>{seed.aiScore}%</span>
            <div className={styles.scoreMeter}>
              <div
                className={styles.scoreMarker}
                style={{ left: `${seed.aiScore}%` }}
              >
                <svg
                  width="7"
                  height="6"
                  viewBox="0 0 7 6"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M3.46387 6L-0.000235494 -7.15256e-07L6.92797 -7.15256e-07L3.46387 6Z"
                    fill="#A153FF"
                  />
                </svg>
              </div>
              <div className={styles.scoreTrack}>
                {Array.from({ length: AI_SCORE_TICKS }).map((_, i) => (
                  <span
                    key={i}
                    className={`${styles.scoreTick} ${
                      (i / AI_SCORE_TICKS) * 100 <= seed.aiScore
                        ? styles.scoreTickActive
                        : ""
                    }`}
                  />
                ))}
              </div>
            </div>
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

          <div className={styles.noteList}>
            {notes.map((note) => (
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

        <div className={styles.conversationArea}>
          <div className={styles.convHeaderBar}>
            <div className={styles.convHeaderTop}>
                <div className={styles.convTitleBlock}>
                  <span className={styles.convTitle}>
                    <span className={styles.convTitleLabel}>Conversation</span>
                    {" "}with {seed.name}
                  </span>
                  <span className={styles.convTitleInputRow}>
                    <input
                      type="text"
                      className={styles.convTitleInput}
                      placeholder="Add conversation title"
                      value={conversationTitle}
                      onChange={(e) => setConversationTitle(e.target.value)}
                      style={{ width: titleInputWidth }}
                    />
                    <Info size={12} color="#A1A1AA" aria-hidden="true" />
                  </span>
                </div>

                <div className={styles.convHeaderActions}>
                  <span className={styles.tooltipAnchor}>
                    <span className={styles.tooltip}>Assign</span>
                    <button
                      type="button"
                      className={styles.headerIconButton}
                      aria-label="Assign"
                    >
                      <User size={16} />
                    </button>
                  </span>
                  <span className={styles.tooltipAnchor}>
                    <span className={styles.tooltip}>
                      {starred ? "Unstar" : "Star"}
                    </span>
                    <button
                      type="button"
                      className={`${styles.headerIconButton} ${
                        starred ? styles.headerIconActive : ""
                      }`}
                      aria-label="Star"
                      aria-pressed={starred}
                      onClick={() => setStarred((prev) => !prev)}
                    >
                      <Star size={16} fill={starred ? "currentColor" : "none"} />
                    </button>
                  </span>
                  <span className={styles.tooltipAnchor}>
                    <span className={styles.tooltip}>Snooze</span>
                    <button
                      type="button"
                      className={styles.headerIconButton}
                      aria-label="Snooze"
                    >
                      <Clock size={16} />
                    </button>
                  </span>
                  <button
                    type="button"
                    className={styles.headerIconButton}
                    aria-label="More actions"
                  >
                    <EllipsisVertical size={16} />
                  </button>
                </div>
            </div>
          </div>

          <div className={styles.conversationBody}>
          <div className={styles.conversationInner}>
            <div className={styles.messages}>
              <span className={styles.dateDivider}>Today</span>

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.messageRow} ${
                    message.from === "agent" ? styles.messageRowAgent : ""
                  }`}
                >
                  {message.from === "contact" && (
                    <span className={styles.messageAvatar}>
                      <User size={16} />
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
            </div>

            <div className={styles.composerWrap}>
              <div className={styles.composer}>
                <input
                  type="text"
                  className={styles.composerInput}
                  placeholder="Type a message..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSend();
                  }}
                  aria-label="Composer input"
                />
                <div className={styles.composerRow}>
                  <div className={styles.composerIcons}>
                    <span className={styles.tooltipAnchor}>
                      <span className={styles.tooltip}>Insert macro</span>
                      <button
                        type="button"
                        className={styles.composerIconButton}
                        aria-label="Insert macro"
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
                    <button type="button" className={styles.resumeAiLink}>
                      Resume AI
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
            </div>
          </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={addingNote}
        onClose={() => setAddingNote(false)}
        title="Add note"
        width={480}
      >
        <div className={styles.noteModalBody}>
          <textarea
            className={styles.noteTextarea}
            placeholder="Write a note..."
            value={noteDraft}
            onChange={(e) => setNoteDraft(e.target.value)}
            autoFocus
          />
          <div className={styles.noteModalFooter}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAddingNote(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={submitNote}
              disabled={!noteDraft.trim()}
            >
              Save note
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
