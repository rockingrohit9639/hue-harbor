import { PlusCircleIcon, Trash2Icon } from 'lucide-react'
import { FieldError, useFieldArray, useFormContext } from 'react-hook-form'
import { Button } from '~/components/ui/button'
import { Input, InputProps } from '~/components/ui/input'
import { cn } from '~/lib/utils'

type OriginsInputProps = InputProps & {
  className?: string
  style?: React.CSSProperties
  name: string
}

export default function OriginsInput({ className, style, name, ...inputProps }: OriginsInputProps) {
  const { control, register, formState } = useFormContext()
  const { fields, append, remove } = useFieldArray({ name, control })
  const errors = formState?.errors?.[name] as unknown as FieldError[]

  return (
    <div className={cn('flex flex-col gap-2', className)} style={style}>
      {fields.map((field, i) => {
        const fieldError = errors?.[i]?.message

        return (
          <div key={field.id}>
            <div className="flex items-center gap-2">
              <Input key={field.id} {...inputProps} {...register(`${name}.${i}`)} />

              <Button
                icon={<Trash2Icon />}
                size="icon-sm"
                variant="destructive-outline"
                onClick={() => {
                  remove(i)
                }}
              />
            </div>

            {!!fieldError && <p className="mt-1 text-sm text-destructive">{fieldError}</p>}
          </div>
        )
      })}

      <Button
        type="button"
        variant="outline"
        icon={<PlusCircleIcon />}
        onClick={() => {
          append('')
        }}
      >
        Add Origin
      </Button>
    </div>
  )
}
