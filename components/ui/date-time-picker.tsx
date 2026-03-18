'use client'

import * as React from 'react'

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
import { TimePicker } from '@/components/ui/time-picker'

export type DateTimePickerStandaloneProps = {
  className?: string
  dateDisabled?: boolean
  dateFormat?: (date: Date) => string
  datePlaceholder?: string
  disabled?: boolean
  onUpdate?: (value: null | string) => void
  timeClearable?: boolean
  timePlaceholder?: string
  timeShowNowButton?: boolean
  timeWithSeconds?: boolean
  value?: null | string
}

export const DateTimePicker: React.FC<DateTimePickerStandaloneProps> = ({
  className,
  dateDisabled,
  dateFormat,
  datePlaceholder,
  disabled,
  onUpdate,
  timeClearable = true,
  timePlaceholder,
  timeShowNowButton = true,
  timeWithSeconds = false,
  value
}) => {
  const tDate = useTranslations('components.ui.datePicker')
  const tTime = useTranslations('components.form.timePicker')
  const resolvedDatePlaceholder = datePlaceholder ?? tDate('placeholder')
  const resolvedTimePlaceholder = timePlaceholder ?? tTime('placeholder')
  const [open, setOpen] = React.useState(false)

  const selectedDate = React.useMemo(() => {
    if (!value) return undefined
    try {
      const date = new Date(value)
      return isNaN(date.getTime()) ? undefined : date
    } catch {
      return undefined
    }
  }, [value])

  const timeValue = React.useMemo(() => {
    if (!value) return null
    try {
      const date = new Date(value)
      if (isNaN(date.getTime())) return null
      const hours = date.getHours().toString().padStart(2, '0')
      const minutes = date.getMinutes().toString().padStart(2, '0')
      const seconds = timeWithSeconds
        ? date.getSeconds().toString().padStart(2, '0')
        : '00'
      return `${hours}:${minutes}:${seconds}`
    } catch {
      return null
    }
  }, [value, timeWithSeconds])

  const displayValue = React.useMemo(() => {
    if (!selectedDate && !timeValue) {
      return resolvedDatePlaceholder
    }

    if (selectedDate && timeValue) {
      const dateStr = dateFormat
        ? dateFormat(selectedDate)
        : format(selectedDate, 'MMM d, yyyy')
      const [hours, minutes, seconds] = timeValue.split(':')
      const timeStr = timeWithSeconds
        ? `${hours}:${minutes}:${seconds}`
        : `${hours}:${minutes}`
      return `${dateStr} ${timeStr}`
    }

    if (selectedDate) {
      return dateFormat
        ? dateFormat(selectedDate)
        : format(selectedDate, 'MMM d, yyyy')
    }

    return resolvedDatePlaceholder
  }, [
    selectedDate,
    timeValue,
    dateFormat,
    resolvedDatePlaceholder,
    timeWithSeconds
  ])

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      if (timeValue) {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        onUpdate?.(today.toISOString())
      } else {
        onUpdate?.(null)
      }
      return
    }

    if (timeValue) {
      const newDate = new Date(date)
      const [hours, minutes, seconds = 0] = timeValue.split(':').map(Number)
      newDate.setHours(hours, minutes, seconds)
      onUpdate?.(newDate.toISOString())
    } else {
      const newDate = new Date(date)
      newDate.setHours(0, 0, 0, 0)
      onUpdate?.(newDate.toISOString())
    }
  }

  const handleTimeChange = (time: null | string) => {
    if (!time) {
      if (selectedDate) {
        const date = new Date(selectedDate)
        date.setHours(0, 0, 0, 0)
        onUpdate?.(date.toISOString())
      } else {
        onUpdate?.(null)
      }
      return
    }

    const [hours, minutes, seconds = 0] = time.split(':').map(Number)
    const date = selectedDate || new Date()
    date.setHours(hours, minutes, seconds || 0)
    date.setSeconds(seconds || 0)

    onUpdate?.(date.toISOString())
  }

  const handleClear = () => {
    onUpdate?.(null)
  }

  const handleNow = () => {
    const now = new Date()
    const pad = (value: number) => value.toString().padStart(2, '0')
    const timeString = `${pad(now.getHours())}:${pad(now.getMinutes())}${timeWithSeconds ? `:${pad(now.getSeconds())}` : ':00'}`
    const [hours, minutes, seconds = 0] = timeString.split(':').map(Number)
    now.setHours(hours, minutes, seconds || 0)
    now.setSeconds(seconds || 0)
    onUpdate?.(now.toISOString())
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'border-input placeholder:text-muted-foreground focus:ring-ring group ring-offset-background focus-visible:border-ring focus-visible:ring-ring bg-background text-accent-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 data-[state=open]:bg-accent h-input inline-flex cursor-pointer items-center justify-between gap-1.5 rounded-xl border px-3 py-2 text-sm leading-(--text-sm--line-height) font-thin whitespace-nowrap shadow-xs shadow-black/5 transition-[color,box-shadow] outline-none focus:ring-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
            className || 'w-full'
          )}
          disabled={disabled || dateDisabled}
          variant="outline"
        >
          <CalendarIcon className="size-4 shrink-0 opacity-60" />
          <span
            className={cn(
              'min-w-0',
              !selectedDate && !timeValue && 'text-muted-foreground'
            )}
          >
            {displayValue}
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-4">
        <div className="flex gap-4">
          <div>
            <Calendar
              captionLayout="dropdown"
              disabled={disabled || dateDisabled}
              mode="single"
              onSelect={handleDateSelect}
              selected={selectedDate}
            />
          </div>
          <div className="flex flex-col gap-2">
            <TimePicker
              clearable={timeClearable}
              disabled={disabled}
              disablePopover={true}
              onClear={handleClear}
              onNow={handleNow}
              onTimeChange={handleTimeChange}
              placeholder={resolvedTimePlaceholder}
              showNowButton={timeShowNowButton}
              time={timeValue}
              timeWithSeconds={timeWithSeconds}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
