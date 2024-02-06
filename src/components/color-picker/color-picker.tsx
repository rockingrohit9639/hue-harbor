import { cloneElement, useEffect, useState } from 'react'
import { PopoverContentProps } from '@radix-ui/react-popover'
import { RgbaStringColorPicker, HexColorInput } from 'react-colorful'
import { colord, extend } from 'colord'
import namesPlugin from 'colord/plugins/names'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { cn } from '~/lib/utils'
extend([namesPlugin])

type ColorPickerProps = React.ComponentProps<typeof RgbaStringColorPicker> & {
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
  color: incomingColor,
  onChange,
  disabled,
  align,
  side,
  ...pickerProps
}: ColorPickerProps) {
  const [color, setColor] = useState('rgba(0,0,0,1)')

  function handleColorChange(updatedColor: string) {
    setColor(updatedColor)
    onChange?.(color)
  }

  useEffect(
    function updateColorWhenIncomingChanges() {
      if (typeof incomingColor === 'string') {
        setColor(incomingColor.startsWith('rgba') ? incomingColor : colord(incomingColor).toRgbString())
      }
    },
    [incomingColor],
  )

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
        <RgbaStringColorPicker className="!w-full" color={color} {...pickerProps} onChange={handleColorChange} />

        <div className="mt-2 flex items-center gap-2 rounded-md border px-4 py-2">
          <div className="text-muted-foreground">#</div>
          <HexColorInput
            className="w-full border-none bg-transparent outline-none"
            color={color}
            onChange={(hex) => {
              const newColor = colord(hex).toRgbString()
              setColor(newColor)
              onChange?.(newColor)
            }}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
