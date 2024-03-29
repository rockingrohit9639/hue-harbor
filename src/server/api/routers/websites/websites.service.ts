import { PrismaClient } from '@prisma/client'
import { Session } from 'next-auth'
import { TRPCError } from '@trpc/server'
import { CreateWebsiteInput, UpdateWebsiteInput } from './websites.input'

export async function findAllWebsites(prisma: PrismaClient, session: Session) {
  return prisma.website.findMany({ where: { createdById: session.user.id } })
}

export async function findWebsiteById(id: string, prisma: PrismaClient, session: Session) {
  const website = await prisma.website.findFirst({ where: { id } })

  if (!website) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Website not found!',
    })
  }

  if (website.createdById !== session.user.id) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You are not allowed to access this website!',
    })
  }

  return website
}

export async function createWebsite(input: CreateWebsiteInput, prisma: PrismaClient, session: Session) {
  return prisma.website.create({ data: { ...input, createdBy: { connect: { id: session.user.id } } } })
}

export async function updateWebsite(input: UpdateWebsiteInput, prisma: PrismaClient, session: Session) {
  const website = await findWebsiteById(input.id, prisma, session)

  return prisma.website.update({
    where: { id: website.id },
    data: {
      name: input.name,
      description: input.description,
      url: input.url,
      paletteId: input.palette,
      allowedOrigins: input.allowedOrigins,
    },
  })
}

export async function deleteWebsite(id: string, prisma: PrismaClient, session: Session) {
  const website = await findWebsiteById(id, prisma, session)

  return prisma.website.delete({
    where: { id: website.id },
  })
}
