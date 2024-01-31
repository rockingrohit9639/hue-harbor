import { PackageOpen } from 'lucide-react'
import { match } from 'ts-pattern'
import { cn } from '~/lib/utils'
import { Variable } from '~/schema/palette'
import { usePaletteStore } from '~/stores'

type BuilderProps = {
  className?: string
  style?: React.CSSProperties
}

export default function Builder({ className, style }: BuilderProps) {
  const variables = usePaletteStore((store) => store.variables)
  const isUpdateAllowed = usePaletteStore((store) => store.isUpdateAllowed)
  const activeVariable = usePaletteStore((store) => store.activeVariable)
  const setActiveVariable = usePaletteStore((store) => store.setActiveVariable)

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
    <div className={cn('flex flex-col gap-y-2 p-4', className, { 'opacity-50': !isUpdateAllowed })} style={style}>
      {variables.map((variable) => (
        <div
          key={variable.id}
          className={cn('flex w-full cursor-pointer rounded-md border bg-card', {
            'border-2 border-gray-500': variable.id === activeVariable?.id,
          })}
          onClick={() => {
            if (isUpdateAllowed) {
              setActiveVariable(variable)
            }
          }}
        >
          <div className="flex-1 px-4 py-2">
            <h1 className="text-lg font-bold">{variable.name}</h1>
            <p className="text-sm text-muted-foreground">{variable.identifier}</p>
          </div>
          <div className="flex items-center justify-center border-l px-4 py-2">
            <VariablePreview variable={variable} />
          </div>
        </div>
      ))}
    </div>
  )
}

function VariablePreview({ variable }: { variable: Variable }) {
  return match(variable)
    .with({ type: 'color' }, ({ value }) => (
      <div className="h-10 w-10 rounded-md bg-white" style={{ backgroundColor: value }} />
    ))
    .with({ type: 'number' }, ({ value }) => <div className="text-4xl font-bold opacity-50">{value}</div>)
    .exhaustive()
}
