'use client'

import * as React from 'react'

import { useStore } from '@tanstack/react-form'
import { useTranslations } from 'next-intl'

import { FieldWrapper } from '@/components/form/field-wrapper'

import { TimePicker } from '../ui/time-picker'
import { useFieldContext } from './form'

export type TimeRangePickerProps = {
  classNames?: {
    childrenWrapper?: string
    label?: string
    wrapper?: string
  }
  disabled?: boolean
  label?: string
  required?: boolean
  timeClearable?: boolean
  timePlaceholder?: string
  timeShowNowButton?: boolean
  timeWithSeconds?: boolean
}

export const TimeRangePicker: React.FC<TimeRangePickerProps> = ({
  classNames,
  disabled,
  label,
  required,
  timeClearable = true,
  timePlaceholder,
  timeShowNowButton = true,
  timeWithSeconds = false
}) => {
  const tTime = useTranslations('components.form.timePicker')
  const t = useTranslations('components.form.timeRangePicker')
  const resolvedBasePlaceholder = timePlaceholder ?? tTime('placeholder')
  const field = useFieldContext<null | { from: string; to: string }>()

  const fromTime = useStore(field.store, (state) => state.value?.from || null)
  const toTime = useStore(field.store, (state) => state.value?.to || null)

  const handleFromTimeChange = React.useCallback(
    (time: null | string) => {
      field.handleChange({
        from: time || '',
        to: field.state.value?.to || ''
      })
    },
    [field]
  )

  const handleToTimeChange = React.useCallback(
    (time: null | string) => {
      field.handleChange({
        from: field.state.value?.from || '',
        to: time || ''
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
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="flex-1">
          <TimePicker
            clearable={timeClearable}
            disabled={disabled}
            onTimeChange={handleFromTimeChange}
            placeholder={t('startPlaceholder', {
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
            placeholder={t('endPlaceholder', {
              placeholder: resolvedBasePlaceholder
            })}
            showNowButton={timeShowNowButton}
            time={toTime}
            timeWithSeconds={timeWithSeconds}
          />
        </div>
      </div>
    </FieldWrapper>
  )
}
