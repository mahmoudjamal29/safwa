import type React from 'react'

export type ChipItem = {
  color?: string
  label: string
  value?: string
}

export type InfoLinkItem = {
  href: string
  value: string
}

export type InfoItemConfig = {
  [key: string]: unknown
  label: string
  maxChipsLength?: number
  src?: string
  type?: string
  value:
    | ChipItem[]
    | Date
    | InfoLinkItem[]
    | null
    | number
    | string
    | string[]
    | undefined
  variant?:
    | 'attachment'
    | 'chips'
    | 'currency'
    | 'date'
    | 'datetime'
    | 'link'
    | 'number'
    | 'phone'
    | 'status'
    | 'text'
}

export type InfoSection = {
  icon?: React.ReactNode
  items: InfoItemConfig[]
  label?: string
  media?: InfoMedia
}

export type InfoMedia = {
  alt?: string
  src: string
  type?: 'image' | 'video'
}

export type InfoCardProps = {
  className?: string
  gridCols?: {
    default?: number
    lg?: number
    md?: number
  }
  sections: InfoSection[]
  title?: string
}
