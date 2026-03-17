'use client'

import { useCallback } from 'react'

import { cn } from '@/utils'

import { DatePicker } from '@/components/ui/date-picker'

import { DateFilterProps } from './types'
import { resetPageParam, triggerClassName, useFilterState } from './utils'

type DateFilterComponentProps = Omit<
  DateFilterProps,
  'key' | 'label' | 'placeholder'
> & {
  filterKey: string
  label: string
  placeholder?: string
}

export function DateFilter({
  disabled,
  filterKey,
  label,
  placeholder
}: DateFilterComponentProps) {
  const { setStringValue, value } = useFilterState(filterKey, false)

  const handleUpdate = useCallback(
    async (newValue: null | string) => {
      await setStringValue(newValue || null)
      resetPageParam()
    },
    [setStringValue]
  )

  return (
    <DatePicker
      className={cn(triggerClassName)}
      disabled={disabled}
      onUpdate={handleUpdate}
      placeholder={placeholder || label}
      value={(value as string) || null}
    />
  )
}
