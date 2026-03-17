'use client'

import * as React from 'react'

import { cn } from '@/utils/cn'

type DatePickerProps = {
  className?: string
  disabled?: boolean
  onUpdate?: (value: null | string) => void | Promise<void>
  placeholder?: string
  value?: null | string
}

export function DatePicker({
  className,
  disabled,
  onUpdate,
  placeholder,
  value
}: DatePickerProps) {
  return (
    <input
      className={cn(
        'border-input bg-background h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      disabled={disabled}
      onChange={(e) => onUpdate?.(e.target.value || null)}
      placeholder={placeholder}
      type="date"
      value={value ?? ''}
    />
  )
}
