import { Hash, Pipette } from 'lucide-react'
import { Themes, Variable, VariableType } from '~/schema/palette'
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

export function generateCSS(variables: Variable[], themes: Themes) {
  let css = ''

  for (const theme of themes) {
    let themeCss = `${theme.identifier} {`

    const themeVariables = variables.filter((variable) => variable.theme === theme.id)
    for (const variable of themeVariables) {
      switch (variable.type) {
        case 'number':
          themeCss += `\n\t${variable.identifier} : ${variable.value}${variable.unit};`
          break

        default:
          themeCss += `\n\t${variable.identifier} : ${variable.value};`
      }
    }

    themeCss += '\n}\n\n'

    css += themeCss
  }

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
    title: 'CSS Identifier',
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
