import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

let prisma: PrismaClient

if (process.env.TURSO_DATABASE_URL && process.env.NODE_ENV === 'production') {
  const libsql = createClient({
    url: process.env.TURSO_DATABASE_URL!,
  })
  const adapter = new PrismaLibSql(libsql)
  prisma = new PrismaClient({ adapter })
} else {
  prisma = globalForPrisma.prisma || new PrismaClient()
  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
}

export { prisma }