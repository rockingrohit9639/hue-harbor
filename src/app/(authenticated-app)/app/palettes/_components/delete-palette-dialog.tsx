'use client'

import { PaletteVisibility } from '@prisma/client'
import { Trash2Icon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Alert from '~/components/ui/alert'
import { Button } from '~/components/ui/button'
import { api } from '~/trpc/react'

type DeletePaletteDialogProps = {
  className?: string
  style?: React.CSSProperties
  id: string
  visibility: PaletteVisibility
}

export default function DeletePaletteDialog({ className, style, id, visibility }: DeletePaletteDialogProps) {
  const router = useRouter()

  const statsQuery = api.palettes.preDeleteStats.useQuery(id, {
    enabled: visibility === 'PUBLIC',
  })

  const deletePaletteMutation = api.palettes.delete.useMutation({
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () => {
      toast.success('Palette removed successfully!')
      router.replace('/palettes')
    },
  })

  return (
    <Alert
      className={className}
      style={style}
      loading={deletePaletteMutation.isLoading}
      trigger={<Button icon={<Trash2Icon />} variant="destructive-outline" />}
      title="Remove Palette"
      description={
        statsQuery.isSuccess
          ? `This palette is used by ${statsQuery.data.websites} websites, do you really want to delete this ?`
          : 'Are you sure you want to delete this ?'
      }
      onOk={() => {
        deletePaletteMutation.mutate(id)
      }}
    />
  )
}
