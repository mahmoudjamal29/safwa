'use client'

import * as React from 'react'
import type { Matcher } from 'react-day-picker'

import { format } from 'date-fns'
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

import { ButtonProps } from '../form/button-field'

/**
 * DateMatcher type for disabling specific dates in the DatePicker
 * Re-export the Matcher type from react-day-picker
 */
export type DateMatcher = Matcher

export type DatePickerProps = DatePickerStandaloneProps

export type DatePickerStandaloneProps = {
  align?: 'center' | 'end' | 'start'
  className?: string
  'data-invalid'?: boolean | undefined
  /** Can be boolean to disable entire component, or DateMatcher (or array) to disable specific dates */
  disabled?: boolean | DateMatcher | DateMatcher[]
  format?: (date: Date) => string
  locale?: string
  onBlur?: () => void
  onUpdate?: (value: null | string) => void
  placeholder?: string
  size?: ButtonProps['size']
  startIcon?: React.ReactNode
  value?: null | string
}

export const DatePicker: React.FC<DatePickerProps> = ({
  align = 'start',
  className,
  'data-invalid': dataInvalid,
  disabled,
  format: formatFn,
  locale = 'en-US',
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

  // Determine if the entire component is disabled (boolean true)
  const isComponentDisabled = disabled === true

  // Get disabled dates matcher for the calendar
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
    // Format as YYYY-MM-DD
    const dateStr = format(date, 'yyyy-MM-dd')
    onUpdate?.(dateStr)
    setOpen(false)
  }

  return (
    <Popover onOpenChange={(o) => setOpen(o)} open={open}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'border-input placeholder:text-muted-foreground focus:ring-ring group ring-offset-background focus-visible:border-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive focus-visible:ring-ring bg-background text-accent-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 data-[state=open]:bg-accent h-input inline-flex w-full cursor-pointer items-center justify-between gap-1.5 rounded-md border px-3 py-2 text-sm leading-(--text-sm--line-height) font-thin whitespace-nowrap shadow-xs shadow-black/5 transition-[color,box-shadow] outline-none focus:ring-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-4 [&_svg:not([role=img]):not([class*=text-]):not([class*=opacity-])]:opacity-60 [&>span.contents]:flex [&>span.contents]:w-full [&>span.contents]:justify-between',
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
          locale={locale as never}
          mode="single"
          onSelect={handleDateSelect}
          selected={selectedDate}
        />
      </PopoverContent>
    </Popover>
  )
}
