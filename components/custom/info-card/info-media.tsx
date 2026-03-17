'use client'

import type { InfoMedia } from './info-card.types'

type InfoMediaSectionProps = {
  media: InfoMedia
}

export function InfoMediaSection({ media }: InfoMediaSectionProps) {
  if (media.type === 'video') {
    return (
      <video
        className="max-h-48 w-full rounded-md object-cover"
        controls
        src={media.src}
      />
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      alt={media.alt ?? ''}
      className="max-h-48 w-full rounded-md object-cover"
      src={media.src}
    />
  )
}
