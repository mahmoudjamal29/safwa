'use client'

import * as React from 'react'

import { X } from 'lucide-react'

import { cn } from '@/utils'

export type ChipProps = React.PropsWithChildren<{
  classNames?: {
    content?: string
    wrapper?: string
  }
  handleClose?: () => void
  label?: string
  onClose?: () => void
  radius?: 'full' | 'md' | 'sm'
  variant?: 'bordered' | 'flat' | 'solid'
  withCloseButton?: boolean
}>

export const Chip = ({
  children,
  classNames,
  label,
  onClose,
  radius = 'md',
  variant = 'flat',
  withCloseButton = false
}: ChipProps) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium',
        radius === 'full' && 'rounded-full',
        radius === 'md' && 'rounded-md',
        radius === 'sm' && 'rounded-sm',
        variant === 'bordered' && 'border border-border bg-background',
        variant === 'flat' && 'bg-muted',
        variant === 'solid' && 'bg-primary text-primary-foreground',
        classNames?.wrapper
      )}
    >
      <span className={cn('flex items-center', classNames?.content)}>
        {children ?? label}
      </span>
      {withCloseButton && onClose && (
        <button
          className="text-muted-foreground hover:text-foreground ml-1 rounded-full p-0.5"
          onClick={onClose}
          type="button"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
