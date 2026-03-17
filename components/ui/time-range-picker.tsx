'use client'

import * as React from 'react'

import { cn } from '@/utils/cn'

type TimeRangePickerProps = {
  className?: string
  disabled?: boolean
  onUpdate?: (
    value: null | { from: string; to: string }
  ) => void | Promise<void>
  timeClearable?: boolean
  timePlaceholder?: string
  timeShowNowButton?: boolean
  timeWithSeconds?: boolean
  value?: null | { from: string; to: string }
}

export function TimeRangePicker({
  className,
  disabled,
  onUpdate,
  timePlaceholder,
  value
}: TimeRangePickerProps) {
  return (
    <div className={cn('flex gap-2', className)}>
      <input
        className="border-input bg-background h-9 rounded-md border px-3 py-1 text-sm shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        onChange={(e) =>
          onUpdate?.({ from: e.target.value, to: value?.to ?? '' })
        }
        placeholder={timePlaceholder ?? 'From'}
        type="time"
        value={value?.from ?? ''}
      />
      <input
        className="border-input bg-background h-9 rounded-md border px-3 py-1 text-sm shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        onChange={(e) =>
          onUpdate?.({ from: value?.from ?? '', to: e.target.value })
        }
        placeholder={timePlaceholder ?? 'To'}
        type="time"
        value={value?.to ?? ''}
      />
    </div>
  )
}
