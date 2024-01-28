'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader } from 'lucide-react'
import AppShell from './_components/app-shell'

export default function AuthenticatedAppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { status } = useSession({
    required: true,
    onUnauthenticated: () => {
      router.replace('/auth/signins')
    },
  })

  if (status === 'loading') {
    return (
      <div className="grid h-screen grid-cols-12">
        <div className="hidden h-full border-r md:col-span-2 md:block">
          <div className="flex h-full flex-col justify-between space-y-4 px-3 py-4">
            <div>
              <div className="mb-4 flex flex-col items-center gap-4">
                <div className="bg-card h-12 w-12 animate-pulse rounded-full" />
                <div className="bg-card h-8 w-full animate-pulse rounded-md" />
              </div>

              <div className="flex flex-col gap-2">
                {Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="bg-card h-8 w-full animate-pulse rounded-md" />
                ))}
              </div>
            </div>

            <div className="bg-card h-8 w-full animate-pulse rounded-md" />
          </div>
        </div>

        <div className="relative col-span-12 overflow-y-auto md:col-span-10">
          <div className="bg-background/50 sticky left-0 top-0 z-50 flex h-16 w-full items-center justify-between border-b px-4 backdrop-blur-lg md:hidden">
            <div className="flex items-center gap-2">
              <div className="bg-card h-10 w-10 animate-pulse rounded-full" />
              <div className="bg-card h-8 w-20 animate-pulse rounded-md" />
            </div>

            <div className="flex items-center gap-2">
              <div className="bg-card h-10 w-10 animate-pulse rounded-md" />
              <div className="bg-card h-10 w-10 animate-pulse rounded-md" />
            </div>
          </div>

          <div className="flex h-full flex-col items-center justify-center gap-4">
            <Loader className="animate-spin" />
            <p className="text-muted-foreground">Loading please wait...</p>
          </div>
        </div>
      </div>
    )
  }

  return <AppShell>{children}</AppShell>
}
