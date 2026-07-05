import { NextResponse } from 'next/server'
import { processScheduledPosts } from '@/lib/scheduler/cron'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    await processScheduledPosts()
    return NextResponse.json({ success: true, time: new Date().toISOString() })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
