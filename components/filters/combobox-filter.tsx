'use client'

import * as React from 'react'

import { Combobox } from '@/components/ui/combobox/combobox'

import { triggerClassName, useFilterState } from './utils'

import type {
  ComboboxQueryFilterProps,
  ComboboxStaticFilterProps,
  FilterOption
} from './types'

// ============================================================================
// Types
// ============================================================================

type ComboboxQueryFilterComponentProps = Omit<
  ComboboxQueryFilterProps,
  'key' | 'label' | 'placeholder'
> & {
  filterKey: string
  label: string
  placeholder?: string
}

type ComboboxStaticFilterComponentProps = Omit<
  ComboboxStaticFilterProps,
  'key' | 'label' | 'placeholder'
> & {
  filterKey: string
  label: string
  placeholder?: string
}

// ============================================================================
// Query Combobox Filter (with dynamic API options)
// ============================================================================

export function ComboboxQueryFilter({
  disabled,
  filterKey,
  getOptionLabel,
  infinite = false,
  label,
  labelKey,
  labelKeys,
  placeholder,
  queryOptions,
  renderOption,
  renderSelected,
  searchDebounceMs,
  valueKey
}: ComboboxQueryFilterComponentProps) {
  const { setStringValue, value } = useFilterState(filterKey, false)

  const handleChange = React.useCallback(
    async (newValue: string | undefined) => {
      await setStringValue(newValue || null)
    },
    [setStringValue]
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type ItemType = Record<string, any>

  const baseProps = {
    classNames: {
      trigger: triggerClassName
    },
    disabled,
    getOptionLabel,
    onChange: handleChange,
    placeholder: placeholder || label,
    renderOption,
    renderSelected,
    searchDebounceMs,
    value: (value as string) || undefined,
    valueKey: valueKey as keyof ItemType
  }

  // Handle labelKeys (multiple properties for display)
  if (labelKeys) {
    if (infinite) {
      return (
        <Combobox<ItemType>
          {...baseProps}
          infinite={true}
          labelKeys={labelKeys as Array<keyof ItemType>}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          queryOptions={queryOptions as any}
        />
      )
    }
    return (
      <Combobox<ItemType>
        {...baseProps}
        infinite={false}
        labelKeys={labelKeys as Array<keyof ItemType>}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        queryOptions={queryOptions as any}
      />
    )
  }

  // Default to labelKey
  if (infinite) {
    return (
      <Combobox<ItemType>
        {...baseProps}
        infinite={true}
        labelKey={(labelKey || 'name') as keyof ItemType}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        queryOptions={queryOptions as any}
      />
    )
  }

  return (
    <Combobox<ItemType>
      {...baseProps}
      infinite={false}
      labelKey={(labelKey || 'name') as keyof ItemType}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryOptions={queryOptions as any}
    />
  )
}

// ============================================================================
// Static Combobox Filter (with predefined options)
// ============================================================================

export function ComboboxStaticFilter({
  filterKey,
  label,
  labelKey,
  options,
  placeholder,
  valueKey
}: ComboboxStaticFilterComponentProps) {
  const { setStringValue, value } = useFilterState(filterKey, false)

  type OptionType = Record<string, number | string>

  const convertedOptions = React.useMemo<OptionType[]>(
    () =>
      options.map((option) => ({
        [labelKey]: option[labelKey] as number | string,
        [valueKey]: option[valueKey] as number | string
      })),
    [options, labelKey, valueKey]
  )

  const handleChange = React.useCallback(
    (newValue: string | undefined) => {
      setStringValue(newValue || null)
    },
    [setStringValue]
  )

  return (
    <Combobox<OptionType>
      classNames={{
        trigger: triggerClassName
      }}
      infinite={false}
      labelKey={labelKey as keyof OptionType}
      onChange={handleChange}
      options={convertedOptions}
      placeholder={placeholder || label}
      value={(value as string) || undefined}
      valueKey={valueKey as keyof OptionType}
    />
  )
}

// Re-export types
export type { FilterOption }
