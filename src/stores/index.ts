import { create } from 'zustand'

type Visibility = 'PRIVATE' | 'PUBLIC'

type PaletteStore = {
  basicData?: { name?: string; visibility?: Visibility }
  variables: []
  updateBasicData: (palette: { name?: string; visibility?: Visibility }) => void
}

export const usePaletteStore = create<PaletteStore>((set) => ({
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
}))
