import { cn } from '~/lib/utils'
import { Variable } from '~/schema/palette'

type BackgroundProps = {
  className?: string
  style?: React.CSSProperties
  variables: Variable[]
}

export default function Background({ className, style, variables }: BackgroundProps) {
  return (
    <div className={cn('pointer-events-none absolute -z-0 flex h-screen w-full items-center', className)} style={style}>
      {variables.reverse().map((variable, i) => (
        <div
          key={variable.id}
          className={cn('flex h-full flex-1 items-end p-8 text-lg font-medium')}
          style={{ background: variable.value, flexGrow: variables.length - i }}
        >
          <p className="hidden md:block">{variable.name}</p>
        </div>
      ))}
    </div>
  )
}
