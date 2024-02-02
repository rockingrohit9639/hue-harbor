'use client'

import { PackageOpen } from 'lucide-react'
import { match } from 'ts-pattern'
import Container from '~/components/ui/container'
import ErrorMessage from '~/components/ui/error-message'
import Loader from '~/components/ui/loader'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table'
import { api } from '~/trpc/react'
import CreateApiKeyDialog from './_components/create-api-key-dialog'

export default function ApiKeys() {
  const apiKeysQuery = api.apiKeys.findAll.useQuery()

  return match(apiKeysQuery)
    .with({ status: 'loading' }, () => <Loader />)
    .with({ status: 'error' }, ({ error }) => <ErrorMessage title={error?.message} />)
    .with({ status: 'success' }, ({ data: apiKeys }) => (
      <Container>
        <h1 className="mb-1 text-3xl font-bold">My Palettes</h1>
        <p className="mb-4 text-sm text-muted-foreground">
          Manage and configure API keys for accessing restricted resources and services.
        </p>

        <div className="flex items-center justify-end my-4">
          <CreateApiKeyDialog />
        </div>

        {apiKeys.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-y-2 rounded-md border p-4">
            <PackageOpen />
            <p className="text-sm text-muted-foreground">No api keys</p>
          </div>
        ) : (
          <Table className="border">
            <TableHeader>
              <TableRow>
                <TableHead>S.No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {apiKeys.map((apiKey, i) => (
                <TableRow key={apiKey.id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{apiKey.name}</TableCell>
                  <TableCell>{apiKey.value}</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Container>
    ))
    .exhaustive()
}
