'use client'

import * as React from 'react'

import { format } from 'date-fns'
import { Calendar as CalendarIcon, Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

import { FieldWrapper } from '@/components/form/field-wrapper'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

import { useFieldContext } from './form'

const HOURS_12 = Array.from({ length: 12 }, (_value, index) => index + 1)
const AMPM_OPTIONS = ['AM', 'PM']
const MINUTES = Array.from({ length: 60 }, (_value, index) => index)

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

type PickerColumnProps = {
  label: string
  onSelect: (value: string) => void
  options: string[]
  selected?: string
}

const PickerColumn = ({
  label,
  onSelect,
  options,
  selected
}: PickerColumnProps) => {
  return (
    <div className="flex min-w-[96px] flex-1 flex-col">
      <div className="border-border/80 text-muted-foreground/80 border-b px-3 py-2 text-xs font-medium tracking-wide uppercase">
        {label}
      </div>
      <ScrollArea className="h-56">
        <div className="space-y-1 p-2">
          {options.map((option) => {
            const isSelected = option === selected
            return (
              <button
                className={cn(
                  'focus-visible:ring-ring w-full rounded-md px-2 py-1.5 text-start text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                  isSelected
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted hover:text-foreground/90'
                )}
                data-state={isSelected ? 'selected' : undefined}
                key={option}
                onClick={() => onSelect(option)}
                type="button"
              >
                <span className="font-mono">{option}</span>
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

export type DateTimePickerProps = {
  classNames?: {
    childrenWrapper?: string
    label?: string
    wrapper?: string
  }
  dateDisabled?: boolean
  dateFormat?: (date: Date) => string
  datePlaceholder?: string
  disabled?: boolean
  label?: string
  required?: boolean
  timeClearable?: boolean
  timePlaceholder?: string
  timeShowNowButton?: boolean
  timeWithSeconds?: boolean
}

export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  classNames,
  dateDisabled,
  dateFormat,
  datePlaceholder,
  disabled,
  label,
  required,
  timeClearable = true,
  timePlaceholder,
  timeShowNowButton = true,
  timeWithSeconds = false
}) => {
  const tDate = useTranslations('components.ui.datePicker')
  const tTime = useTranslations('components.form.timePicker')
  const resolvedDatePlaceholder = datePlaceholder ?? tDate('placeholder')
  const resolvedTimePlaceholder = timePlaceholder ?? tTime('placeholder')
  const field = useFieldContext<null | string>()
  const [dateOpen, setDateOpen] = React.useState(false)
  const [timeOpen, setTimeOpen] = React.useState(false)

  const selectedDate = React.useMemo(() => {
    if (!field.state.value) return undefined
    try {
      const date = new Date(field.state.value)
      return isNaN(date.getTime()) ? undefined : date
    } catch {
      return undefined
    }
  }, [field.state.value])

  const dateDisplay = React.useMemo(() => {
    if (!selectedDate) return resolvedDatePlaceholder
    return dateFormat
      ? dateFormat(selectedDate)
      : format(selectedDate, 'MMM d, yyyy')
  }, [dateFormat, resolvedDatePlaceholder, selectedDate])

  const { ampm, hours12 } = React.useMemo(() => {
    if (!selectedDate) return { ampm: 'AM' as const, hours12: 12 }
    return to12Hour(selectedDate.getHours())
  }, [selectedDate])

  const minutes = selectedDate ? selectedDate.getMinutes() : 0
  const seconds = selectedDate ? selectedDate.getSeconds() : 0

  const timeDisplay = React.useMemo(() => {
    if (!selectedDate) return resolvedTimePlaceholder
    const timeStr = `${pad(hours12)}:${pad(minutes)}${timeWithSeconds ? `:${pad(seconds)}` : ''} ${ampm}`
    return timeStr
  }, [
    selectedDate,
    hours12,
    minutes,
    seconds,
    ampm,
    timeWithSeconds,
    resolvedTimePlaceholder
  ])

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      if (selectedDate) {
        const newDate = new Date(selectedDate)
        newDate.setFullYear(0, 0, 1)
        field.handleChange(newDate.toISOString())
      } else {
        field.handleChange(null)
      }
      setDateOpen(false)
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
      newDate.setHours(0, 0, 0, 0)
      field.handleChange(newDate.toISOString())
    }
    setDateOpen(false)
  }

  const handleTimeCommit = (
    next: {
      ampm?: 'AM' | 'PM'
      hours12?: number
      minutes?: number
      seconds?: number
    },
    closePopover = false
  ) => {
    const baseHours = selectedDate ? selectedDate.getHours() : 0
    const baseMinutes = selectedDate ? selectedDate.getMinutes() : 0
    const baseSeconds = selectedDate ? selectedDate.getSeconds() : 0

    const { ampm: baseAmpm, hours12: baseHours12 } = to12Hour(baseHours)

    const hours12Value = next.hours12 ?? baseHours12
    const ampmValue = next.ampm ?? baseAmpm
    const minutesValue = next.minutes ?? baseMinutes
    const secondsValue = timeWithSeconds ? (next.seconds ?? baseSeconds) : 0

    const hours24 = to24Hour(hours12Value, ampmValue)

    const date = selectedDate || new Date()
    date.setHours(hours24, minutesValue, secondsValue)

    field.handleChange(date.toISOString())

    if (closePopover) {
      setTimeOpen(false)
    }
  }

  const handleNow = () => {
    const now = new Date()
    field.handleChange(now.toISOString())
    setTimeOpen(false)
  }

  const handleClear = () => {
    field.handleChange(null)
    setTimeOpen(false)
  }

  const minuteOptions = MINUTES.map(pad)

  return (
    <FieldWrapper
      classNames={classNames}
      field={field}
      label={label}
      required={required}
    >
      <div className="flex flex-col gap-2 lg:flex-row">
        <div className="flex-1">
          <Popover onOpenChange={setDateOpen} open={dateOpen}>
            <PopoverTrigger asChild>
              <Button
                className="border-input placeholder:text-muted-foreground focus:ring-ring group ring-offset-background focus-visible:border-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive focus-visible:ring-ring bg-background text-accent-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 data-[state=open]:bg-accent h-input inline-flex w-full cursor-pointer items-center justify-between gap-1.5 rounded-xl border px-3 py-2 text-sm leading-(--text-sm--line-height) font-medium whitespace-nowrap shadow-xs shadow-black/5 transition-[color,box-shadow] outline-none focus:ring-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60"
                disabled={disabled || dateDisabled}
                variant="outline"
              >
                <span
                  className={cn(
                    'min-w-0',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  {dateDisplay}
                </span>
                <CalendarIcon className="size-4 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                captionLayout="dropdown"
                disabled={disabled || dateDisabled}
                mode="single"
                onSelect={handleDateSelect}
                selected={selectedDate}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex-1">
          <Popover onOpenChange={setTimeOpen} open={timeOpen}>
            <PopoverTrigger asChild>
              <Button
                className="border-input placeholder:text-muted-foreground focus:ring-ring group ring-offset-background focus-visible:border-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive focus-visible:ring-ring bg-background text-accent-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 data-[state=open]:bg-accent h-input inline-flex w-full cursor-pointer items-center justify-between gap-1.5 rounded-xl border px-3 py-2 text-sm leading-(--text-sm--line-height) font-medium whitespace-nowrap shadow-xs shadow-black/5 transition-[color,box-shadow] outline-none focus:ring-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60"
                disabled={disabled}
                variant="outline"
              >
                <span
                  className={cn(
                    'min-w-0',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  {timeDisplay}
                </span>
                <Clock className="size-4 opacity-60" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className={cn(
                'w-[320px] p-0',
                timeWithSeconds ? 'max-w-[480px]' : 'max-w-[384px]'
              )}
            >
              <div
                className={cn(
                  'divide-border flex divide-x border-b',
                  timeWithSeconds ? 'grid grid-cols-4' : 'grid grid-cols-3'
                )}
              >
                <PickerColumn
                  label={tTime('hours')}
                  onSelect={(value) =>
                    handleTimeCommit({ hours12: Number(value) })
                  }
                  options={HOURS_12.map(pad)}
                  selected={pad(hours12)}
                />
                <PickerColumn
                  label={tTime('minutes')}
                  onSelect={(value) =>
                    handleTimeCommit(
                      { minutes: Number(value) },
                      !timeWithSeconds
                    )
                  }
                  options={minuteOptions}
                  selected={pad(minutes)}
                />
                {timeWithSeconds && (
                  <PickerColumn
                    label={tTime('seconds')}
                    onSelect={(value) =>
                      handleTimeCommit({ seconds: Number(value) }, true)
                    }
                    options={MINUTES.map(pad)}
                    selected={pad(seconds)}
                  />
                )}
                <PickerColumn
                  label={tTime('ampm')}
                  onSelect={(value) =>
                    handleTimeCommit(
                      { ampm: value as 'AM' | 'PM' },
                      !timeWithSeconds
                    )
                  }
                  options={AMPM_OPTIONS}
                  selected={ampm}
                />
              </div>

              {(timeClearable || timeShowNowButton) && (
                <div className="flex items-center justify-end gap-2 px-3 py-2">
                  {timeShowNowButton && (
                    <Button
                      onClick={handleNow}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      {tTime('now')}
                    </Button>
                  )}
                  {timeClearable && (
                    <Button
                      onClick={handleClear}
                      size="sm"
                      type="button"
                      variant="ghost"
                    >
                      {tTime('clear')}
                    </Button>
                  )}
                </div>
              )}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </FieldWrapper>
  )
}
