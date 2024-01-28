import { PackageIcon } from 'lucide-react'
import { cn } from '~/lib/utils'

type ErrorMessageProps = {
  className?: string
  style?: React.CSSProperties
  title?: string
  description?: string
}

export default function ErrorMessage({
  className,
  style,
  title = 'Something went wrong',
  description,
}: ErrorMessageProps) {
  return (
    <div className={cn('flex flex-col items-center gap-4 ', className)} style={style}>
      <PackageIcon />

      <div>
        <p>{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}
