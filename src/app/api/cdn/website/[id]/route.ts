import { PaletteVisibility } from '@prisma/client'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateCSS } from '~/lib/palette'
import { variableSchema } from '~/schema/palette'
import { db } from '~/server/db'

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const website = await db.website.findFirst({ where: { id: params.id }, include: { palette: true } })

  if (!website) {
    return new NextResponse('Website not found!', { status: 404 })
  }

  if (!website.palette) {
    return new NextResponse('There is not palette associated with this website', { status: 400 })
  }

  if (website.palette.visibility !== PaletteVisibility.PUBLIC) {
    return new NextResponse('Only public palettes can be accessed using CDN!', { status: 403 })
  }

  const result = z.array(variableSchema).safeParse(website.palette.variables)
  if (!result.success) {
    return new NextResponse('Palette is not configures properly!', { status: 500 })
  }

  const css = generateCSS(result.data)

  return new NextResponse(css, {
    headers: {
      'Content-Type': 'text/css',
    },
  })
}
