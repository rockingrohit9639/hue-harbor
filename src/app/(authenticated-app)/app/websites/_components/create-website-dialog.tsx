'use client'

import { PlusIcon, SendIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import { CreateWebsiteInput, createWebsiteInput } from '~/server/api/routers/websites/websites.input'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { api } from '~/trpc/react'
import OriginsInput from './origins-input'

type CreateWebsiteDialogProps = {
  className?: string
  style?: React.CSSProperties
}

export default function CreateWebsiteDialog({ className, style }: CreateWebsiteDialogProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<CreateWebsiteInput>({
    resolver: zodResolver(createWebsiteInput),
    defaultValues: {
      name: '',
      description: '',
      url: '',
    },
  })

  const utils = api.useUtils()

  const createWebsiteMutation = api.websites.create.useMutation({
    onSuccess: () => {
      utils.websites.findAll.invalidate()
      form.reset()
      setOpen(false)
      toast.success('Website created successfully!')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  function handleCreateWebsite(values: CreateWebsiteInput) {
    createWebsiteMutation.mutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button icon={<PlusIcon />}>Add new website</Button>
      </DialogTrigger>

      <DialogContent className={className} style={style}>
        <DialogHeader>
          <DialogTitle>Add a new website</DialogTitle>
          <DialogDescription>
            Create a new website entry with a name and URL to associate color palettes and manage website settings.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateWebsite)} className="grid gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., My Portfolio Website" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., www.myportfolio.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="allowedOrigins"
              render={() => (
                <FormItem>
                  <FormLabel>Allowed Origins</FormLabel>
                  <FormControl>
                    <OriginsInput name="allowedOrigins" placeholder="Enter origin" />
                  </FormControl>

                  <FormDescription>
                    Only these origins urls will be allowed to access this website palettes.
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="e.g., This is my personal portfolio showcasing my projects and skills."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button icon={<SendIcon />} className="mt-4" loading={createWebsiteMutation.isLoading}>
              Create
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
