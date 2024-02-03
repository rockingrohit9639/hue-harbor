import { PaletteVisibility, PrismaClient, User } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { ServeRawInput } from './serve.input'

/**
 * This will serve the variables in the format as they are stored in our database
 */
export async function serveRawVariables(input: ServeRawInput, prisma: PrismaClient, user: User) {
  const palette = await prisma.palette.findFirst({ where: { slug: input.paletteSlug } })
  if (!palette) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Palette not found!',
    })
  }

  if (palette.visibility === PaletteVisibility.PRIVATE && palette.createdById !== user.id) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You are not allowed to access this palette!',
    })
  }

  return palette.variables
}
