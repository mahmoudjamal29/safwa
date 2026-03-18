import * as React from 'react'

import { DynamicOption } from '@/components/ui/combobox/combobox-types'

export type BaseMultiSelectProps<T extends object> = {
  ariaLabel?: string
  classNames?: {
    chip?: string
    trigger?: string
  }
  defaultValue?: string[]
  disabled?: boolean
  getOptionLabel: (option: T) => string
  getOptionValue: (option: T) => string
  initialOptions?: Option[]
  isLoading?: boolean
  maxCount?: number
  onValueChange: (values: string[]) => void
  placeholder?: string
  searchable?: boolean
  variant?: 'default' | 'inverted' | 'secondary'
}

export type MultiSelectProps<T extends object> = BaseMultiSelectProps<T> &
  DynamicOption<T>

export interface MultiSelectRef {
  clear: () => void
  focus: () => void
  reset: () => void
  setSelectedValues: (values: string[]) => void
}

export interface Option {
  icon?: React.ComponentType<{ className?: string }>
  label: string
  style?: {
    badgeColor?: string
    gradient?: string
  }
  value: string
}
