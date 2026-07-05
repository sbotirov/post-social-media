import { Bot } from 'grammy'
import { logger } from '@/lib/security/logger'

let botInstance: Bot | null = null

export function getBot(): Bot | null {
  const token = process.env.BOT_TOKEN
  if (!token) {
    logger.warn('BOT_TOKEN is not set')
    return null
  }

  if (!botInstance) {
    botInstance = new Bot(token)
    logger.info('Telegram bot instance created')
  }

  return botInstance
}

/**
 * Reset bot instance (useful when token changes)
 */
export function resetBot(): void {
  botInstance = null
}
