import { Palette as PrismaPalette } from '@prisma/client'
import Link from 'next/link'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import ErrorMessage from '~/components/ui/error-message'
import UsagePopover from '~/components/usage-popover'
import { cn, getPaletteCdnContent } from '~/lib/utils'
import { variablesSchema } from '~/schema/palette'
dayjs.extend(relativeTime)

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
    <Link className={cn(className)} style={style} href={blockNavigation ? '#' : `/app/palettes/${palette.slug}`}>
      <div className="group relative flex h-72 flex-col overflow-hidden rounded-xl border-[0.5px]">
        <div className="absolute bottom-0 left-0 w-full translate-y-full bg-background px-4 py-2 transition-all ease-in-out group-hover:translate-y-0">
          {palette.name}
        </div>

        {colorVariables.map((variable) => (
          <div key={variable.id} className="flex-1" style={{ backgroundColor: String(variable.value) }} />
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between">
        <UsagePopover cdnContent={getPaletteCdnContent(palette.slug)} slug={palette.slug} />

        <p className="text-xs text-muted-foreground">{dayjs(palette.createdAt).fromNow()}</p>
      </div>
    </Link>
  )
}
