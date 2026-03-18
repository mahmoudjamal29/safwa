'use client'

import { isFieldInvalid } from '@/utils'

import { FieldWrapper } from '@/components/form/field-wrapper'
import {
  type DateMatcher,
  DatePicker as DatePickerUI
} from '@/components/ui/date-picker'

import { useFieldContext } from './form'

export type DatePickerProps = {
  classNames?: {
    childrenWrapper?: string
    label?: string
    wrapper?: string
  }
  disabled?: boolean | DateMatcher | DateMatcher[]
  format?: (date: Date) => string
  label?: string
  placeholder?: string
  required?: boolean
  startIcon?: React.ReactNode
}

export const DatePicker: React.FC<DatePickerProps> = ({
  classNames,
  disabled,
  format,
  label,
  placeholder,
  required,
  startIcon
}) => {
  const field = useFieldContext<string>()

  return (
    <FieldWrapper
      classNames={classNames}
      field={field}
      label={label}
      required={required}
    >
      <DatePickerUI
        data-invalid={isFieldInvalid(field) || undefined}
        disabled={disabled}
        format={format}
        onBlur={field.handleBlur}
        onUpdate={(v) => field.handleChange(v ?? '')}
        placeholder={placeholder}
        startIcon={startIcon}
        value={field.state.value || null}
      />
    </FieldWrapper>
  )
}
