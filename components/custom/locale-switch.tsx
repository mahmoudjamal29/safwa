'use client'

import { Globe } from 'lucide-react'
import { useRouter, usePathname } from 'next/navigation'

import { cn } from '@/utils'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

export const locales = ['en', 'ar'] as const
export type Locales = (typeof locales)[number]

export function LocaleSwitch({ className }: { className?: string }) {
  const router = useRouter()
  const pathname = usePathname()

  const switchLocale = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=lax`
    router.refresh()
  }

  const currentLocale = typeof document !== 'undefined' && document.cookie.includes('NEXT_LOCALE=ar') ? 'ar' : 'en'

  return (
    <Select
      defaultValue={currentLocale}
      onValueChange={(value: string) => switchLocale(value)}
    >
      <SelectTrigger
        className={cn(
          'hover:bg-accent/20 w-full gap-2 rounded-lg transition-colors duration-200 border-0 bg-transparent',
          className
        )}
      >
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 shrink-0 opacity-70" />
        </div>
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        className="bg-background/95 border-border/40 min-w-[140px] backdrop-blur-sm"
        sideOffset={5}
      >
        <SelectItem
          className="hover:bg-accent/60 focus:bg-accent/60 cursor-pointer"
          key="en"
          value="en"
        >
          <span className="font-medium">English</span>
        </SelectItem>
        <SelectItem
          className="hover:bg-accent/60 focus:bg-accent/60 cursor-pointer"
          key="ar"
          value="ar"
        >
          <span className="font-medium">العربية</span>
        </SelectItem>
      </SelectContent>
    </Select>
  )
}
