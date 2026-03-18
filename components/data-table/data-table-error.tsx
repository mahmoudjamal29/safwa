'use client'

import { useCallback } from 'react'

import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'

type DataTableErrorProps = {
  description?: string
  error?: unknown
  isError?: boolean
  onReload?: () => void
  refetch?: (() => Promise<unknown>) | (() => void)
  reloadLabel?: string
  retryLabel?: string
  showReload?: boolean
  showRetry?: boolean
  title?: string
}

export function DataTableError({
  description,
  error,
  isError,
  onReload,
  refetch,
  reloadLabel,
  retryLabel,
  showReload = true,
  showRetry = true,
  title
}: DataTableErrorProps) {
  const t = useTranslations('components.dataTable.error')
  const defaultTitle = title ?? t('title')
  const defaultDescription =
    description ?? resolveErrorMessage(error) ?? t('description')
  const defaultRetryLabel = retryLabel ?? t('retry')
  const defaultReloadLabel = reloadLabel ?? t('reload')

  const handleReload = useCallback(() => {
    if (onReload) {
      onReload()
      return
    }
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }, [onReload])

  const handleRetry = useCallback(() => {
    if (!refetch) return
    const result = refetch()
    if (result && typeof (result as Promise<unknown>).then === 'function') {
      void (result as Promise<unknown>).catch(() => {})
    }
  }, [refetch])

  if (!isError) return null

  return (
    <div className="bg-card flex min-h-[400px] items-center justify-center">
      <div className="mx-auto flex min-w-96 flex-col items-center justify-center gap-4 rounded-lg p-8 text-center">
        <div className="text-7xl">❌</div>
        <p className="text-muted-foreground text-lg">{defaultTitle}</p>
        <p className="text-muted-foreground text-center text-sm">
          {defaultDescription}
        </p>
        {(showRetry || showReload) && (
          <div className="flex gap-2">
            {showRetry && refetch ? (
              <Button onClick={handleRetry}>{defaultRetryLabel}</Button>
            ) : null}
            {showReload ? (
              <Button onClick={handleReload} variant="outline">
                {defaultReloadLabel}
              </Button>
            ) : null}
          </div>
        )}
      </div>
    </div>
  )
}

function resolveErrorMessage(error?: unknown): string | undefined {
  if (!error) return undefined
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return undefined
}
