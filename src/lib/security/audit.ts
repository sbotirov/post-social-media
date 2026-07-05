import { prisma } from '@/lib/db/prisma'
import { logger } from './logger'

export async function logAudit(
  action: string,
  details?: Record<string, unknown>,
  ip?: string,
  userAgent?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        details: details ? JSON.stringify(details) : null,
        ip: ip || null,
        userAgent: userAgent || null,
      },
    })
    logger.info(`Audit: ${action}`, { details, ip })
  } catch (error) {
    logger.error('Failed to write audit log', { error, action })
  }
}

export async function getAuditLogs(page = 1, limit = 50) {
  const skip = (page - 1) * limit
  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.auditLog.count(),
  ])

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}
