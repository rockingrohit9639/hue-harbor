import invariant from 'tiny-invariant'
import { cn } from '~/lib/utils'
import { ColorPickerValue } from '~/types/color-picker'
import ColorPreview from './color-preview'

type ColorPickerPreviewProps = {
  className?: string
  style?: React.CSSProperties
  value: ColorPickerValue
}

export default function ColorPickerPreview({ className, style, value }: ColorPickerPreviewProps) {
  invariant(value.type === 'color', 'ColorPickerPreview only supports color type')

  return (
    <div className={cn('flex w-full items-center', className)} style={style}>
      <ColorPreview value={value} />
      <div className="flex-1 px-2 text-left text-xs">{value.color}</div>
      <div className="border-l px-2 text-xs">{value.opacity}%</div>
    </div>
  )
}
