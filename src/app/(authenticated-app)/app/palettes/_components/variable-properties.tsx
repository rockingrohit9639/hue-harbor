'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { cn } from '~/lib/utils'
import { variableSchema } from '~/schema/palette'
import { usePaletteStore } from '~/stores'
import { VARIABLE_PROPERTY_MAP } from '~/lib/palette'
import PropertyInput from './property-input'

type VariablePropertiesProps = {
  className?: string
  style?: React.CSSProperties
}

export default function VariableProperties({ className, style }: VariablePropertiesProps) {
  const isUpdateAllowed = usePaletteStore((store) => store.isUpdateAllowed)
  const activeVariable = usePaletteStore((store) => store.activeVariable)
  const updateVariable = usePaletteStore((store) => store.updateVariable)

  const form = useForm<Record<string, unknown>>({
    resolver: zodResolver(variableSchema),
    mode: 'onBlur',
    defaultValues: {
      ...activeVariable,
    },
  })

  useEffect(
    function updatePropertiesWhenVariableChange() {
      form.reset(activeVariable)
    },
    [activeVariable, form],
  )

  function applyChanges(variable: Record<string, unknown>) {
    if (!activeVariable) return

    updateVariable(activeVariable.id, {
      ...activeVariable,
      ...variable,
    })
  }

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

  const variableProperties = VARIABLE_PROPERTY_MAP[activeVariable.type]

  return (
    <Form {...form}>
      <form
        className={cn('grid gap-y-4 p-4', className)}
        style={style}
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        {variableProperties.map((property) => (
          <FormField
            key={property.id}
            control={form.control}
            name={property.id}
            render={() => (
              <FormItem className={className} style={style}>
                <FormLabel>{property.title}</FormLabel>
                <FormControl>
                  <PropertyInput property={property} />
                </FormControl>

                {!!property.description && <FormDescription>{property.description}</FormDescription>}
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </form>
    </Form>
  )
}
