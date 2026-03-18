'use client'

import { useEffect, useState } from 'react'

import { MonitorSmartphone } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPwaButton() {
  const t = useTranslations('layout.sidebar')
  const [installPrompt, setInstallPrompt] =
    useState<BeforeInstallPromptEvent | null>(null)

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return

    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (!installPrompt) return null

  const handleInstall = async () => {
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') setInstallPrompt(null)
  }

  return (
    <div className="px-3 py-2">
      <Button
        variant="outline"
        className="w-full justify-start gap-3"
        onClick={handleInstall}
      >
        <MonitorSmartphone className="size-4 shrink-0" />
        <span>{t('installApp')}</span>
      </Button>
    </div>
  )
}
