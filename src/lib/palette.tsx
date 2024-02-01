import { Hash, Pipette } from 'lucide-react'
import { Variable, VariableType } from '~/schema/palette'
import { Property } from '~/types/property'

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

export function generateCSS(variables: Variable[]) {
  let css = ':root {\n'

  for (const variable of variables) {
    switch (variable.type) {
      case 'number':
        css += `\t${variable.identifier} : ${variable.value}${variable.unit};\n`
        break

      default:
        css += `\t${variable.identifier} : ${variable.value};\n`
    }
  }

  css += '}\n'

  return css
}

const BASIC_PROPERTIES: Property[] = [
  {
    type: 'text',
    id: 'name',
    title: 'Name',
  },
  {
    type: 'text',
    id: 'identifier',
    title: 'Identifier',
  },
]

export const VARIABLE_PROPERTY_MAP: Record<VariableType, Property[]> = {
  color: [
    ...BASIC_PROPERTIES,
    {
      type: 'color',
      id: 'value',
      title: 'Value',
    },
  ],
  number: [
    ...BASIC_PROPERTIES,
    {
      type: 'number',
      id: 'value',
      title: 'Value',
    },
    {
      type: 'text',
      id: 'unit',
      title: 'Unit',
    },
  ],
}
