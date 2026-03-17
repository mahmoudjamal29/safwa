'use client'

import * as React from 'react'

import Link from 'next/link'

import { cn } from '@/utils/cn'

// ============================================================================
// Column.Text
// ============================================================================

type ColumnTextVariant =
  | 'attachment'
  | 'currency'
  | 'date'
  | 'datetime'
  | 'link'
  | 'number'
  | 'phone'
  | 'status'
  | 'text'

type ColumnTextProps = {
  className?: string
  href?: string
  src?: string
  text?: Date | null | number | string | undefined
  type?: string
  variant?: ColumnTextVariant
}

function ColumnText({ className, href, src, text, type, variant }: ColumnTextProps) {
  const displayText = formatValue(text, variant)

  if (variant === 'link' && href) {
    return (
      <Link
        className={cn('text-primary hover:underline', className)}
        href={href}
      >
        {displayText}
      </Link>
    )
  }

  if (variant === 'attachment' && (src || text)) {
    const url = src || String(text)
    return (
      <a
        className={cn('text-primary hover:underline', className)}
        href={url}
        rel="noopener noreferrer"
        target="_blank"
      >
        {type ?? displayText}
      </a>
    )
  }

  if (variant === 'phone' && text) {
    return (
      <a
        className={cn('text-primary hover:underline', className)}
        href={`tel:${text}`}
      >
        {displayText}
      </a>
    )
  }

  return (
    <span className={cn('text-foreground', className)}>
      {displayText ?? '—'}
    </span>
  )
}

function formatValue(
  value: Date | null | number | string | undefined,
  variant?: ColumnTextVariant
): string {
  if (value === null || value === undefined) return '—'

  if (variant === 'date' && (value instanceof Date || typeof value === 'string')) {
    try {
      return new Date(value).toLocaleDateString('ar-SA')
    } catch {
      return String(value)
    }
  }

  if (variant === 'datetime' && (value instanceof Date || typeof value === 'string')) {
    try {
      return new Date(value).toLocaleString('ar-SA')
    } catch {
      return String(value)
    }
  }

  if (variant === 'currency' && typeof value === 'number') {
    return new Intl.NumberFormat('ar-SA', {
      currency: 'SAR',
      style: 'currency'
    }).format(value)
  }

  if (variant === 'number' && typeof value === 'number') {
    return new Intl.NumberFormat('ar-SA').format(value)
  }

  return String(value)
}

// ============================================================================
// Column namespace
// ============================================================================

export const Column = {
  Text: ColumnText
}
