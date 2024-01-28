import { cn } from '~/lib/utils'

type ContainerProps = {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export default function Container({ className, style, children }: ContainerProps) {
  return (
    <div className={cn('mx-auto h-full max-w-screen-xl p-4', className)} style={style}>
      {children}
    </div>
  )
}
