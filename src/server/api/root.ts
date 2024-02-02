import { createTRPCRouter } from '~/server/api/trpc'
import { websitesRouter } from './routers/websites/websites.router'
import { palettesRouter } from './routers/palettes/palettes.router'
import { apiKeyRouter } from './routers/api-key/api-key.router'

export const appRouter = createTRPCRouter({
  websites: websitesRouter,
  palettes: palettesRouter,
  apiKeys: apiKeyRouter,
})

export type AppRouter = typeof appRouter
