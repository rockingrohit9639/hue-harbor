// Special thanks to [https://github.com/abinashpanda/color-picker] on GitHub for providing the color picker component that greatly assisted in the development of this feature.

import { cloneElement, createElement, useCallback, useEffect, useState } from 'react'
import { cn } from '~/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { COLOR_PICKER_CONFIG, createInitialColorValue, isPickerValueEqual } from '~/lib/color-picker'
import { ColorPickerValue, ColorValue } from '~/types/color-picker'
import { useEventCallback } from '~/hooks/use-event-callback'

export type ColorPickerProps = {
  className?: string
  style?: React.CSSProperties
  value: ColorPickerValue
  onChange: (value: ColorPickerValue) => void
}

type PickerDataState = {
  color: ColorValue
}

const PICKER_TYPE_ORDER_LIST: ColorPickerValue['type'][] = ['color']

export default function ColorPicker({ className, style, value, onChange }: ColorPickerProps) {
  const [activePickerType, setActivePickerType] = useState(value.type)

  const [pickerData, setPickerData] = useState<PickerDataState>({
    color: value.type === 'color' ? value : createInitialColorValue('#ffffff'),
  })

  const handleOnChange = useCallback((value: ColorPickerValue) => {
    setPickerData((state) => ({
      ...state,
      [value.type]: value,
    }))
  }, [])

  const onChangeCallback = useEventCallback(onChange)

  useEffect(
    function callOnChangeOnPickerDataChange() {
      if (!isPickerValueEqual(value, pickerData[activePickerType])) {
        onChangeCallback(pickerData[activePickerType])
      }
    },
    [value, pickerData, activePickerType, onChangeCallback],
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn('w-full rounded border p-1 focus-within:ring-1 focus-within:ring-ring', className)}
          style={style}
        >
          {createElement(COLOR_PICKER_CONFIG[activePickerType].previewComponent, {
            value: pickerData[activePickerType],
          })}
        </button>
      </PopoverTrigger>

      <PopoverContent className="w-auto">
        <div className="mb-2 flex items-center space-x-2">
          {PICKER_TYPE_ORDER_LIST.map((type) => (
            <button
              key={type}
              className={cn(
                'rounded-sm border p-1 focus-visible:outline-none',
                activePickerType === type
                  ? 'border-border bg-muted text-foreground'
                  : 'border-border/50 text-muted-foreground',
              )}
              onClick={() => {
                setActivePickerType(type)
              }}
            >
              {cloneElement(COLOR_PICKER_CONFIG[type].icon, {
                className: cn(COLOR_PICKER_CONFIG[type].icon.props.className, 'h-4 w-4'),
              })}
            </button>
          ))}
        </div>

        {createElement(COLOR_PICKER_CONFIG[activePickerType].popoverComponent, {
          value: pickerData[activePickerType],
          onChange: handleOnChange,
        })}
      </PopoverContent>
    </Popover>
  )
}
