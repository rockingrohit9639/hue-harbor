import Navbar from '~/components/navbar'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar className="border-b-border bg-background dark:text-white" />
      <div className="pt-16">{children}</div>
    </>
  )
}
