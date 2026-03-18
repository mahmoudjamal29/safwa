"use client"

import { useEffect, useState } from "react"

import { useRouter } from "next/navigation"

import type { User } from "@supabase/supabase-js"
import { useTranslations } from "next-intl"

import { LogOutIcon, UserIcon } from "@/lib/icons"
import { createClient } from "@/lib/supabase/client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserDropdown() {
  const t = useTranslations("layout.header")
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/auth/signin")
  }

  const name =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split("@")[0] ??
    ""

  const email = user?.email ?? ""
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined

  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-full border border-border"
        >
          <Avatar className="size-8">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="text-xs">
              {initials || <UserIcon className="size-4 text-muted-foreground" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        {(name || email) && (
          <>
            <div className="px-3 py-2">
              {name && (
                <p className="truncate text-sm font-medium">{name}</p>
              )}
              {email && (
                <p className="truncate text-xs text-muted-foreground">{email}</p>
              )}
            </div>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
          <LogOutIcon className="me-2 size-4" />
          {t("userMenu.logout")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
