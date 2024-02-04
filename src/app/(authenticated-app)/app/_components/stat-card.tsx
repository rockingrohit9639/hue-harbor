import { cloneElement } from 'react'
import { cn } from '~/lib/utils'

type StatCardProps = {
  className?: string
  style?: React.CSSProperties
  title: string
  value: string | number
  icon: React.ReactElement<{ className?: string }>
}

export default function StatCard({ className, style, title, value, icon }: StatCardProps) {
  return (
    <div className={cn('flex items-center gap-4 rounded-md bg-gray-50 p-4 dark:bg-card', className)} style={style}>
      <div className="flex flex-col items-center justify-center rounded-md bg-primary p-3">
        {cloneElement(icon, { className: 'w-5 h-5 text-white' })}
      </div>
      <div className="flex flex-col justify-center gap-1">
        <p className="font-medium leading-none text-muted-foreground">{title}</p>
        <p className="text-2xl font-medium leading-none">{value}</p>
      </div>
    </div>
  )
}
