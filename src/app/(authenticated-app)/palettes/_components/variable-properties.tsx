'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { match } from 'ts-pattern'
import ColorPicker from '~/components/color-picker'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'
import { Variable, variableSchema } from '~/schema/palette'
import { usePaletteStore } from '~/stores'

type VariablePropertiesProps = {
  className?: string
  style?: React.CSSProperties
}

export default function VariableProperties({ className, style }: VariablePropertiesProps) {
  const isUpdateAllowed = usePaletteStore((store) => store.isUpdateAllowed)
  const activeVariable = usePaletteStore((store) => store.activeVariable)
  const updateVariable = usePaletteStore((store) => store.updateVariable)

  const form = useForm<Variable>({
    resolver: zodResolver(variableSchema),
    mode: 'onBlur',
    defaultValues: {
      ...activeVariable,
    },
  })

  useEffect(
    function updatePropertiesWhenFieldChange() {
      form.reset(activeVariable)
    },
    [activeVariable, form],
  )

  function applyChanges(variable: Variable) {
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
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Your variable name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>CSS Identifier</FormLabel>
              <FormControl>
                <Input placeholder="CSS variable identifier" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                {match(activeVariable)
                  .with({ type: 'color' }, () => (
                    <ColorPicker
                      value={'rgba(240.98726550000003, 20.999734499999924, 20.999734499999924, 1)'}
                      onChange={field.onChange}
                    />
                  ))
                  .with({ type: 'number' }, () => (
                    <Input
                      type="number"
                      placeholder="Value of your variable"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e.currentTarget.valueAsNumber)
                      }}
                    />
                  ))
                  .exhaustive()}
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}
