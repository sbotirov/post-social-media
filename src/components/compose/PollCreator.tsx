'use client'

import type { PollInput } from '@/types'

interface Props {
  poll: PollInput
  onPollChange: (poll: PollInput) => void
  enabled: boolean
  onToggle: (enabled: boolean) => void
}

import { useTranslations } from 'next-intl'

export default function PollCreator({ poll, onPollChange, enabled, onToggle }: Props) {
  const t = useTranslations('Compose')
  function updateOption(index: number, value: string) {
    const opts = [...poll.options]
    opts[index] = value
    onPollChange({ ...poll, options: opts })
  }

  function addOption() {
    if (poll.options.length >= 10) return
    onPollChange({ ...poll, options: [...poll.options, ''] })
  }

  function removeOption(index: number) {
    if (poll.options.length <= 2) return
    onPollChange({ ...poll, options: poll.options.filter((_, i) => i !== index) })
  }

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="p-5 flex items-center justify-between">
        <span className="text-sm font-semibold flex items-center gap-2">📊 {t('Poll')}</span>
        <button
          onClick={() => onToggle(!enabled)}
          className="relative w-11 h-6 rounded-full transition-colors"
          style={{ background: enabled ? 'hsl(145 65% 50%)' : 'hsl(224 15% 20%)' }}
        >
          <span className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform" style={{ transform: enabled ? 'translateX(20px)' : '' }} />
        </button>
      </div>

      {enabled && (
        <div className="px-5 pb-5 space-y-4 animate-fade-in">
          <input className="form-input" value={poll.question} onChange={(e) => onPollChange({ ...poll, question: e.target.value })} placeholder={t('PollQuestion')} />

          <div className="space-y-2">
            {poll.options.map((opt, i) => (
              <div key={i} className="flex gap-2">
                <input className="form-input flex-1" value={opt} onChange={(e) => updateOption(i, e.target.value)} placeholder={`${t('Option')} ${i + 1}`} />
                {poll.options.length > 2 && (
                  <button onClick={() => removeOption(i)} className="px-2 hover:opacity-70" style={{ color: 'hsl(0 72% 60%)' }}>✕</button>
                )}
              </div>
            ))}
            {poll.options.length < 10 && (
              <button onClick={addOption} className="text-xs px-3 py-1.5 rounded-lg hover:bg-white/10" style={{ color: 'hsl(250 85% 65%)' }}>+ {t('AddOption')}</button>
            )}
          </div>

          {/* Type toggle */}
          <div className="flex gap-2">
            {(['regular', 'quiz'] as const).map((type) => (
              <button
                key={type}
                onClick={() => onPollChange({ ...poll, type })}
                className="flex-1 py-2 rounded-lg text-sm capitalize transition-all"
                style={{
                  background: poll.type === type ? 'hsl(250 85% 65% / 0.2)' : 'hsl(224 20% 14%)',
                  color: poll.type === type ? 'hsl(250 85% 65%)' : 'hsl(215 15% 55%)',
                }}
              >
                {type === 'regular' ? `📊 ${t('Regular')}` : `🧠 ${t('Quiz')}`}
              </button>
            ))}
          </div>

          {poll.type === 'quiz' && (
            <div className="space-y-3">
              <select className="form-input" value={poll.correctOption ?? ''} onChange={(e) => onPollChange({ ...poll, correctOption: parseInt(e.target.value) })}>
                <option value="">{t('SelectCorrectAnswer')}</option>
                {poll.options.map((opt, i) => (
                  <option key={i} value={i}>{opt || `${t('Option')} ${i + 1}`}</option>
                ))}
              </select>
              <input className="form-input" value={poll.explanation || ''} onChange={(e) => onPollChange({ ...poll, explanation: e.target.value })} placeholder={t('ExplanationOptional')} />
            </div>
          )}

          {/* Toggles */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm" style={{ color: 'hsl(215 15% 55%)' }}>
              <input type="checkbox" checked={poll.isAnonymous} onChange={(e) => onPollChange({ ...poll, isAnonymous: e.target.checked })} className="w-4 h-4" />
              {t('AnonymousVoting')}
            </label>
            {poll.type === 'regular' && (
              <label className="flex items-center gap-2 text-sm" style={{ color: 'hsl(215 15% 55%)' }}>
                <input type="checkbox" checked={poll.multiAnswer} onChange={(e) => onPollChange({ ...poll, multiAnswer: e.target.checked })} className="w-4 h-4" />
                {t('MultipleAnswers')}
              </label>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
