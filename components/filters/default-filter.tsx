'use client'

import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

import { DefaultFilterProps } from './types'
import { resetPageParam, triggerClassName, useFilterState } from './utils'

type DefaultFilterComponentProps = Omit<
  DefaultFilterProps,
  'key' | 'label' | 'placeholder'
> & {
  filterKey: string
  label: string
  placeholder?: string
}

export function DefaultFilter({
  filterKey,
  label,
  options,
  placeholder
}: DefaultFilterComponentProps) {
  const t = useTranslations('components.dataTable.topbar')
  const { setStringValue, value } = useFilterState(filterKey, false)

  const handleValueChange = async (newValue: string) => {
    // 'all' always means "no filter" - clears the URL param
    await setStringValue(newValue === 'all' ? null : newValue)
    // resetPageParam is already called inside setStringValue (via handleSetValue in utils.ts)
  }

  // When no value is selected or value is 'all', show placeholder
  // When a value is selected, use that value
  // Ensure 'all' is never passed as value to Select - must be undefined to show placeholder
  const stringValue = value as string
  const displayValue: string | undefined =
    !stringValue || stringValue === 'all' ? undefined : stringValue

  return (
    <Select
      key={`select-${displayValue ?? 'empty'}`}
      onValueChange={handleValueChange}
      value={displayValue}
    >
      <SelectTrigger className={cn(triggerClassName)}>
        <SelectValue placeholder={placeholder || label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{t('all')}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={`${option.value}`}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
