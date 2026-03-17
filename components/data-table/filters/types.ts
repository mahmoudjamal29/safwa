import type { InfiniteQueryOptions, RegularQueryOptions } from '@/types/query'

export type FilterOption = {
  label: string
  value: number | string
  [key: string]: number | string
}

// Base filter props shared by all filter variants
type BaseFilterProps = {
  disabled?: boolean
  filterKey?: string
  key?: string
  label: string
  placeholder?: string
}

// Default (select) filter
export type DefaultFilterProps = BaseFilterProps & {
  options: FilterOption[]
  variant?: 'default'
}

// Input filter
export type InputFilterProps = BaseFilterProps & {
  debounceMs?: number
  variant: 'input'
}

// Date filter
export type DateFilterProps = BaseFilterProps & {
  variant: 'date' | 'date-time'
  timeClearable?: boolean
  timePlaceholder?: string
  timeShowNowButton?: boolean
  timeWithSeconds?: boolean
}

// Date range filter
export type DateRangeFilterProps = BaseFilterProps & {
  align?: 'center' | 'end' | 'start'
  showCompare?: boolean
  variant: 'date-range' | 'date-range-time'
  timeClearable?: boolean
  timePlaceholder?: string
  timeShowNowButton?: boolean
  timeWithSeconds?: boolean
}

// Time range filter
export type TimeRangeFilterProps = BaseFilterProps & {
  timeClearable?: boolean
  timePlaceholder?: string
  timeShowNowButton?: boolean
  timeWithSeconds?: boolean
  variant: 'time' | 'time-range'
}

// Combobox static filter
export type ComboboxStaticFilterProps = BaseFilterProps & {
  labelKey: string
  options: FilterOption[]
  valueKey: string
  variant: 'combobox'
}

// Combobox query filter
export type ComboboxQueryFilterProps = BaseFilterProps & {
  getOptionLabel?: (item: Record<string, unknown>) => string
  infinite?: boolean
  labelKey?: string
  labelKeys?: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryOptions?: RegularQueryOptions<any> | InfiniteQueryOptions<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderOption?: (item: Record<string, unknown>) => React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderSelected?: (item: Record<string, unknown>) => React.ReactNode
  searchDebounceMs?: number
  valueKey?: string
  variant: 'combobox'
}

// Multiselect static filter
export type MultiSelectStaticFilterProps = BaseFilterProps & {
  options: FilterOption[]
  variant: 'multiselect'
}

// Multiselect query filter
export type MultiSelectQueryFilterProps = BaseFilterProps & {
  getOptionLabel?: (item: Record<string, unknown>) => string
  infinite?: boolean
  labelKey?: string
  labelKeys?: string[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  queryOptions?: RegularQueryOptions<any> | InfiniteQueryOptions<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderOption?: (item: Record<string, unknown>) => React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderSelected?: (item: Record<string, unknown>) => React.ReactNode
  valueKey?: string
  variant: 'multiselect'
}

export type DataTableFilterProps =
  | DefaultFilterProps
  | InputFilterProps
  | DateFilterProps
  | DateRangeFilterProps
  | TimeRangeFilterProps
  | ComboboxStaticFilterProps
  | ComboboxQueryFilterProps
  | MultiSelectStaticFilterProps
  | MultiSelectQueryFilterProps

export type DataTableFilterComponentProps = DataTableFilterProps & {
  filterKey: string
  label: string
}
