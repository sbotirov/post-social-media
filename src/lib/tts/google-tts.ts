import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { logger } from '@/lib/security/logger'

export const SUPPORTED_LANGUAGES: Record<string, { name: string; flag: string }> = {
  ru: { name: 'Русский', flag: '🇷🇺' },
  en: { name: 'English', flag: '🇬🇧' },
  ko: { name: '한국어', flag: '🇰🇷' },
  tr: { name: 'Türkçe', flag: '🇹🇷' },
  ar: { name: 'العربية', flag: '🇸🇦' },
  de: { name: 'Deutsch', flag: '🇩🇪' },
  ja: { name: '日本語', flag: '🇯🇵' },
  fr: { name: 'Français', flag: '🇫🇷' },
  zh: { name: '中文', flag: '🇨🇳' },
  es: { name: 'Español', flag: '🇪🇸' },
  pt: { name: 'Português', flag: '🇧🇷' },
  hi: { name: 'हिन्दी', flag: '🇮🇳' },
  it: { name: 'Italiano', flag: '🇮🇹' },
}

const TTS_BASE_URL = 'https://translate.google.com/translate_tts'
const MAX_CHUNK_LENGTH = 190

/**
 * Split text into chunks at sentence/word boundaries, each <= maxLen chars.
 */
function chunkText(text: string, maxLen: number = MAX_CHUNK_LENGTH): string[] {
  if (text.length <= maxLen) return [text]

  const chunks: string[] = []
  let remaining = text

  while (remaining.length > 0) {
    if (remaining.length <= maxLen) {
      chunks.push(remaining)
      break
    }

    let splitIndex = maxLen

    // Try to split at sentence boundary
    const sentenceEnd = remaining.lastIndexOf('.', maxLen)
    const questionEnd = remaining.lastIndexOf('?', maxLen)
    const exclamEnd = remaining.lastIndexOf('!', maxLen)
    const bestSentence = Math.max(sentenceEnd, questionEnd, exclamEnd)

    if (bestSentence > maxLen * 0.4) {
      splitIndex = bestSentence + 1
    } else {
      // Fall back to word boundary
      const spaceIndex = remaining.lastIndexOf(' ', maxLen)
      if (spaceIndex > maxLen * 0.3) {
        splitIndex = spaceIndex
      }
    }

    chunks.push(remaining.substring(0, splitIndex).trim())
    remaining = remaining.substring(splitIndex).trim()
  }

  return chunks
}

/**
 * Build TTS URL for a text chunk.
 */
function buildTtsUrl(text: string, language: string): string {
  const params = new URLSearchParams({
    ie: 'UTF-8',
    tl: language,
    client: 'tw-ob',
    q: text,
  })
  return `${TTS_BASE_URL}?${params.toString()}`
}

/**
 * Generate TTS audio from text using Google Translate TTS API.
 * Returns the relative path to the saved MP3 file.
 */
export async function generateTtsAudio(
  text: string,
  language: string
): Promise<string> {
  if (!text.trim()) throw new Error('Text is empty')
  if (!SUPPORTED_LANGUAGES[language]) throw new Error(`Unsupported language: ${language}`)

  const ttsDir = path.join(process.cwd(), 'public', 'uploads', 'tts')
  if (!fs.existsSync(ttsDir)) {
    fs.mkdirSync(ttsDir, { recursive: true })
  }

  const chunks = chunkText(text)
  const audioBuffers: Buffer[] = []

  for (const chunk of chunks) {
    const url = buildTtsUrl(chunk, language)

    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          Referer: 'https://translate.google.com/',
        },
      })

      if (!response.ok) {
        throw new Error(`TTS API returned ${response.status}`)
      }

      const buffer = Buffer.from(await response.arrayBuffer())
      audioBuffers.push(buffer)
    } catch (error) {
      logger.error('TTS chunk fetch failed', { chunk: chunk.substring(0, 50), error })
      throw error
    }

    // Small delay between chunks to avoid rate limiting
    if (chunks.length > 1) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  // Concatenate all audio buffers
  const combined = Buffer.concat(audioBuffers)
  const fileName = `tts_${crypto.randomUUID()}.mp3`
  const filePath = path.join(ttsDir, fileName)

  fs.writeFileSync(filePath, combined)

  const relativePath = `/uploads/tts/${fileName}`
  logger.info('TTS audio generated', { language, textLength: text.length, chunks: chunks.length, path: relativePath })

  return relativePath
}
