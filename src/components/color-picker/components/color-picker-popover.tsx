'use client'

import { useCallback, useRef } from 'react'
import { cn } from '~/lib/utils'
import { ColorPickerValue } from '~/types/color-picker'
import ColorPalette, { ColorPaletteMethods } from './color-palette'
import ColorPreview from './color-preview'
import HexInput, { HexInputMethod } from './hex-input'

type ColorPickerPopoverProps = {
  className?: string
  style?: React.CSSProperties
  value: ColorPickerValue
  onChange: (value: ColorPickerValue) => void
}

export default function ColorPickerPopover({ className, style, value, onChange }: ColorPickerPopoverProps) {
  const colorPalette = useRef<ColorPaletteMethods | null>(null)
  const hexInput = useRef<HexInputMethod | null>(null)

  const handleHexInputChange = useCallback(
    (updatedValue: ColorPickerValue) => {
      onChange(updatedValue)
      colorPalette.current?.updateColor(updatedValue)
    },
    [onChange],
  )

  const handleColorPaletteChange = useCallback(
    (updatedValue: ColorPickerValue) => {
      onChange(updatedValue)
      hexInput.current?.updateColor(updatedValue)
    },
    [onChange],
  )

  return (
    <div className={cn('w-[200px] space-y-2', className)} style={style}>
      <ColorPalette value={value} onChange={handleColorPaletteChange} ref={colorPalette} />
      <div className="flex w-auto items-center space-x-2">
        <div className="text-xs">Hex</div>
        <div className="flex items-center rounded-md border p-1">
          <ColorPreview value={value} />
          <HexInput value={value} onChange={handleHexInputChange} className="flex-1" ref={hexInput} />
        </div>
      </div>
    </div>
  )
}
