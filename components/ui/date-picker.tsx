'use client'

import * as React from 'react'
import type { Matcher } from 'react-day-picker'

import { format } from 'date-fns'
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils/cn'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

export type DateMatcher = Matcher

export type DatePickerProps = {
  align?: 'center' | 'end' | 'start'
  className?: string
  'data-invalid'?: boolean | undefined
  disabled?: boolean | DateMatcher | DateMatcher[]
  format?: (date: Date) => string
  onBlur?: () => void
  onUpdate?: (value: null | string) => void
  placeholder?: string
  size?: React.ComponentProps<typeof Button>['size']
  startIcon?: React.ReactNode
  value?: null | string
}

export const DatePicker: React.FC<DatePickerProps> = ({
  align = 'start',
  className,
  'data-invalid': dataInvalid,
  disabled,
  format: formatFn,
  onBlur,
  onUpdate,
  placeholder,
  size,
  startIcon,
  value
}) => {
  const t = useTranslations('components.ui.datePicker')
  const resolvedPlaceholder = placeholder ?? t('placeholder')
  const [open, setOpen] = React.useState(false)

  const isComponentDisabled = disabled === true

  const disabledDates = React.useMemo<Matcher | Matcher[] | undefined>(() => {
    if (disabled === true || disabled === false || disabled === undefined) {
      return undefined
    }
    return disabled
  }, [disabled])

  const selectedDate = React.useMemo(() => {
    if (!value) return undefined
    try {
      const date = new Date(value)
      return isNaN(date.getTime()) ? undefined : date
    } catch {
      return undefined
    }
  }, [value])

  const displayValue = React.useMemo(() => {
    if (!selectedDate) return resolvedPlaceholder
    return formatFn
      ? formatFn(selectedDate)
      : format(selectedDate, 'MMM d, yyyy')
  }, [formatFn, resolvedPlaceholder, selectedDate])

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onUpdate?.(null)
      setOpen(false)
      return
    }
    const dateStr = format(date, 'yyyy-MM-dd')
    onUpdate?.(dateStr)
    setOpen(false)
  }

  return (
    <Popover onOpenChange={(o) => setOpen(o)} open={open}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'border-input placeholder:text-muted-foreground focus:ring-ring group ring-offset-background focus-visible:border-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive focus-visible:ring-ring bg-background text-accent-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 data-[state=open]:bg-accent inline-flex w-full cursor-pointer items-center justify-between gap-1.5 rounded-md border px-3 py-2 text-sm font-thin whitespace-nowrap shadow-xs shadow-black/5 transition-[color,box-shadow] outline-none focus:ring-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
            className
          )}
          data-invalid={dataInvalid || undefined}
          disabled={isComponentDisabled}
          onBlur={onBlur}
          size={size}
          variant="outline"
        >
          <div className="flex items-center gap-2">
            {startIcon ? (
              startIcon
            ) : (
              <CalendarIcon className="size-4 shrink-0 opacity-60" />
            )}
            <span
              className={cn(
                'ms-1 min-w-0',
                !selectedDate && 'text-muted-foreground'
              )}
            >
              {displayValue}
            </span>
          </div>
          <ChevronDown className="size-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-auto p-0">
        <Calendar
          captionLayout="dropdown"
          disabled={disabledDates}
          mode="single"
          onSelect={handleDateSelect}
          selected={selectedDate}
        />
      </PopoverContent>
    </Popover>
  )
}
