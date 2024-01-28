'use client'

import { signIn } from 'next-auth/react'

export default function Login() {
  return (
    <div className="flex h-screen items-center justify-center">
      <button
        onClick={() => {
          signIn('google')
        }}
      >
        Login
      </button>
    </div>
  )
}
