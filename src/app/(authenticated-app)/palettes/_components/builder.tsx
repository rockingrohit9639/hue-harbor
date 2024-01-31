import { usePaletteStore } from '~/stores'

type BuilderProps = {
  className?: string
  style?: React.CSSProperties
}

export default function Builder({ className, style }: BuilderProps) {
  const variables = usePaletteStore((store) => store.variables)
  console.log(variables)

  return (
    <div className={className} style={style}>
      Palette Builder
    </div>
  )
}
