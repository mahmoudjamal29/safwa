'use client'

import { signOut, useSession } from 'next-auth/react'

import { LogOutIcon, UserIcon } from '@/lib/icons'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export function UserDropdown() {
  const t = useTranslations('layout.header')
  const { data: session } = useSession()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8 rounded-full border border-border">
          {session?.user?.image ? (
            <Avatar className="size-6">
              <AvatarImage src={session.user.image} />
              <AvatarFallback>{session.user.name?.[0]}</AvatarFallback>
            </Avatar>
          ) : (
            <UserIcon className="size-4 text-muted-foreground" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {session?.user && (
          <div className="px-2 py-1.5 text-sm">
            <div className="font-medium">{session.user.name}</div>
            <div className="text-xs text-muted-foreground">{session.user.email}</div>
          </div>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
          <LogOutIcon className="me-2 size-4" />
          {t('userMenu.logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
