import { createTRPCRouter, protectedProcedure } from '../../trpc'
import { getDashboardStats } from './dashboard.service'

export const dashboardRouter = createTRPCRouter({
  stats: protectedProcedure.query(({ ctx }) => getDashboardStats(ctx.db, ctx.session)),
})
