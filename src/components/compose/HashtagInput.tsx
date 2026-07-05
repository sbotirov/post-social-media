'use client'

import { useState } from 'react'

interface Props {
  hashtags: string[]
  onHashtagsChange: (tags: string[]) => void
}

export default function HashtagInput({ hashtags, onHashtagsChange }: Props) {
  const [input, setInput] = useState('')

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      addTag()
    }
  }

  function addTag() {
    const tag = input.replace(/^#/, '').trim()
    if (tag && !hashtags.includes(tag)) {
      onHashtagsChange([...hashtags, tag])
    }
    setInput('')
  }

  function removeTag(tag: string) {
    onHashtagsChange(hashtags.filter((t) => t !== tag))
  }

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2"># Hashtags</h3>
      <input
        className="form-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder="Type hashtag and press Enter"
      />
      {hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {hashtags.map((tag) => (
            <span key={tag} className="flex items-center gap-1 px-3 py-1 rounded-full text-sm" style={{ background: 'hsl(250 85% 65% / 0.15)', color: 'hsl(250 85% 65%)' }}>
              #{tag}
              <button onClick={() => removeTag(tag)} className="hover:opacity-70 ml-1 text-xs">✕</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
