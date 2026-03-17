'use client'

import * as React from 'react'

import { cn } from '@/utils/cn'

type DateRangePickerProps = {
  align?: 'center' | 'end' | 'start'
  classNames?: {
    button?: string
  }
  disabled?: boolean
  initialDateFrom?: Date | undefined
  initialDateTo?: Date | undefined
  onUpdate?: (values: {
    compareFrom?: Date | undefined
    compareTo?: Date | undefined
    dateFrom: Date | undefined
    dateTo: Date | undefined
  }) => void | Promise<void>
  placeholder?: string
  showCompare?: boolean
}

export function DateRangePicker({
  classNames,
  disabled,
  initialDateFrom,
  initialDateTo,
  onUpdate,
  placeholder
}: DateRangePickerProps) {
  const fmtDate = (d: Date | undefined) =>
    d ? d.toISOString().slice(0, 10) : ''

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateFrom = e.target.value ? new Date(e.target.value) : undefined
    onUpdate?.({
      dateFrom,
      dateTo: initialDateTo
    })
  }

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateTo = e.target.value ? new Date(e.target.value) : undefined
    onUpdate?.({
      dateFrom: initialDateFrom,
      dateTo
    })
  }

  return (
    <div className={cn('flex gap-2', classNames?.button)}>
      <input
        className="border-input bg-background h-9 rounded-md border px-3 py-1 text-sm shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        onChange={handleFromChange}
        placeholder={placeholder ? `${placeholder} from` : 'From'}
        type="date"
        value={fmtDate(initialDateFrom)}
      />
      <input
        className="border-input bg-background h-9 rounded-md border px-3 py-1 text-sm shadow-xs disabled:cursor-not-allowed disabled:opacity-50"
        disabled={disabled}
        onChange={handleToChange}
        placeholder={placeholder ? `${placeholder} to` : 'To'}
        type="date"
        value={fmtDate(initialDateTo)}
      />
    </div>
  )
}
