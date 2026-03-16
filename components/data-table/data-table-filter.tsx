'use client'

import {
  ComboboxQueryFilter,
  ComboboxStaticFilter,
  DataTableFilterComponentProps,
  DataTableFilterProps,
  DateFilter,
  DateRangeFilter,
  DateRangeTimeFilter,
  DateTimeFilter,
  DefaultFilter,
  FilterOption,
  InputFilter,
  MultiSelectQueryFilter,
  MultiSelectStaticFilter,
  TimeFilter,
  TimeRangeFilter
} from './filters'

/**
 * DataTableFilter component with support for multiple filter variants.
 * Manages filter state in URL params via the filter key.
 *
 * Supported variants:
 * - 'default' - Simple select dropdown
 * - 'combobox' - Searchable combobox (static options or API-driven)
 * - 'multiselect' - Multi-select dropdown (static options or API-driven)
 * - 'date' - Single date picker
 * - 'date-time' - Date and time picker
 * - 'date-range' - Date range picker
 * - 'date-range-time' - Date range with time picker
 * - 'time' - Single time picker
 * - 'time-range' - Time range picker
 * - 'input' - Plain text input with debouncing
 */
export function DataTableFilter(props: DataTableFilterComponentProps) {
  const { filterKey, label, ...restProps } = props
  const internalProps = { ...restProps, key: filterKey } as DataTableFilterProps
  const placeholder =
    'placeholder' in internalProps ? internalProps.placeholder : undefined

  const variant = internalProps.variant || 'default'

  // Default variant - uses Select component
  if (variant === 'default' || !variant) {
    const { options } = internalProps as Extract<
      DataTableFilterProps,
      { variant?: 'default' }
    >
    return (
      <DefaultFilter
        filterKey={filterKey}
        label={label}
        options={options}
        placeholder={placeholder}
      />
    )
  }

  // Input variant - plain text input with debouncing
  if (variant === 'input') {
    const inputProps = internalProps as Extract<
      DataTableFilterProps,
      { variant: 'input' }
    >
    return (
      <InputFilter
        debounceMs={inputProps.debounceMs}
        disabled={inputProps.disabled}
        filterKey={filterKey}
        label={label}
        placeholder={placeholder}
      />
    )
  }

  // Combobox variant with static options
  if (
    variant === 'combobox' &&
    'options' in internalProps &&
    internalProps.options
  ) {
    const { labelKey, options, valueKey } = internalProps as Extract<
      DataTableFilterProps,
      { options: FilterOption[]; variant: 'combobox' }
    >
    return (
      <ComboboxStaticFilter
        filterKey={filterKey}
        label={label}
        labelKey={labelKey}
        options={options}
        placeholder={placeholder}
        valueKey={valueKey}
        variant="combobox"
      />
    )
  }

  // Combobox variant with query options
  if (variant === 'combobox' && !('options' in internalProps)) {
    const comboboxProps = internalProps as Extract<
      DataTableFilterProps,
      { variant: 'combobox' }
    > & { options?: never }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { key: _unusedKey, ...restComboboxProps } = comboboxProps
    return (
      <ComboboxQueryFilter
        {...restComboboxProps}
        filterKey={filterKey}
        label={label}
        placeholder={placeholder}
      />
    )
  }

  // Multiselect variant with static options
  if (
    variant === 'multiselect' &&
    'options' in internalProps &&
    internalProps.options &&
    Array.isArray(internalProps.options)
  ) {
    const { options } = internalProps as Extract<
      DataTableFilterProps,
      { options: FilterOption[]; variant: 'multiselect' }
    >
    return (
      <MultiSelectStaticFilter
        filterKey={filterKey}
        label={label}
        options={options}
        placeholder={placeholder}
        variant="multiselect"
      />
    )
  }

  // Multiselect variant with query options
  if (variant === 'multiselect' && !('options' in internalProps)) {
    const multiselectProps = internalProps as Extract<
      DataTableFilterProps,
      { variant: 'multiselect' }
    > & { options?: never }
    // eslint-disable-next-line
    const { key: _unusedKey, ...restMultiselectProps } = multiselectProps
    return (
      <MultiSelectQueryFilter
        {...restMultiselectProps}
        filterKey={filterKey}
        label={label}
        placeholder={placeholder}
      />
    )
  }

  // Date variant - single date picker (no time)
  if (variant === 'date') {
    const { disabled } = internalProps as Extract<
      DataTableFilterProps,
      { variant: 'date' }
    >
    return (
      <DateFilter
        disabled={disabled}
        filterKey={filterKey}
        label={label}
        placeholder={placeholder}
        variant="date"
      />
    )
  }

  // DateTime variant - single date and time picker
  if (variant === 'date-time') {
    const {
      disabled,
      timeClearable,
      timePlaceholder,
      timeShowNowButton,
      timeWithSeconds
    } = internalProps as Extract<DataTableFilterProps, { variant: 'date-time' }>
    return (
      <DateTimeFilter
        disabled={disabled}
        filterKey={filterKey}
        label={label}
        placeholder={placeholder}
        timeClearable={timeClearable}
        timePlaceholder={timePlaceholder}
        timeShowNowButton={timeShowNowButton}
        timeWithSeconds={timeWithSeconds}
        variant="date-time"
      />
    )
  }

  // Date range variant - date range picker (no time)
  if (variant === 'date-range') {
    const { align, disabled, showCompare } = internalProps as Extract<
      DataTableFilterProps,
      { variant: 'date-range' }
    >
    return (
      <DateRangeFilter
        align={align}
        disabled={disabled}
        filterKey={filterKey}
        label={label}
        placeholder={placeholder}
        showCompare={showCompare}
        variant="date-range"
      />
    )
  }

  // Date range time variant - date range with start/end times
  if (variant === 'date-range-time') {
    const {
      align,
      disabled,
      showCompare,
      timeClearable,
      timePlaceholder,
      timeShowNowButton,
      timeWithSeconds
    } = internalProps as Extract<
      DataTableFilterProps,
      { variant: 'date-range-time' }
    >
    return (
      <DateRangeTimeFilter
        align={align}
        disabled={disabled}
        filterKey={filterKey}
        label={label}
        placeholder={placeholder}
        showCompare={showCompare}
        timeClearable={timeClearable}
        timePlaceholder={timePlaceholder}
        timeShowNowButton={timeShowNowButton}
        timeWithSeconds={timeWithSeconds}
        variant="date-range-time"
      />
    )
  }

  // Time range variant - time range picker (single day)
  if (variant === 'time-range') {
    const {
      disabled,
      timeClearable,
      timePlaceholder,
      timeShowNowButton,
      timeWithSeconds
    } = internalProps as Extract<
      DataTableFilterProps,
      { variant: 'time-range' }
    >
    return (
      <TimeRangeFilter
        disabled={disabled}
        filterKey={filterKey}
        label={label}
        placeholder={placeholder}
        timeClearable={timeClearable}
        timePlaceholder={timePlaceholder}
        timeShowNowButton={timeShowNowButton}
        timeWithSeconds={timeWithSeconds}
        variant="time-range"
      />
    )
  }

  // Time variant - single time picker
  if (variant === 'time') {
    const { disabled, timeClearable, timeShowNowButton, timeWithSeconds } =
      internalProps as Extract<DataTableFilterProps, { variant: 'time' }>
    return (
      <TimeFilter
        disabled={disabled}
        filterKey={filterKey}
        label={label}
        placeholder={placeholder}
        timeClearable={timeClearable}
        timeShowNowButton={timeShowNowButton}
        timeWithSeconds={timeWithSeconds}
        variant="time"
      />
    )
  }

  return null
}

// Re-export types for backward compatibility
export type {
  DataTableFilterComponentProps,
  DataTableFilterProps
} from './filters'
