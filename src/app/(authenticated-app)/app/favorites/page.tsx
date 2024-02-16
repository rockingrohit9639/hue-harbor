'use client'

import { PackageOpen } from 'lucide-react'
import { match } from 'ts-pattern'
import Container from '~/components/ui/container'
import ErrorMessage from '~/components/ui/error-message'
import Loader from '~/components/ui/loader'
import { api } from '~/trpc/react'
import Palette from '../palettes/_components/palette'

export default function Favorites() {
  const favoriteListQuery = api.palettes.getFavoriteList.useQuery()

  return match(favoriteListQuery)
    .with({ status: 'loading' }, () => (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader title="Fetching your favorite list..." />
      </div>
    ))
    .with({ status: 'error' }, ({ error }) => (
      <div className="flex h-screen w-full items-center justify-center">
        <ErrorMessage title={error?.message} />
      </div>
    ))
    .with({ status: 'success' }, ({ data }) => {
      if (data.paletteIds.length === 0) {
        return (
          <div className="flex h-full w-full flex-col items-center justify-center">
            <PackageOpen />
            <p className="text-sm text-muted-foreground">You have to added any palettes to your favorites yet!</p>
          </div>
        )
      }

      return (
        <Container className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.palettes.map((palette) => (
            <Palette key={palette.id} palette={palette} />
          ))}
        </Container>
      )
    })
    .exhaustive()
}
