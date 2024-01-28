import { createTRPCRouter } from '~/server/api/trpc'
import { websitesRouter } from './routers/websites/websites.router'

export const appRouter = createTRPCRouter({
  websites: websitesRouter,
})

export type AppRouter = typeof appRouter
