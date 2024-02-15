'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { ExternalLinkIcon, RotateCwIcon } from 'lucide-react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { match } from 'ts-pattern'
import { Button, buttonVariants } from '~/components/ui/button'
import Container from '~/components/ui/container'
import ErrorMessage from '~/components/ui/error-message'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import Loader from '~/components/ui/loader'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { Textarea } from '~/components/ui/textarea'
import UsagePopover from '~/components/usage-popover'
import { cn, getWebsiteCdnContent } from '~/lib/utils'
import { UpdateWebsiteInput, updateWebsiteInput } from '~/server/api/routers/websites/websites.input'
import { api } from '~/trpc/react'
import OriginsInput from '../_components/origins-input'

export default function WebsiteDetails({ params }: { params: { id: string } }) {
  const form = useForm<UpdateWebsiteInput>({
    resolver: zodResolver(updateWebsiteInput.omit({ id: true })),
  })

  const websiteQuery = api.websites.findById.useQuery(params.id, {
    onSuccess: (data) => {
      form.reset({
        name: data.name,
        description: data.description ?? '',
        url: data.url,
        palette: data.paletteId ?? undefined,
        allowedOrigins: data.allowedOrigins,
      })
    },
  })

  const palettesQuery = api.palettes.findAll.useQuery()

  const updateWebsiteMutation = api.websites.update.useMutation({
    onSuccess: () => {
      websiteQuery.refetch()
      toast.success('Website updates successfully!')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  function handleUpdateWebsite(values: UpdateWebsiteInput) {
    updateWebsiteMutation.mutate({ ...values, id: params.id })
  }

  return match(websiteQuery)
    .with({ status: 'loading' }, () => (
      <div className="flex h-full w-full items-center justify-center">
        <Loader title="Fetching website details, please wait..." />
      </div>
    ))
    .with({ status: 'error' }, () => (
      <div className="flex h-full w-full items-center justify-center">
        <ErrorMessage />
      </div>
    ))
    .with({ status: 'success' }, ({ data: website }) => (
      <Container>
        <div className="mb-4 flex justify-between">
          <div>
            <h1 className="truncate text-2xl font-bold">{website.name}</h1>
            {!!website.description && <p className="truncate text-sm text-muted-foreground">{website.description}</p>}
          </div>

          <div className="flex items-center gap-2">
            <UsagePopover cdnContent={getWebsiteCdnContent(params.id)} />
            <Link href={website.url} target="_blank" className={cn(buttonVariants({ variant: 'outline' }))}>
              <ExternalLinkIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleUpdateWebsite)} className="grid gap-4 md:grid-cols-2">
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
              name="palette"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Palette</FormLabel>
                  <FormControl>
                    <Select {...field} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Palette" />

                        <SelectContent>
                          {palettesQuery.data?.map((palette) => (
                            <SelectItem key={palette.id} value={palette.id}>
                              {palette.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </SelectTrigger>
                    </Select>
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
                    <OriginsInput placeholder="Enter origin url" name="allowedOrigins" />
                  </FormControl>

                  <FormDescription>
                    Only these origins urls will be allowed to access this website palettes.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-full">
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

            <Button icon={<RotateCwIcon />} className="mt-4 w-max" loading={updateWebsiteMutation.isLoading}>
              Update
            </Button>
          </form>
        </Form>
      </Container>
    ))
    .exhaustive()
}
