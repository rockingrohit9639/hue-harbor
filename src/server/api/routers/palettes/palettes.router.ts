import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '../../trpc'
import { createPalette, deletePalette, findAllPalettes, findPaletteById, updatePalette } from './palettes.service'
import { createPaletteInput, updatePaletteInput } from './palettes.input'

export const palettesRouter = createTRPCRouter({
  findAll: protectedProcedure.query(({ ctx }) => findAllPalettes(ctx.db, ctx.session)),
  findOneById: protectedProcedure
    .input(z.string())
    .query(({ input, ctx }) => findPaletteById(input, ctx.db, ctx.session)),
  create: protectedProcedure
    .input(createPaletteInput)
    .mutation(({ input, ctx }) => createPalette(input, ctx.db, ctx.session)),
  update: protectedProcedure
    .input(updatePaletteInput)
    .mutation(({ input, ctx }) => updatePalette(input, ctx.db, ctx.session)),
  delete: protectedProcedure.input(z.string()).mutation(({ input, ctx }) => deletePalette(input, ctx.db, ctx.session)),
})
