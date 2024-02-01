'use client'

import Link from 'next/link'
import { match } from 'ts-pattern'
import Container from '~/components/ui/container'
import CreateWebsiteDialog from './_components/create-website-dialog'
import { api } from '~/trpc/react'
import ErrorMessage from '~/components/ui/error-message'
import DeleteWebsiteDialog from './_components/delete-website-dialog'

export default function Websites() {
  const websitesQuery = api.websites.findAll.useQuery()

  return match(websitesQuery)
    .with({ status: 'loading' }, () => (
      <Container>
        <div className="mb-1 h-8 w-32 animate-pulse rounded-md bg-card" />
        <div className="mb-4 h-10 w-full animate-pulse rounded-md bg-card" />

        <div className="mb-4 flex items-center justify-end">
          <div className="h-10 w-28 animate-pulse rounded-md bg-card" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 5 }, (_, i) => (
            <div key={i} className="h-40 w-full animate-pulse rounded-md bg-card" />
          ))}
        </div>
      </Container>
    ))
    .with({ status: 'error' }, () => (
      <div className="flex h-full w-full items-center justify-center">
        <ErrorMessage />
      </div>
    ))
    .with({ status: 'success' }, ({ data: websites }) => (
      <Container>
        <h1 className="mb-1 text-3xl font-bold">My Websites</h1>
        <p className="mb-4 text-sm text-muted-foreground">
          View and manage the websites you&apos;ve created. Easily track details such as name, URL, and associated color
          palettes, and make adjustments to settings as needed.
        </p>

        <div className="mb-4 flex items-center justify-end">
          <CreateWebsiteDialog />
        </div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {websites.map((website) => (
            <Link key={website.id} className="space-y-2 rounded-md border bg-card p-4" href={`/websites/${website.id}`}>
              <h1 className="text-xl font-bold">{website.name}</h1>
              {!!website.description && <p className="text-sm text-muted-foreground">{website.description}</p>}

              <Link
                className="!mb-4 block rounded-md border px-2 py-1 text-sm text-accent-foreground hover:bg-accent"
                href={website.url}
                target="_blank"
              >
                {website.url}
              </Link>

              <DeleteWebsiteDialog id={website.id} />
            </Link>
          ))}
        </div>
      </Container>
    ))
    .exhaustive()
}
