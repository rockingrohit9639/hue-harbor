import { toast } from 'sonner'
import { z } from 'zod'
import { themesSchema, variableSchema } from '~/schema/palette'
import { usePaletteStore } from '~/stores'
import { api } from '~/trpc/react'

export default function usePalette(slug: string) {
  const paletteData = usePaletteStore((store) => store.basicData)
  const updateBasicData = usePaletteStore((store) => store.updateBasicData)
  const updateVariables = usePaletteStore((store) => store.updateVariables)
  const updateThemes = usePaletteStore((store) => store.updateThemes)
  const setActiveVariable = usePaletteStore((store) => store.setActiveVariable)
  const setIsUpdateAllowed = usePaletteStore((store) => store.setIsUpdateAllowed)
  const variables = usePaletteStore((store) => store.variables)
  const themes = usePaletteStore((store) => store.themes)
  const setActiveTheme = usePaletteStore((store) => store.setActiveTheme)

  const paletteQuery = api.palettes.findOneBySlug.useQuery(slug, {
    onSuccess: (data) => {
      updateBasicData({
        id: data.id,
        name: data.name,
        visibility: data.visibility,
        backgroundColor: data.backgroundColor ?? '',
      })

      const result = z.array(variableSchema).safeParse(data.variables)
      if (result.success) {
        updateVariables(result.data)
      }

      const themesResult = themesSchema.safeParse(data.themes)
      if (themesResult.success) {
        setActiveTheme(themesResult.data[0])
        updateThemes(themesResult.data)
      }
    },
  })

  const updatePaletteMutation = api.palettes.update.useMutation({
    onSuccess: () => {
      paletteQuery.refetch()
      setActiveVariable(undefined)
      setIsUpdateAllowed(false)
      toast.success('Palette updated successfully!')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  function handleUpdatePaletteMutation() {
    updatePaletteMutation.mutate({ ...paletteData, id: paletteData?.id ?? '', variables, themes })
  }

  return {
    paletteQuery,
    handleUpdatePaletteMutation,
    isLoading: paletteQuery.isLoading || updatePaletteMutation.isLoading,
  }
}
