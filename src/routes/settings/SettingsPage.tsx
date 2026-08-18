import { useRef, useState } from "react";
import { ChevronDown, ChevronUp, Image, RefreshCw, X } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import Tabs from "../../components/Tabs";
import TextInput from "../../components/TextInput";
import PasswordInput from "../../components/PasswordInput";
import Select from "../../components/Select";
import Button from "../../components/Button";
import SearchInput from "../../components/SearchInput";
import CreateMacroModal, {
  type CreateMacroPayload,
} from "../../components/CreateMacroModal";
import { COLLABORATORS, handleShare } from "../../lib/dashboard";
import styles from "./SettingsPage.module.scss";

const TABS = [
  { label: "General", value: "general" },
  { label: "Security", value: "security" },
  { label: "Macros", value: "macros" },
  { label: "Plan and Billing", value: "billing" },
];

interface Macro {
  id: string;
  title: string;
  createdBy: string;
  usedTimes?: number;
  body?: string;
  availableFor: string[];
}

const MACROS: Macro[] = [
  {
    id: "close-conversation",
    title: "Close conversation",
    createdBy: "Prakash Shrestha",
    usedTimes: 2,
    availableFor: COLLABORATORS.map((c) => c.name),
  },
  {
    id: "open-conversation",
    title: "Open conversation",
    createdBy: "Prakash Shrestha",
    body: "Thank you for reaching out to us. We've received your message and are happy to help. Our team is currently reviewing your request and will get back to you as soon as possible.\n\nBest regards,\nAcme",
    availableFor: COLLABORATORS.map((c) => c.name),
  },
];

const FALLBACK_AVATAR_COLORS = [
  "#1e293b",
  "#a153ff",
  "#3b82f6",
  "#d43a20",
  "#71717a",
];

const avatarColor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = (hash * 31 + name.charCodeAt(i)) % 997;
  return FALLBACK_AVATAR_COLORS[hash % FALLBACK_AVATAR_COLORS.length];
};

const LANGUAGE_OPTIONS = [
  { label: "English (UK)", value: "en-GB" },
  { label: "English (US)", value: "en-US" },
];

const TIMEZONE_OPTIONS = [
  { label: "(GMT+5:45) Kathmandu", value: "Asia/Kathmandu" },
  { label: "(GMT+0:00) London", value: "Europe/London" },
  { label: "(GMT-5:00) New York", value: "America/New_York" },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [workspaceName, setWorkspaceName] = useState("Acme");
  const [language, setLanguage] = useState("en-GB");
  const [timezone, setTimezone] = useState("Asia/Kathmandu");
  const [logoSrc, setLogoSrc] = useState<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const canConfirmPassword = Boolean(
    currentPassword && newPassword && confirmPassword,
  );
  const [macros, setMacros] = useState<Macro[]>(MACROS);
  const [macroSearch, setMacroSearch] = useState("");
  const [expandedMacros, setExpandedMacros] = useState<string[]>([
    "open-conversation",
  ]);
  const [isCreateMacroOpen, setIsCreateMacroOpen] = useState(false);

  const toggleMacro = (id: string) => {
    setExpandedMacros((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id],
    );
  };

  const handleCreateMacro = (macro: CreateMacroPayload) => {
    setMacros((prev) => [
      {
        id: `${macro.title.toLowerCase().replace(/\s+/g, "-")}-${prev.length}`,
        title: macro.title,
        createdBy: "Prakash Shrestha",
        body: macro.body,
        availableFor: macro.availableFor,
      },
      ...prev,
    ]);
  };

  const visibleMacros = macros.filter((macro) =>
    macro.title.toLowerCase().includes(macroSearch.toLowerCase()),
  );

  const handleLogoSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setLogoSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleLogoRemove = () => {
    setLogoSrc(null);
    if (logoInputRef.current) logoInputRef.current.value = "";
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        collaborators={COLLABORATORS}
        onShare={handleShare}
      />

      <div className={styles.page}>
        <Tabs tabs={TABS} value={activeTab} onChange={setActiveTab} />

        {activeTab === "general" && (
          <div className={styles.content}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.headingGroup}>
                  <h2 className={styles.title}>Workspace profile</h2>
                  <p className={styles.subtitle}>
                    This identifies your workspace within Aioncy.
                  </p>
                </div>
                <Button variant="primary">Save changes</Button>
              </div>

              <hr className={styles.divider} />

              <TextInput
                label="Workspace name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
              />

              <hr className={styles.divider} />

              <div className={styles.logoRow}>
                <span className={styles.logoLabel}>Logo</span>
                <div className={styles.logoContent}>
                  <span className={styles.avatar}>
                    {logoSrc ? (
                      <img src={logoSrc} alt="Workspace logo" />
                    ) : (
                      <Image size={20} aria-hidden="true" />
                    )}
                  </span>
                  <div className={styles.logoActions}>
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/*"
                      className={styles.hiddenInput}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLogoSelect(file);
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      icon={<RefreshCw size={16} />}
                      onClick={() => logoInputRef.current?.click()}
                    >
                      Change
                    </Button>
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={handleLogoRemove}
                    >
                      <X size={16} />
                      Remove
                    </button>
                  </div>
                </div>
              </div>

              <TextInput
                label="Workspace ID (Slug)"
                helperText="Your unique Aioncy URL: aioncy.com/w/acme"
                placeholder="aioncy.com/w/acme"
                disabled
              />
            </section>

            <section className={styles.section}>
              <div className={styles.headingGroup}>
                <h2 className={styles.title}>Timezone and Language</h2>
                <p className={styles.subtitle}>
                  Configure your interface language and operational time zone.
                </p>
              </div>

              <hr className={styles.divider} />

              <div className={styles.fieldGroup}>
                <Select
                  label="Dashboard language"
                  options={LANGUAGE_OPTIONS}
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                />
                <Select
                  label="Timezone"
                  helperText="Used to schedule your AI working hours correctly"
                  options={TIMEZONE_OPTIONS}
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                />
              </div>
            </section>

            <section className={styles.dangerZone}>
              <span className={styles.dangerLabel}>Danger zone</span>
              <div className={styles.dangerCard}>
                <div className={styles.headingGroup}>
                  <h2 className={styles.dangerTitle}>Delete workspace</h2>
                  <p className={styles.subtitle}>
                    Permanently delete this workspace and all its data. This
                    cannot be undone.
                  </p>
                </div>
                <Button variant="danger">Delete workspace</Button>
              </div>
            </section>
          </div>
        )}

        {activeTab === "security" && (
          <div className={styles.content}>
            <section className={styles.section}>
              <div className={styles.headingGroup}>
                <h2 className={styles.title}>Account Security</h2>
                <p className={styles.subtitle}>
                  Manage your password and account security settings.
                </p>
              </div>

              <hr className={styles.divider} />

              <div className={styles.securityRow}>
                <div className={styles.headingGroup}>
                  <h3 className={styles.dangerTitle}>Change password</h3>
                  <p className={styles.subtitle}>
                    Must be at least 8 characters, include one uppercase letter
                    and one number.
                  </p>
                </div>

                <div className={styles.securityFields}>
                  <PasswordInput
                    hideLabel
                    placeholder="Current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <PasswordInput
                    hideLabel
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <PasswordInput
                    hideLabel
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div className={styles.confirmRow}>
                    <Button
                      variant="primary"
                      size="sm"
                      disabled={!canConfirmPassword}
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === "macros" && (
          <div className={styles.content}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.headingGroup}>
                  <h2 className={styles.title}>Create a Macro</h2>
                  <p className={styles.subtitle}>
                    Save time with reusable customer response templates.
                  </p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsCreateMacroOpen(true)}
                >
                  Add new
                </Button>
              </div>

              <SearchInput
                value={macroSearch}
                onChange={(e) => setMacroSearch(e.target.value)}
                placeholder="Search..."
              />

              <div className={styles.macroList}>
                {visibleMacros.map((macro) => {
                  const isExpanded = expandedMacros.includes(macro.id);
                  return (
                    <div key={macro.id} className={styles.macroCard}>
                      <div className={styles.macroCardHeader}>
                        <div className={styles.headingGroup}>
                          <h3 className={styles.macroTitle}>{macro.title}</h3>
                          <div className={styles.macroMeta}>
                            <span>Created by</span>
                            <span
                              className={styles.macroAvatar}
                              style={{
                                background: avatarColor(macro.createdBy),
                              }}
                            >
                              {macro.createdBy.charAt(0).toUpperCase()}
                            </span>
                            <span>{macro.createdBy}</span>
                            {typeof macro.usedTimes === "number" && (
                              <>
                                <span
                                  className={styles.dot}
                                  aria-hidden="true"
                                />
                                <span>Used {macro.usedTimes} times</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className={styles.macroActions}>
                          <button type="button" className={styles.deleteLink}>
                            Delete
                          </button>
                          <button type="button" className={styles.editLink}>
                            Edit
                          </button>
                        </div>
                      </div>

                      {isExpanded && macro.body && (
                        <div className={styles.macroBody}>
                          <p className={styles.macroBodyGreeting}>
                            👋 Hi{" "}
                            <span className={styles.macroPill}>First name</span>
                            ,
                          </p>
                          {macro.body.split("\n").map((line, i) => (
                            <p key={i} className={styles.macroBodyText}>
                              {line || " "}
                            </p>
                          ))}
                        </div>
                      )}

                      <div className={styles.macroFooter}>
                        <div className={styles.availableFor}>
                          <span className={styles.macroMetaLabel}>
                            Available for:
                          </span>
                          <div className={styles.availableAvatars}>
                            {macro.availableFor.map((name) => (
                              <span
                                key={name}
                                className={styles.availableAvatar}
                                style={{ background: avatarColor(name) }}
                                title={name}
                              >
                                {name.charAt(0).toUpperCase()}
                              </span>
                            ))}
                          </div>
                        </div>
                        <button
                          type="button"
                          className={styles.macroToggle}
                          aria-label={
                            isExpanded ? "Collapse macro" : "Expand macro"
                          }
                          onClick={() => toggleMacro(macro.id)}
                        >
                          {isExpanded ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}

        {activeTab === "billing" && (
          <div className={styles.content}>
            <p className="text-gray-600 text-lg">
              This section is coming soon.
            </p>
          </div>
        )}
      </div>

      <CreateMacroModal
        isOpen={isCreateMacroOpen}
        onClose={() => setIsCreateMacroOpen(false)}
        onSave={handleCreateMacro}
      />
    </div>
  );
}
