'use client'

import { Variable } from 'lucide-react'
import { cloneElement, useState } from 'react'
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
import { VariableType } from '~/schema/palette'
import { usePaletteStore } from '~/stores'

type AddVariableDialogProps = {
  className?: string
  style?: React.CSSProperties
  triggerProps?: BaseButtonProps
}

export default function AddVariableDialog({ className, style, triggerProps }: AddVariableDialogProps) {
  const [open, setOpen] = useState(false)
  const addVariable = usePaletteStore((store) => store.addVariable)

  function handleAddNewVariable(type: VariableType) {
    const id = nanoid()

    /** Using ts-pattern here will be helpful in case if we add more variable types */
    match(type)
      .with('color', () => {
        addVariable({
          id,
          name: 'My number Variable',
          identifier: '--my-color-variable',
          type: 'color',
          value: '',
        })
      })
      .with('number', () => {
        addVariable({
          id,
          name: 'My number variable',
          identifier: '--my-number-variable',
          type: 'number',
          value: 0,
        })
      })
      .exhaustive()

    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button icon={<Variable />} {...triggerProps}>
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
