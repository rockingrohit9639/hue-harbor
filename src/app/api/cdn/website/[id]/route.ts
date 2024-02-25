import { NextResponse } from 'next/server'
import { z } from 'zod'
import { generateCSS } from '~/lib/palette'
import { themesSchema, variableSchema } from '~/schema/palette'
import { db } from '~/server/db'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const origin = new URL(request.url).origin

  const website = await db.website.findFirst({ where: { id: params.id }, include: { palette: true } })

  if (!website) {
    return new NextResponse('Website not found!', { status: 404 })
  }

  if (!website.palette) {
    return new NextResponse('There is not palette associated with this website', { status: 400 })
  }

  if (!website.allowedOrigins.includes(origin)) {
    return new NextResponse('This origin is not allowed to access this website palette!', { status: 401 })
  }

  const result = z.array(variableSchema).safeParse(website.palette.variables)
  if (!result.success) {
    return new NextResponse('Palette is not configures properly!', { status: 500 })
  }

  const themeResult = themesSchema.safeParse(website.palette.themes)
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
