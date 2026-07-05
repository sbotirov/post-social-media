import { PrismaLibSql } from '@prisma/adapter-libsql'
const a = new PrismaLibSql({ url: 'file:./dev.db' })
