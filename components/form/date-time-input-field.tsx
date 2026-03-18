'use client'

import * as React from 'react'

import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn, isFieldInvalid } from '@/utils'

import { FieldWrapper } from '@/components/form/field-wrapper'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

import { useFieldContext } from './form'

const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1)
const MINUTES = Array.from({ length: 60 }, (_, i) => i)
const AMPM = ['AM', 'PM'] as const

const pad = (value: number) => value.toString().padStart(2, '0')

const to12Hour = (hours24: number): { ampm: 'AM' | 'PM'; hours12: number } => {
  if (hours24 === 0) return { ampm: 'AM', hours12: 12 }
  if (hours24 < 12) return { ampm: 'AM', hours12: hours24 }
  if (hours24 === 12) return { ampm: 'PM', hours12: 12 }
  return { ampm: 'PM', hours12: hours24 - 12 }
}

const to24Hour = (hours12: number, ampm: 'AM' | 'PM'): number => {
  if (ampm === 'AM') {
    return hours12 === 12 ? 0 : hours12
  }
  return hours12 === 12 ? 12 : hours12 + 12
}

export type DateTimeInputProps = {
  classNames?: {
    childrenWrapper?: string
    label?: string
    wrapper?: string
  }
  dateFormat?: string
  defaultDate?: Date
  disabled?: boolean
  label?: string
  min?: Date
  placeholder?: string
  required?: boolean
}

export const DateTimeInput: React.FC<DateTimeInputProps> = ({
  classNames,
  dateFormat = 'MM/dd/yyyy hh:mm aa',
  defaultDate,
  disabled,
  label,
  min,
  placeholder,
  required
}) => {
  const t = useTranslations('components.form.dateTimeInput')
  const resolvedPlaceholder = placeholder ?? t('placeholder')
  const field = useFieldContext<null | string>()
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    if (!defaultDate || field.state.value) return
    if (isNaN(defaultDate.getTime())) return
    field.handleChange(defaultDate.toISOString())
  }, [defaultDate, field, field.state.value])

  const selectedDate = React.useMemo(() => {
    if (!field.state.value) return undefined
    try {
      const date = new Date(field.state.value)
      return isNaN(date.getTime()) ? undefined : date
    } catch {
      return undefined
    }
  }, [field.state.value])

  const displayValue = React.useMemo(() => {
    if (!selectedDate) return null
    return {
      date: format(selectedDate, 'MM/dd/yyyy'),
      time: format(selectedDate, 'hh:mm aa')
    }
  }, [selectedDate])

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      field.handleChange(null)
      return
    }

    if (selectedDate) {
      const newDate = new Date(date)
      newDate.setHours(
        selectedDate.getHours(),
        selectedDate.getMinutes(),
        selectedDate.getSeconds()
      )
      field.handleChange(newDate.toISOString())
    } else {
      const newDate = new Date(date)
      newDate.setHours(12, 0, 0, 0)
      field.handleChange(newDate.toISOString())
    }
  }

  const handleTimeChange = (
    type: 'ampm' | 'hour' | 'minute',
    value: number | string
  ) => {
    const currentDate = selectedDate || new Date()
    const newDate = new Date(currentDate)

    if (type === 'hour') {
      const hour = Number(value)
      const { ampm } = to12Hour(newDate.getHours())
      newDate.setHours(to24Hour(hour, ampm))
    } else if (type === 'minute') {
      newDate.setMinutes(Number(value))
    } else if (type === 'ampm') {
      const { hours12 } = to12Hour(newDate.getHours())
      newDate.setHours(to24Hour(hours12, value as 'AM' | 'PM'))
    }

    field.handleChange(newDate.toISOString())
  }

  const { ampm, hours12 } = React.useMemo(() => {
    if (!selectedDate) return { ampm: 'AM' as const, hours12: 12 }
    return to12Hour(selectedDate.getHours())
  }, [selectedDate])

  const minutes = selectedDate ? selectedDate.getMinutes() : 0
  const calendarDisabled = React.useMemo(() => {
    if (disabled) return true
    if (min) return { before: min }
    return false
  }, [disabled, min])

  return (
    <FieldWrapper
      classNames={classNames}
      field={field}
      label={label}
      required={required}
    >
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            aria-invalid={isFieldInvalid(field) || undefined}
            className={cn(
              'border-input placeholder:text-muted-foreground focus:ring-ring group ring-offset-background focus-visible:border-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive focus-visible:ring-ring bg-background text-accent-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 data-[state=open]:bg-accent h-input inline-flex w-full cursor-pointer items-center justify-between gap-1.5 rounded-md border px-3 py-2 text-sm leading-(--text-sm--line-height) font-normal whitespace-nowrap shadow-xs shadow-black/5 transition-[color,box-shadow] outline-none focus:ring-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
              !selectedDate && 'text-muted-foreground'
            )}
            disabled={disabled}
            variant="outline"
          >
            <span className="flex min-w-0 items-center truncate text-left">
              {displayValue ? (
                <>
                  {displayValue.date}
                  <div className="bg-border! mx-1! h-0.5 w-2.5!"></div>
                  {displayValue.time}
                </>
              ) : (
                resolvedPlaceholder
              )}
            </span>
            <CalendarIcon className="size-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <div className="sm:flex">
            <Calendar
              disabled={calendarDisabled}
              initialFocus
              mode="single"
              onSelect={handleDateSelect}
              selected={selectedDate}
            />
            <div className="flex flex-col divide-y border-t sm:h-[300px] sm:flex-row sm:divide-x sm:divide-y-0 sm:border-t-0 sm:border-l">
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex p-2 sm:flex-col">
                  {HOURS_12.reverse().map((hour) => (
                    <Button
                      className="aspect-square shrink-0 sm:w-full"
                      key={hour}
                      onClick={() => handleTimeChange('hour', hour)}
                      size="icon"
                      type="button"
                      variant={
                        selectedDate && hours12 === hour ? 'default' : 'ghost'
                      }
                    >
                      {hour}
                    </Button>
                  ))}
                </div>
                <ScrollBar className="sm:hidden" orientation="horizontal" />
              </ScrollArea>
              <ScrollArea className="w-64 sm:w-auto">
                <div className="flex p-2 sm:flex-col">
                  {MINUTES.map((minute) => (
                    <Button
                      className="aspect-square shrink-0 sm:w-full"
                      key={minute}
                      onClick={() => handleTimeChange('minute', minute)}
                      size="icon"
                      type="button"
                      variant={
                        selectedDate && minutes === minute ? 'default' : 'ghost'
                      }
                    >
                      {pad(minute)}
                    </Button>
                  ))}
                </div>
                <ScrollBar className="sm:hidden" orientation="horizontal" />
              </ScrollArea>
              <ScrollArea>
                <div className="flex p-2 sm:flex-col">
                  {AMPM.map((period) => (
                    <Button
                      className="aspect-square shrink-0 sm:w-full"
                      key={period}
                      onClick={() => handleTimeChange('ampm', period)}
                      size="icon"
                      type="button"
                      variant={
                        selectedDate && ampm === period ? 'default' : 'ghost'
                      }
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  )
}
