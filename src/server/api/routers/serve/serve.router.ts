import { apiKeyProtectedProcedure, createTRPCRouter } from '../../trpc'
import { serveRawInput } from './serve.input'
import { serveRawVariables } from './serve.service'

export const serveRouter = createTRPCRouter({
  raw: apiKeyProtectedProcedure
    .input(serveRawInput)
    .query(({ input, ctx }) => serveRawVariables(input, ctx.db, ctx.session.user)),
})
