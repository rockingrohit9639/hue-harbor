export type ColorValue = {
  type: 'color'
  color: string
  opacity: number
}

type GradientConfig = { gradientType: 'linear'; angle: number } | { gradientType: 'radial' }

export type GradientValue = {
  type: 'gradient'
  stops: GradientStop[]
} & GradientConfig

export type GradientStop = {
  position: number
  color: string
  opacity: number
}

export type ColorPickerValue = ColorValue
