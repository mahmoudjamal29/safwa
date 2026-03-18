'use client'

import * as React from 'react'

import { cn } from '@/utils'
import { avatarFallbackName } from '@/utils/helpers'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export interface FlexProps {
  avatar?: null | string
  avatarFallback?: React.ReactNode | string
  carLicense?: null | string
  className?: string
  imageProps?: React.ImgHTMLAttributes<HTMLImageElement>
  overFlowAvatar?: null | string
  overFlowAvatarFallback?: React.ReactNode | string
  overFlowAvatarSize?: string
  showOverFlowAvatar?: boolean
  subtitle?: null | string
  title?: null | string
  viewOptions?: FlexViewOptions
}

export interface FlexViewOptions {
  avatar?: boolean
  overFlowAvatar?: boolean
  subtitle?: boolean
  title?: boolean
}

export function DriverCarFlexCard({
  avatar,
  avatarFallback,
  carLicense,
  className,
  imageProps,
  overFlowAvatar,
  overFlowAvatarFallback,
  showOverFlowAvatar: showOverFlowAvatarProp,
  subtitle,
  title,
  viewOptions = { avatar: true, subtitle: true, title: true }
}: FlexProps) {
  const showAvatar = viewOptions.avatar !== false
  const showTitle = viewOptions.title !== false
  const showSubtitle = viewOptions.subtitle !== false
  const showOverFlowAvatar =
    showOverFlowAvatarProp !== undefined
      ? showOverFlowAvatarProp
      : viewOptions.overFlowAvatar !== false

  // Determine if we're showing only avatar (big) or with content (small)
  const isAvatarOnly =
    showAvatar && !showTitle && !showSubtitle && !showOverFlowAvatar
  const hasContent = showTitle || showSubtitle || showOverFlowAvatar

  // Avatar size: big when only avatar, medium-large when with content
  const avatarSize = 'size-20'
  const overflowAvatarSize = 'size-16'
  // Container classes based on layout
  const containerClasses = cn(
    'flex items-center gap-3 w-full',
    isAvatarOnly && 'justify-center',
    className
  )

  // Content wrapper classes
  const contentClasses = cn('flex flex-col', !hasContent && 'hidden')

  // Title classes
  const titleClasses = cn('font-medium', isAvatarOnly ? 'text-base' : 'text-sm')

  // Subtitle classes
  const subtitleClasses = cn(
    'text-muted-foreground',
    isAvatarOnly ? 'text-sm' : 'text-xs'
  )

  return (
    <div className={containerClasses}>
      {showAvatar && (
        <div className="relative ms-12">
          {showOverFlowAvatar && (
            <Avatar
              className={cn(
                'border-background absolute top-1/2 -left-10 z-10 -translate-y-1/2 rounded-full border-3',
                overflowAvatarSize
              )}
            >
              {overFlowAvatar ? (
                <AvatarImage
                  alt={title || 'Overflow Avatar'}
                  src={overFlowAvatar}
                />
              ) : null}
              <AvatarFallback>
                {overFlowAvatarFallback ||
                  (title ? avatarFallbackName(title) : '?')}
              </AvatarFallback>
            </Avatar>
          )}
          <Avatar className={avatarSize}>
            {avatar ? (
              <AvatarImage
                alt={title || 'Avatar'}
                src={avatar}
                {...imageProps}
                className={cn(imageProps?.className)}
              />
            ) : null}
            <AvatarFallback>
              {avatarFallback || (title ? avatarFallbackName(title) : '?')}
            </AvatarFallback>
          </Avatar>
        </div>
      )}

      {hasContent && (
        <div className={contentClasses}>
          {showTitle && title && <div className={titleClasses}>{title}</div>}
          {showSubtitle && subtitle && (
            <div className={subtitleClasses}>{subtitle}</div>
          )}
        </div>
      )}

      {carLicense && (
        <div className="ms-auto rounded-md bg-white px-3 py-1.5 text-center text-sm font-medium text-black shadow-sm">
          {carLicense}
        </div>
      )}
    </div>
  )
}
