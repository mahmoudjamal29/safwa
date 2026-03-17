'use client'

import { useTranslations } from 'next-intl'
import { UserDropdown } from './user-dropdown'

export function HeaderToolbar() {
  const t = useTranslations('layout.header')

  const switchLocale = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`
    window.location.reload()
  }

  return (
    <nav className="flex items-center gap-2">
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
