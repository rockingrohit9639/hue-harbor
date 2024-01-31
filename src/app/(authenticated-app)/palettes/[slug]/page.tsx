'use client'

import { match } from 'ts-pattern'
import { useSession } from 'next-auth/react'
import ErrorMessage from '~/components/ui/error-message'
import Loader from '~/components/ui/loader'
import { api } from '~/trpc/react'
import DeletePaletteDialog from '../_components/delete-palette-dialog'
import { Switch } from '~/components/ui/switch'
import { Label } from '~/components/ui/label'

type PaletteBuilderProps = {
  params: { slug: string }
}

export default function PaletteBuilder({ params }: PaletteBuilderProps) {
  const paletteQuery = api.palettes.findOneBySlug.useQuery(params.slug)
  const { data: session } = useSession()

  return match(paletteQuery)
    .with({ status: 'loading' }, () => (
      <div className="flex h-full w-full items-center justify-center">
        <Loader title="We are fetching your palette details, please wait." />
      </div>
    ))
    .with({ status: 'error' }, () => (
      <div className="flex h-full w-full items-center justify-center">
        <ErrorMessage />
      </div>
    ))
    .with({ status: 'success' }, ({ data }) => (
      <div className="grid h-screen grid-cols-5">
        <div className="col-span-4 p-4">
          <div className="flex justify-between">
            <div>
              <h1 className="text-2xl font-bold">{data.name}</h1>
              <div className="text-xs text-muted-foreground">{data.slug}</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Label htmlFor="visibility" className="!text-sm text-muted-foreground">
                  PRIVATE
                </Label>
                <Switch id="visibility" value={data.visibility} />
                <Label htmlFor="visibility" className="!text-sm text-muted-foreground">
                  PUBLIC
                </Label>
              </div>

              {data.createdById === session?.user.id && (
                <DeletePaletteDialog id={data.id} visibility={data.visibility} />
              )}
            </div>
          </div>
        </div>
        <div className="border-l p-4">Test</div>
      </div>
    ))
    .exhaustive()
}
