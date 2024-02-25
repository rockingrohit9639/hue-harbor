'use client'

import { nanoid } from 'nanoid'
import { cloneElement } from 'react'
import { match } from 'ts-pattern'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import ErrorMessage from '~/components/ui/error-message'
import Loader from '~/components/ui/loader'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import { GetVariableByType } from '~/schema/palette'
import { usePaletteStore } from '~/stores'
import { api } from '~/trpc/react'

type VariablesExplorerProps = {
  trigger?: React.ReactElement
  onSelect?: (variable: GetVariableByType<'color'>) => void
}

export default function VariablesExplorer({ trigger, onSelect }: VariablesExplorerProps) {
  const open = usePaletteStore((store) => store.isExplorerOpen)
  const setOpen = usePaletteStore((store) => store.setExplorerOpen)

  const variablesQuery = api.palettes.explorer.useQuery(undefined, {
    enabled: open,
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!!trigger && <DialogTrigger asChild>{cloneElement(trigger)}</DialogTrigger>}

      <DialogContent className="max-h-[800px] w-full max-w-screen-sm">
        <DialogHeader>
          <DialogTitle>Explore Color Variables</DialogTitle>
          <DialogDescription>Explore and use variables in your own palette.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="your-variables">
          <TabsList className="mb-4 grid w-full grid-cols-2 ">
            <TabsTrigger value="your-variables">Your Variables</TabsTrigger>
            <TabsTrigger value="community">Community</TabsTrigger>
          </TabsList>

          {match(variablesQuery)
            .with({ status: 'loading' }, () => <Loader title="Fetching variables please wait..." />)
            .with({ status: 'error' }, ({ error }) => <ErrorMessage title={error.message} />)
            .with({ status: 'success' }, ({ data }) => (
              <>
                <TabsContent value="your-variables" className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {data.user.length > 0 ? (
                    data.user.map((variable) => (
                      <VariablePreview key={variable.id} variable={variable} onSelect={onSelect} />
                    ))
                  ) : (
                    <div className='text-muted-foreground" col-span-full flex items-center justify-center'>
                      No variables
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="community" className="mt-0 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {data.community.length > 0 ? (
                    data.community.map((variable) => (
                      <VariablePreview key={variable.id} variable={variable} onSelect={onSelect} />
                    ))
                  ) : (
                    <div className="col-span-full flex items-center justify-center text-muted-foreground">
                      No variables yet.
                    </div>
                  )}
                </TabsContent>
              </>
            ))
            .exhaustive()}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

function VariablePreview({
  variable,
  onSelect,
}: {
  variable: GetVariableByType<'color'>
  onSelect?: (variable: GetVariableByType<'color'>) => void
}) {
  const addVariable = usePaletteStore((store) => store.addVariable)

  return (
    <div
      className="group relative h-20 w-full cursor-pointer overflow-hidden rounded-md border"
      style={{ backgroundColor: variable.value }}
      onClick={() => {
        const newId = nanoid()

        if (typeof onSelect === 'function') {
          onSelect(variable)
        } else {
          addVariable({
            ...variable,
            id: newId,
          })
        }
      }}
    >
      <div className="absolute inset-x-0 bottom-0 translate-y-full border-t-[0.5px] bg-white px-4 py-2 transition ease-in-out group-hover:translate-y-0">
        <p className="truncate">{variable.name}</p>
        <p className="text-xs text-muted-foreground">Click to add in your palette</p>
      </div>
    </div>
  )
}
