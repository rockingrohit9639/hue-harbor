import { PaletteVisibility, PrismaClient } from '@prisma/client'
import { Session } from 'next-auth'
import { TRPCError } from '@trpc/server'
import { CreatePaletteInput, UpdatePaletteInput } from './palettes.input'
import { GetVariableByType, variablesSchema } from '~/schema/palette'

export async function createPalette(input: CreatePaletteInput, prisma: PrismaClient, session: Session) {
  const existingPalette = await prisma.palette.findFirst({ where: { slug: input.slug } })
  if (existingPalette) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Palette with this slug already exists, please try a different slug!',
    })
  }

  return prisma.palette.create({
    data: {
      name: input.name,
      visibility: input.visibility,
      createdBy: { connect: { id: session.user.id } },
      variables: [],
      backgroundColor: input.backgroundColor,
      slug: input.slug,
    },
  })
}

export async function findAllPalettes(prisma: PrismaClient, session: Session) {
  return prisma.palette.findMany({ where: { createdById: session.user.id } })
}

export async function findPaletteById(id: string, prisma: PrismaClient, session: Session) {
  const palette = await prisma.palette.findFirst({ where: { id } })

  if (!palette) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Palette not found!',
    })
  }

  if (palette.visibility === PaletteVisibility.PRIVATE && palette.createdById !== session.user.id) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You are not allowed to access this palette!',
    })
  }

  return palette
}

export async function updatePalette(input: UpdatePaletteInput, prisma: PrismaClient, session: Session) {
  const palette = await findPaletteById(input.id, prisma, session)

  if (palette.createdById !== session.user.id) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You are not allowed to update this palette!',
    })
  }

  return prisma.palette.update({
    where: { id: palette.id },
    data: {
      name: input.name,
      visibility: input.visibility,
      variables: input.variables,
      backgroundColor: input.backgroundColor,
    },
  })
}

export async function deletePalette(id: string, prisma: PrismaClient, session: Session) {
  const palette = await findPaletteById(id, prisma, session)

  if (palette.createdById !== session.user.id) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You are not allowed to delete this palette!',
    })
  }

  return prisma.palette.delete({
    where: { id: palette.id },
  })
}

export async function findPaletteBySlug(slug: string, prisma: PrismaClient, session: Session) {
  const palette = await prisma.palette.findFirst({ where: { slug } })

  if (!palette) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Palette not found!',
    })
  }

  if (palette.visibility === PaletteVisibility.PRIVATE && palette.createdById !== session.user.id) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You are not allowed to access this palette!',
    })
  }

  return palette
}

export async function getPreDeletePaletteStats(id: string, prisma: PrismaClient, session: Session) {
  const palette = await findPaletteById(id, prisma, session)

  if (palette.createdById !== session.user.id) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You are not allowed to view these stats!',
    })
  }

  const websitesUsingPalettes = await prisma.website.count({ where: { paletteId: id } })

  return {
    websites: websitesUsingPalettes,
  }
}

export async function findPublicPalettes(prisma: PrismaClient) {
  return prisma.palette.findMany({ where: { visibility: 'PUBLIC' } })
}

export async function duplicatePalette(id: string, prisma: PrismaClient, session: Session) {
  const palette = await findPaletteById(id, prisma, session)

  if (palette.createdById === session.user.id) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'You cannot duplicate your own palette!',
    })
  }

  const variables = variablesSchema.safeParse(palette.variables)
  if (!variables.success) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Palette is not properly configured yet!',
    })
  }

  return prisma.palette.create({
    data: {
      name: `Copy ${palette.name}`,
      slug: await generateNextSlug(palette.slug, prisma),
      backgroundColor: palette.backgroundColor,
      createdById: session.user.id,
      variables: variables.data,
    },
  })
}

async function generateNextSlug(prevSlug: string, prisma: PrismaClient): Promise<string> {
  const splittedSlug = prevSlug.split('-')
  const slugWithoutNumber = Number.isNaN(Number(splittedSlug.at(-1))) ? prevSlug : splittedSlug.at(-1)
  let startCount = Number.isNaN(Number(splittedSlug.at(-1))) ? 1 : Number(splittedSlug.at(-1))

  /**
   * Keep increasing the count until you find a palette which does not exists with the new slug
   * I know this may not be the best approach, but let's face it, I will update it later
   */
  while (true) {
    const paletteWithSlug = await prisma.palette.count({ where: { slug: `${slugWithoutNumber}-${startCount}` } })
    if (paletteWithSlug > 0) {
      startCount += 1
    } else {
      break
    }
  }

  return `${slugWithoutNumber}-${startCount}`
}

export async function getExplorerVariables(prisma: PrismaClient, session: Session) {
  const allowedPalettes = await prisma.palette.findMany({
    where: { OR: [{ visibility: 'PUBLIC' }, { createdById: session.user.id }] },
  })

  const userPalettes = allowedPalettes.filter((palette) => palette.createdById === session.user.id)
  const communityPalettes = allowedPalettes.filter((palette) => palette.createdById !== session.user.id)

  const userVariables = userPalettes
    .flatMap((palette) => {
      const variablesResult = variablesSchema.safeParse(palette.variables)
      if (!variablesResult.success || variablesResult.data.length === 0) {
        return null
      }

      return variablesResult.data
    })
    .filter(Boolean) as GetVariableByType<'color'>[]

  const communityVariables = communityPalettes
    .flatMap((palette) => {
      const variablesResult = variablesSchema.safeParse(palette.variables)
      if (!variablesResult.success || variablesResult.data.length === 0) {
        return null
      }

      return variablesResult.data
    })
    .filter(Boolean) as GetVariableByType<'color'>[]

  return {
    user: userVariables.filter((variable) => variable.type === 'color'),
    community: communityVariables.filter((variable) => variable.type === 'color'),
  }
}

export async function addPaletteToFavorite(paletteId: string, prisma: PrismaClient, session: Session) {
  const favoriteList = await getOrCreateFavoriteList(prisma, session.user.id)
  const isPaletteInFavorite = await isPaletteInUserFavorite(paletteId, prisma, session)

  if (isPaletteInFavorite) {
    return prisma.favoriteList.update({
      where: { id: favoriteList.id },
      data: { palettes: { disconnect: { id: paletteId } } },
    })
  }

  return prisma.favoriteList.update({
    where: { id: favoriteList.id },
    data: {
      palettes: { connect: { id: paletteId } },
    },
  })
}

export async function getOrCreateFavoriteList(prisma: PrismaClient, userId: string) {
  const listForUser = await prisma.favoriteList.findFirst({ where: { userId }, include: { palettes: true } })

  if (!listForUser) {
    return prisma.favoriteList.create({ data: { user: { connect: { id: userId } } }, include: { palettes: true } })
  }

  return listForUser
}

export async function isPaletteInUserFavorite(paletteId: string, prisma: PrismaClient, session: Session) {
  const favoriteList = await getOrCreateFavoriteList(prisma, session.user.id)

  if (favoriteList.paletteIds.includes(paletteId)) {
    return true
  }

  return false
}
