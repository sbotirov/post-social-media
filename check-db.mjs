import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
const posts = await prisma.post.findMany()
console.log(posts)
