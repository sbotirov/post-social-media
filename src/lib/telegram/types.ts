import type { InlineKeyboard } from '@/types'

export interface SendOptions {
  parseMode?: 'HTML' | 'MarkdownV2'
  replyMarkup?: InlineKeyboard
  disableNotification?: boolean
  protectContent?: boolean
}

export interface AudioOptions extends SendOptions {
  title?: string
  performer?: string
  duration?: number
}

export interface PollConfig {
  isAnonymous?: boolean
  type?: 'regular' | 'quiz'
  correctOptionId?: number
  explanation?: string
  allowsMultipleAnswers?: boolean
}
