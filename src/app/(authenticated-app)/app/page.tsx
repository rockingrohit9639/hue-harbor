'use client'

import { match } from 'ts-pattern'
import { Globe2, LockIcon, UsersIcon } from 'lucide-react'
import Container from '~/components/ui/container'
import ErrorMessage from '~/components/ui/error-message'
import { api } from '~/trpc/react'
import StatCard from './_components/stat-card'

export default function Home() {
  const statsQuery = api.dashboard.stats.useQuery()

  return match(statsQuery)
    .with({ status: 'loading' }, () => {
      return (
        <Container>
          <div className="grid w-full gap-4 md:grid-cols-3">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-40 w-full animate-pulse rounded-md bg-gray-100 dark:bg-card" />
            ))}
          </div>
        </Container>
      )
    })
    .with({ status: 'error' }, () => (
      <div className="flex h-full w-full items-center justify-center">
        <ErrorMessage title="Something went wrong while fetching dashboard stats." />
      </div>
    ))
    .with({ status: 'success' }, ({ data }) => (
      <Container>
        <h1 className="mb-4 text-3xl font-bold">Dashboard</h1>

        <div className="grid w-full gap-4 md:grid-cols-3">
          <StatCard title="Total Websites" value={data.totalWebsites} icon={<Globe2 />} />
          <StatCard title="Total Public Palettes" value={data.publicPalettes} icon={<UsersIcon />} />
          <StatCard title="Total Private Palettes" value={data.privatePalettes} icon={<LockIcon />} />
        </div>
      </Container>
    ))
    .exhaustive()
}
