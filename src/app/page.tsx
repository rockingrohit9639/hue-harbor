import { CogIcon, GithubIcon, PaintBucket, WaypointsIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cloneElement } from 'react'
import colors from 'tailwindcss/colors'
import Navbar from '~/components/navbar'
import { getServerAuthSession } from '~/server/auth'

const BOX_COLORS = [
  colors.red['500'],
  colors.amber['500'],
  colors.green['500'],
  colors.blue['500'],
  colors.violet['500'],
  colors.emerald['500'],
  colors.purple['500'],
  colors.teal['500'],
  colors.rose['500'],
]

const FEATURES = [
  {
    title: 'Create Custom Color Palettes',
    content: 'Easily create personalized color palettes using our intuitive interface and advanced color tools.',
    icon: <PaintBucket />,
  },
  {
    title: 'Manage Your Palettes',
    content: 'Organize, edit, and customize your color palettes with ease, ensuring consistency across your projects.',
    icon: <CogIcon />,
  },
  {
    title: 'Seamless Integration',
    content: 'Integrate your palettes into your projects effortlessly using our CDN or API options.',
    icon: <WaypointsIcon />,
  },
]

const STEPS = [
  {
    title: 'Sign Up for Free',
    content:
      'Create your Hue Harbor account in minutes and gain instant access to our powerful palette management tools.',
  },
  {
    title: 'Create Your Palette',
    content:
      'Use our color picker and customization options to create your custom color palette or import existing palettes.',
  },
  {
    title: 'Integrate with Your Projects',
    content:
      'Easily integrate your palettes into your websites, apps, or designs using our provided CDN or plugin options.',
  },
]

export default async function LandingPage() {
  const session = await getServerAuthSession()

  return (
    <div className="bg-white">
      <Navbar />
      <section className="py-12md:py-24 h-screen w-full bg-gray-100 text-black lg:py-32">
        <div className="flex h-full w-full items-center justify-center">
          <div className="container grid h-full w-full md:grid-cols-2">
            <div className="flex flex-col justify-center gap-4 md:max-w-[90%]">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-6xl">Welcome to Hue Harbor</h1>
              <p className="text-lg tracking-tight text-muted-foreground">
                Unleash your creativity with Hue Harbor. Effortlessly manage and integrate stunning color palettes into
                your projects. Get started today and elevate your designs.
              </p>
              <Link
                href={session?.user ? '/app' : '/auth/login'}
                className="w-max rounded-md bg-black px-4 py-2 text-white"
              >
                Create Your Palette
              </Link>
            </div>
            <div className="flex items-center justify-center">
              <div className="grid grid-cols-3 gap-4">
                {BOX_COLORS.map((color) => (
                  <div key={color} className="h-20 w-20 rounded" style={{ backgroundColor: color }} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="border-b border-b-gray-100">
        <div className="container grid text-black md:grid-cols-2">
          <div className="hidden h-full md:block">
            <Image
              src="/about.jpg"
              alt="about"
              width={1000}
              height={1000}
              className="h-full max-h-[500px] w-full object-cover"
            />
          </div>
          <div className="flex flex-col items-end justify-center gap-4 p-8">
            <h1 className="text-right text-4xl font-bold tracking-tighter">Hue Harbor</h1>
            <p className="text-right text-lg tracking-tight text-muted-foreground">
              At Hue Harbor, we are passionate about simplifying color palette management for designers, developers, and
              creatives. Our platform provides intuitive tools to create, customize, and integrate stunning color
              palettes seamlessly. Join our community and bring your projects to life with vibrant colors and effortless
              creativity.
            </p>
            <Link href="/public/palettes" className="w-max rounded-md bg-black px-4 py-2 text-white">
              Explore Palettes
            </Link>
          </div>
        </div>
      </section>

      {/* Features  */}
      <section className="container grid gap-4 py-20 md:grid-cols-3">
        {FEATURES.map((feature, i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center gap-4 rounded-md border border-gray-100 p-4 text-black shadow"
          >
            <div className="flex items-center justify-center rounded-md bg-primary p-4">
              {cloneElement(feature.icon, { className: 'text-white' })}
            </div>
            <h1 className="text-lg font-bold">{feature.title}</h1>
            <p className="text-center text-sm text-muted-foreground">{feature.content}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto flex max-w-screen-sm flex-col items-center justify-center gap-4 px-10 py-20">
        {STEPS.map((step, i) => (
          <>
            <div className="rounded-md border px-4 py-2 text-black">
              <h1 className="mb-2 text-2xl font-bold">
                {i + 1}. {step.title}
              </h1>
              <p>{step.content}</p>
            </div>
            {i < STEPS.length - 1 ? <div className="h-10 w-[1px] bg-gray-300" /> : null}
          </>
        ))}
      </section>

      <footer className="border-t border-t-gray-100 text-black">
        <div className="container flex items-center justify-between p-4">
          <div>&copy; 2024 Rohit Saini</div>

          <Link href="https://github.com/rockingrohit9639/hue-harbor" target="_blank">
            <GithubIcon />
          </Link>
        </div>
      </footer>
    </div>
  )
}
