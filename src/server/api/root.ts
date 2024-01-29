import { createTRPCRouter } from '~/server/api/trpc'
import { websitesRouter } from './routers/websites/websites.router'
import { palettesRouter } from './routers/palettes/palettes.router'

export const appRouter = createTRPCRouter({
  websites: websitesRouter,
  palettes: palettesRouter,
})

export type AppRouter = typeof appRouter
