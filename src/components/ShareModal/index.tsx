import { useEffect, useRef, useState, type FormEvent } from 'react'
import { ChevronDown, Link as LinkIcon, Search, X } from 'lucide-react'
import Modal from '../Modal'
import Button from '../Button'
import PermissionMenu from '../PermissionMenu'
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

const INITIAL_MEMBERS: Member[] = [
  { id: 'owner', name: 'Sanjay Shrestha', email: 'Sanjay07@gmail.com', avatarSrc: '/share/sanjay.png', role: 'Owner' },
  { id: 'aryan', name: 'Aryan Shrestha', email: 'xth.aryan07@gmail.com', avatarSrc: '/share/aryan.png', role: 'Can view' },
]

export interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
}

const LogoGlyph = () => (
  <svg width="23.471" height="27.7" viewBox="0 0 23.471 27.7" fill="none" aria-hidden="true">
    <rect x="14.59" width="8.881" height="8.881" rx="5.286" fill="#000" />
    <rect x="1.9975" y="-1.8955" width="8.881" height="12.793" rx="5.286" transform="rotate(89.46 6.438 4.501)" fill="#000" />
    <rect x="14.59" y="10.57" width="8.881" height="17.128" rx="5.286" fill="#000" />
    <rect x="3.4265" y="9.8245" width="8.881" height="11.762" rx="5.286" transform="rotate(40.54 7.867 15.7055)" fill="#A153FF" />
  </svg>
)

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
    const email = query.trim()
    if (!email) return
    if (members.some((member) => member.email.toLowerCase() === email.toLowerCase())) {
      setQuery('')
      return
    }
    setMembers((prev) => [
      ...prev,
      { id: `${Date.now()}`, name: email.split('@')[0], email, role: 'Can view' },
    ])
    setQuery('')
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
          <label className={styles.search}>
            <Search size={16} aria-hidden="true" />
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search..."
              aria-label="Search people"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
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
