'use client'

import * as React from 'react'

import { isFieldInvalid } from '@/utils'

import { FieldWrapper } from '@/components/form/field-wrapper'
import { Input as BaseInput } from '@/components/ui/input'

import { useFieldContext } from './form'

export type InputProps = React.ComponentProps<typeof BaseInput> & {
  label?: string
  required?: boolean
}

export const Input = ({ label, required, ...inputProps }: InputProps) => {
  const field = useFieldContext<string>()

  return (
    <FieldWrapper field={field} label={label} required={required}>
      <BaseInput
        aria-invalid={isFieldInvalid(field) || undefined}
        name={field.name}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
        value={field.state.value ?? ''}
        {...inputProps}
      />
    </FieldWrapper>
  )
}
