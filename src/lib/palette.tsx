import { Hash, Pipette } from 'lucide-react'
import { VariableType } from '~/schema/palette'

export const VARIABLES = [
  {
    type: 'color',
    title: 'Color',
    description: 'Creates a new color variable to store RGBA values in your palette.',
    icon: <Pipette />,
  },
  {
    type: 'number',
    title: 'Number',
    description:
      'Adds a new number variable to store numerical values such as border radius or font size in your palette.',
    icon: <Hash />,
  },
] satisfies Array<{
  type: VariableType
  title: string
  description: string
  icon: React.ReactElement<{ className?: string }>
}>
