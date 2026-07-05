'use client'

import { useMemo } from 'react'

interface Props {
  mode: 'now' | 'schedule'
  scheduledAt: string
  onModeChange: (mode: 'now' | 'schedule') => void
  onDateTimeChange: (dt: string) => void
}

export default function SchedulePicker({ mode, scheduledAt, onModeChange, onDateTimeChange }: Props) {
  const countdown = useMemo(() => {
    if (!scheduledAt) return null
    const diff = new Date(scheduledAt).getTime() - Date.now()
    if (diff <= 0) return 'Time has passed'
    const hours = Math.floor(diff / 3600000)
    const mins = Math.floor((diff % 3600000) / 60000)
    return `Posts in ${hours}h ${mins}m`
  }, [scheduledAt])

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">⏰ Schedule</h3>

      <div className="flex gap-2 mb-4">
        {(['now', 'schedule'] as const).map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
            style={{
              background: mode === m ? 'hsl(250 85% 65% / 0.2)' : 'hsl(224 20% 14%)',
              color: mode === m ? 'hsl(250 85% 65%)' : 'hsl(215 15% 55%)',
              border: mode === m ? '1px solid hsl(250 85% 65% / 0.3)' : '1px solid transparent',
            }}
          >
            {m === 'now' ? '⚡ Send Now' : '📅 Schedule'}
          </button>
        ))}
      </div>

      {mode === 'schedule' && (
        <div className="space-y-3 animate-fade-in">
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => onDateTimeChange(e.target.value)}
            min={new Date().toISOString().slice(0, 16)}
            className="form-input w-full"
          />
          {countdown && (
            <p className="text-xs text-center" style={{ color: 'hsl(250 85% 65%)' }}>{countdown}</p>
          )}
        </div>
      )}
    </div>
  )
}
