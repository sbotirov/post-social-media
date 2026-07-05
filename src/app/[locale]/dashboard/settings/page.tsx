'use client'

import { useState, useTransition } from 'react'
import { updatePassword } from '@/app/actions/settings'
import { useTranslations } from 'next-intl'

export default function SettingsPage() {
  const [tokenVisible, setTokenVisible] = useState(false)
  
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const t = useTranslations('Settings')

  function handleUpdatePassword(e: React.FormEvent) {
    e.preventDefault()
    if (!currentPassword || !newPassword) return

    setStatus(null)
    startTransition(async () => {
      try {
        await updatePassword(currentPassword, newPassword)
        setStatus({ type: 'success', message: t('PasswordUpdated') })
        setCurrentPassword('')
        setNewPassword('')
      } catch (err) {
        setStatus({ type: 'error', message: err instanceof Error ? err.message : t('FailedToUpdate') })
      }
    })
  }

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-bold">{t('Title')}</h2>
        <p className="text-sm" style={{ color: 'hsl(215 15% 55%)' }}>{t('Description')}</p>
      </div>

      <div className="grid gap-6">
        {/* Bot Configuration */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">{t('BotConfig')}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1.5" style={{ color: 'hsl(215 15% 55%)' }}>{t('BotToken')}</label>
              <div className="flex gap-2">
                <input
                  type={tokenVisible ? 'text' : 'password'}
                  value="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                  readOnly
                  className="form-input flex-1 opacity-70 cursor-not-allowed"
                />
                <button
                  onClick={() => setTokenVisible(!tokenVisible)}
                  className="px-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  {tokenVisible ? t('Hide') : t('Show')}
                </button>
              </div>
              <p className="text-xs mt-2" style={{ color: 'hsl(215 15% 55%)' }}>
                {t('BotTokenHelp')}
              </p>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">{t('Security')}</h3>
          <form className="space-y-4 max-w-md" onSubmit={handleUpdatePassword}>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: 'hsl(215 15% 55%)' }}>{t('CurrentPassword')}</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder={t('CurrentPasswordPlaceholder')} 
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm mb-1.5" style={{ color: 'hsl(215 15% 55%)' }}>{t('NewPassword')}</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder={t('NewPasswordPlaceholder')} 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
              />
            </div>
            
            {status && (
              <p className={`text-sm ${status.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {status.message}
              </p>
            )}

            <button
              disabled={isPending || !currentPassword || !newPassword}
              className="px-6 py-2.5 rounded-xl font-medium text-white transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              style={{ background: 'hsl(250 85% 65%)' }}
            >
              {isPending ? t('Updating') : t('UpdatePasswordBtn')}
            </button>
          </form>
        </div>

        {/* System Info */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">{t('SystemInfo')}</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl" style={{ background: 'hsl(224 20% 14%)' }}>
              <p className="text-xs mb-1" style={{ color: 'hsl(215 15% 55%)' }}>{t('Version')}</p>
              <p className="font-semibold">v1.0.0</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'hsl(224 20% 14%)' }}>
              <p className="text-xs mb-1" style={{ color: 'hsl(215 15% 55%)' }}>{t('Environment')}</p>
              <p className="font-semibold">{t('Production')}</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'hsl(224 20% 14%)' }}>
              <p className="text-xs mb-1" style={{ color: 'hsl(215 15% 55%)' }}>{t('Database')}</p>
              <p className="font-semibold text-green-400">{t('Connected')}</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'hsl(224 20% 14%)' }}>
              <p className="text-xs mb-1" style={{ color: 'hsl(215 15% 55%)' }}>{t('Storage')}</p>
              <p className="font-semibold">{t('Local')}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

