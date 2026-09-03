import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Bold,
  ChevronDown,
  Code,
  Image,
  Italic,
  Link2,
  List,
  ListOrdered,
  Redo2,
  Save,
  Send,
  TextAlignStart,
  Underline,
  Undo2,
} from 'lucide-react'
import Button from '../Button'
import DetailsPanel, { type DocumentStatusTone } from '../DetailsPanel'
import { DropdownList } from '../DropdownList'
import styles from './WriteDocPanel.module.scss'

export interface WriteDocPayload {
  title: string
  /** Body markup from the editor. */
  content: string
}

export interface WriteDocPanelProps {
  initialTitle?: string
  initialContent?: string
  status: string
  statusTone: DocumentStatusTone
  createdBy: string
  updatedAt: number
  updatedBy: string
  onClose: () => void
  onSaveDraft: (payload: WriteDocPayload) => void
  onPublish: (payload: WriteDocPayload) => void
}

const BLOCK_FORMATS: { label: string; tag: string }[] = [
  { label: 'Heading 1', tag: 'h1' },
  { label: 'Heading 2', tag: 'h2' },
  { label: 'Heading 3', tag: 'h3' },
  { label: 'Paragraph', tag: 'p' },
]

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

/** Keeps focus (and the selection) inside the editor when a control is pressed. */
const keepSelection = (e: React.MouseEvent) => e.preventDefault()

interface ToolButtonProps {
  label: string
  onClick: () => void
  children: React.ReactNode
  isActive?: boolean
  wide?: boolean
}

const ToolButton = ({ label, onClick, children, isActive = false, wide = false }: ToolButtonProps) => (
  <button
    type="button"
    className={`${styles.toolButton} ${wide ? styles.toolButtonWide : ''} ${
      isActive ? styles.toolButtonActive : ''
    }`}
    aria-label={label}
    aria-pressed={isActive}
    title={label}
    onMouseDown={keepSelection}
    onClick={onClick}
  >
    {children}
  </button>
)

const WriteDocPanel = ({
  initialTitle = '',
  initialContent = '',
  status,
  statusTone,
  createdBy,
  updatedAt,
  updatedBy,
  onClose,
  onSaveDraft,
  onPublish,
}: WriteDocPanelProps) => {
  const bodyRef = useRef<HTMLDivElement>(null)
  const formatMenuRef = useRef<HTMLDivElement>(null)
  const [title, setTitle] = useState(initialTitle)
  const [isBodyEmpty, setIsBodyEmpty] = useState(true)
  const [isFormatOpen, setIsFormatOpen] = useState(false)
  const [activeFormats, setActiveFormats] = useState<Record<string, boolean>>({})

  // The editable is uncontrolled: seed it once so React never clobbers the caret.
  useEffect(() => {
    const body = bodyRef.current
    if (!body) return
    body.innerHTML = initialContent
    setIsBodyEmpty(body.innerText.trim() === '')
    // Without this, Enter emits <div> and paragraphs lose their spacing.
    document.execCommand('defaultParagraphSeparator', false, 'p')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  useEffect(() => {
    if (!isFormatOpen) return
    const handleOutsideClick = (e: MouseEvent) => {
      if (formatMenuRef.current && !formatMenuRef.current.contains(e.target as Node)) {
        setIsFormatOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [isFormatOpen])

  const syncActiveFormats = useCallback(() => {
    const body = bodyRef.current
    if (!body || !body.contains(document.getSelection()?.anchorNode ?? null)) return
    setActiveFormats({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      insertUnorderedList: document.queryCommandState('insertUnorderedList'),
      insertOrderedList: document.queryCommandState('insertOrderedList'),
    })
  }, [])

  useEffect(() => {
    document.addEventListener('selectionchange', syncActiveFormats)
    return () => document.removeEventListener('selectionchange', syncActiveFormats)
  }, [syncActiveFormats])

  const handleBodyInput = () => {
    const body = bodyRef.current
    if (body) setIsBodyEmpty(body.innerText.trim() === '')
  }

  /** Toolbar commands always target the body, never the title field. */
  const runCommand = (command: string, value?: string) => {
    const body = bodyRef.current
    if (!body) return
    if (!body.contains(document.getSelection()?.anchorNode ?? null)) body.focus()
    document.execCommand(command, false, value)
    handleBodyInput()
    syncActiveFormats()
  }

  const handleUndo = () => runCommand('undo')
  const handleRedo = () => runCommand('redo')
  const handleBold = () => runCommand('bold')
  const handleItalic = () => runCommand('italic')
  const handleUnderline = () => runCommand('underline')
  const handleBulletList = () => runCommand('insertUnorderedList')
  const handleNumberedList = () => runCommand('insertOrderedList')

  const handleToggleFormatMenu = () => setIsFormatOpen((open) => !open)

  const handleFormatBlock = (tag: string) => {
    runCommand('formatBlock', `<${tag}>`)
    setIsFormatOpen(false)
  }

  const handleInsertLink = () => {
    const url = window.prompt('Link URL')
    if (url) runCommand('createLink', url)
  }

  const handleInsertImage = () => {
    const url = window.prompt('Image URL')
    if (url) runCommand('insertImage', url)
  }

  const handleInsertCode = () => {
    const selection = window.getSelection()
    const selected = selection?.toString() ?? ''
    runCommand('insertHTML', `<code>${escapeHtml(selected || 'code')}</code>`)
  }

  const payload = (): WriteDocPayload => ({
    title: title.trim() || 'Untitled doc',
    content: bodyRef.current?.innerHTML ?? '',
  })

  const hasContent = title.trim() !== '' || !isBodyEmpty

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-label="Write your own doc"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.main}>
          <div className={styles.mainHeader}>
            <span className={styles.mainHeaderTitle}>Write your own doc</span>

            <div className={styles.actions}>
              <button type="button" className={styles.cancelButton} onClick={onClose}>
                Cancel
              </button>

              <Button
                variant="outline"
                size="sm"
                icon={<Save size={16} />}
                disabled={!hasContent}
                onClick={() => onSaveDraft(payload())}
              >
                Save as draft
              </Button>

              <Button
                variant="primary"
                size="sm"
                icon={<Send size={16} />}
                disabled={!hasContent}
                onClick={() => onPublish(payload())}
              >
                Publish
              </Button>
            </div>
          </div>

          <div className={styles.editorScroll}>
            <input
              className={styles.titleInput}
              value={title}
              placeholder="Untitled doc"
              aria-label="Document title"
              onChange={(e) => setTitle(e.target.value)}
            />

            <div
              ref={bodyRef}
              className={`${styles.body} ${isBodyEmpty ? styles.bodyEmpty : ''}`}
              contentEditable
              suppressContentEditableWarning
              role="textbox"
              aria-multiline="true"
              aria-label="Document body"
              data-placeholder="Start writing"
              onInput={handleBodyInput}
              onBlur={handleBodyInput}
            />
          </div>

          <div className={styles.toolbar}>
            <div className={styles.toolGroup}>
              <ToolButton label="Undo" onClick={handleUndo}>
                <Undo2 size={16} />
              </ToolButton>
              <ToolButton label="Redo" onClick={handleRedo}>
                <Redo2 size={16} />
              </ToolButton>
            </div>

            <div className={styles.toolGroup} ref={formatMenuRef}>
              <ToolButton label="Text style" wide onClick={handleToggleFormatMenu}>
                <TextAlignStart size={16} />
                <ChevronDown size={12} />
              </ToolButton>

              {isFormatOpen && (
                <div className={styles.formatMenu} onMouseDown={keepSelection}>
                  <DropdownList
                    items={BLOCK_FORMATS.map((format) => ({
                      label: format.label,
                      onClick: () => handleFormatBlock(format.tag),
                    }))}
                  />
                </div>
              )}
            </div>

            <div className={styles.toolGroup}>
              <ToolButton label="Bold" isActive={activeFormats.bold} onClick={handleBold}>
                <Bold size={16} />
              </ToolButton>
              <ToolButton label="Italic" isActive={activeFormats.italic} onClick={handleItalic}>
                <Italic size={16} />
              </ToolButton>
              <ToolButton
                label="Underline"
                isActive={activeFormats.underline}
                onClick={handleUnderline}
              >
                <Underline size={16} />
              </ToolButton>
            </div>

            <div className={styles.toolGroup}>
              <ToolButton
                label="Bulleted list"
                isActive={activeFormats.insertUnorderedList}
                onClick={handleBulletList}
              >
                <List size={16} />
              </ToolButton>
              <ToolButton
                label="Numbered list"
                isActive={activeFormats.insertOrderedList}
                onClick={handleNumberedList}
              >
                <ListOrdered size={16} />
              </ToolButton>
            </div>

            <div className={styles.toolGroup}>
              <ToolButton label="Insert link" onClick={handleInsertLink}>
                <Link2 size={16} />
              </ToolButton>
              <ToolButton label="Insert image" onClick={handleInsertImage}>
                <Image size={16} />
              </ToolButton>
              <ToolButton label="Inline code" onClick={handleInsertCode}>
                <Code size={16} />
              </ToolButton>
            </div>
          </div>
        </div>

        <DetailsPanel
          type="Manual"
          status={status}
          statusTone={statusTone}
          createdBy={createdBy}
          updatedAt={updatedAt}
          updatedBy={updatedBy}
          onClose={onClose}
        />
      </div>
    </div>
  )
}

export default WriteDocPanel
