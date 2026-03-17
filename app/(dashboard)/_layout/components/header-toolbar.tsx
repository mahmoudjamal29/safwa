'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'

import { UserDropdown } from './user-dropdown'

export function HeaderToolbar() {
  const t = useTranslations('layout.header')
  const { resolvedTheme, setTheme } = useTheme()

  const switchLocale = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`
    window.location.reload()
  }

  return (
    <nav className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
        aria-label="Toggle theme"
      >
        <Sun className="size-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Moon className="absolute size-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      </Button>

      <button
        onClick={() => switchLocale(document.cookie.includes('NEXT_LOCALE=en') ? 'ar' : 'en')}
        className="rounded border border-border px-3 py-1 text-xs text-muted-foreground transition hover:border-primary/30 hover:text-primary"
      >
        {t('switchLanguage')}
      </button>
      <UserDropdown />
    </nav>
  )
}
