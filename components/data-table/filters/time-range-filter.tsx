'use client'

import { useCallback } from 'react'

import { cn } from '@/utils'

import { TimeRangePicker } from '@/components/ui/time-range-picker'

import { TimeRangeFilterProps } from './types'
import { resetPageParam, triggerClassName, useFilterState } from './utils'

type TimeRangeFilterComponentProps = Omit<
  TimeRangeFilterProps,
  'key' | 'label' | 'placeholder'
> & {
  filterKey: string
  label: string
  placeholder?: string
}

export function TimeRangeFilter({
  disabled,
  filterKey,
  label,
  placeholder,
  timeClearable,
  timePlaceholder,
  timeShowNowButton,
  timeWithSeconds
}: TimeRangeFilterComponentProps) {
  const { isEmptyJsonValue, setStringValue, value } = useFilterState(
    filterKey,
    true
  )

  const handleUpdate = useCallback(
    async (newValue: null | { from: string; to: string }) => {
      if (!newValue || (!newValue.from && !newValue.to)) {
        await setStringValue({ from: '', to: '' })
      } else {
        await setStringValue(newValue)
      }
      resetPageParam()
    },
    [setStringValue]
  )

  const timeRangeValue = isEmptyJsonValue
    ? null
    : (value as { from: string; to: string }) || null

  return (
    <TimeRangePicker
      className={cn(triggerClassName)}
      disabled={disabled}
      onUpdate={handleUpdate}
      timeClearable={timeClearable}
      timePlaceholder={timePlaceholder || placeholder || label}
      timeShowNowButton={timeShowNowButton}
      timeWithSeconds={timeWithSeconds}
      value={timeRangeValue}
    />
  )
}
