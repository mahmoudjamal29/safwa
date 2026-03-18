'use client'

import * as React from 'react'

import { parseISO } from 'date-fns'
import { useTranslations } from 'next-intl'

import { FieldWrapper } from '@/components/form/field-wrapper'

import { type DateRange, DateRangePicker } from '../ui/date-range-picker'
import { TimePicker } from '../ui/time-picker'
import { useFieldContext } from './form'

export type DateRangeTimePickerProps = {
  classNames?: {
    childrenWrapper?: string
    label?: string
    wrapper?: string
  }
  dateRangeAlign?: 'center' | 'end' | 'start'
  disabled?: boolean
  label?: string
  required?: boolean
  showCompare?: boolean
  timeClearable?: boolean
  timePlaceholder?: string
  timeShowNowButton?: boolean
  timeWithSeconds?: boolean
}

export const DateRangeTimePicker: React.FC<DateRangeTimePickerProps> = ({
  classNames,
  dateRangeAlign = 'end',
  disabled,
  label,
  required,
  showCompare = false,
  timeClearable = true,
  timePlaceholder,
  timeShowNowButton = true,
  timeWithSeconds = false
}) => {
  const tTime = useTranslations('components.form.timePicker')
  const tRange = useTranslations('components.form.timeRangePicker')
  const resolvedBasePlaceholder = timePlaceholder ?? tTime('placeholder')
  const field = useFieldContext<null | {
    from: string
    to: string
  }>()

  const dateRange = React.useMemo<DateRange | null>(() => {
    if (!field.state.value) return null
    try {
      return {
        from: field.state.value.from
          ? parseISO(field.state.value.from.split('T')[0])
          : undefined,
        to: field.state.value.to
          ? parseISO(field.state.value.to.split('T')[0])
          : undefined
      }
    } catch {
      return null
    }
  }, [field.state.value])

  const fromTime = React.useMemo(() => {
    if (!field.state.value?.from) return undefined
    try {
      const date = new Date(field.state.value.from)
      if (isNaN(date.getTime())) return undefined
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = timeWithSeconds
        ? date.getSeconds().toString().padStart(2, '0')
        : '00'
      return `${hours}:${minutes}:${seconds}`
    } catch {
      return undefined
    }
  }, [field.state.value?.from, timeWithSeconds])

  const toTime = React.useMemo(() => {
    if (!field.state.value?.to) return undefined
    try {
      const date = new Date(field.state.value.to)
      if (isNaN(date.getTime())) return undefined
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = timeWithSeconds
        ? date.getSeconds().toString().padStart(2, '0')
        : '00'
      return `${hours}:${minutes}:${seconds}`
    } catch {
      return undefined
    }
  }, [field.state.value?.to, timeWithSeconds])

  const handleDateRangeUpdate = React.useCallback(
    (values: {
      compareFrom?: Date | undefined
      compareTo?: Date | undefined
      dateFrom: Date | undefined
      dateTo: Date | undefined
    }) => {
      if (!values.dateFrom && !values.dateTo) {
        field.handleChange(null)
        return
      }

      const fromDate = values.dateFrom ? new Date(values.dateFrom) : null
      const toDate = values.dateTo ? new Date(values.dateTo) : null

      if (fromDate && fromTime) {
        const [hours, minutes, seconds = 0] = fromTime.split(':').map(Number)
        fromDate.setHours(hours, minutes, seconds)
      } else if (fromDate) {
        fromDate.setHours(0, 0, 0, 0)
      }

      if (toDate && toTime) {
        const [hours, minutes, seconds = 0] = toTime.split(':').map(Number)
        toDate.setHours(hours, minutes, seconds)
      } else if (toDate) {
        toDate.setHours(0, 0, 0, 0)
      }

      field.handleChange({
        from: fromDate ? fromDate.toISOString() : '',
        to: toDate ? toDate.toISOString() : ''
      })
    },
    [field, fromTime, toTime]
  )

  const handleFromTimeChange = React.useCallback(
    (value: null | string | undefined) => {
      const currentValue = field.state.value

      if (!value) {
        if (currentValue?.from) {
          const date = new Date(currentValue.from)
          date.setHours(0, 0, 0, 0)
          field.handleChange({
            from: date.toISOString(),
            to: currentValue.to || ''
          })
        }
        return
      }

      const [hours, minutes, seconds = 0] = value.split(':').map(Number)
      const fromDate = currentValue?.from
        ? new Date(currentValue.from)
        : dateRange?.from || new Date()
      fromDate.setHours(hours, minutes, seconds || 0)
      fromDate.setSeconds(seconds || 0)

      field.handleChange({
        from: fromDate.toISOString(),
        to: currentValue?.to || ''
      })
    },
    [field, dateRange]
  )

  const handleToTimeChange = React.useCallback(
    (value: null | string | undefined) => {
      const currentValue = field.state.value

      if (!value) {
        if (currentValue?.to) {
          const date = new Date(currentValue.to)
          date.setHours(0, 0, 0, 0)
          field.handleChange({
            from: currentValue.from || '',
            to: date.toISOString()
          })
        }
        return
      }

      const [hours, minutes, seconds = 0] = value.split(':').map(Number)
      const toDate = currentValue?.to
        ? new Date(currentValue.to)
        : dateRange?.to || new Date()
      toDate.setHours(hours, minutes, seconds || 0)
      toDate.setSeconds(seconds || 0)

      field.handleChange({
        from: currentValue?.from || '',
        to: toDate.toISOString()
      })
    },
    [field, dateRange]
  )

  return (
    <FieldWrapper
      classNames={classNames}
      field={field}
      label={label}
      required={required}
    >
      <div className="flex flex-col gap-4">
        <DateRangePicker
          align={dateRangeAlign}
          disabled={disabled}
          onUpdate={handleDateRangeUpdate}
          showCompare={showCompare}
          value={dateRange}
        />
        <div className="flex flex-col gap-2 lg:flex-row">
          <div className="flex-1">
            <TimePicker
              clearable={timeClearable}
              disabled={disabled}
              onTimeChange={handleFromTimeChange}
              placeholder={tRange('startPlaceholder', {
                placeholder: resolvedBasePlaceholder
              })}
              showNowButton={timeShowNowButton}
              time={fromTime}
              timeWithSeconds={timeWithSeconds}
            />
          </div>
          <div className="flex-1">
            <TimePicker
              clearable={timeClearable}
              disabled={disabled}
              onTimeChange={handleToTimeChange}
              placeholder={tRange('endPlaceholder', {
                placeholder: resolvedBasePlaceholder
              })}
              showNowButton={timeShowNowButton}
              time={toTime}
              timeWithSeconds={timeWithSeconds}
            />
          </div>
        </div>
      </div>
    </FieldWrapper>
  )
}
