import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import { ZodError } from 'zod'

import { getServerAuthSession } from '~/server/auth'
import { db } from '~/server/db'

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await getServerAuthSession()

  return {
    db,
    session,
    ...opts,
  }
}

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    }
  },
})

export const createTRPCRouter = t.router

export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  })
})

/** This procedure is used to authenticate a user using API Key */
export const apiKeyProtectedProcedure = t.procedure.use(async ({ ctx, next }) => {
  const apiKeyHeader = ctx.headers.get('Authorization')

  if (!apiKeyHeader) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not authorized to access this resource!' })
  }

  const apiKey = apiKeyHeader.split(' ').pop()
  if (!apiKey) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not authorized to access this resource!' })
  }

  const apiKeyFound = await db.apiKey.findFirst({ where: { value: apiKey }, include: { createdBy: true } })
  if (!apiKeyFound) {
    throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid API key found!' })
  }

  await db.apiKey.update({
    where: { id: apiKeyFound.id },
    data: {
      usage: { increment: 1 },
    },
  })

  return next({
    ctx: {
      session: { user: apiKeyFound.createdBy },
    },
  })
})
