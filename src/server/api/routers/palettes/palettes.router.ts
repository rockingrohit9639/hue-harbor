import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../../trpc'
import {
  addPaletteToFavorite,
  createPalette,
  deletePalette,
  duplicatePalette,
  findAllPalettes,
  findPaletteById,
  findPaletteBySlug,
  findPublicPalettes,
  getExplorerVariables,
  getPreDeletePaletteStats,
  isPaletteInUserFavorite,
  updatePalette,
} from './palettes.service'
import { createPaletteInput, updatePaletteInput } from './palettes.input'
import { SLUG_REGEX } from '~/lib/constants'

export const palettesRouter = createTRPCRouter({
  findAll: protectedProcedure.query(({ ctx }) => findAllPalettes(ctx.db, ctx.session)),
  findOneById: protectedProcedure
    .input(z.string())
    .query(({ input, ctx }) => findPaletteById(input, ctx.db, ctx.session)),
  findOneBySlug: protectedProcedure
    .input(z.string().regex(SLUG_REGEX))
    .query(({ input, ctx }) => findPaletteBySlug(input, ctx.db, ctx.session)),
  preDeleteStats: protectedProcedure
    .input(z.string())
    .query(({ input, ctx }) => getPreDeletePaletteStats(input, ctx.db, ctx.session)),
  create: protectedProcedure
    .input(createPaletteInput)
    .mutation(({ input, ctx }) => createPalette(input, ctx.db, ctx.session)),
  update: protectedProcedure
    .input(updatePaletteInput)
    .mutation(({ input, ctx }) => updatePalette(input, ctx.db, ctx.session)),
  delete: protectedProcedure.input(z.string()).mutation(({ input, ctx }) => deletePalette(input, ctx.db, ctx.session)),
  public: publicProcedure.query(({ ctx }) => findPublicPalettes(ctx.db)),
  duplicate: protectedProcedure
    .input(z.string())
    .mutation(({ input, ctx }) => duplicatePalette(input, ctx.db, ctx.session)),
  explorer: protectedProcedure.query(({ ctx }) => getExplorerVariables(ctx.db, ctx.session)),
  addToFavorite: protectedProcedure
    .input(z.string())
    .mutation(({ input, ctx }) => addPaletteToFavorite(input, ctx.db, ctx.session)),
  isPaletteInUserFavorite: protectedProcedure
    .input(z.string())
    .query(({ input, ctx }) => isPaletteInUserFavorite(input, ctx.db, ctx.session)),
})
