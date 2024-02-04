'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

export default function Login() {
  return (
    <div className="container relative hidden h-screen flex-col items-center justify-center overflow-hidden md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <Image
          src="/login.jpg"
          width={1000}
          height={1200}
          alt="background"
          className="absolute inset-0 h-full w-full object-cover opacity-100"
        />
      </div>

      <div className="h-full lg:p-8">
        <div className="h-full">
          <div>
            <Image src="/logo.png" width={100} height={100} alt="logo" className="w-10" />
          </div>

          <div className="mx-auto flex h-full w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <h1 className="text-center text-2xl font-semibold tracking-tight">Welcome Back</h1>

            <div
              className="flex cursor-pointer items-center justify-center gap-4 rounded-md border px-4 py-2 transition hover:bg-muted"
              onClick={() => {
                signIn('google')
              }}
            >
              <Image src="/google.png" alt="google" width={50} height={50} className="w-8 object-contain" />
              <p>Continue with google</p>
            </div>

            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{' '}
              <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
