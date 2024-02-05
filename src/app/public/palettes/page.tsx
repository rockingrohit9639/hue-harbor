'use client'

import { match } from 'ts-pattern'
import Palette from '~/app/(authenticated-app)/app/palettes/_components/palette'
import Container from '~/components/ui/container'
import ErrorMessage from '~/components/ui/error-message'
import { variablesSchema } from '~/schema/palette'
import { api } from '~/trpc/react'

export default function PublicPalettes() {
  const palettesQuery = api.palettes.public.useQuery()

  return match(palettesQuery)
    .with({ status: 'loading' }, () => (
      <div className="min-h-screen ">
        <div className="h-64 w-full animate-pulse bg-gray-100 dark:bg-card" />

        <div className="container p-4">
          <div className="grid gap-4 p-4 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="h-40 w-full animate-pulse rounded-md bg-gray-100 dark:bg-card" />
            ))}
          </div>
        </div>
      </div>
    ))
    .with({ status: 'error' }, ({ error }) => (
      <div className="flex h-full min-h-screen w-full items-center justify-center">
        <ErrorMessage title={error?.message} />
      </div>
    ))
    .with({ status: 'success' }, ({ data }) => (
      <div className="h-screen">
        <div className="flex flex-col items-center justify-center gap-2 bg-gray-100 px-4 py-20 dark:bg-card">
          <h1 className="text-center text-3xl font-bold text-card-foreground sm:text-5xl md:text-6xl">
            Explore Public Palettes
          </h1>
          <p className="text-center text-muted-foreground md:max-w-[60%]">
            Discover inspiring color combinations contributed by our community. Explore endless possibilities with Hue
            Harbor&apos;s public palettes.
          </p>
        </div>

        <Container className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {data
            .filter((palette) => {
              const result = variablesSchema.safeParse(palette.variables)
              if (!result.success) {
                return false
              }

              const colorVariables = result.data.filter((variable) => variable.type === 'color')
              if (colorVariables.length === 0) {
                return false
              }

              return true
            })
            .map((palette) => (
              <Palette key={palette.id} palette={palette} blockNavigation />
            ))}
        </Container>
      </div>
    ))
    .exhaustive()
}
