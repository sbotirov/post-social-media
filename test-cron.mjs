import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const now = new Date()
const posts = await prisma.post.findMany({
  where: { status: 'SCHEDULED', scheduledAt: { lte: now } }
})
console.log('Found', posts.length, 'scheduled posts for now (', now.toISOString(), ')')
console.log(posts)
