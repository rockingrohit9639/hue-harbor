import { zodResolver } from '@hookform/resolvers/zod'
import { PencilIcon, TrashIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'
import { Button } from '~/components/ui/button'
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '~/components/ui/context-menu'
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'
import { Theme, UpdateThemeSchema, updateThemeSchema } from '~/schema/palette'
import { usePaletteStore } from '~/stores'

type ThemeTabProps = {
  className?: string
  style?: React.CSSProperties
  theme: Theme
}

export default function ThemeTab({ className, style, theme }: ThemeTabProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const activeTheme = usePaletteStore((store) => store.activeTheme)
  const setActiveTheme = usePaletteStore((store) => store.setActiveTheme)
  const isUpdateAllowed = usePaletteStore((store) => store.isUpdateAllowed)

  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <AlertDialog>
        <ContextMenu>
          <ContextMenuTrigger disabled={!isUpdateAllowed} asChild>
            <div
              key={theme.id}
              className={cn(
                'cursor-pointer rounded-tl-md rounded-tr-md border border-b-0 px-4 py-2 transition-colors duration-100 hover:bg-accent',
                { 'bg-accent': activeTheme?.id === theme.id },
                className,
              )}
              onClick={() => {
                setActiveTheme(theme)
              }}
              style={style}
            >
              {theme.name}
            </div>
          </ContextMenuTrigger>

          <ContextMenuContent>
            <DialogTrigger asChild>
              <ContextMenuItem>
                <PencilIcon className="mr-2 h-4 w-4" />
                Edit
              </ContextMenuItem>
            </DialogTrigger>

            <AlertDialogTrigger asChild>
              <ContextMenuItem className="text-destructive">
                <TrashIcon className="mr-2 h-4 w-4" />
                Delete
              </ContextMenuItem>
            </AlertDialogTrigger>
          </ContextMenuContent>
        </ContextMenu>

        <EditDialogContent
          theme={theme}
          onSuccess={() => {
            setIsEditOpen(false)
          }}
        />

        <DeleteDialogContent theme={theme} />
      </AlertDialog>
    </Dialog>
  )
}

function EditDialogContent({ theme, onSuccess }: { theme: Theme; onSuccess?: () => void }) {
  const updateTheme = usePaletteStore((store) => store.updateTheme)
  const form = useForm<UpdateThemeSchema>({
    resolver: zodResolver(updateThemeSchema),
    defaultValues: theme,
  })

  function handleUpdateTheme(values: UpdateThemeSchema) {
    updateTheme(theme.id, values)
    onSuccess?.()
  }

  return (
    <DialogContent>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdateTheme)} className="space-y-4">
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name of the palette" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="identifier"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Identifier</FormLabel>
                <FormControl>
                  <Input placeholder="e.g .dark" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button>Update</Button>
        </form>
      </Form>
    </DialogContent>
  )
}

function DeleteDialogContent({ theme }: { theme: Theme }) {
  const deleteTheme = usePaletteStore((store) => store.deleteTheme)
  const totalVariablesInTheme = usePaletteStore(
    (store) => store.variables.filter((variable) => variable.theme === theme.id).length,
  )
  const totalThemes = usePaletteStore((store) => store.themes.length)
  const isDeleteAllowed = totalThemes > 1

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Delete Theme?</AlertDialogTitle>
        <AlertDialogDescription>
          {isDeleteAllowed
            ? `By deleting this theme all its ${totalVariablesInTheme} variables will be deleted too. Are you sure you want to
          delete this theme?`
            : 'There should be at least one theme in a palette. This action is not allowed yet.'}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        {isDeleteAllowed && (
          <AlertDialogAction
            onClick={() => {
              deleteTheme(theme.id)
            }}
          >
            Continue
          </AlertDialogAction>
        )}
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
