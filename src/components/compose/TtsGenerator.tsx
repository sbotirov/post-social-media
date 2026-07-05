'use client'

import { useState, useRef } from 'react'

const languages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
]

interface Props {
  onAudioGenerated: (path: string) => void
  ttsText: string
  onTtsTextChange: (text: string) => void
  ttsLanguage: string
  onTtsLanguageChange: (lang: string) => void
}

import { useTranslations } from 'next-intl'

export default function TtsGenerator({ onAudioGenerated, ttsText, onTtsTextChange, ttsLanguage, onTtsLanguageChange }: Props) {
  const t = useTranslations('Compose')
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [error, setError] = useState('')
  const audioRef = useRef<HTMLAudioElement>(null)

  async function handleGenerate(preview = false) {
    if (!ttsText.trim()) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: ttsText, language: ttsLanguage }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'TTS failed')
      }

      const data = await res.json()
      setAudioUrl(data.url)

      if (!preview) {
        onAudioGenerated(data.filePath)
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed')
    }
    setLoading(false)
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-5 flex items-center justify-between text-sm font-semibold hover:bg-white/5 transition-colors"
      >
        <span className="flex items-center gap-2">🔊 {t('VoiceTab')}</span>
        <span className="text-lg transition-transform duration-200" style={{ transform: expanded ? 'rotate(180deg)' : '' }}>▾</span>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-4 animate-fade-in">
          <textarea
            value={ttsText}
            onChange={(e) => onTtsTextChange(e.target.value)}
            placeholder={t('EnterTextForTTS')}
            rows={3}
            className="form-input resize-y min-h-[100px]"
          />

          {/* Language grid */}
          <div className="grid grid-cols-5 gap-1.5">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => onTtsLanguageChange(lang.code)}
                className="py-2 px-1 rounded-lg text-xs text-center transition-all"
                style={{
                  background: ttsLanguage === lang.code ? 'hsl(250 85% 65% / 0.2)' : 'hsl(224 20% 14%)',
                  border: ttsLanguage === lang.code ? '1px solid hsl(250 85% 65% / 0.5)' : '1px solid transparent',
                  color: ttsLanguage === lang.code ? 'hsl(250 85% 65%)' : 'hsl(215 15% 55%)',
                }}
              >
                <span className="text-base">{lang.flag}</span>
                <div className="mt-0.5 truncate">{lang.name}</div>
              </button>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleGenerate(true)}
              disabled={loading || !ttsText.trim()}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all hover:bg-white/10 disabled:opacity-50"
              style={{ border: '1px solid hsl(224 15% 20%)', color: 'hsl(215 15% 55%)' }}
            >
              {loading ? '⏳ ...' : t('PreviewBtn')}
            </button>
            <button
              onClick={() => handleGenerate(false)}
              disabled={loading || !ttsText.trim()}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:scale-[1.02] disabled:opacity-50"
              style={{ background: 'hsl(250 85% 65%)' }}
            >
              {loading ? `⏳ ${t('Uploading')}` : t('GenerateAndAttach')}
            </button>
          </div>

          {/* Audio player */}
          {audioUrl && (
            <div className="p-3 rounded-xl" style={{ background: 'hsl(224 20% 14%)' }}>
              <audio ref={audioRef} controls className="w-full h-8" src={audioUrl} />
            </div>
          )}

          {error && <p className="text-sm" style={{ color: 'hsl(0 72% 60%)' }}>⚠️ {error}</p>}
        </div>
      )}
    </div>
  )
}
