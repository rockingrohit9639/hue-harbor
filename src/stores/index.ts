import { create } from 'zustand'
import { Theme, Themes, Variable } from '~/schema/palette'

type Visibility = 'PRIVATE' | 'PUBLIC'

type PaletteStore = {
  isUpdateAllowed: boolean
  setIsUpdateAllowed: (isUpdateAllowed: boolean) => void

  basicData?: { id?: string; name?: string; visibility?: Visibility; backgroundColor?: string }
  variables: Variable[]
  updateBasicData: (palette: { id?: string; name?: string; visibility?: Visibility; backgroundColor?: string }) => void

  isAddVariableOpen: boolean
  setAddVariableOpen: (isOpen: boolean) => void

  isExplorerOpen: boolean
  setExplorerOpen: (isOpen: boolean) => void

  /** Variables */
  updateVariables: (variables: Variable[]) => void
  addVariable: (variable: Variable) => void

  activeVariable?: Variable
  setActiveVariable: (variable: Variable | undefined) => void
  updateVariable: (id: string, properties: Variable) => void
  removeVariable: (id: string) => void

  /** Themes */
  themes: Themes
  updateThemes: (themes: Themes) => void
  addTheme: (theme: Theme) => void
  updateTheme: (id: string, updatedTheme: Theme) => void

  activeTheme?: Theme
  setActiveTheme: (theme: Theme | undefined) => void
}

export const usePaletteStore = create<PaletteStore>((set) => ({
  isUpdateAllowed: false,
  setIsUpdateAllowed: (isUpdateAllowed) => {
    set((prev) => ({
      ...prev,
      isUpdateAllowed,
    }))
  },

  basicData: undefined,
  variables: [],
  updateBasicData: (data) => {
    set((prev) => ({
      ...prev,
      basicData: {
        ...prev.basicData,
        ...data,
      },
    }))
  },

  isAddVariableOpen: false,
  setAddVariableOpen: (isOpen) => {
    set((prev) => ({
      ...prev,
      isAddVariableOpen: isOpen,
    }))
  },

  isExplorerOpen: false,
  setExplorerOpen: (isOpen) => {
    set((prev) => ({
      ...prev,
      isExplorerOpen: isOpen,
    }))
  },

  /** Variables */
  activeVariable: undefined,
  updateVariables: (variables) => {
    set((prev) => ({
      ...prev,
      variables,
    }))
  },
  addVariable: (variable) => {
    set((prev) => ({
      ...prev,
      variables: [variable, ...prev.variables],
    }))
  },
  setActiveVariable: (variable) => {
    set((prev) => ({
      ...prev,
      activeVariable: variable,
    }))
  },
  updateVariable: (id, properties) => {
    set((prev) => ({
      ...prev,
      variables: prev.variables.map((variable) => {
        if (variable.id === id) {
          return {
            ...variable,
            ...properties,
          }
        }

        return variable
      }),
    }))
  },
  removeVariable: (id) => {
    set((prev) => ({
      ...prev,
      variables: prev.variables.filter((variable) => variable.id !== id),
    }))
  },

  /** Themes */
  themes: [],
  updateThemes: (themes) => {
    set((prev) => ({ ...prev, themes }))
  },
  addTheme: (theme) => {
    set((prev) => ({ ...prev, themes: [...prev.themes, theme] }))
  },

  activeTheme: undefined,
  setActiveTheme: (theme) => {
    set((prev) => ({ ...prev, activeTheme: theme }))
  },
  updateTheme: (id, updatedTheme) => {
    set((prev) => ({
      ...prev,
      themes: prev.themes.map((theme) => {
        if (theme.id === id) {
          return {
            ...theme,
            ...updatedTheme,
          }
        }

        return theme
      }),
    }))
  },
}))
