'use client'

import Image from 'next/image'
import React from 'react'

import { AlertCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

import { ImagePreview } from '@/components/ui/image-preview'

import type { InfoMediaSection as InfoMediaSectionType } from './info-card.types'

type InfoMediaSectionProps = {
  media: InfoMediaSectionType
}

export const InfoMediaSectionComponent: React.FC<InfoMediaSectionProps> = ({
  media
}) => {
  const t = useTranslations('components.custom.infoMedia')
  const gridColsClass = cn(
    'grid gap-4',
    media.gridCols?.default
      ? `grid-cols-${media.gridCols.default}`
      : 'grid-cols-1',
    media.gridCols?.md ? `md:grid-cols-${media.gridCols.md}` : 'md:grid-cols-2',
    media.gridCols?.lg ? `lg:grid-cols-${media.gridCols.lg}` : 'lg:grid-cols-2'
  )

  return (
    <div className={media.className}>
      <div className={gridColsClass}>
        {media.groups.map((group, groupIndex) => {
          const filteredImages = group.images.filter(
            (image) => image.src && image.src.length > 0
          )
          const defaultMaxVisible = media.defaultMaxVisible?.default ?? 2
          const featuredMaxVisible = media.defaultMaxVisible?.featured ?? 1
          const stackedMaxVisible = media.defaultMaxVisible?.stacked ?? 4
          const maxVisible =
            group.maxVisible ??
            (group.variant === 'featured'
              ? featuredMaxVisible
              : group.variant === 'stacked'
                ? stackedMaxVisible
                : defaultMaxVisible)
          const visibleImages = filteredImages.slice(0, maxVisible)
          const remainingImages = Math.max(
            filteredImages.length - maxVisible,
            0
          )
          const isFeatured = group.variant === 'featured'
          const sourceImages = filteredImages.map((image) => ({
            id: image.src,
            image: image.src
          }))

          return (
            <div className="flex max-h-96 flex-col gap-3" key={groupIndex}>
              <div className="text-foreground text-sm font-semibold">
                {group.label}
              </div>
              {filteredImages.length === 0 ? (
                <div className="text-muted-foreground flex items-center gap-2 text-xs">
                  <AlertCircle className="size-4" />
                  <span>{group.emptyLabel ?? t('noImagesFound')}</span>
                </div>
              ) : (
                <ImagePreview source={sourceImages ?? []} title={group.label}>
                  {(imagePreviews, onThumbnailClick) =>
                    isFeatured ? (
                      <button
                        className="bg-muted/20 relative aspect-3/4 w-full cursor-pointer overflow-hidden rounded-lg border"
                        onClick={() => onThumbnailClick(0)}
                        type="button"
                      >
                        <Image
                          alt={visibleImages[0]?.alt ?? group.label}
                          className={cn(
                            'object-cover',
                            visibleImages[0]?.className
                          )}
                          fill
                          sizes="(min-width: 1024px) 320px, 100vw"
                          src={imagePreviews[0]?.url ?? ''}
                        />
                      </button>
                    ) : (
                      <div className="grid h-full grid-cols-2 grid-rows-2 justify-items-center gap-3">
                        {visibleImages.map((image, imageIndex) => {
                          const showOverlay =
                            remainingImages > 0 &&
                            imageIndex === visibleImages.length - 1
                          const preview = imagePreviews[imageIndex]

                          return (
                            <button
                              className="bg-muted/20 relative w-full cursor-pointer overflow-hidden rounded-lg border"
                              key={`${image.src}-${imageIndex}`}
                              onClick={() => onThumbnailClick(imageIndex)}
                              type="button"
                            >
                              <Image
                                alt={image.alt ?? group.label}
                                className="object-cover"
                                fill
                                sizes="(min-width: 1024px) 200px, 50vw"
                                src={preview?.url ?? ''}
                              />
                              {showOverlay && (
                                <div className="bg-foreground/60 text-background absolute inset-0 flex items-center justify-center text-sm font-semibold">
                                  {`+${remainingImages}`}
                                </div>
                              )}
                            </button>
                          )
                        })}
                      </div>
                    )
                  }
                </ImagePreview>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export const InfoMediaSection = React.memo(InfoMediaSectionComponent)
