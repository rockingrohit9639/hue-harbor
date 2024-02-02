import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../../trpc'
import { createApiKeyInput } from './api-key.input'
import { copyApiKey, createApiKey, findAllApiKeys } from './api-key.service'

export const apiKeyRouter = createTRPCRouter({
  create: protectedProcedure
    .input(createApiKeyInput)
    .mutation(({ input, ctx }) => createApiKey(input, ctx.db, ctx.session)),
  findAll: protectedProcedure.query(({ ctx }) => findAllApiKeys(ctx.db, ctx.session)),
  copy: protectedProcedure.input(z.string()).query(({ input, ctx }) => copyApiKey(input, ctx.db, ctx.session)),
})
