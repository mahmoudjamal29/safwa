'use client'

import * as React from 'react'

import { cn } from '@/utils'

import { MultiSelect } from '@/components/ui/multi-select'

import { resetPageParam, triggerClassName, useArrayFilterState } from './utils'

import type {
  FilterOption,
  MultiSelectQueryFilterProps,
  MultiSelectStaticFilterProps
} from './types'

// ============================================================================
// Types
// ============================================================================

type MultiSelectQueryFilterComponentProps = Omit<
  MultiSelectQueryFilterProps,
  'key' | 'label' | 'placeholder'
> & {
  filterKey: string
  label: string
  placeholder?: string
}

type MultiSelectStaticFilterComponentProps = Omit<
  MultiSelectStaticFilterProps,
  'key' | 'label' | 'placeholder'
> & {
  filterKey: string
  label: string
  placeholder?: string
}

// ============================================================================
// Query Multiselect Filter (with dynamic API options)
// ============================================================================

export function MultiSelectQueryFilter({
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
  valueKey
}: MultiSelectQueryFilterComponentProps) {
  const { setArrayValue, value } = useArrayFilterState(filterKey)

  const handleChange = React.useCallback(
    (newValues: string[]) => {
      const valueToSet = newValues.length > 0 ? newValues : null
      setArrayValue(valueToSet)
      resetPageParam()
    },
    [setArrayValue]
  )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  type ItemType = Record<string, any>

  // Create a new array reference when value changes to ensure useEffect detects it
  // Use JSON.stringify in dependency to handle stable EMPTY_ARRAY reference
  const defaultValue = React.useMemo(
    () => [...value],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(value)]
  )

  const baseProps = {
    defaultValue,
    disabled,
    getOptionLabel,
    getOptionValue: (item: ItemType) => String(item[valueKey || 'id']),
    onValueChange: handleChange,
    placeholder: placeholder || label,
    renderOption,
    renderSelected,
    searchable: true,
    valueKey: valueKey as keyof ItemType
  }

  // Handle labelKeys (multiple properties for display)
  if (labelKeys) {
    if (infinite) {
      return (
        <MultiSelect<ItemType>
          classNames={{ trigger: cn(triggerClassName) }}
          {...baseProps}
          getOptionLabel={(item: ItemType) => {
            const labels = labelKeys
              .map((key) => item[key] as string)
              .filter(Boolean)
            return labels.join(' - ')
          }}
          infinite={true}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          queryOptions={queryOptions as any}
        />
      )
    }
    return (
      <MultiSelect<ItemType>
        {...baseProps}
        getOptionLabel={(item: ItemType) => {
          const labels = labelKeys
            .map((key) => item[key] as string)
            .filter(Boolean)
          return labels.join(' - ')
        }}
        infinite={false}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        queryOptions={queryOptions as any}
      />
    )
  }

  // Default to labelKey
  if (infinite) {
    return (
      <MultiSelect<ItemType>
        classNames={{ trigger: cn(triggerClassName) }}
        {...baseProps}
        getOptionLabel={(item: ItemType) => String(item[labelKey || 'name'])}
        infinite={true}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        queryOptions={queryOptions as any}
      />
    )
  }

  return (
    <MultiSelect<ItemType>
      classNames={{ trigger: cn(triggerClassName) }}
      {...baseProps}
      getOptionLabel={(item: ItemType) => String(item[labelKey || 'name'])}
      infinite={false}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      queryOptions={queryOptions as any}
    />
  )
}

// ============================================================================
// Static Multiselect Filter (with predefined options)
// ============================================================================

export function MultiSelectStaticFilter({
  filterKey,
  label,
  options,
  placeholder
}: MultiSelectStaticFilterComponentProps) {
  const { setArrayValue, value } = useArrayFilterState(filterKey)

  type OptionType = {
    label: string
    value: string
  }

  const convertedOptions = React.useMemo<OptionType[]>(
    () =>
      options.map((option) => ({
        label: option.label,
        value: String(option.value)
      })),
    [options]
  )

  const handleChange = React.useCallback(
    (newValues: string[]) => {
      const valueToSet = newValues.length > 0 ? newValues : null
      setArrayValue(valueToSet)
      resetPageParam()
    },
    [setArrayValue]
  )

  // Create a new array reference when value changes to ensure useEffect detects it
  // Use JSON.stringify in dependency to handle stable EMPTY_ARRAY reference
  const defaultValue = React.useMemo(
    () => [...value],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(value)]
  )

  return (
    <MultiSelect<OptionType>
      classNames={{ trigger: cn(triggerClassName) }}
      defaultValue={defaultValue}
      getOptionLabel={(option: OptionType) => option.label}
      getOptionValue={(option: OptionType) => option.value}
      infinite={false}
      onValueChange={handleChange}
      options={convertedOptions}
      placeholder={placeholder || label}
      searchable={true}
    />
  )
}

// Re-export types
export type { FilterOption }
