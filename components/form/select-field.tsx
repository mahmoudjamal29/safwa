'use client'

import React from 'react'

import { Loader2 } from 'lucide-react'

import { cn, isFieldInvalid } from '@/utils'

import {
  FieldWrapper,
  FieldWrapperClassNames
} from '@/components/form/field-wrapper'
import {
  Select as BaseSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { useFieldContext } from './form'

type SelectProps<T> = {
  classNames?: FieldWrapperClassNames & { select?: string }
  disabled?: boolean
  label?: string
  loading?: boolean
  optionKey: keyof T
  options: T[]
  optionValue: keyof T
  placeholder?: string
  ref?: React.Ref<HTMLButtonElement>
  renderOption?: (item: T) => React.ReactNode
  required?: boolean
  startIcon?: React.ReactNode
}

export const Select = <T extends object>({
  classNames,
  disabled,
  label,
  loading,
  optionKey,
  options,
  optionValue,
  placeholder,
  ref,
  renderOption,
  required,
  startIcon
}: SelectProps<T>) => {
  const field = useFieldContext<number | string | string[] | undefined>()

  const value = field.state.value?.toString() ?? ''
  const isDisabled = disabled || loading

  return (
    <FieldWrapper
      classNames={classNames}
      field={field}
      label={label}
      required={required}
    >
      <BaseSelect
        disabled={isDisabled}
        onValueChange={(val) => {
          if (val === '' && required) {
            return
          }
          field.handleChange(val)
        }}
        value={value}
      >
        <SelectTrigger
          aria-busy={loading || undefined}
          className={cn(
            `h-input w-full justify-between! rounded-md! px-3.5! py-2! **:text-start`,
            classNames?.select
          )}
          data-invalid={isFieldInvalid(field) || undefined}
          data-loading={loading || undefined}
          onBlur={field.handleBlur}
          ref={ref}
          style={{ borderRadius: '7px' }}
        >
          {startIcon && !loading ? startIcon : null}
          {loading && (
            <Loader2 className="text-muted-foreground mr-2 h-4 w-4 animate-spin" />
          )}
          <SelectValue placeholder={loading ? '' : placeholder} />
        </SelectTrigger>

        <SelectContent>
          {loading ? (
            <div className="text-muted-foreground flex items-center justify-center gap-2 p-3 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : (
            (Array.isArray(options) ? options : []).map((item) => (
              <SelectItem
                className="flex items-center gap-3 px-3 py-2"
                key={String(item[optionKey])}
                value={String(item[optionKey])}
              >
                {renderOption
                  ? renderOption(item)
                  : (item[optionValue] as string)}{' '}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </BaseSelect>
    </FieldWrapper>
  )
}
