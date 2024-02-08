'use client'

import { CopyIcon, MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '~/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { api } from '~/trpc/react'

type PaletteActionsProps = {
  className?: string
  style?: React.CSSProperties
  id: string
}

export default function PaletteActions({ className, style, id }: PaletteActionsProps) {
  const duplicatePaletteMutation = api.palettes.duplicate.useMutation({
    onSuccess: () => {
      toast.success('Palette duplicated successfully!')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button icon={<MoreHorizontal />} variant="ghost" size="icon-sm" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className={className} style={style}>
        <DropdownMenuItem
          disabled={duplicatePaletteMutation.isLoading}
          onClick={() => {
            duplicatePaletteMutation.mutate(id)
          }}
        >
          <CopyIcon className="mr-2 h-4 w-4" />
          Duplicate
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
