'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { PlusIcon, SendIcon } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import ColorPicker from '~/components/color-picker'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import SlugInput from '~/components/ui/slug-input'
import { CreatePaletteInput, createPaletteInput } from '~/server/api/routers/palettes/palettes.input'
import { api } from '~/trpc/react'

type CreatePaletteDialogProps = {
  className?: string
  style?: React.CSSProperties
}

export default function CreatePaletteDialog({ className, style }: CreatePaletteDialogProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<CreatePaletteInput>({
    resolver: zodResolver(createPaletteInput),
    defaultValues: {
      name: '',
      backgroundColor: '',
      visibility: 'PRIVATE',
    },
  })

  const utils = api.useUtils()
  const createPaletteMutation = api.palettes.create.useMutation({
    onSuccess: () => {
      form.reset({
        name: '',
        backgroundColor: '',
        visibility: 'PRIVATE',
      })

      utils.palettes.findAll.invalidate()
      setOpen(false)

      toast.success('Palette created successfully!')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  function handleCreatePalette(values: CreatePaletteInput) {
    createPaletteMutation.mutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button icon={<PlusIcon />}>Create Palette</Button>
      </DialogTrigger>

      <DialogContent className={className} style={style}>
        <DialogHeader>
          <DialogTitle>Create new palette</DialogTitle>
          <DialogDescription>
            Design and name your color scheme for easy application to your projects.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreatePalette)} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Beautiful Blue" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="backgroundColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>BG Color (optional)</FormLabel>
                  <FormControl>
                    <ColorPicker {...field} side="right" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <SlugInput
                      watcherField="name"
                      placeholder="Please enter a slug to identify your palette"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="visibility"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup {...field} onValueChange={field.onChange} className="flex gap-4">
                      <div className="flex flex-1 items-center space-x-2">
                        <RadioGroupItem value="PRIVATE" id="PRIVATE" />
                        <Label htmlFor="PRIVATE">
                          <div>Private</div>
                          <p className="text-xs font-normal text-muted-foreground">
                            Select this if you want to keep your palettes private to your websites only.
                          </p>
                        </Label>
                      </div>
                      <div className="flex flex-1 items-center space-x-2">
                        <RadioGroupItem value="PUBLIC" id="PUBLIC" />
                        <Label htmlFor="PUBLIC">
                          <div>Public</div>
                          <p className="text-xs font-normal text-muted-foreground">
                            Select this if you want to share your palettes with community.
                          </p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button icon={<SendIcon />} className="mt-4" loading={createPaletteMutation.isLoading}>
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
