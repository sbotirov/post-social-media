'use client'

import { useState, useTransition } from 'react'
import { useEffect } from 'react'
import { getChannels } from '@/app/actions/channels'
import { createPost, sendPostNow } from '@/app/actions/posts'
import type { ChannelInfo, PostType, InlineKeyboard, PollInput, PostOptions, MediaFileInput } from '@/types'
import TextEditor from './TextEditor'
import MediaUploader from './MediaUploader'
import TtsGenerator from './TtsGenerator'
import PollCreator from './PollCreator'
import InlineKeyboardBuilder from './InlineKeyboardBuilder'
import SchedulePicker from './SchedulePicker'
import HashtagInput from './HashtagInput'
import PostOptions_ from './PostOptions'
import PostPreview from './PostPreview'

export default function PostComposer() {
  const [channels, setChannels] = useState<ChannelInfo[]>([])
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [text, setText] = useState('')
  const [parseMode, setParseMode] = useState<'HTML' | 'MarkdownV2'>('HTML')
  const [mediaFiles, setMediaFiles] = useState<MediaFileInput[]>([])
  const [ttsAudioPath, setTtsAudioPath] = useState<string | null>(null)
  const [ttsText, setTtsText] = useState('')
  const [ttsLanguage, setTtsLanguage] = useState('en')
  const [pollEnabled, setPollEnabled] = useState(false)
  const [poll, setPoll] = useState<PollInput>({ question: '', options: ['', ''], isAnonymous: true, type: 'regular', multiAnswer: false })
  const [keyboard, setKeyboard] = useState<InlineKeyboard>([])
  const [hashtags, setHashtags] = useState<string[]>([])
  const [options, setOptions] = useState<PostOptions>({ disableComments: false, disableNotification: false, protectContent: false, pinMessage: false })
  const [scheduleMode, setScheduleMode] = useState<'now' | 'schedule'>('now')
  const [scheduledAt, setScheduledAt] = useState('')
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    getChannels().then((data) => setChannels(data as unknown as ChannelInfo[]))
  }, [])

  function getPostType(): PostType {
    if (pollEnabled) return 'POLL'
    if (ttsAudioPath) return 'TTS'
    if (mediaFiles.length > 1) return 'MEDIA_GROUP'
    if (mediaFiles.length === 1) {
      const t = mediaFiles[0].type
      if (t === 'PHOTO') return 'PHOTO'
      if (t === 'AUDIO') return 'AUDIO'
      if (t === 'VIDEO') return 'VIDEO'
      return 'DOCUMENT'
    }
    return 'TEXT'
  }

  function buildFullText(): string {
    let fullText = text
    if (hashtags.length > 0) {
      fullText += '\n\n' + hashtags.map((h) => `#${h}`).join(' ')
    }
    return fullText
  }

  async function handleSubmit(action: 'send' | 'schedule' | 'draft') {
    if (selectedChannels.length === 0) {
      setStatus({ type: 'error', message: 'Select at least one channel' })
      return
    }

    setStatus(null)
    startTransition(async () => {
      try {
        const postData = {
          type: getPostType(),
          text: buildFullText() || undefined,
          parseMode,
          channelIds: selectedChannels,
          mediaFiles: mediaFiles.length > 0 ? mediaFiles : undefined,
          poll: pollEnabled ? poll : undefined,
          inlineKeyboard: keyboard.length > 0 ? keyboard : undefined,
          hashtags: hashtags.length > 0 ? hashtags : undefined,
          options,
          ttsText: ttsText || undefined,
          ttsLanguage: ttsLanguage || undefined,
          ttsAudioPath: ttsAudioPath || undefined,
          scheduledAt: action === 'schedule' ? new Date(scheduledAt).toISOString() : null,
        }

        const post = await createPost(postData)

        if (action === 'send') {
          const result = await sendPostNow(post.id)
          if (result.success) {
            setStatus({ type: 'success', message: '✅ Post sent successfully!' })
            resetForm()
          } else {
            setStatus({ type: 'error', message: `Some channels failed: ${result.errors.map((e) => e.error).join(', ')}` })
          }
        } else if (action === 'schedule') {
          setStatus({ type: 'success', message: `⏰ Post scheduled for ${new Date(scheduledAt).toLocaleString()}` })
          resetForm()
        } else {
          setStatus({ type: 'success', message: '💾 Draft saved' })
        }
      } catch (e) {
        setStatus({ type: 'error', message: e instanceof Error ? e.message : 'Failed' })
      }
    })
  }

  function resetForm() {
    setText('')
    setMediaFiles([])
    setTtsAudioPath(null)
    setTtsText('')
    setPollEnabled(false)
    setPoll({ question: '', options: ['', ''], isAnonymous: true, type: 'regular', multiAnswer: false })
    setKeyboard([])
    setHashtags([])
    setScheduleMode('now')
    setScheduledAt('')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fade-in">
      {/* Left Column - Form */}
      <div className="lg:col-span-3 space-y-5">
        {/* Channel Selector */}
        <div className="glass rounded-2xl p-5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">📢 Select Channels</h3>
          <div className="flex flex-wrap gap-2">
            {channels.length === 0 ? (
              <p className="text-sm" style={{ color: 'hsl(215 15% 55%)' }}>No channels. Add channels first.</p>
            ) : (
              <>
                <button
                  onClick={() => setSelectedChannels(selectedChannels.length === channels.length ? [] : channels.map((c) => c.id))}
                  className="text-xs px-3 py-1.5 rounded-lg transition-colors"
                  style={{ background: 'hsl(224 20% 14%)', color: 'hsl(215 15% 55%)' }}
                >
                  {selectedChannels.length === channels.length ? 'Deselect All' : 'Select All'}
                </button>
                {channels.map((ch) => {
                  const selected = selectedChannels.includes(ch.id)
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setSelectedChannels(selected ? selectedChannels.filter((id) => id !== ch.id) : [...selectedChannels, ch.id])}
                      className="px-3 py-1.5 rounded-xl text-sm transition-all duration-200"
                      style={{
                        background: selected ? 'hsl(250 85% 65% / 0.2)' : 'hsl(224 20% 14%)',
                        border: selected ? '1px solid hsl(250 85% 65% / 0.5)' : '1px solid transparent',
                        color: selected ? 'hsl(250 85% 65%)' : 'hsl(215 15% 55%)',
                      }}
                    >
                      📢 {ch.title}
                    </button>
                  )
                })}
              </>
            )}
          </div>
        </div>

        <TextEditor value={text} onChange={setText} parseMode={parseMode} onParseModeChange={setParseMode} />
        <MediaUploader files={mediaFiles} onFilesChange={setMediaFiles} />
        <TtsGenerator onAudioGenerated={(path) => setTtsAudioPath(path)} ttsText={ttsText} onTtsTextChange={setTtsText} ttsLanguage={ttsLanguage} onTtsLanguageChange={setTtsLanguage} />
        <HashtagInput hashtags={hashtags} onHashtagsChange={setHashtags} />
        <PostOptions_ options={options} onOptionsChange={setOptions} />
        <PollCreator poll={poll} onPollChange={setPoll} enabled={pollEnabled} onToggle={setPollEnabled} />
        <InlineKeyboardBuilder keyboard={keyboard} onKeyboardChange={setKeyboard} />
        <SchedulePicker mode={scheduleMode} scheduledAt={scheduledAt} onModeChange={setScheduleMode} onDateTimeChange={setScheduledAt} />

        {/* Status Message */}
        {status && (
          <div className={`px-4 py-3 rounded-xl text-sm ${status.type === 'success' ? 'status-sent' : 'status-failed'}`}>
            {status.message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleSubmit('send')}
            disabled={isPending}
            className="flex-1 min-w-[140px] py-3 rounded-xl font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 glow-effect"
            style={{ background: 'linear-gradient(135deg, hsl(250 85% 65%), hsl(175 80% 50%))' }}
          >
            {isPending ? '⏳ Sending...' : '📤 Send Now'}
          </button>
          {scheduleMode === 'schedule' && (
            <button
              onClick={() => handleSubmit('schedule')}
              disabled={isPending || !scheduledAt}
              className="flex-1 min-w-[140px] py-3 rounded-xl font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
              style={{ border: '1px solid hsl(250 85% 65%)', color: 'hsl(250 85% 65%)' }}
            >
              ⏰ Schedule
            </button>
          )}
          <button
            onClick={() => handleSubmit('draft')}
            disabled={isPending}
            className="py-3 px-6 rounded-xl font-semibold transition-all hover:bg-white/5 disabled:opacity-50"
            style={{ color: 'hsl(215 15% 55%)' }}
          >
            💾 Draft
          </button>
        </div>
      </div>

      {/* Right Column - Preview */}
      <div className="lg:col-span-2">
        <div className="lg:sticky lg:top-6">
          <PostPreview
            text={buildFullText()}
            parseMode={parseMode}
            mediaFiles={mediaFiles}
            poll={pollEnabled ? poll : undefined}
            keyboard={keyboard}
            channelName={channels.find((c) => selectedChannels.includes(c.id))?.title || 'Channel'}
            ttsAudioPath={ttsAudioPath}
          />
        </div>
      </div>
    </div>
  )
}
