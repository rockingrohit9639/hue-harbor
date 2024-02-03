import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { match } from 'ts-pattern'
import { validateUserWithApi } from '~/lib/api'
import { variablesSchema } from '~/schema/palette'
import { db } from '~/server/db'

export async function GET(_: Request, { params }: { params: { palette: string } }) {
  const apiKeyHeader = headers().get('Authorization')
  if (!apiKeyHeader) {
    return NextResponse.json({ message: 'Api key not found!' }, { status: 403 })
  }

  const apiKey = apiKeyHeader.split(' ').pop()
  if (!apiKey) {
    return NextResponse.json({ message: 'Api key not found!' }, { status: 403 })
  }

  const user = await validateUserWithApi(apiKey)
  if (!user) {
    return NextResponse.json({ message: 'Invalid api key found!' }, { status: 403 })
  }

  const palette = await db.palette.findFirst({ where: { slug: params.palette } })
  if (!palette) {
    return NextResponse.json({ message: 'Palette not found!' }, { status: 404 })
  }

  const result = variablesSchema.safeParse(palette.variables)
  if (!result.success) {
    return NextResponse.json({ message: 'Variables not configured properly!' }, { status: 400 })
  }

  return NextResponse.json({
    message: 'Palette found!',
    data: result.data.map((variable) => ({
      variableName: variable.identifier,
      value: match(variable)
        .with({ type: 'color' }, ({ value }) => value)
        .with({ type: 'number' }, ({ value, unit }) => `${value}${unit ?? ''}`)
        .exhaustive(),
    })),
  })
}
