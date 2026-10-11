import { useSyncExternalStore } from 'react'

/** Notification preference groups, as listed in Account → Notifications. */
export type NotificationCategory = 'conversations' | 'tickets' | 'ai' | 'billing' | 'account'
export type NotificationChannel = 'web' | 'email'

export type NotificationKind =
  | 'takeover-request'
  | 'takeover-rejected'
  | 'conversation-assigned'
  | 'conversation-closed'
  | 'ticket-assigned'
  | 'credits-low'
  | 'upload-succeeded'
  | 'upload-failed'

export type NotificationActor =
  | { kind: 'user'; name: string; avatarSrc?: string }
  | { kind: 'wingman' }
  | { kind: 'system' }

/** Where clicking a notification takes the user. */
export type NotificationTarget =
  | { kind: 'conversation'; conversationId: string }
  | { kind: 'ticket'; ticketId: string }
  | { kind: 'knowledge-base' }
  | { kind: 'billing' }

export type TakeoverStatus = 'pending' | 'accepted' | 'declined'

export interface AppNotification {
  id: string
  kind: NotificationKind
  category: NotificationCategory
  actor: NotificationActor
  /** Underlined entity in the message — a contact, ticket or document name. */
  subject?: string
  /** Label shown after the timestamp, e.g. "Conversation" or "Knowledge Base". */
  source?: string
  createdAt: string
  read: boolean
  target?: NotificationTarget
  takeoverStatus?: TakeoverStatus
}

export type NotificationPreferences = Record<NotificationCategory, Record<NotificationChannel, boolean>>

export const NOTIFICATION_CATEGORIES: { id: NotificationCategory; title: string; description: string }[] = [
  {
    id: 'conversations',
    title: 'Conversation and leads',
    description:
      'Chats assigned to you, takeover requests, handovers from your AI, chats waiting too long, and new leads.',
  },
  {
    id: 'tickets',
    title: 'New ticket and ticket messages',
    description: 'Tickets assigned to you and updates on your tickets.',
  },
  {
    id: 'ai',
    title: 'AI and channels',
    description: 'Knowledge sources that fail to sync, channels that disconnect, and when your AI is paused.',
  },
  {
    id: 'billing',
    title: 'Billing and credits',
    description: 'Low or used-up credits, payment results, and plan renewals.',
  },
  {
    id: 'account',
    title: 'Account and teams',
    description: 'New device logins, password changes, and teammates joining or changing roles.',
  },
]

export const DEFAULT_PREFERENCES: NotificationPreferences = {
  conversations: { web: true, email: true },
  tickets: { web: true, email: true },
  ai: { web: false, email: false },
  billing: { web: false, email: false },
  account: { web: false, email: false },
}

const ARYAN: NotificationActor = { kind: 'user', name: 'AryanXth', avatarSrc: '/share/aryan.png' }

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString()

const seedNotifications = (): AppNotification[] => [
  {
    id: 'n1',
    kind: 'takeover-request',
    category: 'conversations',
    actor: ARYAN,
    subject: 'Apsan Rana Magar',
    source: 'Conversation',
    createdAt: minutesAgo(30),
    read: false,
    target: { kind: 'conversation', conversationId: 'c2' },
    takeoverStatus: 'pending',
  },
  {
    id: 'n2',
    kind: 'ticket-assigned',
    category: 'tickets',
    actor: ARYAN,
    subject: 'Ticket001',
    source: 'Conversation',
    createdAt: minutesAgo(30),
    read: false,
    target: { kind: 'ticket', ticketId: 'Ticket001' },
  },
  {
    id: 'n3',
    kind: 'takeover-rejected',
    category: 'conversations',
    actor: ARYAN,
    subject: 'Apsan Rana Magar',
    source: 'Conversation',
    createdAt: minutesAgo(30),
    read: true,
    target: { kind: 'conversation', conversationId: 'c2' },
  },
  {
    id: 'n4',
    kind: 'conversation-closed',
    category: 'conversations',
    actor: ARYAN,
    subject: 'Aryan Shrestha',
    source: 'Conversation',
    createdAt: minutesAgo(30),
    read: true,
    target: { kind: 'conversation', conversationId: 'c3' },
  },
  {
    id: 'n5',
    kind: 'takeover-request',
    category: 'conversations',
    actor: ARYAN,
    subject: 'Aryan Shrestha',
    source: 'Conversation',
    createdAt: minutesAgo(30),
    read: true,
    target: { kind: 'conversation', conversationId: 'c3' },
    takeoverStatus: 'pending',
  },
  {
    id: 'n6',
    kind: 'conversation-assigned',
    category: 'conversations',
    actor: { kind: 'wingman' },
    subject: 'Kiran Shrestha',
    source: 'Conversation',
    createdAt: minutesAgo(45),
    read: true,
    target: { kind: 'conversation', conversationId: 'c1' },
  },
  {
    id: 'n7',
    kind: 'ticket-assigned',
    category: 'tickets',
    actor: ARYAN,
    subject: 'Ticket001',
    source: 'Ticket',
    createdAt: minutesAgo(30),
    read: true,
    target: { kind: 'ticket', ticketId: 'Ticket001' },
  },
  {
    id: 'n8',
    kind: 'credits-low',
    category: 'billing',
    actor: { kind: 'system' },
    createdAt: minutesAgo(60),
    read: false,
    target: { kind: 'billing' },
  },
  {
    id: 'n9',
    kind: 'upload-succeeded',
    category: 'ai',
    actor: { kind: 'system' },
    subject: 'Doc name.pdf',
    source: 'Knowledge Base',
    createdAt: minutesAgo(90),
    read: true,
    target: { kind: 'knowledge-base' },
  },
  {
    id: 'n10',
    kind: 'upload-failed',
    category: 'ai',
    actor: { kind: 'system' },
    subject: 'doc name.pdf',
    source: 'Knowledge Base',
    createdAt: minutesAgo(120),
    read: true,
    target: { kind: 'knowledge-base' },
  },
]

const NOTIFICATIONS_KEY = 'aioncy:notifications'
const PREFERENCES_KEY = 'aioncy:notification-preferences'

const readStored = <T>(key: string, fallback: () => T): T => {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback()
  } catch {
    return fallback()
  }
}

const writeStored = (key: string, value: unknown) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage can be unavailable (private mode, quota) — state still lives in memory.
  }
}

const mergePreferences = (stored: Partial<NotificationPreferences>): NotificationPreferences =>
  Object.fromEntries(
    Object.entries(DEFAULT_PREFERENCES).map(([category, channels]) => [
      category,
      { ...channels, ...stored[category as NotificationCategory] },
    ]),
  ) as NotificationPreferences

let notifications: AppNotification[] =
  typeof window !== 'undefined' ? readStored(NOTIFICATIONS_KEY, seedNotifications) : []
let preferences: NotificationPreferences =
  typeof window !== 'undefined' ? mergePreferences(readStored(PREFERENCES_KEY, () => ({}))) : DEFAULT_PREFERENCES

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((listener) => listener())

const setNotifications = (next: AppNotification[]) => {
  notifications = next
  writeStored(NOTIFICATIONS_KEY, notifications)
  emit()
}

const updateNotification = (id: string, patch: Partial<AppNotification>) =>
  setNotifications(notifications.map((n) => (n.id === id ? { ...n, ...patch } : n)))

export const markNotificationRead = (id: string) => updateNotification(id, { read: true })

export const respondToTakeover = (id: string, status: Exclude<TakeoverStatus, 'pending'>) =>
  updateNotification(id, { read: true, takeoverStatus: status })

export const savePreferences = (next: NotificationPreferences) => {
  preferences = next
  writeStored(PREFERENCES_KEY, preferences)
  emit()
}

/** Only categories with web notifications switched on appear in the inbox. */
const isVisible = (n: AppNotification) => preferences[n.category].web

export const markAllNotificationsRead = () =>
  setNotifications(notifications.map((n) => (isVisible(n) ? { ...n, read: true } : n)))

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const useNotifications = () => {
  const all = useSyncExternalStore(subscribe, () => notifications, () => [])
  const prefs = useSyncExternalStore(subscribe, () => preferences, () => DEFAULT_PREFERENCES)
  const visible = all.filter((n) => prefs[n.category].web)

  return {
    notifications: visible,
    unreadCount: visible.filter((n) => !n.read).length,
    preferences: prefs,
  }
}

export const formatRelativeTime = (iso: string, now = Date.now()) => {
  const minutes = Math.max(0, Math.round((now - new Date(iso).getTime()) / 60_000))
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hr ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}
