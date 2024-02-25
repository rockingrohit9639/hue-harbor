'use client'

import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import ThemeToggler from '~/app/(authenticated-app)/app/_components/theme-toggler'
import { cn } from '~/lib/utils'

type NavbarProps = {
  className?: string
  style?: React.CSSProperties
  showThemeToggler?: boolean
}

export default function Navbar({ className, style, showThemeToggler }: NavbarProps) {
  const { data } = useSession()

  return (
    <nav
      className={cn(
        'fixed left-0 top-0 h-16 w-full border-b border-b-gray-100 bg-white/50 text-black backdrop-blur-md',
        className,
      )}
      style={style}
    >
      <div className="container flex h-full items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="logo" width={100} height={100} className="w-10 object-contain" />
          <h1 className="text-xl font-bold">Hue Harbor</h1>
        </Link>
        <div className="flex items-center gap-4">
          {!!showThemeToggler && <ThemeToggler />}
          {data?.user ? <Link href="/app">Dashboard</Link> : <Link href="/auth/login">Login</Link>}
        </div>
      </div>
    </nav>
  )
}
