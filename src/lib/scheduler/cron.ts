import { prisma } from '@/lib/db/prisma'
import { sendPostToChannels } from '@/lib/telegram/sender'
import { logger } from '@/lib/security/logger'

let schedulerInterval: ReturnType<typeof setInterval> | null = null

export async function processScheduledPosts() {
  try {
    const now = new Date()

    const posts = await prisma.post.findMany({
      where: {
        status: 'SCHEDULED',
        scheduledAt: { lte: now },
      },
      include: {
        channels: { include: { channel: true } },
        mediaFiles: { orderBy: { sortOrder: 'asc' } },
        poll: true,
      },
    })

    if (posts.length === 0) return

    logger.info(`Processing ${posts.length} scheduled post(s)`)

    for (const post of posts) {
      try {
        // Update status to SENDING
        await prisma.post.update({
          where: { id: post.id },
          data: { status: 'SENDING' },
        })

        const channelChatIds = post.channels.map((pc) => pc.channel.chatId)

        const results = await sendPostToChannels(post, channelChatIds)

        const allSuccess = Array.from(results.values()).every((r) => r.success)
        const messageIds = Array.from(results.entries())
          .filter(([, r]) => r.success)
          .map(([chatId, r]) => ({ chatId, messageId: r.messageId }))

        const errors = Array.from(results.entries())
          .filter(([, r]) => !r.success)
          .map(([chatId, r]) => ({ chatId, error: r.error }))

        await prisma.post.update({
          where: { id: post.id },
          data: {
            status: allSuccess ? 'SENT' : 'FAILED',
            sentAt: allSuccess ? new Date() : null,
            telegramMsgIds: JSON.stringify(messageIds),
            errorMessage: errors.length > 0 ? JSON.stringify(errors) : null,
          },
        })

        logger.info(`Scheduled post ${post.id} processed`, {
          success: allSuccess,
          channels: channelChatIds.length,
        })
      } catch (error) {
        const errMsg = error instanceof Error ? error.message : 'Unknown error'
        await prisma.post.update({
          where: { id: post.id },
          data: { status: 'FAILED', errorMessage: errMsg },
        })
        logger.error(`Failed to process scheduled post ${post.id}`, { error: errMsg })
      }
    }
  } catch (error) {
    logger.error('Scheduler error', { error })
  }
}

export function startScheduler() {
  if (schedulerInterval) return

  logger.info('Post scheduler started (60s interval)')
  schedulerInterval = setInterval(processScheduledPosts, 60_000)

  // Run immediately on start
  processScheduledPosts()
}

export function stopScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval)
    schedulerInterval = null
    logger.info('Post scheduler stopped')
  }
}
