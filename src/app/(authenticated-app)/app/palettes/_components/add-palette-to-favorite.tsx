import { Heart } from 'lucide-react'
import { BaseButtonProps, Button } from '~/components/ui/button'
import { api } from '~/trpc/react'

type AddPaletteToFavoriteProps = BaseButtonProps & {
  paletteId: string
}

export default function AddPaletteToFavorite({ paletteId, ...props }: AddPaletteToFavoriteProps) {
  const isPaletteInFavorite = api.palettes.isPaletteInUserFavorite.useQuery(paletteId)

  const addToFavoriteMutation = api.palettes.addToFavorite.useMutation({
    onSuccess: () => {
      isPaletteInFavorite.refetch()
    },
  })

  return (
    <Button
      icon={<Heart fill={isPaletteInFavorite.data === true ? 'red' : undefined} />}
      {...props}
      variant="link"
      loading={addToFavoriteMutation.isLoading}
      onClick={() => {
        addToFavoriteMutation.mutate(paletteId)
      }}
    />
  )
}
