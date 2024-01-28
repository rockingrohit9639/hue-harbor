import { LoaderIcon } from 'lucide-react'
import { cn } from '~/lib/utils'

type LoaderProps = {
  className?: string
  style?: React.CSSProperties
  title?: string
  description?: string
}

export default function Loader({ className, style, title = 'Loading please wait...', description }: LoaderProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2', className)} style={style}>
      <LoaderIcon className="animate-spin" />

      <div>
        <p className="mb-1">{title}</p>
        {!!description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}
