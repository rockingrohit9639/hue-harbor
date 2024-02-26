import { GithubIcon } from 'lucide-react'
import Link from 'next/link'
import { cloneElement } from 'react'
import Navbar from '~/components/navbar'
import { HOMEPAGE_PALETTE_SLUG } from '~/lib/constants'
import { variablesSchema } from '~/schema/palette'
import { db } from '~/server/db'
import Background from './_components/background'
import Container from '~/components/ui/container'
import { cn } from '~/lib/utils'
import { buttonVariants } from '~/components/ui/button'
import { FAQS, FEATURES, STEPS } from '~/lib/home'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '~/components/ui/accordion'

export default async function LandingPage() {
  const palette = await db.palette.findFirstOrThrow({ where: { slug: HOMEPAGE_PALETTE_SLUG } })
  const variables = variablesSchema.parse(palette.variables)

  return (
    <div className="bg-white">
      <Navbar />
      <section className="relative min-h-screen">
        <Background variables={variables} />

        <Container className="relative flex h-screen flex-col justify-center">
          <h1 className="text-8xl font-bold text-white md:text-[140px]">Hue Harbor</h1>
          <p className="text-2xl font-medium text-muted-foreground">Elevate Your Projects with Vibrant Colors</p>
        </Container>
      </section>

      {/* About Us */}
      <section className="bg-[url(/about-bg.jpg)] bg-cover py-40">
        <div className="flex flex-col items-center justify-center gap-4 p-8 text-center">
          <h1 className="text-4xl font-bold tracking-tighter text-black">Unleashing Creativity with Hue Harbor</h1>
          <p className="text-lg tracking-tight text-gray-500 md:w-[60%]">
            At Hue Harbor, we are passionate about simplifying color palette management for designers, developers, and
            creatives. Our platform provides intuitive tools to create, customize, and integrate stunning color palettes
            seamlessly. Join our community and bring your projects to life with vibrant colors and effortless
            creativity.
          </p>

          <Link href="/public/palettes" className="mt-4 w-max rounded-full bg-black px-4 py-2 text-white">
            Explore Palettes
          </Link>
        </div>
      </section>

      {/* Features  */}
      <section className="bg-gray-50 py-40">
        <Container className="grid gap-4 md:grid-cols-3">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              className="flex h-96 flex-col items-center justify-center gap-4 rounded-2xl border-2 border-gray-100 bg-white px-4 py-8 text-black shadow-sm"
            >
              {cloneElement(feature.icon, { className: 'text-primary w-10 h-10' })}
              <h1 className="text-xl font-bold">{feature.title}</h1>
              <p className="text-center text-sm text-muted-foreground md:w-[80%]">{feature.content}</p>
            </div>
          ))}
        </Container>
      </section>

      <section className="bg-gray-50 py-40">
        <h1 className="mb-8 text-center text-5xl font-bold text-black">How to use Hue Harbor?</h1>
        <Container className="flex w-full flex-col items-center justify-center gap-4">
          {STEPS.map((step, i) => (
            <>
              <div className="w-full rounded-md border border-gray-200 bg-white px-4 py-2 text-black">
                <h1 className="mb-2 text-2xl font-bold">
                  {i + 1}. {step.title}
                </h1>
                <p className="text-gray-500">{step.content}</p>
              </div>
              {i < STEPS.length - 1 ? <div className="h-10 w-[1px] bg-gray-300" /> : null}
            </>
          ))}
        </Container>
      </section>

      <section className="mx-auto max-w-screen-lg py-40">
        <h1 className="mb-8 text-center text-4xl font-bold text-black md:text-6xl">FAQs</h1>
        <Accordion type="single" collapsible>
          {FAQS.map((faq, i) => (
            <AccordionItem value={faq.question} key={i}>
              <AccordionTrigger className="text-black hover:no-underline">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-gray-500">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <section className="py-40 text-center">
        <h1 className="mb-8 text-4xl font-bold text-black md:text-6xl">Sign up today.</h1>
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          <Link href="/auth/login" className={cn(buttonVariants(), 'rounded-full bg-black')}>
            Get Started
          </Link>
        </div>
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
