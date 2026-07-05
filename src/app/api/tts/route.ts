import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { generateTtsAudio } from '@/lib/tts/google-tts'

export async function POST(request: NextRequest) {
  try {
    const { text, language } = await request.json()

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 })
    }

    if (!language) {
      return NextResponse.json({ error: 'Language is required' }, { status: 400 })
    }

    const filePath = await generateTtsAudio(text, language)

    return NextResponse.json({ url: filePath, filePath })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : 'TTS generation failed'
    return NextResponse.json({ error: errMsg }, { status: 500 })
  }
}
