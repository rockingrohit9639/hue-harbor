'use client'

import { Trash2Icon } from 'lucide-react'
import { toast } from 'sonner'
import Alert from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { api } from '~/trpc/react'

type DeleteWebsiteDialogProps = {
  className?: string
  style?: React.CSSProperties
  id: string
}

export default function DeleteWebsiteDialog({ className, style, id }: DeleteWebsiteDialogProps) {
  const deleteWebsiteMutation = api.websites.delete.useMutation({
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success('Website removed successfully!')
    },
  })

  return (
    <Alert
      className={className}
      style={style}
      loading={deleteWebsiteMutation.isLoading}
      trigger={<Button icon={<Trash2Icon />} variant="destructive-outline" />}
      title="Remove website"
      description="Are you sure you want to delete this website?"
      onOk={() => {
        deleteWebsiteMutation.mutate(id)
      }}
    />
  )
}
