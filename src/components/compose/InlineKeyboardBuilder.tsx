'use client'

import { useState } from 'react'
import type { InlineKeyboard, InlineButton } from '@/types'

interface Props {
  keyboard: InlineKeyboard
  onKeyboardChange: (kb: InlineKeyboard) => void
}

export default function InlineKeyboardBuilder({ keyboard, onKeyboardChange }: Props) {
  const [expanded, setExpanded] = useState(false)

  function addRow() {
    onKeyboardChange([...keyboard, [{ text: '', url: '' }]])
  }

  function addButtonToRow(rowIndex: number) {
    const rows = [...keyboard]
    rows[rowIndex] = [...rows[rowIndex], { text: '', url: '' }]
    onKeyboardChange(rows)
  }

  function updateButton(rowIndex: number, btnIndex: number, field: keyof InlineButton, value: string) {
    const rows = keyboard.map((row, ri) =>
      ri === rowIndex ? row.map((btn, bi) => (bi === btnIndex ? { ...btn, [field]: value } : btn)) : row
    )
    onKeyboardChange(rows)
  }

  function removeButton(rowIndex: number, btnIndex: number) {
    const rows = keyboard.map((row, ri) =>
      ri === rowIndex ? row.filter((_, bi) => bi !== btnIndex) : row
    ).filter((row) => row.length > 0)
    onKeyboardChange(rows)
  }

  function removeRow(rowIndex: number) {
    onKeyboardChange(keyboard.filter((_, i) => i !== rowIndex))
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full p-5 flex items-center justify-between text-sm font-semibold hover:bg-white/5 transition-colors">
        <span className="flex items-center gap-2">⌨️ Inline Keyboard</span>
        <span className="text-lg transition-transform" style={{ transform: expanded ? 'rotate(180deg)' : '' }}>▾</span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-3 animate-fade-in">
          {keyboard.map((row, ri) => (
            <div key={ri} className="p-3 rounded-xl space-y-2" style={{ background: 'hsl(224 20% 14%)' }}>
              <div className="flex items-center justify-between">
                <span className="text-xs" style={{ color: 'hsl(215 15% 55%)' }}>Row {ri + 1}</span>
                <button onClick={() => removeRow(ri)} className="text-xs hover:opacity-70" style={{ color: 'hsl(0 72% 60%)' }}>Remove Row</button>
              </div>
              {row.map((btn, bi) => (
                <div key={bi} className="flex gap-2 items-center">
                  <input value={btn.text} onChange={(e) => updateButton(ri, bi, 'text', e.target.value)} placeholder="Button text" className="flex-1" />
                  <input value={btn.url} onChange={(e) => updateButton(ri, bi, 'url', e.target.value)} placeholder="https://..." className="flex-1" />
                  <button onClick={() => removeButton(ri, bi)} className="text-xs px-1 hover:opacity-70" style={{ color: 'hsl(0 72% 60%)' }}>✕</button>
                </div>
              ))}
              <button onClick={() => addButtonToRow(ri)} className="text-xs px-3 py-1 rounded-lg hover:bg-white/10" style={{ color: 'hsl(250 85% 65%)' }}>+ Button</button>
            </div>
          ))}

          <button onClick={addRow} className="w-full py-2 rounded-xl text-sm hover:bg-white/10 transition-colors" style={{ border: '1px dashed hsl(224 15% 20%)', color: 'hsl(215 15% 55%)' }}>
            + Add Row
          </button>

          {/* Preview */}
          {keyboard.length > 0 && (
            <div className="mt-3 space-y-1">
              <p className="text-xs mb-2" style={{ color: 'hsl(215 15% 55%)' }}>Preview:</p>
              {keyboard.map((row, ri) => (
                <div key={ri} className="flex gap-1">
                  {row.map((btn, bi) => (
                    <span key={bi} className="flex-1 text-center py-1.5 rounded-lg text-xs font-medium truncate" style={{ background: 'hsl(210 85% 55% / 0.2)', color: 'hsl(210 85% 55%)' }}>
                      {btn.text || 'Button'}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
