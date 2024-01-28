import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../../trpc'
import { createWebsiteInput, updateWebsiteInput } from './websites.input'
import { createWebsite, deleteWebsite, findAllWebsites, findWebsiteById, updateWebsite } from './websites.service'

export const websitesRouter = createTRPCRouter({
  findAll: protectedProcedure.query(({ ctx }) => findAllWebsites(ctx.db, ctx.session)),
  findById: protectedProcedure.input(z.string()).query(({ input, ctx }) => findWebsiteById(input, ctx.db)),
  create: protectedProcedure
    .input(createWebsiteInput)
    .mutation(({ input, ctx }) => createWebsite(input, ctx.db, ctx.session)),
  update: protectedProcedure
    .input(updateWebsiteInput)
    .mutation(({ input, ctx }) => updateWebsite(input, ctx.db, ctx.session)),
  delete: protectedProcedure.input(z.string()).mutation(({ input, ctx }) => deleteWebsite(input, ctx.db, ctx.session)),
})
