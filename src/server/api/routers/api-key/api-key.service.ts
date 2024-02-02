import { PrismaClient } from '@prisma/client'
import { Session } from 'next-auth'
import { TRPCError } from '@trpc/server'
import { nanoid } from 'nanoid'
import { CreateApiKeyInput } from './api-key.input'
import { MAX_API_KEYS_ALLOWED } from '~/lib/constants'

export async function createApiKey(input: CreateApiKeyInput, prisma: PrismaClient, session: Session) {
  const existingApiKeys = await prisma.apiKey.count({ where: { createdById: session.user.id } })

  /** @TODO Make MAX_API_KEYS_ALLOWED dynamic for a user */
  if (existingApiKeys >= MAX_API_KEYS_ALLOWED) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'You have exceeded the limit of maximum keys allowed!',
    })
  }

  return prisma.apiKey.create({
    data: {
      name: input.name,
      value: nanoid(60),
      createdBy: { connect: { id: session.user.id } },
    },
  })
}

export async function findAllApiKeys(prisma: PrismaClient, session: Session) {
  const apiKeys = await prisma.apiKey.findMany({ where: { createdById: session.user.id } })

  return apiKeys.map((apiKey) => ({
    ...apiKey,
    value: '********',
  }))
}

export async function copyApiKey(id: string, prisma: PrismaClient, session: Session) {
  const apiKey = await prisma.apiKey.findFirst({ where: { id } })
  if (!apiKey) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Api key not found!',
    })
  }

  if (apiKey.createdById !== session.user.id) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You are not allowed to access this api key!',
    })
  }

  return apiKey
}
