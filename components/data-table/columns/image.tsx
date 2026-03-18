'use client'

import * as React from 'react'

import { ImageIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarShape
} from '@/components/ui/avatar'
import { ImagePreview } from '@/components/ui/image-preview'

export type ImageColumnProps = Omit<
  React.ComponentProps<typeof AvatarImage>,
  'alt' | 'src'
> & {
  alt?: string
  avatarFallback?: React.ReactNode | string
  classNames?: ImageClassNames
  shape?: AvatarShape
  size?: number
  src: null | string | undefined
}

type ImageClassNames = {
  avatar?: string
  avatarFallback?: string
  avatarImage?: string
}

export const Image: React.FC<ImageColumnProps> = ({
  alt,
  avatarFallback,
  classNames,
  shape = 'square',
  size,
  src,
  ...avatarProps
}) => {
  const t = useTranslations('components.dataTable.columns.image')
  const resolvedSize = size ?? 60
  const resolvedAlt = alt || t('alt')

  const baseClasses = cn(
    'text-muted-foreground flex items-center justify-center rounded-md  mx-auto',
    !src && 'p-2 bg-muted'
  )

  if (!src) {
    return (
      <div
        className={cn(baseClasses, 'shrink-0', classNames?.avatar)}
        style={{ height: resolvedSize, width: resolvedSize }}
      >
        <ImageIcon className={classNames?.avatarImage} size={20} />
      </div>
    )
  }

  return (
    <ImagePreview source={src}>
      {(_, onThumbnailClick) => (
        <Avatar
          className={cn(
            baseClasses,
            'shrink-0 cursor-pointer transition-opacity hover:opacity-80',
            classNames?.avatar
          )}
          onClick={() => !!src && onThumbnailClick(0)}
          shape={shape}
          style={{ height: resolvedSize, width: resolvedSize }}
        >
          <AvatarImage
            alt={resolvedAlt}
            src={src}
            {...avatarProps}
            className={cn(
              'absolute *:object-contain!',
              classNames?.avatarImage
            )}
          />
          <AvatarFallback className={classNames?.avatarFallback}>
            {avatarFallback ??
              (typeof resolvedAlt === 'string' && resolvedAlt.trim()
                ? resolvedAlt.trim().charAt(0).toUpperCase()
                : '?')}
          </AvatarFallback>
        </Avatar>
      )}
    </ImagePreview>
  )
}
