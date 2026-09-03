import React, { useEffect, useRef, useState } from "react";
import {
  EllipsisVertical,
  File,
  Info,
  Laptop,
  LoaderCircle,
  PencilLine,
  Upload,
} from "lucide-react";
import PageHeader from "../../../components/PageHeader";
import SearchInput from "../../../components/SearchInput";
import Button from "../../../components/Button";
import { DropdownList } from "../../../components/DropdownList";
import WebsiteSyncPanel, {
  type WebsiteSyncMode,
  type WebsiteSyncPayload,
} from "../../../components/WebsiteSyncPanel";
import UploadDocumentPanel from "../../../components/UploadDocumentPanel";
import DocumentViewerModal from "../../../components/DocumentViewerModal";
import WriteDocPanel, {
  type WriteDocPayload,
} from "../../../components/WriteDocPanel";
import { COLLABORATORS, handleShare } from "../../../lib/dashboard";
import { avatarColor } from "../../../lib/avatarColor";
import styles from "./KnowledgeBasePage.module.scss";

type KnowledgeType = "website" | "manual" | "document";
type KnowledgeStatus = "live" | "processing" | "draft" | "failed" | "inactive";

interface KnowledgeSource {
  id: string;
  title: string;
  type: KnowledgeType;
  status: KnowledgeStatus;
  liveCount?: number;
  createdBy: string;
  updatedAt: number;
  /** Editor markup, kept so a manual doc round-trips through the editor. */
  content?: string;
}

const TYPE_LABELS: Record<KnowledgeType, string> = {
  website: "Website",
  manual: "Manual",
  document: "Document",
};

const CURRENT_USER = "Prakash Shrestha";
const SEED_AUTHOR = "Aryan Shrestha";

const SEED_UPDATED_AT = new Date(2026, 5, 10, 14, 25).getTime();

const MOCK_SOURCES: KnowledgeSource[] = [
  {
    id: "source-website",
    title:
      "Bimba Labs — Custom Software, Mobile Apps & AI Solutions | Bimba Labs",
    type: "website",
    status: "live",
    liveCount: 4,
    createdBy: SEED_AUTHOR,
    updatedAt: SEED_UPDATED_AT,
  },
  {
    id: "source-faqs",
    title: "FAQs",
    type: "manual",
    status: "processing",
    createdBy: SEED_AUTHOR,
    updatedAt: SEED_UPDATED_AT,
  },
  {
    id: "source-untitled",
    title: "Untitled",
    type: "manual",
    status: "draft",
    createdBy: SEED_AUTHOR,
    updatedAt: SEED_UPDATED_AT,
  },
  {
    id: "source-docs",
    title: "Bimba_Labs_Docs_2026.pdf",
    type: "document",
    status: "failed",
    createdBy: SEED_AUTHOR,
    updatedAt: SEED_UPDATED_AT,
  },
];

interface MenuAction {
  key: "edit" | "resync" | "deactivate" | "delete";
  label: string;
  destructive?: boolean;
}

const MENU_ACTIONS: Record<KnowledgeType, MenuAction[]> = {
  manual: [
    { key: "edit", label: "Edit" },
    { key: "deactivate", label: "Deactivate" },
    { key: "delete", label: "Delete", destructive: true },
  ],
  website: [
    { key: "edit", label: "Edit source" },
    { key: "resync", label: "Re-sync" },
    { key: "deactivate", label: "Deactivate" },
    { key: "delete", label: "Delete", destructive: true },
  ],
  document: [
    { key: "edit", label: "View document" },
    { key: "deactivate", label: "Deactivate" },
    { key: "delete", label: "Delete", destructive: true },
  ],
};

const hostFromTitle = (title: string) =>
  title
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\.com.*$/, "")
    .split("/")[0];

const formatUpdatedAt = (timestamp: number) =>
  new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

const statusLabel = (source: KnowledgeSource) => {
  switch (source.status) {
    case "live":
      return `${source.liveCount ?? 0} live`;
    case "processing":
      return "Processing";
    case "draft":
      return "Draft";
    case "failed":
      return "Failed";
    case "inactive":
      return "Inactive";
  }
};

/** The Details pane shows the bare state, without the table's page count. */
const VIEWER_STATUS_LABELS: Record<KnowledgeStatus, string> = {
  live: "live",
  processing: "Processing",
  draft: "Draft",
  failed: "Failed",
  inactive: "Inactive",
};

// "processing" renders a spinner instead of a dot, so it needs no colour class.
const STATUS_CLASSES: Partial<Record<KnowledgeStatus, string>> = {
  live: styles.statusLive,
  draft: styles.statusDraft,
  failed: styles.statusFailed,
  inactive: styles.statusInactive,
};

export function KnowledgeBasePage() {
  const [search, setSearch] = useState("");
  const [sources, setSources] = useState<KnowledgeSource[]>(MOCK_SOURCES);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [syncPanel, setSyncPanel] = useState<{
    mode: WebsiteSyncMode;
    sourceId?: string;
    host: string;
    title: string;
  } | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [viewedDocId, setViewedDocId] = useState<string | null>(null);
  // `sourceId` absent means the editor is composing a brand-new doc.
  const [writeDoc, setWriteDoc] = useState<{
    sourceId?: string;
    openedAt: number;
  } | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!openMenuId) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenMenuId(null);
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openMenuId]);

  const viewedDoc = sources.find((source) => source.id === viewedDocId) ?? null;
  const editedDoc = writeDoc?.sourceId
    ? (sources.find((source) => source.id === writeDoc.sourceId) ?? null)
    : null;

  const visibleSources = sources.filter((source) =>
    source.title.toLowerCase().includes(search.trim().toLowerCase()),
  );

  const updateSource = (id: string, patch: Partial<KnowledgeSource>) => {
    setSources((prev) =>
      prev.map((source) =>
        source.id === id
          ? { ...source, ...patch, updatedAt: Date.now() }
          : source,
      ),
    );
  };

  const handleMenuAction = (action: MenuAction, source: KnowledgeSource) => {
    setOpenMenuId(null);

    if (action.key === "delete") {
      setSources((prev) => prev.filter((item) => item.id !== source.id));
      return;
    }

    if (action.key === "edit" && source.type === "document") {
      setViewedDocId(source.id);
      return;
    }

    if (action.key === "edit" && source.type === "manual") {
      setWriteDoc(() => ({ sourceId: source.id, openedAt: Date.now() }));
      return;
    }

    if (action.key === "edit" && source.type === "website") {
      setSyncPanel({
        mode: "edit",
        sourceId: source.id,
        host: hostFromTitle(source.title),
        title: source.title,
      });
      return;
    }

    if (action.key === "resync") {
      updateSource(source.id, { status: "processing" });
      return;
    }

    if (action.key === "deactivate") {
      updateSource(source.id, {
        status: source.status === "inactive" ? "draft" : "inactive",
      });
    }
  };

  const handleSyncSubmit = (payload: WebsiteSyncPayload) => {
    const editingId = syncPanel?.sourceId;

    if (editingId) {
      updateSource(editingId, {
        title: payload.title,
        status: "processing",
        liveCount: payload.pages.length,
      });
    } else {
      setSources((prev) => [
        {
          id: `website-${Date.now()}`,
          title: payload.title,
          type: "website",
          status: "processing",
          liveCount: payload.pages.length,
          createdBy: CURRENT_USER,
          updatedAt: Date.now(),
        },
        ...prev,
      ]);
    }

    setSyncPanel(null);
  };

  const handleUploadSubmit = (files: File[]) => {
    if (files.length === 0) return;

    const added = files.map((file, index) => ({
      id: `document-${Date.now()}-${index}`,
      title: file.name,
      type: "document" as const,
      status: "live" as const,
      liveCount: 1,
      createdBy: CURRENT_USER,
      updatedAt: Date.now(),
    }));

    setSources((prev) => [...added, ...prev]);
    setIsUploadOpen(false);
    setViewedDocId(added[0].id);
  };

  const handleReUpload = (id: string, file: File) => {
    updateSource(id, { title: file.name, status: "processing" });
  };

  const handleWriteOwnDoc = () => setWriteDoc({ openedAt: Date.now() });

  /** Publishing goes live; saving keeps it a draft. Both close the editor. */
  const commitWrittenDoc = (
    payload: WriteDocPayload,
    status: Extract<KnowledgeStatus, "live" | "draft">,
  ) => {
    const editingId = writeDoc?.sourceId;

    if (editingId) {
      updateSource(editingId, {
        title: payload.title,
        content: payload.content,
        status,
        liveCount: status === "live" ? 1 : undefined,
      });
    } else {
      setSources((prev) => [
        {
          id: `manual-${Date.now()}`,
          title: payload.title,
          type: "manual",
          status,
          liveCount: status === "live" ? 1 : undefined,
          content: payload.content,
          createdBy: CURRENT_USER,
          updatedAt: Date.now(),
        },
        ...prev,
      ]);
    }

    setWriteDoc(null);
  };

  return (
    <div>
      <PageHeader
        title="Knowledge Base"
        collaborators={COLLABORATORS}
        onShare={handleShare}
      />

      <div className={styles.page}>
        <div className={styles.toolbar}>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search knowledge base"
            resultsCount={search.trim() ? visibleSources.length : undefined}
          />
          <div className={styles.toolbarEnd}>
            <Button variant="outline" size="sm">
              Test AI
            </Button>
          </div>
        </div>

        <div className={styles.addSection}>
          <span className={styles.addLabel}>
            Add knowledge
            <Info size={14} color="#A1A1AA" aria-hidden="true" />
          </span>

          <div className={styles.addGrid}>
            <button
              type="button"
              className={styles.addCard}
              onClick={() =>
                setSyncPanel({ mode: "create", host: "", title: "" })
              }
            >
              <span className={styles.addCardIcon}>
                <Laptop size={20} aria-hidden="true" />
              </span>
              <span className={styles.addCardLabel}>Sync from website</span>
            </button>

            <button
              type="button"
              className={styles.addCard}
              onClick={() => setIsUploadOpen(true)}
            >
              <span className={styles.addCardIcon}>
                <Upload size={20} aria-hidden="true" />
              </span>
              <span className={styles.addCardLabel}>Upload a document</span>
            </button>

            <button
              type="button"
              className={styles.addCard}
              onClick={handleWriteOwnDoc}
            >
              <span className={styles.addCardIcon}>
                <PencilLine size={20} aria-hidden="true" />
              </span>
              <span className={styles.addCardLabel}>Write your own doc</span>
            </button>
          </div>
        </div>

        <div className={styles.tableWrap}>
          <div className={styles.table}>
            <div className={styles.headerRow}>
              <span className={styles.headerCell}>Title</span>
              <span className={styles.headerCell}>Type</span>
              <span className={styles.headerCell}>Status</span>
              <span className={styles.headerCell}>Last updated</span>
              <span className={styles.headerCell} aria-hidden="true" />
            </div>

            {visibleSources.map((source) => {
              const isMenuOpen = openMenuId === source.id;
              const actions = MENU_ACTIONS[source.type];

              const isDocument = source.type === "document";
              const isManual = source.type === "manual";
              const openRow = isDocument
                ? () => setViewedDocId(source.id)
                : () => setWriteDoc({ sourceId: source.id, openedAt: Date.now() });

              return (
                <div
                  key={source.id}
                  className={`${styles.row} ${isDocument || isManual ? styles.rowClickable : ""}`}
                  {...(isDocument || isManual
                    ? {
                        role: "button" as const,
                        tabIndex: 0,
                        onClick: openRow,
                        onKeyDown: (e: React.KeyboardEvent) => {
                          if (e.key === "Enter") openRow();
                        },
                      }
                    : {})}
                >
                  <span className={styles.titleCell}>
                    <span className={styles.titleIcon}>
                      {source.type === "website" && (
                        <span
                          className={styles.titleFavicon}
                          style={{ background: avatarColor(source.title) }}
                          aria-hidden="true"
                        >
                          {source.title.replace(/^https?:\/\//, "").charAt(0).toUpperCase()}
                        </span>
                      )}
                      {source.type === "manual" && (
                        <PencilLine size={16} aria-hidden="true" />
                      )}
                      {source.type === "document" && (
                        <File size={16} aria-hidden="true" />
                      )}
                    </span>
                    <span className={styles.titleText} title={source.title}>
                      {source.title}
                    </span>
                  </span>

                  <span className={styles.typeCell}>
                    <span className={styles.typeBadge}>
                      {TYPE_LABELS[source.type]}
                    </span>
                  </span>

                  <span
                    className={`${styles.statusCell} ${STATUS_CLASSES[source.status] ?? ""}`}
                  >
                    {source.status === "processing" ? (
                      <LoaderCircle
                        size={16}
                        className={styles.statusSpinner}
                        aria-hidden="true"
                      />
                    ) : (
                      <span className={styles.statusIndicator} aria-hidden="true">
                        <span className={styles.statusDot} />
                      </span>
                    )}
                    <span className={styles.statusLabel}>
                      {statusLabel(source)}
                    </span>
                  </span>

                  <span className={styles.updatedCell}>
                    {formatUpdatedAt(source.updatedAt)}
                  </span>

                  <span
                    className={styles.moreCell}
                    ref={isMenuOpen ? menuRef : undefined}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className={styles.moreButton}
                      aria-label={`Actions for ${source.title}`}
                      aria-haspopup="menu"
                      aria-expanded={isMenuOpen}
                      onClick={() =>
                        setOpenMenuId(isMenuOpen ? null : source.id)
                      }
                    >
                      <EllipsisVertical size={16} />
                    </button>

                    {isMenuOpen && (
                      <div className={styles.actionMenu}>
                        <DropdownList
                          items={actions.map((action) => ({
                            label:
                              action.key === "deactivate" &&
                              source.status === "inactive"
                                ? "Activate"
                                : action.label,
                            destructive: action.destructive,
                            onClick: () => handleMenuAction(action, source),
                          }))}
                        />
                      </div>
                    )}
                  </span>
                </div>
              );
            })}

            {visibleSources.length === 0 && (
              <p className={styles.emptyState}>
                No knowledge sources match your search.
              </p>
            )}
          </div>
        </div>
      </div>

      {isUploadOpen && (
        <UploadDocumentPanel
          onClose={() => setIsUploadOpen(false)}
          onSubmit={handleUploadSubmit}
        />
      )}

      {viewedDoc && (
        <DocumentViewerModal
          title={viewedDoc.title}
          status={VIEWER_STATUS_LABELS[viewedDoc.status]}
          statusTone={viewedDoc.status}
          createdBy={viewedDoc.createdBy}
          updatedAt={viewedDoc.updatedAt}
          updatedBy={viewedDoc.createdBy}
          onClose={() => setViewedDocId(null)}
          onDelete={() => {
            setSources((prev) =>
              prev.filter((item) => item.id !== viewedDoc.id),
            );
            setViewedDocId(null);
          }}
          onReUpload={(file) => handleReUpload(viewedDoc.id, file)}
        />
      )}

      {writeDoc && (
        <WriteDocPanel
          key={writeDoc.sourceId ?? "new-manual-doc"}
          initialTitle={editedDoc?.title ?? ""}
          initialContent={editedDoc?.content ?? ""}
          status={VIEWER_STATUS_LABELS[editedDoc?.status ?? "draft"]}
          statusTone={editedDoc?.status ?? "draft"}
          createdBy={editedDoc?.createdBy ?? CURRENT_USER}
          updatedAt={editedDoc?.updatedAt ?? writeDoc.openedAt}
          updatedBy={editedDoc?.createdBy ?? CURRENT_USER}
          onClose={() => setWriteDoc(null)}
          onSaveDraft={(payload) => commitWrittenDoc(payload, "draft")}
          onPublish={(payload) => commitWrittenDoc(payload, "live")}
        />
      )}

      {syncPanel && (
        <WebsiteSyncPanel
          key={syncPanel.sourceId ?? "new-website-sync"}
          mode={syncPanel.mode}
          initialHost={syncPanel.host}
          initialTitle={syncPanel.title}
          onClose={() => setSyncPanel(null)}
          onSubmit={handleSyncSubmit}
        />
      )}
    </div>
  );
}
