'use client'

import type React from 'react'

import { ChevronRight, PhoneIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

import { Column } from '@/components/data-table/columns'

import { ClippedPhoto } from './clipped-photo'

type ProfileCardProps = {
  className?: string
  group?: null | string
  infoHref?: null | string
  name?: null | string
  onCallClick?: (() => void) | null
  phone?: null | string
  profileImageAlt?: string
  profileImageFallbackSrc?: string
  profileImageSrc?: null | string
  showCallButton?: boolean
  subtitle?: null | {
    href?: null | string
    name?: null | string
  }
  title?: null | string
}

export const ProfileCard: React.FC<ProfileCardProps> = ({
  className,
  group,
  infoHref,
  name,
  onCallClick,
  phone,
  profileImageAlt,
  profileImageFallbackSrc,
  profileImageSrc,
  showCallButton = true,
  subtitle,
  title
}) => {
  const t = useTranslations('components.ui.profileCard')
  const resolvedProfileImageAlt = profileImageAlt || t('profileImageAlt')
  const resolvedTitle = title || t('defaultTitle')

  return (
    <div
      className={cn(
        'bg-card flex items-start gap-4 rounded-lg border p-4',
        className
      )}
    >
      {(profileImageSrc || profileImageFallbackSrc) && (
        <ClippedPhoto
          alt={resolvedProfileImageAlt}
          fallbackSrc={profileImageFallbackSrc}
          icon={
            showCallButton ? (
              <PhoneIcon className="text-white" size={14} />
            ) : undefined
          }
          onClick={showCallButton && onCallClick ? onCallClick : undefined}
          src={profileImageSrc ?? profileImageFallbackSrc ?? ''}
        />
      )}

      <div className="flex flex-1 flex-col gap-1">
        {(resolvedTitle || infoHref) && (
          <div className="flex items-center justify-between gap-2">
            {resolvedTitle && (
              <Column.Text
                className="text-base font-semibold"
                text={resolvedTitle}
              />
            )}
            {infoHref && (
              <div className="flex items-center gap-1">
                <Column.Text
                  className="text-sm font-normal"
                  href={infoHref}
                  text={t('info')}
                  variant="link"
                />
                <ChevronRight className="text-muted-foreground size-4" />
              </div>
            )}
          </div>
        )}

        {name && (
          <Column.Text className="text-base font-semibold" text={name} />
        )}

        {phone && (
          <Column.Text
            className="text-sm font-normal"
            color="muted"
            text={phone}
            variant="phone"
          />
        )}

        {subtitle?.name && (
          <Column.Text
            className="text-xs font-normal"
            color="muted"
            href={subtitle.href || undefined}
            text={subtitle.name}
            variant={subtitle.href ? 'link' : undefined}
          />
        )}

        {group && (
          <Column.Text
            className="text-xs font-normal"
            color="muted"
            text={group}
          />
        )}
      </div>
    </div>
  )
}
