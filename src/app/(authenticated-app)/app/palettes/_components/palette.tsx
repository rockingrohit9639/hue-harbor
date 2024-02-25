'use client'

import { Palette as PrismaPalette } from '@prisma/client'
import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { useSession } from 'next-auth/react'
import ErrorMessage from '~/components/ui/error-message'
import UsagePopover from '~/components/usage-popover'
import { getPaletteCdnContent } from '~/lib/utils'
import { themesSchema, variablesSchema } from '~/schema/palette'
import PaletteActions from './palette-actions'
import AddPaletteToFavorite from './add-palette-to-favorite'
dayjs.extend(relativeTime)

type PaletteProps = {
  className?: string
  style?: React.CSSProperties
  palette: PrismaPalette
  blockNavigation?: boolean
}

export default function Palette(props: PaletteProps) {
  const variablesResult = variablesSchema.safeParse(props.palette.variables)
  const themeResult = themesSchema.safeParse(props.palette.themes)

  if (!variablesResult.success) {
    return <ErrorMessage title="Variables are not configured!" />
  }

  if (!themeResult.success) {
    return <ErrorMessage title="Themes are not configured!" />
  }

  const theme = themeResult.data[0]

  const colorVariables = variablesResult.data
    .filter((variable) => variable.theme === theme?.id)
    .filter((variable) => variable.type === 'color')

  if (colorVariables.length === 0 || colorVariables.length > 6) {
    return (
      <PaletteShell {...props}>
        <Link
          className="flex h-72 w-full items-center justify-center rounded-md border text-3xl font-bold"
          style={{ backgroundColor: props.palette.backgroundColor ?? undefined }}
          href={props.blockNavigation ? '#' : `/app/palettes/${props.palette.slug}`}
        >
          {props.palette.name}
        </Link>
      </PaletteShell>
    )
  }

  return (
    <PaletteShell {...props}>
      <Link href={props.blockNavigation ? '#' : `/app/palettes/${props.palette.slug}`}>
        <div className="group relative flex h-72 flex-col overflow-hidden rounded-xl border-[0.5px]">
          <div className="absolute bottom-0 left-0 w-full translate-y-full bg-background px-4 py-2 transition-all ease-in-out group-hover:translate-y-0">
            {props.palette.name}
          </div>

          {colorVariables.map((variable) => (
            <div key={variable.id} className="flex-1" style={{ backgroundColor: String(variable.value) }} />
          ))}
        </div>
      </Link>
    </PaletteShell>
  )
}

function PaletteShell({
  className,
  style,
  children,
  palette,
}: {
  children: React.ReactNode
  palette: PrismaPalette
  className?: string
  style?: React.CSSProperties
}) {
  const { data } = useSession()
  const isAuthenticated = Boolean(data?.user.id)

  return (
    <div className={className} style={style}>
      {isAuthenticated && (
        <div className="flex items-center justify-end py-1">
          <PaletteActions id={palette.id} />
        </div>
      )}

      {children}

      <div className="mt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isAuthenticated && <AddPaletteToFavorite paletteId={palette.id} />}

          <UsagePopover
            cdnContent={getPaletteCdnContent(palette.slug)}
            slug={palette.slug}
            triggerProps={{
              variant: 'link',
            }}
          />
        </div>

        <p className="text-xs text-muted-foreground">{dayjs(palette.createdAt).fromNow()}</p>
      </div>
    </div>
  )
}
