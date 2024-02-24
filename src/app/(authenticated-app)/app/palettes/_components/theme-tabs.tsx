import { cn } from '~/lib/utils'
import { usePaletteStore } from '~/stores'
import AddThemeDialog from './add-theme-dialog'

type ThemeTabsProps = {
  className?: string
  style?: React.CSSProperties
}

export default function ThemeTabs({ className, style }: ThemeTabsProps) {
  const themes = usePaletteStore((store) => store.themes)

  return (
    <div className={cn('relative flex items-center border-b bg-background px-4 pt-4', className)} style={style}>
      <div className="flex items-center">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className="cursor-pointer rounded-tl-md rounded-tr-md border border-b-0 px-4 py-2 transition-colors duration-100 hover:bg-accent"
          >
            {theme.name}
          </div>
        ))}
      </div>

      <AddThemeDialog />
    </div>
  )
}
