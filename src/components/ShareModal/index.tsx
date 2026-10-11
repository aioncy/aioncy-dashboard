import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ChevronDown, Link as LinkIcon, X } from 'lucide-react'
import Modal from '../Modal'
import Button from '../Button'
import PermissionMenu from '../PermissionMenu'
import LogoGlyph from '../LogoGlyph'
import { avatarColor } from '../../lib/avatarColor'
import styles from './ShareModal.module.scss'

type Access = 'Can view' | 'Can edit'

interface Member {
  id: string
  name: string
  email: string
  avatarSrc?: string
  role: 'Owner' | Access
}

const SHARE_LINK = 'aioncy.com/projects/wrokshop'
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const INITIAL_MEMBERS: Member[] = [
  { id: 'owner', name: 'Sanjay Shrestha', email: 'Sanjay07@gmail.com', avatarSrc: '/share/sanjay.png', role: 'Owner' },
  { id: 'aryan', name: 'Aryan Shrestha', email: 'xth.aryan07@gmail.com', avatarSrc: '/share/aryan.png', role: 'Can view' },
]

export interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
}

const ShareModal = ({ isOpen, onClose }: ShareModalProps) => {
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS)
  const [query, setQuery] = useState('')
  const [copied, setCopied] = useState(false)
  const [menuFor, setMenuFor] = useState<string | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setCopied(false)
      setMenuFor(null)
    }
  }, [isOpen])

  useEffect(() => {
    if (!menuFor) return
    const handleClickOutside = (e: MouseEvent) => {
      if (listRef.current && !listRef.current.contains(e.target as Node)) setMenuFor(null)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuFor])

  useEffect(() => {
    if (!copied) return
    const timer = window.setTimeout(() => setCopied(false), 1600)
    return () => window.clearTimeout(timer)
  }, [copied])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://${SHARE_LINK}`)
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const invite = (event: FormEvent) => {
    event.preventDefault()
    const entries = query
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
    if (!entries.length) return

    const known = new Set(members.map((member) => member.email.toLowerCase()))
    const added: Member[] = []
    const invalid: string[] = []
    entries.forEach((email, index) => {
      if (!EMAIL_PATTERN.test(email)) {
        invalid.push(email)
        return
      }
      if (known.has(email.toLowerCase())) return
      known.add(email.toLowerCase())
      added.push({ id: `${Date.now()}-${index}`, name: email.split('@')[0], email, role: 'Can view' })
    })

    if (added.length) setMembers((prev) => [...prev, ...added])
    setQuery(invalid.join(', '))
  }

  const setRole = (id: string, role: Access) => {
    setMembers((prev) => prev.map((member) => (member.id === id ? { ...member, role } : member)))
    setMenuFor(null)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      ariaLabel="Share this file"
      className={styles.panel}
      overlayClassName={styles.overlay}
    >
      <div className={styles.topBar}>
        <span className={styles.logo}>
          <LogoGlyph />
        </span>
        <button type="button" className={styles.closeButton} aria-label="Close" onClick={onClose}>
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.linkSection}>
          <div className={styles.heading}>
            <h2 className={styles.title}>Share this file</h2>
            <p className={styles.subtitle}>Invite your team members to collaborate on this project.</p>
          </div>

          <div className={styles.linkCard}>
            <div className={styles.linkInfo}>
              <span className={styles.linkIcon}>
                <LinkIcon size={16} aria-hidden="true" />
              </span>
              <div className={styles.linkText}>
                <p className={styles.linkTitle}>Anyone with the link can view</p>
                <p className={styles.linkUrl}>{SHARE_LINK}</p>
              </div>
            </div>
            <button type="button" className={styles.copyButton} onClick={copyLink}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        <form className={styles.inviteRow} onSubmit={invite}>
          <input
            type="text"
            inputMode="email"
            autoComplete="off"
            className={styles.emailInput}
            placeholder="Add comma separated emails to invite"
            aria-label="Emails to invite"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <Button type="submit" variant="primary" size="md">
            Send
          </Button>
        </form>

        <div className={styles.members} ref={listRef}>
          {members.map((member) => (
            <div key={member.id} className={styles.member}>
              <div className={styles.memberInfo}>
                <span
                  className={styles.avatar}
                  style={member.avatarSrc ? undefined : { background: avatarColor(member.name) }}
                >
                  {member.avatarSrc ? (
                    <img src={member.avatarSrc} alt="" />
                  ) : (
                    member.name.charAt(0).toUpperCase()
                  )}
                </span>
                <div className={styles.memberText}>
                  <p className={styles.memberName}>{member.name}</p>
                  <p className={styles.memberEmail}>{member.email}</p>
                </div>
              </div>

              {member.role === 'Owner' ? (
                <span className={styles.owner}>Owner</span>
              ) : (
                <div className={styles.access}>
                  <button
                    type="button"
                    className={styles.accessButton}
                    aria-haspopup="menu"
                    aria-expanded={menuFor === member.id}
                    onClick={() => setMenuFor((prev) => (prev === member.id ? null : member.id))}
                  >
                    {member.role}
                    <ChevronDown size={16} aria-hidden="true" />
                  </button>
                  {menuFor === member.id && (
                    <PermissionMenu
                      className={styles.accessMenu}
                      items={(['Can view', 'Can edit'] as Access[]).map((role) => ({
                        title: role,
                        selected: member.role === role,
                        onClick: () => setRole(member.id, role),
                      }))}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default ShareModal
