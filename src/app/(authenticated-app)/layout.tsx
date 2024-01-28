import { redirect } from 'next/navigation'
import { getServerAuthSession } from '~/server/auth'
import AppShell from './_components/app-shell'

export default async function AuthenticatedAppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerAuthSession()

  if (!session) {
    return redirect('/api/auth/signin')
  }

  return <AppShell>{children}</AppShell>
}
