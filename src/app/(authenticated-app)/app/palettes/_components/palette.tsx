import { Palette as PrismaPalette } from '@prisma/client'
import Link from 'next/link'
import ErrorMessage from '~/components/ui/error-message'
import UsagePopover from '~/components/usage-popover'
import { cn, getPaletteCdnContent } from '~/lib/utils'
import { variablesSchema } from '~/schema/palette'

type PaletteProps = {
  className?: string
  style?: React.CSSProperties
  palette: PrismaPalette
  blockNavigation?: boolean
}

export default function Palette({ className, style, palette, blockNavigation }: PaletteProps) {
  const variablesResult = variablesSchema.safeParse(palette.variables)

  if (!variablesResult.success) {
    return <ErrorMessage title="Variables are not configured!" />
  }

  const colorVariables = variablesResult.data.filter((variable) => variable.type === 'color')

  if (colorVariables.length === 0 || colorVariables.length > 6) {
    return (
      <Link
        className={cn('flex h-40 w-full items-center justify-center rounded-md border text-3xl font-bold', className)}
        style={{ ...style, backgroundColor: palette.backgroundColor ?? undefined }}
        href={`/app/palettes/${palette.slug}`}
      >
        {palette.name}
      </Link>
    )
  }

  return (
    <Link
      className={cn('relative flex h-52 w-full flex-col overflow-hidden rounded-md border', className)}
      style={style}
      href={blockNavigation ? '#' : `/app/palettes/${palette.slug}`}
    >
      <div className="flex items-center justify-between gap-2 px-4 py-2">
        <h1 className="text-lg font-bold">{palette.name}</h1>

        <UsagePopover slug={palette.slug} cdnContent={getPaletteCdnContent(palette.slug)} />
      </div>

      {colorVariables.map((variable) => (
        <div
          key={variable.id}
          className="h-full flex-1 transition-all hover:flex-[2]"
          style={{ backgroundColor: String(variable.value) }}
        />
      ))}
    </Link>
  )
}
