import Image from 'next/image'
import Link from 'next/link'
import { cn } from '~/lib/utils'
import ThemeToggler from './theme-toggler'
import { Sidebar } from './sidebar'
import MobileMenu from './mobile-menu'

type AppShellProps = {
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

export default function AppShell({ className, style, children }: AppShellProps) {
  return (
    <div className={cn('grid h-screen grid-cols-12', className)} style={style}>
      <Sidebar className="hidden md:col-span-2 md:block" />

      <div className="relative col-span-12 overflow-y-auto md:col-span-10">
        <div className="sticky left-0 top-0 z-50 flex h-16 w-full items-center justify-between border-b bg-background/50 px-4 backdrop-blur-lg md:hidden">
          <Link className="flex items-center gap-2" href="/app">
            <Image src="/logo.png" alt="logo" width={100} height={100} className="w-10" />
            <h1 className="text-xl font-bold">Hue Harbor</h1>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggler />
            <MobileMenu />
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
