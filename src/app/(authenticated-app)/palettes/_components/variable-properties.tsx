'use client'

import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { cn } from '~/lib/utils'
import { usePaletteStore } from '~/stores'

type VariablePropertiesProps = {
  className?: string
  style?: React.CSSProperties
}

export default function VariableProperties({ className, style }: VariablePropertiesProps) {
  const isUpdateAllowed = usePaletteStore((store) => store.isUpdateAllowed)
  const activeVariable = usePaletteStore((store) => store.activeVariable)
  const updateVariable = usePaletteStore((store) => store.updateVariable)

  if (!isUpdateAllowed) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-center text-sm text-muted-foreground">
          Click on Update Palette to start editing your palette.
        </p>
      </div>
    )
  }

  if (!activeVariable) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <p className="text-center text-sm text-muted-foreground">Click on a variable to start editing its properties</p>
      </div>
    )
  }

  return (
    <div className={cn('grid gap-4 p-4', className)} style={style} key={activeVariable.id}>
      <div>
        <Label>Name</Label>
        <Input
          className="mt-1"
          defaultValue={activeVariable.name}
          onBlur={(e) => {
            updateVariable(activeVariable.id, {
              ...activeVariable,
              name: e.currentTarget.value,
            })
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateVariable(activeVariable.id, {
                ...activeVariable,
                name: e.currentTarget.value,
              })
            }
          }}
        />
      </div>

      <div>
        <Label>Identifier</Label>
        <Input
          className="mt-1"
          defaultValue={activeVariable.identifier}
          onBlur={(e) => {
            updateVariable(activeVariable.id, {
              ...activeVariable,
              identifier: e.currentTarget.value,
            })
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateVariable(activeVariable.id, {
                ...activeVariable,
                identifier: e.currentTarget.value,
              })
            }
          }}
        />
      </div>

      <div>
        <Label>Value</Label>
        <Input
          className="mt-1"
          defaultValue={activeVariable.value}
          onBlur={(e) => {
            updateVariable(activeVariable.id, {
              ...activeVariable,
              name: e.currentTarget.value,
            })
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateVariable(activeVariable.id, {
                ...activeVariable,
                name: e.currentTarget.value,
              })
            }
          }}
        />
      </div>
    </div>
  )
}
