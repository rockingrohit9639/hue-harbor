import { create } from 'zustand'
import { Variable } from '~/schema/palette'

type Visibility = 'PRIVATE' | 'PUBLIC'

type PaletteStore = {
  isUpdateAllowed: boolean
  setIsUpdateAllowed: (isUpdateAllowed: boolean) => void

  basicData?: { name?: string; visibility?: Visibility; backgroundColor?: string }
  variables: Variable[]
  updateBasicData: (palette: { name?: string; visibility?: Visibility; backgroundColor?: string }) => void

  isAddVariableOpen: boolean
  setAddVariableOpen: (isOpen: boolean) => void

  /** Variables */
  updateVariables: (variables: Variable[]) => void
  addVariable: (variable: Variable) => void

  activeVariable?: Variable
  setActiveVariable: (variable: Variable | undefined) => void
  updateVariable: (id: string, properties: Variable) => void
  removeVariable: (id: string) => void
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
}))
