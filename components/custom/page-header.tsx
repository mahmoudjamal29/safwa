'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

import { SmartBreadcrumb } from '@/components/breadcrumbs'
import {
  Flex,
  type FlexProps,
  FlexViewOptions
} from '@/components/data-table/columns/flex'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

type PageHeaderProps = FlexProps & {
  cancelHref?: string
  children?: React.ReactNode
  className?: string
  description?: null | string
  image?: null | string
  imageIcon?: React.ReactNode
  isAvatar?: boolean
  isLoading?: boolean
  resourceName?: string
  startContent?: React.ReactNode
  subTitle?: string
  title: string | undefined
}

const PageHeaderComponent: React.FC<PageHeaderProps> = (props) => {
  const {
    cancelHref,
    children,
    className,
    image,
    imageIcon,
    isAvatar,
    isLoading,
    resourceName,
    startContent,
    subTitle,
    title,
    ...flexProps
  } = props

  const router = useRouter()
  const t = useTranslations('components.pageHeader')

  const {
    avatar,
    classNames,
    subtitle,
    variants,
    viewOptions,
    ...restFlexProps
  } = flexProps

  const resolvedAvatar = avatar ?? image ?? null
  const resolvedSubtitle =
    subtitle !== undefined ? subtitle : (subTitle ?? props.description)
  const resolvedShowAvatar =
    viewOptions?.avatar ??
    (isAvatar !== undefined ? isAvatar : Boolean(resolvedAvatar))

  const resolvedViewOptions: FlexViewOptions = {
    ...viewOptions,
    avatar: resolvedShowAvatar
  }

  const resolvedVariants = {
    ...variants,
    avatar: {
      shape: variants?.avatar?.shape,
      size: variants?.avatar?.size ?? 50
    },
    subtitle: {
      ...variants?.subtitle,
      maxLength: variants?.subtitle?.maxLength ?? 100
    },
    title: {
      ...variants?.title,
      maxLength: variants?.title?.maxLength ?? 50
    }
  }

  const resolvedClassNames = {
    ...classNames,
    container: cn('items-center gap-3 w-full!', classNames?.container),
    content: cn('gap-1', classNames?.content),
    subtitle: cn('text-muted-foreground text-sm', classNames?.subtitle),
    title: cn('text-card-foreground text-2xl font-bold', classNames?.title)
  }

  if (isLoading) {
    return (
      <PageHeaderSkeleton
        className={className}
        hasActions={!!cancelHref}
        hasChildren={!!children}
        showAvatar={resolvedShowAvatar}
        titleSize={resolvedVariants.avatar?.size}
      />
    )
  }

  return (
    <header
      className={cn(
        'border-border bg-card/95 supports-backdrop-filter:bg-card/60 sticky top-0 z-47 w-full max-w-screen border-b backdrop-blur lg:top-(--header-height)',
        className
      )}
    >
      <div className="page-header-content flex w-full flex-col gap-5 p-5">
        <SmartBreadcrumb resourceName={resourceName} />
        <div className="-mt-5 flex w-full flex-col items-start gap-5 md:flex-row md:items-center md:justify-between">
          {startContent && startContent}
          {!startContent && (
            <Flex
              {...restFlexProps}
              avatar={resolvedAvatar}
              avatarAccessory={imageIcon}
              classNames={resolvedClassNames}
              subtitle={resolvedSubtitle}
              title={title}
              variants={resolvedVariants}
              viewOptions={resolvedViewOptions}
            />
          )}

          <div className="flex items-center gap-3">
            {!!cancelHref && (
              <Button onClick={() => router.push(cancelHref)} variant="outline">
                {t('cancel')}
              </Button>
            )}
            {children}
          </div>
        </div>
      </div>
    </header>
  )
}

export const PageHeader = PageHeaderComponent

type PageHeaderSkeletonProps = {
  className?: string
  hasActions?: boolean
  hasChildren?: boolean
  showAvatar?: boolean
  titleSize?: number
}

const PageHeaderSkeleton: React.FC<PageHeaderSkeletonProps> = ({
  className,
  hasActions,
  hasChildren,
  showAvatar,
  titleSize
}) => {
  const descriptionOffset = showAvatar ? (titleSize ?? 50) + 12 : 0

  return (
    <header
      className={cn(
        'border-border bg-card/95 supports-backdrop-filter:bg-card/60 sticky top-0 z-47 w-full max-w-screen border-b backdrop-blur lg:top-(--header-height)',
        className
      )}
    >
      <div className="page-header-content flex w-full flex-col items-start gap-5 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center gap-3">
            {showAvatar && <Skeleton className="size-[50px] rounded-full" />}
            <div className="flex flex-col gap-2">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="max-w-2xl" style={{ paddingLeft: descriptionOffset }}>
            <Skeleton className="h-4 w-72" />
          </div>
        </div>

        {(hasActions || hasChildren) && (
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-28" />
            {hasChildren && <Skeleton className="h-10 w-24" />}
          </div>
        )}
      </div>
    </header>
  )
}
