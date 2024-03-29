'use client'

import { VariableIcon } from 'lucide-react'
import { cloneElement } from 'react'
import { match } from 'ts-pattern'
import { nanoid } from 'nanoid'
import { BaseButtonProps, Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { VARIABLES } from '~/lib/palette'
import { cn } from '~/lib/utils'
import { Variable, VariableType } from '~/schema/palette'
import { usePaletteStore } from '~/stores'

type AddVariableDialogProps = {
  className?: string
  style?: React.CSSProperties
  triggerProps?: BaseButtonProps
}

export default function AddVariableDialog({ className, style, triggerProps }: AddVariableDialogProps) {
  const open = usePaletteStore((store) => store.isAddVariableOpen)
  const setOpen = usePaletteStore((store) => store.setAddVariableOpen)
  const addVariable = usePaletteStore((store) => store.addVariable)
  const setActiveVariable = usePaletteStore((store) => store.setActiveVariable)
  const activeTheme = usePaletteStore((store) => store.activeTheme)

  function handleAddNewVariable(type: VariableType) {
    if (!activeTheme) return

    const id = nanoid()

    /** Using ts-pattern here will be helpful in case if we add more variable types */
    const variable: Variable = match(type)
      .with('color', () => ({
        id,
        name: 'My Color Variable',
        identifier: '--my-color-variable',
        type: 'color' as const,
        value: '#000000',
        theme: activeTheme.id,
      }))
      .with('number', () => ({
        id,
        name: 'My number variable',
        identifier: '--my-number-variable',
        type: 'number' as const,
        value: 0,
        theme: activeTheme.id,
      }))
      .exhaustive()

    addVariable(variable)
    setActiveVariable(variable)

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button icon={<VariableIcon />} {...triggerProps}>
          Add variable
        </Button>
      </DialogTrigger>

      <DialogContent className={cn('!w-full max-w-2xl', className)} style={style}>
        <DialogHeader className="mb-4">
          <DialogTitle>Add variable</DialogTitle>
          <DialogDescription>
            Create a new variable to enhance your palette. Select the type, name it, and assign a value to customize
            your design elements effectively.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4">
          {VARIABLES.map((variable) => (
            <div
              className="cursor-pointer rounded-md border bg-card p-4 transition hover:border-gray-100/20"
              key={variable.type}
              onClick={() => {
                handleAddNewVariable(variable.type)
              }}
            >
              <div className="mb-2 flex w-max items-center justify-center rounded-md border bg-card p-2">
                {cloneElement(variable.icon, { className: 'w-4 h-4' })}
              </div>

              <h1 className="text-lg font-bold uppercase">{variable.title}</h1>
              <p className="text-sm text-muted-foreground">{variable.description}</p>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
