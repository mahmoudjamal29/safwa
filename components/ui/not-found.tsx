'use client'

import { useRouter } from 'next/navigation'

import { cva, type VariantProps } from 'class-variance-authority'
import { Info } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

import { Button } from '@/components/ui/button'
import { Logo } from '@/components/ui/logo'

const notFoundContainerVariants = cva('flex items-center justify-center', {
  defaultVariants: {
    variant: 'default'
  },
  variants: {
    variant: {
      default: 'h-auto',
      page: 'h-[calc(100vh-var(--header-height))]'
    }
  }
})

const notFoundContentVariants = cva('', {
  defaultVariants: {
    variant: 'default'
  },
  variants: {
    variant: {
      default:
        'text-muted-foreground col-span-full flex items-center justify-center gap-2 py-8 text-sm capitalize',
      page: 'bg-content1 mx-auto flex min-w-full flex-col items-center justify-center gap-5 rounded-lg p-8 text-center'
    }
  }
})

export type NotFoundProps = VariantProps<typeof notFoundContainerVariants> & {
  classNames?: {
    container?: string
    content?: string
  }
  goBack?: boolean
  message: string
}

export function NotFound({
  classNames,
  goBack = true,
  message,
  variant = 'default'
}: NotFoundProps) {
  const router = useRouter()
  const t = useTranslations('components.notFound')

  if (variant === 'page') {
    return (
      <div
        className={cn(
          notFoundContainerVariants({ variant }),
          classNames?.container
        )}
      >
        <div
          className={cn(
            notFoundContentVariants({ variant }),
            classNames?.content
          )}
        >
          <Logo alt={t('alt')} size="lg" />
          <p className="text-default-500 text-lg">{message}</p>
          {goBack && (
            <Button onClick={() => router.back()}>{t('goBack')}</Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(notFoundContentVariants({ variant }), classNames?.content)}
    >
      <Info className="size-3.5" />
      {message}
    </div>
  )
}
