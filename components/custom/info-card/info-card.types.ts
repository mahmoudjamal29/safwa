import type { LinkProps } from 'next/link'
import type React from 'react'

import type { TextProps } from '@/components/data-table/columns'
import type { TextVariant } from '@/components/data-table/columns/text'

import type { DocumentTypeEnum } from '@/types/enums'

export type ChipItem = {
  href?: LinkProps['href']
  label: string
}

export type InfoCardProps = {
  className?: string
  gridCols?: {
    default?: number
    lg?: number
    md?: number
  }
  sections: InfoSection[]
  title: string
}

export type InfoItemConfig = BaseInfoItem &
  Omit<TextProps, 'src' | 'text' | 'type' | 'variant'> & {
    href?: LinkProps['href']
    maxChipsLength?: number
    src?: null | string
    type?: DocumentTypeEnum | null | undefined
    value: ChipItem[] | InfoLinkItem[] | string[] | TextProps['text']
    variant?: 'chips' | TextVariant
  }

export type InfoLinkItem = {
  href: LinkProps['href']
  value: string
}

export type InfoMediaGroup = {
  emptyLabel?: string
  images: InfoMediaItem[]
  label: string
  maxVisible?: number
  variant?: 'featured' | 'stacked'
}

export type InfoMediaItem = {
  alt?: string
  className?: string
  src: null | string
}

export type InfoMediaSection = {
  className?: string
  defaultMaxVisible?: {
    default?: number
    featured?: number
    stacked?: number
  }
  gridCols?: {
    default?: number
    lg?: number
    md?: number
  }
  groups: InfoMediaGroup[]
}

export type InfoSection = {
  icon?: React.ReactNode
  items: InfoItemConfig[]
  label: string
  media?: InfoMediaSection
}

type BaseInfoItem = {
  label: string
}
