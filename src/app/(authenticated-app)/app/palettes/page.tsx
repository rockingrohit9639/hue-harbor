'use client'

import { match } from 'ts-pattern'
import Container from '~/components/ui/container'
import ErrorMessage from '~/components/ui/error-message'
import Loader from '~/components/ui/loader'
import { api } from '~/trpc/react'
import CreatePaletteDialog from './_components/create-palette-dialog'
import Palette from './_components/palette'

export default function MyPalettes() {
  const palettesQuery = api.palettes.findAll.useQuery()

  return match(palettesQuery)
    .with({ status: 'loading' }, () => (
      <div className="flex h-full w-full items-center justify-center">
        <Loader title="We are fetching your palettes, please wait...." />
      </div>
    ))
    .with({ status: 'error' }, () => (
      <div>
        <ErrorMessage title="Something went wrong while fetching your palettes!" />
      </div>
    ))
    .with({ status: 'success' }, ({ data: palettes }) => (
      <Container>
        <h1 className="mb-1 text-3xl font-bold">My Palettes</h1>
        <p className="mb-4 text-sm text-muted-foreground">
          Manage your custom color palettes with ease. Organize, edit, and apply your color schemes to websites
          effortlessly, ensuring consistent and stylish designs.
        </p>

        <div className="mb-4 flex items-center justify-end">
          <CreatePaletteDialog />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {palettes.map((palette) => (
            <Palette key={palette.id} palette={palette} />
          ))}
        </div>
      </Container>
    ))
    .exhaustive()
}
