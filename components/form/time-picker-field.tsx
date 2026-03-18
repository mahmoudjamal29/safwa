'use client'

import { useEffect, useMemo, useState } from 'react'

import { Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn, isFieldInvalid } from '@/utils'

import { FieldWrapper } from '@/components/form/field-wrapper'
// import { ChevronDown, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

import { useFieldContext } from './form'

type TimeParts = {
  hours: number
  minutes: number
  seconds: number
}

const HOURS_12 = Array.from({ length: 12 }, (_value, index) => index + 1)
const AMPM_OPTIONS = ['AM', 'PM']

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const pad = (value: number) => value.toString().padStart(2, '0')

const parseTime = (value: null | string | undefined): null | TimeParts => {
  if (!value) return null

  // Handle ISO date strings (e.g., "2024-01-15T14:30:00Z" or "2024-01-15T14:30:00.000Z")
  if (value.includes('T')) {
    try {
      const date = new Date(value)
      if (!Number.isNaN(date.getTime())) {
        return {
          hours: date.getHours(),
          minutes: date.getMinutes(),
          seconds: date.getSeconds()
        }
      }
    } catch {
      // Fall through to time string parsing
    }
  }

  // Handle time strings (e.g., "14:30:00" or "14:30")
  const segments = value.split(':').map((segment) => segment.trim())
  if (segments.length < 2) return null

  const [hours, minutes, seconds = '0'] = segments
  const parsedHours = Number.parseInt(hours, 10)
  const parsedMinutes = Number.parseInt(minutes, 10)
  const parsedSeconds = Number.parseInt(seconds, 10)

  if (
    Number.isNaN(parsedHours) ||
    Number.isNaN(parsedMinutes) ||
    Number.isNaN(parsedSeconds)
  ) {
    return null
  }

  if (
    parsedHours < 0 ||
    parsedHours > 23 ||
    parsedMinutes < 0 ||
    parsedMinutes > 59 ||
    parsedSeconds < 0 ||
    parsedSeconds > 59
  ) {
    return null
  }

  return {
    hours: parsedHours,
    minutes: parsedMinutes,
    seconds: parsedSeconds
  }
}

const makeSteppedList = (step: number, selected?: null | number) => {
  const normalizedStep = Math.min(Math.max(Math.floor(step) || 1, 1), 30)
  const values = new Set<string>()

  for (let index = 0; index < 60; index += normalizedStep) {
    values.add(pad(index))
  }

  if (selected != null) {
    values.add(pad(clamp(selected, 0, 59)))
  }

  return Array.from(values).sort((a, b) => Number(a) - Number(b))
}

const formatValue = (
  { hours, minutes, seconds }: TimeParts,
  includeSeconds = false
) =>
  includeSeconds
    ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
    : `${pad(hours)}:${pad(minutes)}`

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

const formatDisplay = (
  { hours, minutes, seconds }: TimeParts,
  withSeconds: boolean,
  format?: (value: TimeParts) => string
) => {
  if (format) return format({ hours, minutes, seconds })
  const { ampm, hours12 } = to12Hour(hours)
  if (withSeconds) {
    return `${pad(hours12)}:${pad(minutes)}:${pad(seconds)} ${ampm}`
  }
  return { ampm: ampm, time: `${pad(hours12)}:${pad(minutes)}` }
}

type PickerColumnProps = {
  disabledValues?: number[]
  label: string
  onSelect: (value: string) => void
  options: string[]
  selected?: string
}

const PickerColumn = ({
  disabledValues,
  label,
  onSelect,
  options,
  selected
}: PickerColumnProps) => {
  return (
    <div className="flex min-w-24 flex-1 flex-col">
      <div className="border-border/80 text-muted-foreground/80 border-b px-3 py-2 text-xs font-medium tracking-wide uppercase">
        {label}
      </div>
      <ScrollArea className="h-56">
        <div className="space-y-1 p-2">
          {options.map((option) => {
            const isSelected = option === selected
            const isDisabled = disabledValues?.includes(Number(option))
            return (
              <button
                className={cn(
                  'focus-visible:ring-ring w-full rounded-md px-2 py-1.5 text-start text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
                  isDisabled && 'text-muted-foreground/40 cursor-not-allowed',
                  !isDisabled &&
                    (isSelected
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-muted hover:text-foreground/90')
                )}
                data-state={isSelected ? 'selected' : undefined}
                disabled={isDisabled}
                key={option}
                onClick={() => !isDisabled && onSelect(option)}
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

export type TimePickerProps = {
  classNames?: {
    content?: string
    fieldWrapper?: string
    trigger?: string
  }
  clearable?: boolean
  disabled?: boolean
  /** Array of hours (0-23) to disable */
  disabledHours?: number[]
  /** Array of minutes (0-59) to disable */
  disabledMinutes?: number[]
  format?: (value: TimeParts) => string
  label?: string
  minuteStep?: number
  placeholder?: string
  required?: boolean
  showNowButton?: boolean
  startIcon?: React.ReactNode
  /** Control visibility of time picker columns */
  viewOptions?: TimePickerViewOptions
  /**
   * Enable seconds selection in the time picker.
   * @default false - Seconds are disabled by default
   */
  withSeconds?: boolean
}

export type TimePickerViewOptions = {
  ampm?: boolean
  hours?: boolean
  minutes?: boolean
  seconds?: boolean
}

export const TimePicker = ({
  classNames,
  clearable = true,
  disabled,
  disabledHours,
  disabledMinutes,
  format,
  label,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  minuteStep: _minuteStep = 5,
  placeholder,
  required,
  showNowButton = true,
  startIcon,
  viewOptions,
  withSeconds = false
}: TimePickerProps) => {
  const t = useTranslations('components.form.timePicker')
  const resolvedPlaceholder = placeholder ?? t('placeholder')
  const field = useFieldContext<null | string | undefined>()
  const [open, setOpen] = useState(false)

  // Convert ISO date strings to time format (HH:mm or HH:mm:ss based on withSeconds)
  useEffect(() => {
    const value = field.state.value
    if (value && typeof value === 'string' && value.includes('T')) {
      try {
        const date = new Date(value)
        if (!Number.isNaN(date.getTime())) {
          const timeString = formatValue(
            {
              hours: date.getHours(),
              minutes: date.getMinutes(),
              seconds: date.getSeconds()
            },
            withSeconds
          )
          // Only update if the value is different to avoid infinite loops
          if (value !== timeString) {
            field.handleChange(timeString)
          }
        }
      } catch {
        // Ignore parsing errors
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.state.value, withSeconds])

  // Normalize existing time values to remove seconds when withSeconds is false
  useEffect(() => {
    const value = field.state.value
    if (
      !withSeconds &&
      value &&
      typeof value === 'string' &&
      !value.includes('T') &&
      value.match(/^\d{2}:\d{2}:\d{2}$/)
    ) {
      // Value has format HH:mm:ss but withSeconds is false, strip seconds
      const parsed = parseTime(value)
      if (parsed) {
        const normalized = formatValue(parsed, false)
        if (value !== normalized) {
          field.handleChange(normalized)
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [field.state.value, withSeconds])

  const parsedValue = useMemo(
    () => parseTime(field.state.value),
    [field.state.value]
  )

  const minuteOptions = useMemo(
    () => Array.from({ length: 60 }, (_value, index) => pad(index)),
    []
  )

  const secondOptions = useMemo(
    () =>
      withSeconds ? makeSteppedList(1, parsedValue?.seconds) : ([] as string[]),
    [parsedValue?.seconds, withSeconds]
  )

  const { ampm: currentAmpm, hours12: currentHours12 } = useMemo(
    () =>
      parsedValue
        ? to12Hour(parsedValue.hours)
        : { ampm: 'AM' as const, hours12: 12 },
    [parsedValue]
  )

  // Convert 12-hour disabledHours to hours12 values for current AM/PM
  const disabledHours12 = useMemo(() => {
    if (!disabledHours || disabledHours.length === 0) return undefined

    const disabled12: number[] = []
    for (const hour24 of disabledHours) {
      const { ampm, hours12 } = to12Hour(hour24)
      if (ampm === currentAmpm) {
        disabled12.push(hours12)
      }
    }
    return disabled12.length > 0 ? disabled12 : undefined
  }, [disabledHours, currentAmpm])

  const displayValue = useMemo(() => {
    if (!parsedValue) return { ampm: null, time: resolvedPlaceholder }
    const formatted = formatDisplay(parsedValue, withSeconds, format)
    // If format function returns a string, parse it back
    if (typeof formatted === 'string') {
      return { ampm: null, time: formatted }
    }
    return formatted
  }, [parsedValue, withSeconds, format, resolvedPlaceholder])

  const handleCommit = (
    next: Partial<TimeParts> & { ampm?: 'AM' | 'PM'; hours12?: number },
    closePopover = false
  ) => {
    const base = parsedValue ?? { hours: 0, minutes: 0, seconds: 0 }
    const { ampm: baseAmpm, hours12: baseHours12 } = to12Hour(base.hours)

    // Convert 12-hour selection to 24-hour for storage
    const hours12 = next.hours12 ?? baseHours12
    const ampm = next.ampm ?? baseAmpm
    const hours24 = to24Hour(hours12, ampm)

    const merged: TimeParts = {
      hours: hours24,
      minutes: clamp(next.minutes ?? base.minutes, 0, 59),
      seconds: withSeconds ? clamp(next.seconds ?? base.seconds, 0, 59) : 0
    }

    field.handleChange(formatValue(merged, withSeconds))

    if (closePopover) {
      setOpen(false)
    }
  }

  const handleClear = () => {
    field.handleChange(undefined)
    setOpen(false)
  }

  const handleNow = () => {
    const current = new Date()
    handleCommit(
      {
        hours: current.getHours(),
        minutes: current.getMinutes(),
        seconds: withSeconds ? current.getSeconds() : 0
      },
      true
    )
  }

  const showHours = viewOptions?.hours !== false
  const showMinutes = viewOptions?.minutes !== false
  const showSeconds = withSeconds && viewOptions?.seconds !== false
  const showAmpm = viewOptions?.ampm !== false
  const visibleColCount = [
    showHours,
    showMinutes,
    showSeconds,
    showAmpm
  ].filter(Boolean).length
  const gridColsClass: Record<number, string> = {
    1: 'grid grid-cols-1',
    2: 'grid grid-cols-2',
    3: 'grid grid-cols-3',
    4: 'grid grid-cols-4'
  }

  return (
    <FieldWrapper
      classNames={{ wrapper: classNames?.fieldWrapper }}
      field={field}
      label={label}
      required={required}
    >
      <Popover
        onOpenChange={(value) => {
          setOpen(value)
          if (!value) {
            field.handleBlur()
          }
        }}
        open={open}
      >
        <PopoverTrigger asChild>
          <Button
            aria-invalid={isFieldInvalid(field) || undefined}
            className={cn(
              'h-input flex w-full items-center justify-between gap-3 rounded-lg px-3.5',
              !parsedValue && 'text-muted-foreground',
              classNames?.trigger
            )}
            data-invalid={isFieldInvalid(field) || undefined}
            disabled={disabled}
            id={field.name}
            onBlur={field.handleBlur}
            type="button"
            variant="outline"
          >
            {startIcon ?? null}
            <span
              className={cn(
                'text-sm font-medium',
                parsedValue ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {displayValue.time}{' '}
              {displayValue.ampm && (
                <span className="text-muted-foreground text-sm">
                  {displayValue.ampm}
                </span>
              )}
            </span>
            {!startIcon ? (
              <Clock className="text-secondary-foreground size-4" />
            ) : (
              ''
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className={cn(
            'w-[320px] p-0',
            withSeconds ? 'max-w-120' : 'max-w-[384px]'
          )}
        >
          <div
            className={cn(
              'divide-border flex divide-x border-b',
              gridColsClass[visibleColCount] ?? 'grid grid-cols-3'
            )}
          >
            {showHours && (
              <PickerColumn
                disabledValues={disabledHours12}
                label={t('hours')}
                onSelect={(value) => handleCommit({ hours12: Number(value) })}
                options={HOURS_12.map(pad)}
                selected={parsedValue ? pad(currentHours12) : undefined}
              />
            )}
            {showMinutes && (
              <PickerColumn
                disabledValues={disabledMinutes}
                label={t('minutes')}
                onSelect={(value) =>
                  handleCommit({ minutes: Number(value) }, !withSeconds)
                }
                options={minuteOptions}
                selected={parsedValue ? pad(parsedValue.minutes) : undefined}
              />
            )}
            {showSeconds && (
              <PickerColumn
                label={t('seconds')}
                onSelect={(value) =>
                  handleCommit({ seconds: Number(value) }, true)
                }
                options={secondOptions}
                selected={parsedValue ? pad(parsedValue.seconds) : undefined}
              />
            )}
            {showAmpm && (
              <PickerColumn
                label={t('ampm')}
                onSelect={(value) =>
                  handleCommit({ ampm: value as 'AM' | 'PM' }, !withSeconds)
                }
                options={AMPM_OPTIONS}
                selected={parsedValue ? currentAmpm : undefined}
              />
            )}
          </div>

          {(clearable || showNowButton) && (
            <div className="flex items-center justify-end gap-2 px-3 py-2">
              {showNowButton && (
                <Button
                  onClick={handleNow}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  {t('now')}
                </Button>
              )}
              {clearable && (
                <Button
                  onClick={handleClear}
                  size="sm"
                  type="button"
                  variant="ghost"
                >
                  {t('clear')}
                </Button>
              )}
            </div>
          )}
        </PopoverContent>
      </Popover>
    </FieldWrapper>
  )
}
