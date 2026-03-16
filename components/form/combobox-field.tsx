'use client'

import * as React from 'react'

import { FieldWrapper } from '@/components/form/field-wrapper'
import { useFieldContext } from '@/components/form/form'

import { Combobox as ComboboxBase } from '../ui/combobox/combobox'

import type { InfiniteQueryOptions, RegularQueryOptions } from '@/types/query'

import type { ComboboxProps } from '../ui/combobox/combobox-types'

export const Combobox = <T extends object>(
  props: ComboboxProps<T>
): React.ReactElement => {
  const {
    classNames,
    infinite,
    label,
    options,
    queryOptions,
    required,
    ...restProps
  } = props

  const field = useFieldContext<string>()

  const value = field.state.value || ''
  const handleChange = React.useCallback(
    (newValue: string | undefined) => {
      field.handleChange(newValue || '')
    },
    [field]
  )

  const autocompleteProps = React.useMemo<ComboboxProps<T>>(() => {
    const baseProps = {
      ...restProps,
      classNames,
      onChange: handleChange,
      value
    }

    if (infinite) {
      return {
        ...baseProps,
        infinite: true as const,
        queryOptions: queryOptions as InfiniteQueryOptions<T>
      } as ComboboxProps<T>
    }

    if (options) {
      return {
        ...baseProps,
        infinite: false as const,
        options
      } as ComboboxProps<T>
    }

    return {
      ...baseProps,
      infinite: false as const,
      queryOptions: queryOptions as RegularQueryOptions<T>
    } as ComboboxProps<T>
  }, [
    infinite,
    options,
    queryOptions,
    restProps,
    classNames,
    value,
    handleChange
  ])

  return (
    <FieldWrapper
      classNames={classNames}
      field={field}
      label={label}
      required={required}
    >
      <ComboboxBase {...autocompleteProps} />
    </FieldWrapper>
  )
}
