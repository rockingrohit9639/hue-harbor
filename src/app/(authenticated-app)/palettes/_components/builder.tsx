import { PackageOpen } from 'lucide-react'
import { cn } from '~/lib/utils'
import { usePaletteStore } from '~/stores'

type BuilderProps = {
  className?: string
  style?: React.CSSProperties
}

export default function Builder({ className, style }: BuilderProps) {
  const variables = usePaletteStore((store) => store.variables)

  if (!variables.length) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-2">
        <PackageOpen />

        <h1 className="text-lg">No variables created</h1>
        <p className="text-center text-sm text-muted-foreground">
          You have not added any variables to your palette yet, start by clicking on Add Variable button
        </p>
      </div>
    )
  }

  return (
    <div className={cn('p-4', className)} style={style}>
      {variables.map((variable) => (
        <div key={variable.id}>{variable.id}</div>
      ))}
    </div>
  )
}
