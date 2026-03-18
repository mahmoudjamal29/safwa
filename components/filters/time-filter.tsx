'use client'

import { useCallback } from 'react'

import { cn } from '@/utils'

import { TimePicker } from '@/components/ui/time-picker'

import { TimeFilterProps } from './types'
import { resetPageParam, triggerClassName, useFilterState } from './utils'

type TimeFilterComponentProps = Omit<
  TimeFilterProps,
  'key' | 'label' | 'placeholder'
> & {
  filterKey: string
  label: string
  placeholder?: string
}

export function TimeFilter({
  disabled,
  filterKey,
  label,
  placeholder,
  timeClearable,
  timeShowNowButton,
  timeWithSeconds
}: TimeFilterComponentProps) {
  const { setStringValue, value } = useFilterState(filterKey, false)

  const handleTimeChange = useCallback(
    async (time: null | string) => {
      await setStringValue(time || null)
      resetPageParam()
    },
    [setStringValue]
  )

  return (
    <TimePicker
      className={cn(triggerClassName)}
      clearable={timeClearable}
      disabled={disabled}
      onTimeChange={handleTimeChange}
      placeholder={placeholder || label}
      showNowButton={timeShowNowButton}
      time={(value as string) || null}
      timeWithSeconds={timeWithSeconds}
    />
  )
}
