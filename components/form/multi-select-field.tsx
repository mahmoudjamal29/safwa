'use client'

import {
  FieldWrapper,
  FieldWrapperProps
} from '@/components/form/field-wrapper'
import {
  MultiSelect as UIMultiSelect,
  MultiSelectProps as UIMultiSelectProps
} from '@/components/ui/multi-select'

import { useFieldContext } from './form'

type MultiSelectProps<TData extends object = object> = Omit<
  FieldWrapperProps,
  'field'
> &
  (OmittedQueryModeProps<TData> | OmittedStaticModeProps)

type OmittedQueryModeProps<TData extends object = object> = Omit<
  QueryModeProps<TData>,
  'defaultValue' | 'onValueChange'
>

type OmittedStaticModeProps = Omit<
  StaticModeProps,
  'defaultValue' | 'onValueChange'
>

type QueryModeProps<TData extends object = object> = Extract<
  UIMultiSelectProps<TData>,
  { queryOptions: unknown }
>

type StaticModeProps = Extract<UIMultiSelectProps<object>, { options: unknown }>

function isQueryModeProps<TData extends object = object>(
  props: OmittedQueryModeProps<TData> | OmittedStaticModeProps
): props is OmittedQueryModeProps<TData> {
  return (
    'queryOptions' in props &&
    !!(props as { queryOptions?: unknown }).queryOptions
  )
}

export const MultiSelect = <TData extends object = object>(
  props: MultiSelectProps<TData>
) => {
  const { classNames, label, required = false, ...uiProps } = props
  const field = useFieldContext<string[]>()

  // Ensure we're passing the current field value, not just initial default
  const fieldValue = field.state.value || []

  const disabled =
    (uiProps.disabled || field.state.meta.isValidating || uiProps.isLoading) ??
    false

  return (
    <FieldWrapper
      classNames={classNames}
      field={field}
      label={label}
      required={required}
    >
      {isQueryModeProps<TData>(uiProps) ? (
        <UIMultiSelect<TData>
          {...({
            ...uiProps,
            defaultValue: fieldValue,
            disabled,
            onValueChange: (values: string[]) => field.handleChange(values)
          } as QueryModeProps<TData> & {
            defaultValue: string[]
            onValueChange: (values: string[]) => void
          })}
        />
      ) : (
        <UIMultiSelect
          {...({
            ...uiProps,
            defaultValue: fieldValue,
            disabled,
            onValueChange: (values: string[]) => field.handleChange(values)
          } as StaticModeProps & {
            defaultValue: string[]
            onValueChange: (values: string[]) => void
          })}
        />
      )}
    </FieldWrapper>
  )
}
