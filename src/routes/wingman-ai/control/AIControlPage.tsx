import { useState } from "react";
import {
  ChevronDown,
  Hand,
  Handshake,
  Info,
  Laptop,
  Smile,
  Trash2,
  X,
} from "lucide-react";
import PageHeader from "../../../components/PageHeader";
import Button from "../../../components/Button";
import Switch from "../../../components/Switch";
import Textarea from "../../../components/Textarea";
import { COLLABORATORS, handleShare } from "../../../lib/dashboard";
import styles from "./AIControlPage.module.scss";

interface Channel {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface SegmentOption {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const ShortIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="5.73047" width="12" height="1.44" rx="0.72" fill="currentColor" />
    <rect x="2" y="8.83008" width="7.33" height="1.44" rx="0.72" fill="currentColor" />
  </svg>
);

const StandardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4.17969" width="12" height="1.44" rx="0.72" fill="currentColor" />
    <rect x="2" y="7.2793" width="12" height="1.44" rx="0.72" fill="currentColor" />
    <rect x="2" y="10.3789" width="7.33" height="1.44" rx="0.72" fill="currentColor" />
  </svg>
);

const ThoroughIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="2.63086" width="12" height="1.44" rx="0.72" fill="currentColor" />
    <rect x="2" y="5.73047" width="12" height="1.44" rx="0.72" fill="currentColor" />
    <rect x="2" y="8.83008" width="12" height="1.44" rx="0.72" fill="currentColor" />
    <rect x="2" y="11.9316" width="7.33" height="1.44" rx="0.72" fill="currentColor" />
  </svg>
);

const TONE_OPTIONS: SegmentOption[] = [
  { value: "friendly", label: "Friendly", icon: <Hand size={16} /> },
  { value: "professional", label: "Professional", icon: <Handshake size={16} /> },
  { value: "humorous", label: "Humorous", icon: <Smile size={16} /> },
];

const LENGTH_OPTIONS: SegmentOption[] = [
  { value: "short", label: "Short", icon: <ShortIcon /> },
  { value: "standard", label: "Standard", icon: <StandardIcon /> },
  { value: "thorough", label: "Thorough", icon: <ThoroughIcon /> },
];

const HANDOFF_OPTIONS = [
  { id: "askForHuman", label: "When customer ask to speak to human" },
  { id: "cantAnswerTwice", label: "When AI can't answer within two attempts" },
  { id: "outsideWorkingHours", label: "Outside working hours" },
];

const DAY_OPTIONS = ["Weekdays", "Weekends", "Everyday"];

const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
  const totalMinutes = i * 30;
  const hour24 = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  const period = hour24 >= 12 ? "pm" : "am";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return `${hour12}:${minute.toString().padStart(2, "0")} ${period}`;
});

let scheduleIdCounter = 0;
const nextScheduleId = () => `schedule-${scheduleIdCounter++}`;

interface Schedule {
  id: string;
  day: string;
  start: string;
  end: string;
}

interface PillSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  ariaLabel: string;
}

const PillSelect = ({ value, onChange, options, ariaLabel }: PillSelectProps) => (
  <div className={styles.pillSelect}>
    <select
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
    <ChevronDown size={14} aria-hidden="true" />
  </div>
);

const CHANNELS: Channel[] = [
  {
    id: "whatsapp",
    label: "Whatsapp",
    icon: <img src="/social/whatsapp.png" alt="" />,
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: <img src="/social/insta.png" alt="" />,
  },
  {
    id: "messenger",
    label: "Messenger",
    icon: <img src="/social/messanger.png" alt="" />,
  },
  {
    id: "website",
    label: "Website",
    icon: <Laptop size={28} color="#8C8C8C" />,
  },
];

export function AIControlPage() {
  const [showPromo, setShowPromo] = useState(true);
  const [masterToggle, setMasterToggle] = useState(true);
  const [channelToggles, setChannelToggles] = useState<Record<string, boolean>>(
    {
      whatsapp: false,
      instagram: true,
      messenger: true,
      website: true,
    },
  );
  const [workingHours, setWorkingHours] = useState(true);
  const [schedules, setSchedules] = useState<Schedule[]>([
    { id: nextScheduleId(), day: "Weekdays", start: "9:00 am", end: "5:00 pm" },
    { id: nextScheduleId(), day: "Weekends", start: "9:00 am", end: "5:00 pm" },
  ]);
  const [tone, setTone] = useState("friendly");
  const [answerLength, setAnswerLength] = useState("short");
  const [greeting, setGreeting] = useState(
    "Hello there and Namaste! How can I help you today?",
  );
  const [keywords, setKeywords] = useState([
    "Competitor-name",
    "Refund-claims",
    "Abusive-language",
  ]);
  const [fallbackResponse, setFallbackResponse] = useState(
    "I'm not able to help with that specific request. Let me connect you with a team member who can assist you better.",
  );
  const [handoff, setHandoff] = useState<Record<string, boolean>>({
    askForHuman: false,
    cantAnswerTwice: false,
    outsideWorkingHours: false,
  });

  const toggleChannel = (id: string) => {
    setChannelToggles((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const removeKeyword = (keyword: string) => {
    setKeywords((prev) => prev.filter((k) => k !== keyword));
  };

  const toggleHandoff = (id: string) => {
    setHandoff((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const addSchedule = () => {
    setSchedules((prev) => [
      ...prev,
      { id: nextScheduleId(), day: "Weekdays", start: "9:00 am", end: "5:00 pm" },
    ]);
  };

  const updateSchedule = (
    id: string,
    field: "day" | "start" | "end",
    value: string,
  ) => {
    setSchedules((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row)),
    );
  };

  const removeSchedule = (id: string) => {
    setSchedules((prev) => prev.filter((row) => row.id !== id));
  };

  return (
    <div>
      <PageHeader
        title="AI Control"
        collaborators={COLLABORATORS}
        onShare={handleShare}
      />

      <div className={styles.page}>
        <div className={styles.actionsRow}>
          <Button variant="outline">Test AI</Button>
          <Button variant="primary">Save changes</Button>
        </div>

        {showPromo && (
          <div className={styles.promoCard}>
            <button
              type="button"
              className={styles.promoClose}
              aria-label="Dismiss"
              onClick={() => setShowPromo(false)}
            >
              <X size={16} />
            </button>

            <div className={styles.promoContent}>
              <h2 className={styles.promoTitle}>
                Train Wingman to Handle Conversations
              </h2>
              <p className={styles.promoSubtitle}>
                Train Wingman to understand and respond to customer messages
                effectively.
              </p>
              <a className={styles.promoLink} href="#">
                Train now
              </a>
            </div>

            <img
              src="/wingman/wingman.png"
              alt="Wingman AI"
              className={styles.promoImage}
            />
          </div>
        )}

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.headingGroup}>
              <h3 className={styles.cardTitle}>
                Wingman Master Toggle
                <Info size={14} color="#A1A1AA" aria-hidden="true" />
              </h3>
              <p className={styles.cardSubtitle}>
                Enable or disable your AI agent across connected channels.
              </p>
            </div>
            <Switch
              checked={masterToggle}
              onChange={setMasterToggle}
              aria-label="Wingman master toggle"
            />
          </div>

          <div className={styles.channelGrid}>
            {CHANNELS.map((channel) => (
              <div key={channel.id} className={styles.channelCard}>
                <span className={styles.channelIcon}>{channel.icon}</span>
                <div className={styles.channelBottom}>
                  <span className={styles.channelLabel}>{channel.label}</span>
                  <Switch
                    checked={channelToggles[channel.id]}
                    onChange={() => toggleChannel(channel.id)}
                    aria-label={`Toggle ${channel.label}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.headingGroup}>
              <h3 className={styles.cardTitle}>Wingman Working Hours</h3>
              <p className={styles.cardSubtitle}>
                Manage your wingman's working hours.
              </p>
            </div>
            <Switch
              checked={workingHours}
              onChange={setWorkingHours}
              aria-label="Wingman working hours toggle"
            />
          </div>

          <div className={styles.scheduleList}>
            {schedules.map((row, index) => (
              <div key={row.id} className={styles.scheduleRow}>
                <PillSelect
                  ariaLabel="Day"
                  value={row.day}
                  options={DAY_OPTIONS}
                  onChange={(value) => updateSchedule(row.id, "day", value)}
                />
                <PillSelect
                  ariaLabel="Start time"
                  value={row.start}
                  options={TIME_OPTIONS}
                  onChange={(value) => updateSchedule(row.id, "start", value)}
                />
                <span className={styles.scheduleTo}>to</span>
                <PillSelect
                  ariaLabel="End time"
                  value={row.end}
                  options={TIME_OPTIONS}
                  onChange={(value) => updateSchedule(row.id, "end", value)}
                />
                {index > 0 && (
                  <button
                    type="button"
                    className={styles.scheduleDelete}
                    aria-label="Remove schedule"
                    onClick={() => removeSchedule(row.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            className={styles.addScheduleLink}
            onClick={addSchedule}
          >
            Add schedule
          </button>
        </section>

        <section className={styles.card}>
          <div className={styles.headingGroup}>
            <h3 className={styles.cardTitle}>Language Control</h3>
            <p className={styles.cardSubtitle}>
              Choose how your AI responds to different languages
            </p>
          </div>

          <hr className={styles.divider} />

          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Tone of Voice</span>
            <div className={styles.segmentedRow}>
              {TONE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.segmentButton} ${
                    tone === option.value ? styles.segmentActive : ""
                  }`}
                  onClick={() => setTone(option.value)}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Answer Length</span>
            <div className={styles.segmentedRow}>
              {LENGTH_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.segmentButton} ${
                    answerLength === option.value ? styles.segmentActive : ""
                  }`}
                  onClick={() => setAnswerLength(option.value)}
                >
                  {option.icon}
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <Textarea
            label="AI Greeting Message"
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
          />
        </section>

        <section className={styles.card}>
          <div className={styles.headingGroup}>
            <h3 className={styles.cardTitle}>Guardrails &amp; Safety</h3>
            <p className={styles.cardSubtitle}>
              Define safety rules and restricted behaviors
            </p>
          </div>

          <hr className={styles.divider} />

          <div className={styles.fieldGroup}>
            <span className={styles.fieldLabel}>Blacklisted Keywords</span>
            <div className={styles.keywordRow}>
              {keywords.map((keyword) => (
                <span key={keyword} className={styles.keywordChip}>
                  {keyword}
                  <button
                    type="button"
                    aria-label={`Remove ${keyword}`}
                    onClick={() => removeKeyword(keyword)}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              <button type="button" className={styles.addKeywordLink}>
                Add Keywords
              </button>
            </div>
          </div>

          <Textarea
            label="Default Fallback Response"
            value={fallbackResponse}
            onChange={(e) => setFallbackResponse(e.target.value)}
          />
        </section>

        <section className={styles.card}>
          <div className={styles.headingGroup}>
            <h3 className={styles.cardTitle}>Human Handoff</h3>
            <p className={styles.cardSubtitle}>
              Select when AI should pass the chat to human
            </p>
          </div>

          <hr className={styles.divider} />

          <div className={styles.checkboxList}>
            {HANDOFF_OPTIONS.map((option) => (
              <label key={option.id} className={styles.checkboxRow}>
                <input
                  type="checkbox"
                  checked={handoff[option.id]}
                  onChange={() => toggleHandoff(option.id)}
                />
                {option.label}
              </label>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
