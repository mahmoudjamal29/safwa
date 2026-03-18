'use client'

import { useEffect, useState } from 'react'

import { MonitorSmartphone, Share, SquarePlus } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

type InstallState =
  | { type: 'hidden' }
  | { type: 'android'; prompt: BeforeInstallPromptEvent }
  | { type: 'ios' }

function isIos() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent)
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)
  )
}

export function InstallPwaButton() {
  const t = useTranslations('layout.sidebar')
  const [state, setState] = useState<InstallState>({ type: 'hidden' })
  const [iosDialogOpen, setIosDialogOpen] = useState(false)

  useEffect(() => {
    if (isStandalone()) return

    if (isIos()) {
      setState({ type: 'ios' })
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setState({ type: 'android', prompt: e as BeforeInstallPromptEvent })
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  if (state.type === 'hidden') return null

  const handleClick = async () => {
    if (state.type === 'android') {
      await state.prompt.prompt()
      const { outcome } = await state.prompt.userChoice
      if (outcome === 'accepted') setState({ type: 'hidden' })
    } else {
      setIosDialogOpen(true)
    }
  }

  return (
    <>
      <div className="px-3 py-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-3"
          onClick={handleClick}
        >
          <MonitorSmartphone className="size-4 shrink-0" />
          <span>{t('installApp')}</span>
        </Button>
      </div>

      {/* iOS instructions dialog */}
      <Dialog open={iosDialogOpen} onOpenChange={setIosDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t('installApp')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2 text-sm text-muted-foreground">
            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                1
              </span>
              <div className="flex items-center gap-2">
                <span>{t('installIosStep1')}</span>
                <Share className="size-4 shrink-0 text-foreground" />
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                2
              </span>
              <div className="flex items-center gap-2">
                <span>{t('installIosStep2')}</span>
                <SquarePlus className="size-4 shrink-0 text-foreground" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
