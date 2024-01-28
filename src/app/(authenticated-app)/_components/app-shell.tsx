import Image from 'next/image'
import Link from 'next/link'
import { cn } from '~/lib/utils'
import ThemeToggler from './theme-toggler'

type AppShellProps = {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export default function AppShell({ className, style, children }: AppShellProps) {
  return (
    <div className={cn(className)} style={style}>
      <div className="fixed left-0 top-0 h-16 w-full border-b bg-background/10 backdrop-blur-lg">
        <div className="mx-auto flex h-full w-full max-w-screen-xl items-center justify-between px-4">
          <Link className="flex items-center gap-2" href="/">
            <Image src="/logo.png" alt="logo" width={100} height={100} className="w-10" />
            <h1 className="text-xl font-bold">Hue Harbor</h1>
          </Link>

          <ThemeToggler />
        </div>
      </div>

      {children}
    </div>
  )
}
