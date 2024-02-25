import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon } from 'lucide-react'
import { nanoid } from 'nanoid'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Theme, themeSchema } from '~/schema/palette'
import { usePaletteStore } from '~/stores'

type AddThemeDialogProps = {
  className?: string
  style?: React.CSSProperties
}

export default function AddThemeDialog({ className, style }: AddThemeDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const addTheme = usePaletteStore((store) => store.addTheme)
  const isUpdateAllowed = usePaletteStore((store) => store.isUpdateAllowed)

  const form = useForm<Theme>({
    resolver: zodResolver(themeSchema.omit({ id: true })),
    defaultValues: {
      identifier: ':root',
    },
  })

  function handleAddTheme(values: Theme) {
    addTheme({ ...values, id: nanoid() })
    form.reset({ name: '', identifier: ':root' })
    setIsDialogOpen(false)

    toast.success('Theme added successfully!')
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div
          hidden={!isUpdateAllowed}
          className="h-full cursor-pointer rounded-tl-md rounded-tr-md border border-b-0 border-l-0 px-3 py-3 transition-colors duration-100 hover:bg-accent"
        >
          <PlusIcon className="h-4 w-4" />
        </div>
      </DialogTrigger>

      <DialogContent className={className} style={style}>
        <DialogHeader>
          <DialogTitle>Add a new theme</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleAddTheme)}>
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

            <Button>Create</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
