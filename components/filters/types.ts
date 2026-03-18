import type { BaseComboboxProps } from '@/components/ui/combobox/combobox-types'

// ============================================================================
// Combobox Filter Types
// ============================================================================

/**
 * Combobox filter with dynamic query options (API-driven)
 * Extends BaseComboboxProps with filter-specific fields
 *
 * Note: queryOptions uses `any` to allow flexible parameter types
 * (e.g., RolesListParams, custom params) without strict typing constraints
 */
export type ComboboxQueryFilterProps = Omit<
  BaseComboboxProps<Record<string, unknown>>,
  'onChange' | 'onSearch' | 'value'
> & {
  infinite?: boolean
  key: string
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryOptions: any
  variant: 'combobox'
}

/**
 * Combobox filter with static options (predefined list)
 */
export type ComboboxStaticFilterProps = {
  key: string
  label: string
  labelKey: 'key' | 'label'
  labelKeys?: never
  options: FilterOption[]
  placeholder?: string
  valueKey: 'key' | 'value'
  variant: 'combobox'
}

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * Component props interface (uses filterKey instead of key)
 */
export interface DataTableFilterComponentProps extends Omit<
  DataTableFilterProps,
  'key'
> {
  filterKey: string
}

/**
 * Union type for all filter props
 */
export type DataTableFilterProps =
  | ComboboxQueryFilterProps
  | ComboboxStaticFilterProps
  | DateFilterProps
  | DateRangeFilterProps
  | DateRangeTimeFilterProps
  | DateTimeFilterProps
  | DefaultFilterProps
  | InputFilterProps
  | MultiSelectQueryFilterProps
  | MultiSelectStaticFilterProps
  | TimeFilterProps
  | TimeRangeFilterProps

// ============================================================================
// Date/Time Filter Types
// ============================================================================

/**
 * Date filter variant (single date, no time)
 */
export type DateFilterProps = {
  disabled?: boolean
  key: string
  label: string
  placeholder?: string
  variant: 'date'
}

/**
 * Date range filter variant (date range, no time)
 */
export type DateRangeFilterProps = {
  align?: 'center' | 'end' | 'start'
  disabled?: boolean
  key: string
  label: string
  placeholder?: string
  showCompare?: boolean
  variant: 'date-range'
}

/**
 * Date range time filter variant (date range with start/end times)
 */
export type DateRangeTimeFilterProps = {
  align?: 'center' | 'end' | 'start'
  disabled?: boolean
  key: string
  label: string
  placeholder?: string
  showCompare?: boolean
  timeClearable?: boolean
  timePlaceholder?: string
  timeShowNowButton?: boolean
  timeWithSeconds?: boolean
  variant: 'date-range-time'
}

/**
 * DateTime filter variant (single date with time)
 */
export type DateTimeFilterProps = {
  disabled?: boolean
  key: string
  label: string
  placeholder?: string
  timeClearable?: boolean
  timePlaceholder?: string
  timeShowNowButton?: boolean
  timeWithSeconds?: boolean
  variant: 'date-time'
}

// ============================================================================
// Default Filter Type
// ============================================================================

/**
 * Default variant props (simple select dropdown)
 */
export type DefaultFilterProps = {
  key: string
  label: string
  options: FilterOption[]
  placeholder?: string
  variant?: 'default'
}

// ============================================================================
// Input Filter Type
// ============================================================================

/**
 * Standard filter option for select/combobox filters
 */
export interface FilterOption {
  key: number | string
  label: string
  value: number | string
}

// ============================================================================
// Common Types
// ============================================================================

/**
 * Input filter variant (plain text input with debouncing)
 */
export type InputFilterProps = {
  debounceMs?: number
  disabled?: boolean
  key: string
  label: string
  placeholder?: string
  variant: 'input'
}

// ============================================================================
// Multiselect Filter Types
// ============================================================================

/**
 * Multiselect filter with dynamic query options (API-driven)
 * Extends BaseComboboxProps with filter-specific fields
 *
 * Note: queryOptions uses `any` to allow flexible parameter types
 * (e.g., RolesListParams, custom params) without strict typing constraints
 */
export type MultiSelectQueryFilterProps = Omit<
  BaseComboboxProps<Record<string, unknown>>,
  'onChange' | 'onSearch' | 'value'
> & {
  infinite?: boolean
  key: string
  label: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryOptions: any
  variant: 'multiselect'
}

/**
 * Multiselect filter with static options (predefined list)
 */
export type MultiSelectStaticFilterProps = {
  key: string
  label: string
  options: FilterOption[]
  placeholder?: string
  variant: 'multiselect'
}

// ============================================================================
// Time Filter Types
// ============================================================================

/**
 * Time filter variant (single time)
 */
export type TimeFilterProps = {
  disabled?: boolean
  key: string
  label: string
  placeholder?: string
  timeClearable?: boolean
  timeShowNowButton?: boolean
  timeWithSeconds?: boolean
  variant: 'time'
}

/**
 * Time range filter variant (time range, single day)
 */
export type TimeRangeFilterProps = {
  disabled?: boolean
  key: string
  label: string
  placeholder?: string
  timeClearable?: boolean
  timePlaceholder?: string
  timeShowNowButton?: boolean
  timeWithSeconds?: boolean
  variant: 'time-range'
}
