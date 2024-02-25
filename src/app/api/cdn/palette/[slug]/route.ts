import { PaletteVisibility } from '@prisma/client'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateCSS } from '~/lib/palette'
import { themesSchema, variableSchema } from '~/schema/palette'
import { db } from '~/server/db'

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const palette = await db.palette.findFirst({ where: { slug: params.slug } })

  if (!palette) {
    return new NextResponse('Palette not found!', { status: 404 })
  }

  if (palette.visibility !== PaletteVisibility.PUBLIC) {
    return new NextResponse('Only public palettes can be accessed using CDN!', { status: 403 })
  }

  const result = z.array(variableSchema).safeParse(palette.variables)
  if (!result.success) {
    return new NextResponse('Palette is not configures properly!', { status: 500 })
  }

  const themeResult = themesSchema.safeParse(palette.themes)
  if (!themeResult.success) {
    return new NextResponse('Theme is not configured properly!')
  }

  const css = generateCSS(result.data, themeResult.data)

  return new NextResponse(css, {
    headers: {
      'Content-Type': 'text/css',
    },
  })
}
