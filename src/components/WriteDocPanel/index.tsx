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

/** Parks the caret just outside a <code> chip; stripped again on save. */
const ZERO_WIDTH = '​'

/** Keeps focus (and the selection) inside the editor when a control is pressed. */
const keepSelection = (e: React.MouseEvent) => e.preventDefault()

/** Nearest <code> ancestor within the editor, so the code button can toggle off. */
const closestCode = (node: Node | null, boundary: HTMLElement): HTMLElement | null => {
  let current: Node | null = node
  while (current && current !== boundary) {
    if (current.nodeType === Node.ELEMENT_NODE && (current as HTMLElement).tagName === 'CODE') {
      return current as HTMLElement
    }
    current = current.parentNode
  }
  return null
}

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
  const imageInputRef = useRef<HTMLInputElement>(null)
  // The file dialog drops the caret, so the range is parked here across it.
  const savedRangeRef = useRef<Range | null>(null)
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

  const restoreSelection = () => {
    const range = savedRangeRef.current
    if (!range) return
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }

  const handleInsertImage = () => {
    const body = bodyRef.current
    if (!body) return
    if (!body.contains(document.getSelection()?.anchorNode ?? null)) body.focus()
    const selection = window.getSelection()
    savedRangeRef.current = selection?.rangeCount ? selection.getRangeAt(0).cloneRange() : null
    imageInputRef.current?.click()
  }

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return

    // No upload endpoint yet, so the picked file is inlined as a data URL.
    const reader = new FileReader()
    reader.onload = () => {
      const body = bodyRef.current
      if (!body) return
      body.focus()
      restoreSelection()
      document.execCommand('insertImage', false, String(reader.result))
      handleBodyInput()
    }
    reader.readAsDataURL(file)
  }

  const placeCaret = (node: Node, offset: number) => {
    const range = document.createRange()
    range.setStart(node, offset)
    range.collapse(true)
    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }

  /** Wraps the selection in <code>, or steps in and out of a chip when the caret is collapsed. */
  const handleInsertCode = () => {
    const body = bodyRef.current
    if (!body) return
    if (!body.contains(document.getSelection()?.anchorNode ?? null)) body.focus()

    const selection = window.getSelection()
    const existing = closestCode(selection?.anchorNode ?? null, body)
    const selected = selection?.toString() ?? ''

    if (existing) {
      if (selected) {
        // Unwrapping only makes sense when something is actually selected.
        existing.replaceWith(...Array.from(existing.childNodes))
      } else {
        // Otherwise step past the chip so typing carries on in plain text.
        const anchor = document.createTextNode(ZERO_WIDTH)
        existing.after(anchor)
        placeCaret(anchor, 1)
      }
      handleBodyInput()
      return
    }

    // Built by hand rather than via insertHTML, which rewrites <code> into a
    // styled <span> and drops it altogether when it is empty.
    const range = selection?.rangeCount ? selection.getRangeAt(0) : null
    if (!range) return

    const code = document.createElement('code')

    if (selected) {
      try {
        range.surroundContents(code)
      } catch {
        // The range straddled element boundaries, so move its contents instead.
        code.appendChild(range.extractContents())
        range.insertNode(code)
      }
      placeCaret(code, code.childNodes.length)
    } else {
      // Seeded with a zero-width character so the empty chip has somewhere to put
      // the caret; stripped again on save.
      code.textContent = ZERO_WIDTH
      range.insertNode(code)
      if (code.firstChild) placeCaret(code.firstChild, 1)
    }

    handleBodyInput()
  }

  const payload = (): WriteDocPayload => ({
    title: title.trim() || 'Untitled doc',
    content: (bodyRef.current?.innerHTML ?? '').split(ZERO_WIDTH).join(''),
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
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className={styles.hiddenInput}
                onChange={handleImageFile}
              />
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
