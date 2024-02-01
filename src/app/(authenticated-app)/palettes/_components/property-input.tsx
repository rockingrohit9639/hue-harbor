import { useController } from 'react-hook-form'
import { match } from 'ts-pattern'
import ColorPicker from '~/components/color-picker'
import { Input } from '~/components/ui/input'
import { Property } from '~/types/property'

type PropertyInputProps = {
  className?: string
  style?: React.CSSProperties
  property: Property
}

export default function PropertyInput({ className, style, property }: PropertyInputProps) {
  const { field } = useController({ name: property.id })

  return match(property)
    .with({ type: 'text' }, () => (
      <Input className={className} style={style} placeholder={property.placeholder ?? property.title} {...field} />
    ))
    .with({ type: 'color' }, () => (
      <ColorPicker className={className} style={style} value={field.value} onChange={field.onChange} />
    ))
    .with({ type: 'number' }, () => (
      <Input
        className={className}
        style={style}
        type="number"
        placeholder={property.placeholder ?? property.title}
        {...field}
        onChange={(e) => {
          field.onChange(e.currentTarget.valueAsNumber)
        }}
      />
    ))
    .exhaustive()
}
