'use client'

import * as React from 'react'

import { parseISO } from 'date-fns'
import { useTranslations } from 'next-intl'

import { FieldWrapper } from '@/components/form/field-wrapper'

import {
  type DateRange,
  DateRangePicker as DateRangePickerUI
} from '../ui/date-range-picker'
import { useFieldContext } from './form'

export type DateRangePickerProps = {
  align?: 'center' | 'end' | 'start'
  classNames?: {
    childrenWrapper?: string
    label?: string
    wrapper?: string
  }
  disabled?: boolean
  label?: string
  placeholder?: string
  required?: boolean
  showCompare?: boolean
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  align = 'end',
  classNames,
  disabled,
  label,
  placeholder,
  required,
  showCompare = false
}) => {
  const t = useTranslations('components.ui.dateRangePicker')
  const resolvedPlaceholder = placeholder ?? t('placeholder')
  const field = useFieldContext<null | { from: string; to: string }>()

  const dateRange = React.useMemo<DateRange | null>(() => {
    if (!field.state.value) return null
    try {
      return {
        from: field.state.value.from
          ? parseISO(field.state.value.from)
          : undefined,
        to: field.state.value.to ? parseISO(field.state.value.to) : undefined
      }
    } catch {
      return null
    }
  }, [field.state.value])

  const handleUpdate = React.useCallback(
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

      field.handleChange({
        from: values.dateFrom
          ? values.dateFrom.toISOString().split('T')[0]
          : '',
        to: values.dateTo ? values.dateTo.toISOString().split('T')[0] : ''
      })
    },
    [field]
  )

  return (
    <FieldWrapper
      classNames={classNames}
      field={field}
      label={label}
      required={required}
    >
      <DateRangePickerUI
        align={align}
        disabled={disabled}
        onUpdate={handleUpdate}
        placeholder={resolvedPlaceholder}
        showCompare={showCompare}
        value={dateRange}
      />
    </FieldWrapper>
  )
}
