import { cva, type VariantProps } from 'class-variance-authority'
import { useTranslations } from 'next-intl'

import { Logo } from '@/components/ui/logo'
import { Spinner } from '@/components/ui/spinner'

const loadingContainerVariants = cva(
  'flex items-center justify-center animate-pulse select-none',
  {
    defaultVariants: {
      variant: 'default'
    },
    variants: {
      variant: {
        default: 'h-auto',
        page: 'h-[calc(100vh-var(--header-height))]'
      }
    }
  }
)

const loadingContentVariants = cva('', {
  defaultVariants: {
    variant: 'default'
  },
  variants: {
    variant: {
      default:
        'col-span-full flex items-center justify-center gap-2 py-8 text-sm',
      page: 'bg-content1 mx-auto flex min-w-full flex-col items-center justify-center gap-2 rounded-lg p-8 text-center'
    }
  }
})

export type LoadingProps = VariantProps<typeof loadingContainerVariants> & {
  message?: string
}

export const Loading: React.FC<LoadingProps> = ({
  message,
  variant = 'default'
}: LoadingProps) => {
  const t = useTranslations('components.loading')
  const resolvedMessage = message || t('message')

  if (variant === 'page') {
    return (
      <div className={loadingContainerVariants({ variant })}>
        <div className={loadingContentVariants({ variant })}>
          <Logo alt={t('alt')} size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className={loadingContentVariants({ variant })}>
      <Spinner aria-label={resolvedMessage} className="size-4" />
      <span className="text-muted-foreground">{resolvedMessage}</span>
    </div>
  )
}
