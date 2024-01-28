import Link, { LinkProps } from 'next/link'
import { usePathname } from 'next/navigation'
import React, { cloneElement } from 'react'
import { buttonVariants } from '~/components/ui/button'
import { cn } from '~/lib/utils'

type Props = LinkProps & {
  icon?: React.ReactElement<{ className?: string }>
  label: string
}

export default function NavLink({ href, icon, label }: Props) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(buttonVariants({ variant: isActive ? 'default' : 'ghost' }), 'w-full justify-start gap-2')}
    >
      {icon ? cloneElement(icon, { className: 'w-4 h-4' }) : null}
      <span className="truncate">{label}</span>
    </Link>
  )
}
