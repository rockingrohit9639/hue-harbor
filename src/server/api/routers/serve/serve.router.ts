import { z } from 'zod'
import { apiKeyProtectedProcedure, createTRPCRouter } from '../../trpc'
import { serveCssVariables, serveRawVariables } from './serve.service'

export const serveRouter = createTRPCRouter({
  raw: apiKeyProtectedProcedure
    .input(z.string())
    .query(({ input, ctx }) => serveRawVariables(input, ctx.db, ctx.session.user)),
  css: apiKeyProtectedProcedure
    .input(z.string())
    .query(({ input, ctx }) => serveCssVariables(input, ctx.db, ctx.session.user)),
})
