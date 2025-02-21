"use client"

import { useClerk } from "@clerk/nextjs"

export const SignOutForm = () => {
  const { signOut } = useClerk()

  return (
    <button
      onClick={() => signOut().then(() => (window.location.href = "/"))}
      className="w-full text-left px-1 py-0.5 text-red-500"
    >
      Sign out
    </button>
  )
}
