'use client'

import { useCallback } from 'react'

import { DateRangePicker } from '@/components/ui/date-range-picker'

import { DateRangeTimeFilterProps } from './types'
import { resetPageParam, triggerClassName, useFilterState } from './utils'

type DateRangeTimeFilterComponentProps = Omit<
  DateRangeTimeFilterProps,
  'key' | 'label' | 'placeholder'
> & {
  filterKey: string
  label: string
  placeholder?: string
}

export function DateRangeTimeFilter({
  align,
  disabled,
  filterKey,
  label,
  placeholder,
  showCompare,
  timeClearable,
  timePlaceholder,
  timeShowNowButton,
  timeWithSeconds
}: DateRangeTimeFilterComponentProps) {
  const { isEmptyJsonValue, setStringValue, value } = useFilterState(
    filterKey,
    true
  )

  const dateRangeTimeValue = isEmptyJsonValue
    ? null
    : (value as { from: string; to: string }) || null

  const handleUpdate = useCallback(
    async (values: {
      compareFrom?: Date | undefined
      compareTo?: Date | undefined
      dateFrom: Date | undefined
      dateTo: Date | undefined
    }) => {
      if (!values.dateFrom && !values.dateTo) {
        await setStringValue({ from: '', to: '' })
        resetPageParam()
      } else {
        const newValue = {
          from: values.dateFrom ? values.dateFrom.toISOString() : '',
          to: values.dateTo ? values.dateTo.toISOString() : ''
        }
        await setStringValue(newValue)
        resetPageParam()
      }
    },
    [setStringValue]
  )

  return (
    <DateRangePicker
      align={align}
      classNames={{
        button: triggerClassName
      }}
      disabled={disabled}
      enableTime={true}
      onUpdate={handleUpdate}
      placeholder={placeholder || label}
      showCompare={showCompare}
      timeClearable={timeClearable}
      timePlaceholder={timePlaceholder}
      timeShowNowButton={timeShowNowButton}
      timeWithSeconds={timeWithSeconds}
      value={
        dateRangeTimeValue
          ? {
              from: dateRangeTimeValue.from
                ? new Date(dateRangeTimeValue.from)
                : undefined,
              to: dateRangeTimeValue.to
                ? new Date(dateRangeTimeValue.to)
                : undefined
            }
          : null
      }
    />
  )
}
