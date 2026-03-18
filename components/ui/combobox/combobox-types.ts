import * as React from 'react'

import { Popover as PopoverPrimitive } from 'radix-ui'

import {
  DynamicInfiniteQueryOptions,
  DynamicRegularQueryOptions
} from '@/types/query'

export type BaseComboboxProps<T extends object> = {
  classNames?: {
    childrenWrapper?: string
    label?: string
    popoverContent?: string
    trigger?: string
    wrapper?: string
  }
  closeOnSelect?: boolean
  customTrigger?: React.ReactNode
  disabled?: boolean
  footer?: React.ReactNode
  getOptionLabel?: (item: T) => React.ReactNode
  label?: string
  labelKey?: keyof T
  labelKeys?: Array<keyof T>
  onChange?: (value: string | undefined) => void
  onSearch?: (query: string) => void
  onSelectItem?: (item: T | undefined) => void
  placeholder?: string
  popoverContentProps?: React.ComponentProps<typeof PopoverPrimitive.Content>
  renderOption?: (item: T) => React.ReactNode
  renderSelected?: (item: T | undefined) => React.ReactNode
  required?: boolean
  searchDebounceMs?: number
  value?: string
  valueKey: keyof T
} & (
  | { labelKey: keyof T; labelKeys?: never }
  | { labelKey?: never; labelKeys: Array<keyof T> }
)

export type ComboboxProps<T extends object> = BaseComboboxProps<T> &
  DynamicOption<T>

export type DynamicOption<T extends object> =
  | {
      infinite: true
      options?: never
      queryOptions: DynamicInfiniteQueryOptions<T>
    }
  | {
      infinite?: false
      options: T[]
      queryOptions?: never
    }
  | {
      infinite?: false
      options?: never
      queryOptions: DynamicRegularQueryOptions<T>
    }
