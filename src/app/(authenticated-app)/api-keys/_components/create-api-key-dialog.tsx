'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ShieldPlus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '~/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { CreateApiKeyInput, createApiKeyInput } from '~/server/api/routers/api-key/api-key.input'
import { api } from '~/trpc/react'

type CreateApiKeyDialogProps = {
  className?: string
  style?: React.CSSProperties
}

export default function CreateApiKeyDialog({ className, style }: CreateApiKeyDialogProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<CreateApiKeyInput>({
    resolver: zodResolver(createApiKeyInput),
    defaultValues: {
      name: '',
    },
  })

  const utils = api.useUtils()
  const createApiKeyMutation = api.apiKeys.create.useMutation({
    onSuccess: () => {
      form.reset({ name: '' })
      utils.apiKeys.findAll.invalidate()
      setOpen(false)

      toast.success('Api key created successfully!')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  function handleCreateApiKey(values: CreateApiKeyInput) {
    createApiKeyMutation.mutate(values)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create API key</Button>
      </DialogTrigger>

      <DialogContent className={className} style={style}>
        <DialogHeader>
          <DialogTitle>Create new api key</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleCreateApiKey)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name for your API key" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button icon={<ShieldPlus />} className="mt-4">
              Create Key
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
