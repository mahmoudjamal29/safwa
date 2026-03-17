'use client'

import * as React from 'react'

import { DateRangePicker } from '@/components/ui/date-range-picker'

const format = (date: Date, fmt: string): string => {
  if (fmt === 'yyyy-MM-dd') {
    return date.toISOString().slice(0, 10)
  }
  return date.toISOString()
}

import { DateRangeFilterProps } from './types'
import {
  getDateRangeValue,
  resetPageParam,
  triggerClassName,
  useFilterState
} from './utils'

type DateRangeFilterComponentProps = Omit<
  DateRangeFilterProps,
  'key' | 'label' | 'placeholder'
> & {
  filterKey: string
  label: string
  placeholder?: string
}

export function DateRangeFilter({
  align,
  disabled,
  filterKey,
  label,
  placeholder,
  showCompare
}: DateRangeFilterComponentProps) {
  const { isEmptyJsonValue, setStringValue, value } = useFilterState(
    filterKey,
    true
  )

  // Date range value for date-range variant
  const dateRangeValue = React.useMemo(
    () => getDateRangeValue(value, 'date-range', isEmptyJsonValue),
    [value, isEmptyJsonValue]
  )

  const handleUpdate = React.useCallback(
    async (values: {
      compareFrom?: Date | undefined
      compareTo?: Date | undefined
      dateFrom: Date | undefined
      dateTo: Date | undefined
    }) => {
      if (!values.dateFrom && !values.dateTo) {
        await setStringValue({ from: '', to: '' } as never)
        return
      }

      const newValue = {
        from: values.dateFrom ? format(values.dateFrom, 'yyyy-MM-dd') : '',
        to: values.dateTo ? format(values.dateTo, 'yyyy-MM-dd') : ''
      }
      await setStringValue(newValue as never)
      resetPageParam()
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
      initialDateFrom={dateRangeValue?.dateFrom}
      initialDateTo={dateRangeValue?.dateTo}
      onUpdate={handleUpdate}
      placeholder={placeholder || label}
      showCompare={showCompare}
    />
  )
}
