import { cloneElement, useState } from 'react'
import BestColorPicker from 'react-best-gradient-color-picker'
import { PopoverContentProps } from '@radix-ui/react-popover'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '~/lib/utils'

type ColorPickerProps = React.ComponentProps<typeof BestColorPicker> & {
  className?: string
  style?: React.CSSProperties
  trigger?: React.ReactElement
  disabled?: boolean
  align?: PopoverContentProps['align']
  side?: PopoverContentProps['side']
}

export default function ColorPicker({
  className,
  style,
  trigger,
  value,
  onChange,
  disabled,
  align,
  side,
  ...pickerProps
}: ColorPickerProps) {
  const [color, setColor] = useState(value)

  function handleColorChange(color: string) {
    setColor(color)
    onChange(color)
  }

  return (
    <Popover>
      <PopoverTrigger asChild disabled={disabled}>
        {trigger ? (
          cloneElement(trigger, { disabled })
        ) : (
          <div
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-muted-foreground',
              { 'pointer-events-none cursor-not-allowed opacity-50': disabled },
              className,
            )}
            style={style}
          >
            <div className="h-5 w-5 rounded-sm" style={{ background: color }} />

            <p className="">Pick a color</p>
          </div>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-full bg-card" align={align} side={side}>
        <BestColorPicker
          value={color}
          onChange={handleColorChange}
          {...pickerProps}
          hideInputType
          hideColorTypeBtns
          hideAdvancedSliders
          hideColorGuide
        />
      </PopoverContent>
    </Popover>
  )
}
