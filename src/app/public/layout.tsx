import Navbar from '~/components/navbar'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <div className="bg-white pt-16">{children}</div>
    </>
  )
}
