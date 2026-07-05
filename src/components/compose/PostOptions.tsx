'use client'

import type { PostOptions } from '@/types'

interface Props {
  options: PostOptions
  onOptionsChange: (opts: PostOptions) => void
}

const toggleItems = [
  { key: 'disableComments' as const, icon: '💬', labelKey: 'DisableComments' },
  { key: 'disableNotification' as const, icon: '🔕', labelKey: 'SilentNotification' },
  { key: 'protectContent' as const, icon: '🛡️', labelKey: 'ProtectContent' },
  { key: 'pinMessage' as const, icon: '📌', labelKey: 'PinMessage' },
]

import { useTranslations } from 'next-intl'

export default function PostOptions_({ options, onOptionsChange }: Props) {
  const t = useTranslations('Compose')
  function toggle(key: keyof PostOptions) {
    onOptionsChange({ ...options, [key]: !options[key] })
  }

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">⚙️ {t('PostOptions')}</h3>
      <div className="grid grid-cols-2 gap-3">
        {toggleItems.map((item) => (
          <button
            key={item.key}
            onClick={() => toggle(item.key)}
            className="flex items-center gap-2 p-3 rounded-xl text-sm transition-all text-left"
            style={{
              background: options[item.key] ? 'hsl(250 85% 65% / 0.1)' : 'hsl(224 20% 14%)',
              border: options[item.key] ? '1px solid hsl(250 85% 65% / 0.3)' : '1px solid hsl(224 15% 20%)',
              color: options[item.key] ? 'hsl(250 85% 65%)' : 'hsl(215 15% 55%)',
            }}
          >
            <span>{item.icon}</span>
            <span className="text-xs">{t(item.labelKey)}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
