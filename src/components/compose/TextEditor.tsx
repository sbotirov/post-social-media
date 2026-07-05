'use client'

import { useRef } from 'react'

interface Props {
  value: string
  onChange: (val: string) => void
  parseMode: 'HTML' | 'MarkdownV2'
  onParseModeChange: (mode: 'HTML' | 'MarkdownV2') => void
}

const formatButtons = [
  { label: 'B', tag: 'b', title: 'Bold' },
  { label: 'I', tag: 'i', title: 'Italic' },
  { label: 'U', tag: 'u', title: 'Underline' },
  { label: 'S', tag: 's', title: 'Strikethrough' },
  { label: '</>', tag: 'code', title: 'Code' },
  { label: '🔗', tag: 'a', title: 'Link' },
  { label: '👁', tag: 'tg-spoiler', title: 'Spoiler' },
]

export default function TextEditor({ value, onChange, parseMode, onParseModeChange }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function wrapSelection(tag: string) {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = value.substring(start, end)

    let wrapped: string
    if (tag === 'a') {
      const url = prompt('Enter URL:')
      if (!url) return
      wrapped = `<a href="${url}">${selected || 'Link'}</a>`
    } else {
      wrapped = `<${tag}>${selected}</${tag}>`
    }

    const newText = value.substring(0, start) + wrapped + value.substring(end)
    onChange(newText)

    // Restore cursor
    setTimeout(() => {
      textarea.focus()
      const newPos = start + wrapped.length
      textarea.setSelectionRange(newPos, newPos)
    }, 0)
  }

  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">📝 Message</h3>
        <div className="flex gap-1 text-xs">
          {(['HTML', 'MarkdownV2'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => onParseModeChange(mode)}
              className="px-2.5 py-1 rounded-lg transition-colors"
              style={{
                background: parseMode === mode ? 'hsl(250 85% 65% / 0.2)' : 'transparent',
                color: parseMode === mode ? 'hsl(250 85% 65%)' : 'hsl(215 15% 55%)',
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex gap-1 mb-2 p-1 rounded-lg" style={{ background: 'hsl(224 20% 14%)' }}>
        {formatButtons.map((btn) => (
          <button
            key={btn.tag}
            onClick={() => wrapSelection(btn.tag)}
            title={btn.title}
            className="w-8 h-8 rounded-md flex items-center justify-center text-sm hover:bg-white/10 transition-colors"
            style={{ color: 'hsl(215 15% 55%)' }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your message here..."
        rows={6}
        className="form-input resize-y min-h-[150px]"
      />

      <div className="flex justify-end mt-1">
        <span className="text-xs" style={{ color: 'hsl(215 15% 55%)' }}>{value.length} / 4096</span>
      </div>
    </div>
  )
}
