'use client'

import { useCallback } from 'react'

import { cn } from '@/utils'

import { DateTimePicker } from '@/components/ui/date-time-picker'

import { DateTimeFilterProps } from './types'
import { resetPageParam, triggerClassName, useFilterState } from './utils'

type DateTimeFilterComponentProps = Omit<
  DateTimeFilterProps,
  'key' | 'label' | 'placeholder'
> & {
  filterKey: string
  label: string
  placeholder?: string
}

export function DateTimeFilter({
  disabled,
  filterKey,
  label,
  placeholder,
  timeClearable,
  timePlaceholder,
  timeShowNowButton,
  timeWithSeconds
}: DateTimeFilterComponentProps) {
  const { setStringValue, value } = useFilterState(filterKey, false)

  const handleUpdate = useCallback(
    async (newValue: null | string) => {
      await setStringValue(newValue || null)
      resetPageParam()
    },
    [setStringValue]
  )

  return (
    <DateTimePicker
      className={cn(triggerClassName)}
      datePlaceholder={placeholder || label}
      disabled={disabled}
      onUpdate={handleUpdate}
      timeClearable={timeClearable}
      timePlaceholder={timePlaceholder}
      timeShowNowButton={timeShowNowButton}
      timeWithSeconds={timeWithSeconds}
      value={(value as string) || null}
    />
  )
}
