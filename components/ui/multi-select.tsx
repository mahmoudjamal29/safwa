'use client'

import * as React from 'react'

import { cn } from '@/utils/cn'

import type { InfiniteQueryOptions, RegularQueryOptions } from '@/types/query'

type MultiSelectClassNames = {
  content?: string
  item?: string
  trigger?: string
}

type MultiSelectBaseProps<T extends object> = {
  classNames?: MultiSelectClassNames
  defaultValue?: string[]
  disabled?: boolean
  getOptionLabel?: (item: T) => string
  getOptionValue?: (item: T) => string
  onValueChange?: (values: string[]) => void
  placeholder?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderOption?: (item: T) => React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  renderSelected?: (item: T) => React.ReactNode
  searchable?: boolean
  valueKey?: keyof T
}

type MultiSelectWithOptions<T extends object> = MultiSelectBaseProps<T> & {
  infinite?: false
  options?: T[]
  queryOptions?: never
}

type MultiSelectWithRegularQuery<T extends object> = MultiSelectBaseProps<T> & {
  infinite?: false
  options?: never
  queryOptions?: RegularQueryOptions<T>
}

type MultiSelectWithInfiniteQuery<T extends object> = MultiSelectBaseProps<T> & {
  infinite: true
  options?: never
  queryOptions?: InfiniteQueryOptions<T>
}

export type MultiSelectProps<T extends object> =
  | MultiSelectWithOptions<T>
  | MultiSelectWithRegularQuery<T>
  | MultiSelectWithInfiniteQuery<T>

export function MultiSelect<T extends object>({
  classNames,
  defaultValue: _defaultValue,
  disabled,
  onValueChange,
  options,
  placeholder
}: MultiSelectProps<T> & { options?: T[] }) {
  const [selected, setSelected] = React.useState<string[]>(_defaultValue ?? [])

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const values = Array.from(e.target.selectedOptions, (opt) => opt.value)
    setSelected(values)
    onValueChange?.(values)
  }

  return (
    <select
      className={cn(
        'border-input bg-background placeholder:text-muted-foreground h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs disabled:cursor-not-allowed disabled:opacity-50',
        classNames?.trigger
      )}
      disabled={disabled}
      multiple
      onChange={handleChange}
      value={selected}
    >
      {placeholder && (
        <option disabled value="">
          {placeholder}
        </option>
      )}
      {(options ?? []).map((opt, i) => (
        <option key={i}>{String(opt)}</option>
      ))}
    </select>
  )
}
