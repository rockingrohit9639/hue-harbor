import { useFormContext } from 'react-hook-form'
import { useEffect } from 'react'
import { Input, InputProps } from './input'
import slugify from '~/lib/slugify'
import { cn } from '~/lib/utils'

type SlugInputProps = Omit<InputProps, 'onChange'> & {
  /** A field in form to create a basic slug  */
  watcherField?: string
  onChange?: (value: string) => void
}

export default function SlugInput({ className, watcherField, onChange, ...props }: SlugInputProps) {
  const { watch } = useFormContext()
  const values = watch()

  const slugifiedValue = slugify(values[watcherField ?? ''] ?? '')

  useEffect(
    function updateSlug() {
      onChange?.(slugifiedValue)
    },
    [onChange, slugifiedValue],
  )

  return (
    <Input
      className={cn('opacity-50', className)}
      {...props}
      onChange={(e) => {
        const updatedSlugifiedValue = slugify(e.currentTarget.value)
        onChange?.(updatedSlugifiedValue)
      }}
    />
  )
}
