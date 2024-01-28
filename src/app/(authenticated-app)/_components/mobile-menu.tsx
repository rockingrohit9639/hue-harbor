'use client'

import React, { useState } from 'react'
import { LogOutIcon, MenuIcon } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import { Sheet, SheetContent, SheetHeader, SheetTrigger } from '~/components/ui/sheet'
import { Button } from '~/components/ui/button'
import NavLink from './nav-link'
import { ROUTES } from './sidebar'

export default function MobileMenu() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { data } = useSession()
  if (!data) return null

  return (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <MenuIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>

      <SheetContent className="h-full ">
        <SheetHeader className="mb-4">
          <Link className="flex items-center gap-2" href="/">
            <Image src="/logo.png" alt="logo" width={100} height={100} className="w-10" />
            <h1 className="text-xl font-bold">Hue Harbor</h1>
          </Link>
        </SheetHeader>

        <div className="flex h-[95%] flex-col justify-between">
          <div className="space-y-2">
            {ROUTES.map((route) => (
              <NavLink key={route.path} href={route.path} label={route.label} icon={route.icon} />
            ))}

            <NavLink
              href="/profile"
              label="Profile"
              icon={
                <Image
                  src={data.user.image!}
                  alt="avatar"
                  width={80}
                  height={80}
                  className="h-6 w-6 rounded-full object-cover"
                />
              }
            />
          </div>

          <Button
            icon={<LogOutIcon />}
            variant="outline"
            onClick={() => {
              signOut()
            }}
          >
            Logout
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
