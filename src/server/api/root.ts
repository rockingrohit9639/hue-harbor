import { createTRPCRouter } from '~/server/api/trpc'
import { websitesRouter } from './routers/websites/websites.router'
import { palettesRouter } from './routers/palettes/palettes.router'
import { apiKeyRouter } from './routers/api-key/api-key.router'
import { serveRouter } from './routers/serve/serve.router'
import { dashboardRouter } from './routers/dashboard/dashboard.router'

export const appRouter = createTRPCRouter({
  websites: websitesRouter,
  palettes: palettesRouter,
  apiKeys: apiKeyRouter,
  serve: serveRouter,
  dashboard: dashboardRouter,
})

export type AppRouter = typeof appRouter
