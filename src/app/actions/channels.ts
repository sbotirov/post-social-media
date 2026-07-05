'use server'

import { prisma } from '@/lib/db/prisma'
import { getBot } from '@/lib/telegram/bot'
import { logAudit } from '@/lib/security/audit'
import { revalidatePath } from 'next/cache'

export async function getChannels() {
  return prisma.channel.findMany({
    orderBy: { createdAt: 'desc' },
    where: { isActive: true },
  })
}

export async function getAllChannels() {
  return prisma.channel.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function addChannel(chatId: string) {
  if (!chatId.trim()) throw new Error('Chat ID is required')

  // Check if already exists
  const existing = await prisma.channel.findUnique({ where: { chatId } })
  if (existing) throw new Error('Channel already added')

  let title = chatId
  let username: string | null = null
  let description: string | null = null
  let memberCount: number | null = null

  // Try to get channel info from Telegram
  const bot = getBot()
  if (bot) {
    try {
      const chat = await bot.api.getChat(chatId)
      if ('title' in chat) title = chat.title || chatId
      if ('username' in chat) username = chat.username || null
      if ('description' in chat) description = chat.description || null
      try {
        memberCount = await bot.api.getChatMemberCount(chatId)
      } catch { /* ignore */ }
    } catch (error) {
      // If we can't fetch info, just use the chatId as title
      console.warn('Could not fetch channel info:', error)
    }
  }

  const channel = await prisma.channel.create({
    data: { chatId, title, username, description, memberCount },
  })

  await logAudit('channel.add', { chatId, title })
  revalidatePath('/dashboard/channels')
  revalidatePath('/dashboard')

  return channel
}

export async function removeChannel(id: string) {
  const channel = await prisma.channel.delete({ where: { id } })
  await logAudit('channel.remove', { chatId: channel.chatId, title: channel.title })
  revalidatePath('/dashboard/channels')
  revalidatePath('/dashboard')
  return channel
}

export async function toggleChannel(id: string, isActive: boolean) {
  const channel = await prisma.channel.update({
    where: { id },
    data: { isActive },
  })
  await logAudit('channel.toggle', { id, isActive })
  revalidatePath('/dashboard/channels')
  return channel
}
