"use client"
import { ChevronUp } from "lucide-react"
import Image from "next/image"
import { useClerk, useUser } from "@clerk/nextjs"
import { useTheme } from "next-themes"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar"

export function SidebarUserNav() {
  const { setTheme, theme } = useTheme()
  const { signOut } = useClerk()
  const { user } = useUser()

  if (!user) return null

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10">
              <Image
                src={
                  user.imageUrl ||
                  `https://avatar.vercel.sh/${user.emailAddresses[0]?.emailAddress}`
                }
                alt={user.emailAddresses[0]?.emailAddress ?? "User Avatar"}
                width={24}
                height={24}
                className="rounded-full"
              />
              <span className="truncate">
                {user.emailAddresses[0]?.emailAddress}
              </span>
              <ChevronUp className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="top"
            className="w-[--radix-popper-anchor-width]"
          >
            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {`Toggle ${theme === "light" ? "dark" : "light"} mode`}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <button
                type="button"
                className="w-full cursor-pointer"
                onClick={() => signOut()}
              >
                Sign out
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
