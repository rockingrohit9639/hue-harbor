import Color from 'color'
import ColorPickerPopover from '~/components/color-picker/components/color-picker-popover'
import ColorPickerPreview from '~/components/color-picker/components/color-picker-preview'
import { ColorPickerValue, ColorValue, GradientValue } from '~/types/color-picker'

export const COLOR_PICKER_CONFIG = {
  color: {
    icon: <div className="bg-current" />,
    previewComponent: ColorPickerPreview,
    popoverComponent: ColorPickerPopover,
  },
} satisfies Record<
  ColorPickerValue['type'],
  {
    icon: React.ReactElement<{ className?: string; style?: React.CSSProperties }>
    previewComponent: React.ComponentType<{ value: ColorPickerValue }>
    popoverComponent: React.ComponentType<{ value: ColorPickerValue; onChange: (value: ColorPickerValue) => void }>
  }
>

export function fixHexColor(color: string): string {
  // Remove the '#' if it exists
  if (color.startsWith('#')) {
    color = color.substring(1)
  }

  // Pad or trim to a valid length
  if (color.length > 6) {
    color = color.substring(0, 6)
  } else if (color.length < 6 && color.length !== 3) {
    color = color.padEnd(6, '0')
  } else if (color.length > 3 && color.length < 6) {
    color = color.substring(0, 3)
  }

  // Replace invalid characters with the nearest valid hex character
  color = color
    .split('')
    .map((char) => {
      if ('0123456789abcdefABCDEF'.includes(char)) {
        return char
      }

      // Find the closest valid hex character
      const hexChars = '0123456789abcdef'
      const index = hexChars.split('').reduce((prev, curr) => {
        return Math.abs(curr.charCodeAt(0) - char.charCodeAt(0)) < Math.abs(prev.charCodeAt(0) - char.charCodeAt(0))
          ? curr
          : prev
      })

      return index
    })
    .join('')

  // If we were working with a short 3-character color, ensure it remains short
  if (color.length === 3) {
    return `#${color}`
  }

  // Expand 3-character color to 6 characters
  if (color.length === 3) {
    color = color
      .split('')
      .map((char) => char + char)
      .join('')
  }

  return `#${color}`
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(value, max))
}

export function createInitialColorValue(value?: string): ColorValue {
  return {
    type: 'color',
    color: value || '#000000',
    opacity: 100,
  }
}

export function createInitialGradientValue(value?: string): GradientValue {
  const initialColor = value ?? '#000000'

  return {
    type: 'gradient',
    gradientType: 'linear',
    angle: 180,
    stops: [
      {
        position: 0,
        color: initialColor,
        opacity: 100,
      },
      {
        position: 100,
        color: initialColor,
        opacity: 0,
      },
    ],
  }
}

export function isPickerValueEqual(a: ColorPickerValue, b: ColorPickerValue) {
  if (a.type !== b.type) {
    return false
  }

  if (a.type === 'color' && b.type === 'color') {
    return (
      Color(a.color)
        .alpha(a.opacity / 100)
        .hex() ===
      Color(b.color)
        .alpha(b.opacity / 100)
        .hex()
    )
  }

  return false
}
