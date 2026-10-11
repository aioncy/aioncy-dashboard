import type { KeyboardEvent, MouseEvent, ReactNode } from 'react'
import Button from '../Button'
import LogoGlyph from '../LogoGlyph'
import { formatRelativeTime, type AppNotification } from '../../lib/notifications'
import styles from './NotificationItem.module.scss'

export interface NotificationItemProps {
  notification: AppNotification
  /** Opens whatever the notification points at (conversation, ticket, …). */
  onOpen: (notification: AppNotification) => void
  onAccept?: (notification: AppNotification) => void
  onDecline?: (notification: AppNotification) => void
  className?: string
}

const ACTION_TEXT: Partial<Record<AppNotification['kind'], string>> = {
  'takeover-request': 'wants to take over the chat with ',
  'takeover-rejected': 'rejected your takeover request for ',
  'conversation-assigned': 'assigned you the conversation with ',
  'conversation-closed': 'closed the conversation with ',
  'ticket-assigned': 'assigned you a ',
}

const Avatar = ({ actor }: { actor: AppNotification['actor'] }) => {
  if (actor.kind === 'user') {
    return (
      <span className={styles.avatar}>
        {actor.avatarSrc ? <img src={actor.avatarSrc} alt="" /> : actor.name.charAt(0).toUpperCase()}
      </span>
    )
  }
  if (actor.kind === 'wingman') {
    return (
      <span className={styles.avatar}>
        <img className={styles.wingmanMark} src="/notifications/wingman.png" alt="" />
      </span>
    )
  }
  return (
    <span className={`${styles.avatar} ${styles.systemAvatar}`}>
      <LogoGlyph width={18.777} height={22.16} markColor="#1A1A1A" className={styles.logoGlyph} />
    </span>
  )
}

const NotificationItem = ({ notification, onOpen, onAccept, onDecline, className = '' }: NotificationItemProps) => {
  const { kind, actor, subject, source, read } = notification

  const open = () => onOpen(notification)
  const stop = (handler?: (n: AppNotification) => void) => (event: MouseEvent) => {
    event.stopPropagation()
    handler?.(notification)
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      open()
    }
  }

  const subjectLink = subject ? (
    <button type="button" className={styles.subject} onClick={stop(onOpen)}>
      {subject}
    </button>
  ) : null

  let message: ReactNode
  if (kind === 'credits-low') {
    message = <span className={styles.muted}>You’ve used 80% of your AI credits this month.</span>
  } else if (kind === 'upload-succeeded') {
    message = (
      <>
        {subjectLink}
        <span className={styles.muted}> has been uploaded successfully</span>
      </>
    )
  } else if (kind === 'upload-failed') {
    message = (
      <>
        {subjectLink}
        <span className={styles.muted}> failed to upload. Please try again.</span>
      </>
    )
  } else {
    const actorName = actor.kind === 'user' ? actor.name : actor.kind === 'wingman' ? 'Wingman' : 'Aioncy'
    message = (
      <>
        <span className={styles.actor}>{actorName}</span>{' '}
        <span className={styles.muted}>{ACTION_TEXT[kind]}</span>
        {subjectLink}
      </>
    )
  }

  const tone =
    kind === 'upload-succeeded' ? styles.success : kind === 'upload-failed' ? styles.failure : !read ? styles.unread : ''
  const showActions = kind === 'takeover-request' && notification.takeoverStatus === 'pending'

  return (
    <div
      className={`${styles.row} ${tone} ${className}`}
      role="button"
      tabIndex={0}
      aria-label={read ? undefined : 'Unread notification'}
      onClick={open}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.main}>
        <Avatar actor={actor} />

        <div className={styles.body}>
          <div className={styles.textBlock}>
            <p className={styles.message}>{message}</p>
            <div className={styles.meta}>
              <span>{formatRelativeTime(notification.createdAt)}</span>
              {source && (
                <>
                  <span className={styles.metaDot} aria-hidden="true" />
                  <span>{source}</span>
                </>
              )}
            </div>
          </div>

          {showActions && (
            <div className={styles.actions}>
              <Button type="button" variant="outline" size="sm" onClick={stop(onDecline)}>
                Decline
              </Button>
              <Button type="button" variant="primary" size="sm" onClick={stop(onAccept)}>
                Accept
              </Button>
            </div>
          )}
        </div>
      </div>

      {!read && <span className={styles.unreadDot} aria-hidden="true" />}
    </div>
  )
}

export default NotificationItem
