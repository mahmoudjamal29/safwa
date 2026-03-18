'use client'

import { useTranslations } from 'next-intl'

import { InstallPwaButton } from './install-pwa-button'

export function SidebarFooter() {
  const t = useTranslations('layout.sidebar')
  return (
    <div className="border-t border-border">
      <InstallPwaButton />
      <div className="px-5 py-4 text-center text-[10px] text-muted-foreground">
        {t('footer')}
      </div>
    </div>
  )
}
