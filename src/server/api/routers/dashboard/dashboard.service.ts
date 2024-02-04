import { PrismaClient } from '@prisma/client'
import { Session } from 'next-auth'

export async function getDashboardStats(prisma: PrismaClient, session: Session) {
  const totalWebsitesCreated = await prisma.website.count({ where: { createdById: session.user.id } })

  const publicPalettes = await prisma.palette.count({ where: { createdById: session.user.id, visibility: 'PUBLIC' } })

  const privatePalettes = await prisma.palette.count({ where: { createdById: session.user.id, visibility: 'PRIVATE' } })

  return {
    totalWebsites: totalWebsitesCreated,
    publicPalettes,
    privatePalettes,
  }
}
