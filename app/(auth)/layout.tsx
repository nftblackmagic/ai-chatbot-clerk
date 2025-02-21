"use server"

import React from "react"

interface AuthLayoutProps {
  children: React.ReactNode
}

export default async function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="container mx-auto flex h-full flex-col items-center justify-center md:flex-row">
        {/* Left column (Illustration) */}
        <div className="relative hidden h-full w-full items-center justify-center bg-accent md:flex md:w-1/2">
          {/* Replace with your actual image or illustration */}
          <img
            src="/some-auth-illustration.png"
            alt="Auth illustration"
            className="h-auto w-3/4 object-cover"
          />
        </div>

        {/* Right column (Sign In / Sign Up form) */}
        <div className="flex w-full max-w-md flex-1 items-center justify-center px-6 py-10 md:w-1/2 md:py-0">
          {children}
        </div>
      </div>
    </div>
  )
}
