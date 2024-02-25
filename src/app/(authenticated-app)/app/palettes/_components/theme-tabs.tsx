import { cn } from '~/lib/utils'
import { usePaletteStore } from '~/stores'
import AddThemeDialog from './add-theme-dialog'
import ThemeTab from './theme-tab'

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
          <ThemeTab key={theme.id} theme={theme} />
        ))}
      </div>

      <AddThemeDialog />
    </div>
  )
}
