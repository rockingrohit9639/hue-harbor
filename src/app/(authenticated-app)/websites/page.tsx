import Container from '~/components/ui/container'
import CreateWebsiteDialog from './_components/create-website-dialog'

export default function Websites() {
  return (
    <Container>
      <h1 className="mb-1 text-3xl font-bold">My Websites</h1>
      <p className="mb-4 text-sm text-muted-foreground">
        View and manage the websites you&apos;ve created. Easily track details such as name, URL, and associated color
        palettes, and make adjustments to settings as needed.
      </p>

      <div className="flex items-center justify-end">
        <CreateWebsiteDialog />
      </div>
    </Container>
  )
}
