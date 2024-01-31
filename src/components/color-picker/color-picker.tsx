import { cloneElement, useState } from 'react'
import BestColorPicker from 'react-best-gradient-color-picker'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '~/lib/utils'

type ColorPickerProps = React.ComponentProps<typeof BestColorPicker> & {
  className?: string
  style?: React.CSSProperties
  trigger?: React.ReactElement
}

export default function ColorPicker({ className, style, trigger, value, onChange, ...pickerProps }: ColorPickerProps) {
  const [color, setColor] = useState(value)

  function handleColorChange(color: string) {
    setColor(color)
    onChange(color)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger ? (
          cloneElement(trigger)
        ) : (
          <div
            className={cn(
              'flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-muted-foreground',
              className,
            )}
            style={style}
          >
            <div className="h-5 w-5 rounded-sm" style={{ background: color }} />

            <p className="">Pick a color</p>
          </div>
        )}
      </PopoverTrigger>

      <PopoverContent className="w-full bg-card">
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