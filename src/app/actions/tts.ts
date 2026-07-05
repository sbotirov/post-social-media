'use server'

import { generateTtsAudio, SUPPORTED_LANGUAGES } from '@/lib/tts/google-tts'

export async function generateTts(text: string, language: string) {
  if (!text.trim()) throw new Error('Text is required')

  const filePath = await generateTtsAudio(text, language)
  return { filePath }
}

export async function getSupportedLanguages() {
  return SUPPORTED_LANGUAGES
}
