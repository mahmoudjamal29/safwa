import type { InfiniteQueryOptions, RegularQueryOptions } from '@/types/query'

export type ComboboxClassNames = {
  childrenWrapper?: string
  content?: string
  item?: string
  label?: string
  trigger?: string
  wrapper?: string
}

type ComboboxBaseProps<T extends object> = {
  classNames?: ComboboxClassNames
  disabled?: boolean
   
  getOptionLabel?: (item: T) => string
  label?: string
  labelKey?: keyof T
  labelKeys?: Array<keyof T>
  onChange?: (value: string | undefined) => void
  placeholder?: string
   
  renderOption?: (item: T) => React.ReactNode
   
  renderSelected?: (item: T) => React.ReactNode
  required?: boolean
  searchDebounceMs?: number
  value?: string
  valueKey?: keyof T
}

type ComboboxWithOptions<T extends object> = ComboboxBaseProps<T> & {
  infinite?: false
  options: T[]
  queryOptions?: never
}

type ComboboxWithRegularQuery<T extends object> = ComboboxBaseProps<T> & {
  infinite?: false
  options?: never
  queryOptions: RegularQueryOptions<T>
}

type ComboboxWithInfiniteQuery<T extends object> = ComboboxBaseProps<T> & {
  infinite: true
  options?: never
  queryOptions: InfiniteQueryOptions<T>
}

export type ComboboxProps<T extends object> =
  | ComboboxWithOptions<T>
  | ComboboxWithRegularQuery<T>
  | ComboboxWithInfiniteQuery<T>
