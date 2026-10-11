import { useRef, useState } from "react";
import { Briefcase, MailCheck } from "lucide-react";
import PageHeader from "../../components/PageHeader";
import Tabs from "../../components/Tabs";
import TextInput from "../../components/TextInput";
import PasswordInput from "../../components/PasswordInput";
import Button from "../../components/Button";
import Switch from "../../components/Switch";
import TwoFactorModal from "../../components/TwoFactorModal";
import { COLLABORATORS, CURRENT_USER, handleShare } from "../../lib/dashboard";
import { useSearch } from "@tanstack/react-router";
import type { AccountSearch } from "./index";
import {
  NOTIFICATION_CATEGORIES,
  savePreferences,
  useNotifications,
  type NotificationCategory,
  type NotificationChannel,
  type NotificationPreferences,
} from "../../lib/notifications";
import styles from "./AccountPage.module.scss";

const TABS = [
  { label: "Profile info", value: "profile" },
  { label: "Security", value: "security" },
  { label: "Notifications", value: "notifications" },
];

const ACCOUNT_EMAIL = CURRENT_USER.email;

const CHANNELS: { id: NotificationChannel; label: string }[] = [
  { id: "web", label: "Web" },
  { id: "email", label: "Email" },
];

type TwoFactorMethod = "email";

const TWO_FACTOR_METHODS: {
  id: TwoFactorMethod;
  title: string;
  description: string;
  action: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "email",
    title: "Email verification",
    description:
      "We'll send a 6-digit code to your email when you log in from a new device.",
    action: "Enable",
    icon: <MailCheck size={16} />,
  },
];

export function AccountPage() {
  const routeSearch: AccountSearch = useSearch({ strict: false });
  const [activeTab, setActiveTab] = useState<string>(routeSearch.tab ?? "profile");
  const { preferences } = useNotifications();
  const [prefsDraft, setPrefsDraft] = useState<NotificationPreferences>(preferences);
  const [prefsMsg, setPrefsMsg] = useState<string | null>(null);

  // Follow ?tab= when it changes (e.g. the inbox's "Account settings" link).
  const [syncedTab, setSyncedTab] = useState(routeSearch.tab);
  if (routeSearch.tab !== syncedTab) {
    setSyncedTab(routeSearch.tab);
    if (routeSearch.tab) setActiveTab(routeSearch.tab);
  }

  const togglePreference = (
    category: NotificationCategory,
    channel: NotificationChannel,
    enabled: boolean,
  ) => {
    setPrefsMsg(null);
    setPrefsDraft((prev) => ({
      ...prev,
      [category]: { ...prev[category], [channel]: enabled },
    }));
  };

  const prefsDirty = JSON.stringify(prefsDraft) !== JSON.stringify(preferences);

  const handleSavePreferences = () => {
    savePreferences(prefsDraft);
    setPrefsMsg("Notification settings saved.");
  };
  const [name, setName] = useState("Aryan");
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [enabledMethods, setEnabledMethods] = useState<TwoFactorMethod[]>([]);
  const [verifyingMethod, setVerifyingMethod] =
    useState<TwoFactorMethod | null>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const canConfirmPassword = Boolean(
    currentPassword && newPassword && confirmPassword,
  );

  const handleAvatarSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setAvatarSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleAvatarRemove = () => {
    setAvatarSrc(null);
    if (avatarInputRef.current) avatarInputRef.current.value = "";
  };

  const toggleMethod = (id: TwoFactorMethod, enabled: boolean) => {
    if (enabled) {
      setVerifyingMethod(id);
      return;
    }
    setEnabledMethods((prev) => prev.filter((method) => method !== id));
  };

  const handleVerified = () => {
    if (!verifyingMethod) return;
    setEnabledMethods((prev) =>
      prev.includes(verifyingMethod) ? prev : [...prev, verifyingMethod],
    );
    setVerifyingMethod(null);
  };

  return (
    <div>
      <PageHeader
        title="Account"
        collaborators={COLLABORATORS}
        onShare={handleShare}
      />

      <div className={styles.page}>
        <Tabs tabs={TABS} value={activeTab} onChange={setActiveTab} />

        {activeTab === "profile" && (
          <form
            className={styles.content}
            onSubmit={(event) => event.preventDefault()}
          >
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.headingGroup}>
                  <h2 className={styles.title}>Profile Information</h2>
                  <p className={styles.subtitle}>
                    Update your personal information and profile picture.
                  </p>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className={styles.nowrap}
                >
                  Save changes
                </Button>
              </div>

              <div className={styles.rowGroup}>
                <div className={styles.row}>
                  <div className={styles.rowInfo}>
                    <span className={styles.rowLabel}>Profile picture</span>
                  </div>
                  <div className={`${styles.rowField} ${styles.pictureField}`}>
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className={styles.hiddenInput}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAvatarSelect(file);
                      }}
                    />
                    <button
                      type="button"
                      className={styles.avatarThumb}
                      title="Change profile picture"
                      aria-label="Change profile picture"
                      onClick={() => avatarInputRef.current?.click()}
                    >
                      {avatarSrc ? (
                        <img src={avatarSrc} alt="Profile picture" />
                      ) : (
                        <Briefcase size={20} aria-hidden="true" />
                      )}
                    </button>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={handleAvatarRemove}
                    >
                      Remove
                    </Button>
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.rowInfo}>
                    <span className={styles.rowLabel}>Name</span>
                  </div>
                  <div className={styles.rowField}>
                    <TextInput
                      label="Name"
                      hideLabel
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.rowInfo}>
                    <span className={styles.rowLabel}>Email</span>
                  </div>
                  <div className={styles.rowField}>
                    <TextInput
                      label="Email"
                      hideLabel
                      placeholder={ACCOUNT_EMAIL}
                      disabled
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.headingGroup}>
                  <h2 className={styles.title}>Two-factor authentication</h2>
                  <p className={styles.subtitle}>
                    Add an extra layer of security to your account.
                  </p>
                </div>
              </div>

              <div className={styles.twoFactorList}>
                {TWO_FACTOR_METHODS.map((method) => {
                  const isEnabled = enabledMethods.includes(method.id);
                  return (
                    <div key={method.id} className={styles.twoFactorCard}>
                      <span className={styles.twoFactorIcon}>
                        {method.icon}
                      </span>
                      <div className={styles.twoFactorText}>
                        <span className={styles.twoFactorTitle}>
                          {method.title}
                        </span>
                        <span className={styles.subtitle}>
                          {method.description}
                        </span>
                      </div>
                      {isEnabled ? (
                        <Switch
                          checked
                          aria-label={`Disable ${method.title}`}
                          onChange={() => toggleMethod(method.id, false)}
                        />
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className={styles.nowrap}
                          onClick={() => toggleMethod(method.id, true)}
                        >
                          {method.action}
                        </Button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            <div className={styles.dangerZone}>
              <div className={styles.dangerDivider}>
                <span className={styles.dangerLabel}>Danger zone</span>
              </div>
              <div className={styles.dangerCard}>
                <div className={styles.headingGroup}>
                  <h3 className={styles.cardTitle}>Delete account</h3>
                  <p className={styles.subtitle}>
                    Permanently delete this account and all its data. This
                    cannot be undone.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="outlineDanger"
                  size="sm"
                  className={styles.nowrap}
                >
                  Delete account
                </Button>
              </div>
            </div>
          </form>
        )}

        {activeTab === "security" && (
          <div className={styles.content}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.headingGroup}>
                  <h2 className={styles.title}>Account Security</h2>
                  <p className={styles.subtitle}>
                    Manage your password and account security settings.
                  </p>
                </div>
              </div>

              <div className={styles.passwordRow}>
                <div className={styles.rowInfo}>
                  <span className={styles.rowLabel}>Change password</span>
                  <span className={styles.rowHelper}>
                    Must be at least 8 characters, include one uppercase letter
                    and one number.
                  </span>
                </div>

                <div className={styles.passwordFields}>
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

        {activeTab === "notifications" && (
          <div className={styles.content}>
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <div className={styles.headingGroup}>
                  <h2 className={styles.title}>Notification settings</h2>
                  <p className={styles.subtitle}>
                    Choose what you get notified about and where.
                  </p>
                </div>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  className={styles.nowrap}
                  disabled={!prefsDirty}
                  onClick={handleSavePreferences}
                >
                  Save changes
                </Button>
              </div>

              {prefsMsg && (
                <p role="status" style={{ color: "#15803D", fontSize: 13 }}>
                  {prefsMsg}
                </p>
              )}

              <div className={styles.notificationRows}>
                {NOTIFICATION_CATEGORIES.map((category) => (
                  <div key={category.id} className={styles.notificationRow}>
                    <div className={styles.notificationInfo}>
                      <span className={styles.rowLabel}>{category.title}</span>
                      <span className={styles.rowHelper}>{category.description}</span>
                    </div>
                    <div className={styles.channelList}>
                      {CHANNELS.map((channel) => (
                        <label key={channel.id} className={styles.channel}>
                          <Switch
                            checked={prefsDraft[category.id][channel.id]}
                            aria-label={`${category.title} — ${channel.label}`}
                            onChange={(enabled) =>
                              togglePreference(category.id, channel.id, enabled)
                            }
                          />
                          <span className={styles.channelLabel}>{channel.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </div>

      {verifyingMethod && (
        <TwoFactorModal
          email={ACCOUNT_EMAIL}
          onClose={() => setVerifyingMethod(null)}
          onConfirm={handleVerified}
        />
      )}
    </div>
  );
}
