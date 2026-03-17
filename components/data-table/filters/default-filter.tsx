'use client'

import { useCallback } from 'react'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { triggerClassName, useFilterState } from './utils'

import type { FilterOption } from './types'

type DefaultFilterComponentProps = {
  filterKey: string
  label: string
  options: FilterOption[]
  placeholder?: string
}

export function DefaultFilter({
  filterKey,
  label,
  options,
  placeholder
}: DefaultFilterComponentProps) {
  const { setStringValue, value } = useFilterState(filterKey, false)

  const handleChange = useCallback(
    (newValue: string) => {
      setStringValue(newValue === '_all' ? null : newValue)
    },
    [setStringValue]
  )

  return (
    <Select
      onValueChange={handleChange}
      value={(value as string) || '_all'}
    >
      <SelectTrigger className={triggerClassName}>
        <SelectValue placeholder={placeholder || label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="_all">{placeholder || label}</SelectItem>
        {options.map((option) => (
          <SelectItem key={String(option.value)} value={String(option.value)}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
