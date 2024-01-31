import { create } from 'zustand'
import { Variable } from '~/schema/palette'

type Visibility = 'PRIVATE' | 'PUBLIC'

type PaletteStore = {
  isUpdateAllowed: boolean
  setIsUpdateAllowed: (isUpdateAllowed: boolean) => void

  basicData?: { name?: string; visibility?: Visibility; backgroundColor?: string }
  variables: Variable[]
  updateBasicData: (palette: { name?: string; visibility?: Visibility; backgroundColor?: string }) => void

  /** Variables */
  updateVariables: (variables: Variable[]) => void
  addVariable: (variable: Variable) => void
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

  /** Variables */
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
}))
