// Post types matching Prisma schema
export type PostType = 'TEXT' | 'PHOTO' | 'AUDIO' | 'VIDEO' | 'DOCUMENT' | 'MEDIA_GROUP' | 'POLL' | 'TTS'
export type PostStatus = 'DRAFT' | 'SCHEDULED' | 'SENDING' | 'SENT' | 'FAILED'
export type MediaType = 'PHOTO' | 'AUDIO' | 'VIDEO' | 'DOCUMENT'

export interface ChannelInfo {
  id: string
  chatId: string
  title: string
  description?: string | null
  username?: string | null
  memberCount?: number | null
  photoUrl?: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface InlineButton {
  text: string
  url: string
}

export type InlineKeyboardRow = InlineButton[]
export type InlineKeyboard = InlineKeyboardRow[]

export interface PollInput {
  question: string
  options: string[]
  isAnonymous: boolean
  type: 'regular' | 'quiz'
  correctOption?: number
  explanation?: string
  multiAnswer: boolean
}

export interface PostOptions {
  disableComments: boolean
  disableNotification: boolean
  protectContent: boolean
  pinMessage: boolean
}

export interface TtsRequest {
  text: string
  language: string
  title?: string
}

export interface MediaFileInput {
  type: MediaType
  filePath: string
  fileName: string
  fileSize: number
  mimeType: string
  caption?: string
  sortOrder: number
}

export interface CreatePostInput {
  type: PostType
  text?: string
  parseMode: 'HTML' | 'MarkdownV2'
  channelIds: string[]
  mediaFiles?: MediaFileInput[]
  poll?: PollInput
  inlineKeyboard?: InlineKeyboard
  hashtags?: string[]
  options: PostOptions
  ttsText?: string
  ttsLanguage?: string
  ttsAudioPath?: string
  scheduledAt?: string | null
  draftId?: string
}

export interface SendResult {
  success: boolean
  messageId?: number
  error?: string
}

export interface DashboardStats {
  totalChannels: number
  postsToday: number
  scheduledPosts: number
  totalPosts: number
}

export interface PostFilter {
  search?: string
  channelId?: string
  type?: PostType
  status?: PostStatus
  dateFrom?: string
  dateTo?: string
}

export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}
