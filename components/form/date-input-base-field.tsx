'use client'

import * as React from 'react'

import { format } from 'date-fns'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

import { Input } from '@/components/ui/input'

export type DateInputBaseProps = {
  className?: string
  disabled?: boolean
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  value?: Date | null | string
}

export const DateInputBase = React.forwardRef<
  HTMLInputElement,
  DateInputBaseProps
>(({ className, disabled, onChange, placeholder, value, ...props }, ref) => {
  const t = useTranslations('components.form.dateInputBase')
  const resolvedPlaceholder = placeholder || t('placeholder')
  const [inputValue, setInputValue] = React.useState<string>(() => {
    if (!value) return ''
    try {
      const date = typeof value === 'string' ? new Date(value) : value
      if (!isNaN(date.getTime())) {
        return format(date, 'yyyy-MM-dd')
      }
    } catch {
      // Invalid date
    }
    return ''
  })

  React.useEffect(() => {
    if (!value) {
      setInputValue('')
      return
    }
    try {
      const date = typeof value === 'string' ? new Date(value) : value
      if (!isNaN(date.getTime())) {
        setInputValue(format(date, 'yyyy-MM-dd'))
      }
    } catch {
      // Invalid date
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)

    if (!newValue) {
      onChange?.(undefined)
      return
    }

    try {
      const date = new Date(newValue)
      if (!isNaN(date.getTime())) {
        onChange?.(date)
      }
    } catch {
      // Invalid date
    }
  }

  return (
    <Input
      className={cn('h-input rounded-lg', className)}
      disabled={disabled}
      onChange={handleChange}
      placeholder={resolvedPlaceholder}
      ref={ref}
      type="date"
      value={inputValue}
      {...props}
    />
  )
})

DateInputBase.displayName = 'DateInputBase'
