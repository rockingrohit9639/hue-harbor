import { PaletteVisibility, PrismaClient, User } from '@prisma/client'
import { TRPCError } from '@trpc/server'
import { match } from 'ts-pattern'
import { variablesSchema } from '~/schema/palette'

/**
 * This will serve the variables in the format as they are stored in our database
 */
export async function serveRawVariables(input: string, prisma: PrismaClient, user: User) {
  const palette = await prisma.palette.findFirst({ where: { slug: input } })
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

  const result = variablesSchema.safeParse(palette.variables)
  if (!result.success) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Palette variables are not configures properly!',
    })
  }

  return result.data
}

/**
 * This will serve the css variables only, and will remove extra fields from our db document
 */
export async function serveCssVariables(input: string, prisma: PrismaClient, user: User) {
  const variables = await serveRawVariables(input, prisma, user)

  return variables.map((variable) => ({
    variableName: variable.identifier,
    value: match(variable)
      .with({ type: 'color' }, ({ value }) => value)
      .with({ type: 'number' }, ({ value, unit }) => `${value}${unit ?? ''}`)
      .exhaustive(),
  }))
}
