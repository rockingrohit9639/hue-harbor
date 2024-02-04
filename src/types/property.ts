type BasicProperty = {
  id: string
  title: string
  description?: string
  placeholder?: string
}

type TextProperty = BasicProperty & {
  type: 'text'
}

type NumberProperty = BasicProperty & {
  type: 'number'
}

type ColorProperty = BasicProperty & {
  type: 'color'
}

export type Property = TextProperty | NumberProperty | ColorProperty
