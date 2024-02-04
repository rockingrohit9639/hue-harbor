import Navbar from '~/components/navbar'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="mt-16">{children}</div>
    </>
  )
}
