'use client'

import { match } from 'ts-pattern'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { useState } from 'react'
import { Edit2, Save } from 'lucide-react'
import ErrorMessage from '~/components/ui/error-message'
import Loader from '~/components/ui/loader'
import { api } from '~/trpc/react'
import DeletePaletteDialog from '../_components/delete-palette-dialog'
import { Switch } from '~/components/ui/switch'
import { Label } from '~/components/ui/label'
import EditableInput from '~/components/ui/editable-input'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'

type PaletteBuilderProps = {
  params: { slug: string }
}

export default function PaletteBuilder({ params }: PaletteBuilderProps) {
  const { data: session } = useSession()
  const [isUpdateAllowed, setIsUpdateAllowed] = useState(false)

  /** We need this state to manage the updation of palette */
  const [paletteData, setPaletteData] = useState<{
    name: string
    visibility: 'PRIVATE' | 'PUBLIC'
  }>({
    name: '',
    visibility: 'PRIVATE',
  })

  const paletteQuery = api.palettes.findOneBySlug.useQuery(params.slug, {
    onSuccess: (data) => {
      setPaletteData({
        name: data.name,
        visibility: data.visibility,
      })
    },
  })

  const updatePaletteMutation = api.palettes.update.useMutation({
    onSuccess: () => {
      paletteQuery.refetch()
      setIsUpdateAllowed(false)
      toast.success('Palette updated successfully!')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

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
        <div className="col-span-4">
          <div className="flex justify-between border-b p-4">
            <div>
              <EditableInput
                editable={isUpdateAllowed}
                value={paletteData.name}
                className="text-2xl font-bold"
                onChange={(value) => {
                  setPaletteData((prev) => ({
                    ...prev,
                    name: value,
                  }))
                }}
              />
              <div className="text-xs text-muted-foreground">{data.slug}</div>
            </div>

            <div className="flex items-center gap-4">
              <div className={cn('flex items-center space-x-2 opacity-50', { 'opacity-100': isUpdateAllowed })}>
                <Label htmlFor="visibility" className="!text-sm">
                  PRIVATE
                </Label>
                <Switch
                  id="visibility"
                  disabled={!isUpdateAllowed}
                  checked={paletteData.visibility === 'PUBLIC'}
                  onCheckedChange={(checked) => {
                    setPaletteData((prev) => ({
                      ...prev,
                      visibility: checked === true ? 'PUBLIC' : 'PRIVATE',
                    }))
                  }}
                />
                <Label htmlFor="visibility" className="!text-sm">
                  PUBLIC
                </Label>
              </div>

              {data.createdById === session?.user.id && (
                <DeletePaletteDialog id={data.id} visibility={data.visibility} />
              )}

              {isUpdateAllowed ? (
                <Button
                  loading={updatePaletteMutation.isLoading}
                  icon={<Save className="h-4 w-4" />}
                  onClick={() => {
                    updatePaletteMutation.mutate({ id: data.id, ...paletteData })
                  }}
                >
                  Save Changes
                </Button>
              ) : (
                <Button
                  loading={updatePaletteMutation.isLoading}
                  icon={<Edit2 className="h-4 w-4" />}
                  onClick={() => {
                    setIsUpdateAllowed(true)
                  }}
                >
                  Update Palette
                </Button>
              )}
            </div>
          </div>
        </div>
        <div className="border-l p-4">Test</div>
      </div>
    ))
    .exhaustive()
}
