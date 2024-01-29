import { PaletteVisibility, PrismaClient } from '@prisma/client'
import { Session } from 'next-auth'
import { TRPCError } from '@trpc/server'
import { CreatePaletteInput, UpdatePaletteInput } from './palettes.input'
import slugify from '~/lib/slugify'

export async function createPalette(input: CreatePaletteInput, prisma: PrismaClient, session: Session) {
  const existingPalette = await prisma.palette.findFirst({ where: { name: input.name.trim() } })
  if (existingPalette) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Palette with this name already exists, please try a different name!',
    })
  }

  return prisma.palette.create({
    data: {
      name: input.name,
      visibility: input.visibility,
      createdBy: { connect: { id: session.user.id } },
      variables: [],
      backgroundColor: input.backgroundColor,
      slug: slugify(input.name),
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
