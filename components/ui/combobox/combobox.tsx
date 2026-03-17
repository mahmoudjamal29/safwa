'use client'

import * as React from 'react'

import { cn } from '@/utils/cn'

import type { ComboboxProps } from './combobox-types'

export function Combobox<T extends object>({
  classNames,
  disabled,
  getOptionLabel,
  labelKey,
  onChange,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options: _options,
  placeholder,
  value
}: ComboboxProps<T>) {
  return (
    <select
      className={cn(
        'border-input bg-background placeholder:text-muted-foreground h-9 w-full rounded-md border px-3 py-1 text-sm shadow-xs disabled:cursor-not-allowed disabled:opacity-50',
        classNames?.trigger
      )}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value || undefined)}
      value={value ?? ''}
    >
      {placeholder && (
        <option disabled value="">
          {placeholder}
        </option>
      )}
    </select>
  )
}
