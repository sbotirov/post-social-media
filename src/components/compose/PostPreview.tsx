'use client'

import type { InlineKeyboard, PollInput, MediaFileInput } from '@/types'
import { useTranslations } from 'next-intl'

interface Props {
  text: string
  parseMode: string
  mediaFiles: MediaFileInput[]
  poll?: PollInput
  keyboard: InlineKeyboard
  channelName: string
  ttsAudioPath: string | null
}

export default function PostPreview({ text, mediaFiles, poll, keyboard, channelName, ttsAudioPath }: Props) {
  const t = useTranslations('Compose')
  const now = new Date()
  const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">📱 {t('Preview')}</h3>

      <div className="rounded-2xl overflow-hidden" style={{ background: 'hsl(224 20% 12%)' }}>
        {/* Channel header */}
        <div className="flex items-center gap-2 p-3 border-b" style={{ borderColor: 'hsl(224 15% 20% / 0.5)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ background: 'hsl(250 85% 65% / 0.2)' }}>📢</div>
          <span className="text-sm font-medium">{channelName}</span>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          {/* Media preview */}
          {mediaFiles.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {mediaFiles.map((f, i) => (
                <div key={i} className="w-16 h-16 rounded-lg flex items-center justify-center text-2xl" style={{ background: 'hsl(224 15% 20%)' }}>
                  {f.type === 'PHOTO' ? '🖼️' : f.type === 'VIDEO' ? '🎬' : f.type === 'AUDIO' ? '🎵' : '📄'}
                </div>
              ))}
            </div>
          )}

          {/* TTS indicator */}
          {ttsAudioPath && (
            <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'hsl(250 85% 65% / 0.1)' }}>
              <span>🔊</span>
              <div className="flex-1">
                <div className="h-1 rounded-full" style={{ background: 'hsl(250 85% 65% / 0.3)' }}>
                  <div className="h-1 w-1/3 rounded-full" style={{ background: 'hsl(250 85% 65%)' }} />
                </div>
              </div>
              <span className="text-xs" style={{ color: 'hsl(215 15% 55%)' }}>{t('TTSAudio')}</span>
            </div>
          )}

          {/* Text */}
          {text && (
            <div className="text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br/>') }} />
          )}

          {/* Poll preview */}
          {poll && poll.question && (
            <div className="space-y-2 p-3 rounded-xl" style={{ background: 'hsl(224 15% 18%)' }}>
              <p className="text-sm font-medium">📊 {poll.question}</p>
              {poll.options.filter(Boolean).map((opt, i) => (
                <div key={i} className="py-1.5 px-3 rounded-lg text-sm" style={{ background: 'hsl(224 20% 14%)', border: '1px solid hsl(224 15% 20%)' }}>
                  {opt}
                </div>
              ))}
            </div>
          )}

          {/* Inline keyboard preview */}
          {keyboard.length > 0 && (
            <div className="space-y-1">
              {keyboard.map((row, ri) => (
                <div key={ri} className="flex gap-1">
                  {row.map((btn, bi) => (
                    <span key={bi} className="flex-1 text-center py-2 rounded-lg text-xs font-medium" style={{ background: 'hsl(210 85% 55% / 0.15)', color: 'hsl(210 85% 55%)' }}>
                      {btn.text || 'Button'}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex justify-end">
            <span className="text-[10px]" style={{ color: 'hsl(215 15% 40%)' }}>{timeStr} 👁 0</span>
          </div>
        </div>
      </div>

      {/* Empty state */}
      {!text && mediaFiles.length === 0 && !poll && !ttsAudioPath && (
        <div className="text-center py-6" style={{ color: 'hsl(215 15% 40%)' }}>
          <p className="text-sm">{t('StartTypingPreview')}</p>
        </div>
      )}
    </div>
  )
}
