'use client'

import React from 'react'
import { GlobeIcon, HomeIcon, Key, LogOutIcon, SwatchBookIcon } from 'lucide-react'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import Image from 'next/image'
import NavLink from './nav-link'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { cn } from '~/lib/utils'
import ThemeToggler from './theme-toggler'

type SidebarProps = React.HTMLAttributes<HTMLDivElement>

export const ROUTES = [
  {
    path: '/app',
    label: 'Home',
    icon: <HomeIcon />,
  },
  {
    path: '/websites',
    label: 'My Websites',
    icon: <GlobeIcon />,
  },
  {
    path: '/palettes',
    label: 'My Palettes',
    icon: <SwatchBookIcon />,
  },
  {
    path: '/api-keys',
    label: 'My API Keys',
    icon: <Key />,
  },
  {
    path: '/public/palettes',
    label: 'Explore Palettes',
    icon: <Key />,
  },
]

export function Sidebar({ className, ...restProps }: SidebarProps) {
  const { data } = useSession({ required: true })

  if (!data) {
    return null
  }

  const userData = data.user

  return (
    <div className={cn('h-full border-r', className)} {...restProps}>
      <div className="flex h-full flex-col justify-between space-y-4 px-3 py-4">
        <div>
          <Link className="mb-4 flex flex-col items-center" href="/app">
            <Image src="/logo.png" alt="logo" width={100} height={100} className="w-10" />
            <h1 className="text-center text-xl font-bold">Hue Harbor</h1>
          </Link>

          <div className="space-y-2 py-2">
            {ROUTES.map((route) => (
              <NavLink key={route.path} href={route.path} label={route.label} icon={route.icon} />
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <ThemeToggler
            trigger={
              <Button variant="outline" className="w-full">
                Change Theme
              </Button>
            }
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full cursor-pointer">
                <div className="flex items-center gap-2">
                  {!!userData?.image && (
                    <Image
                      src={userData.image}
                      alt="avatar"
                      width={80}
                      height={80}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  )}
                  <p>{userData?.name}</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{userData?.email}</DropdownMenuLabel>

              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => {
                  signOut()
                }}
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
