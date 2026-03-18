'use client'

import * as React from 'react'

import { ChevronDown, Clock } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'

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
    <div className="flex min-w-[96px] flex-1 flex-col">
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
                  isSelected
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted hover:text-foreground/90',
                  isDisabled &&
                    'cursor-not-allowed opacity-50 hover:bg-transparent'
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

export type TimePickerInternalProps = {
  className?: string
  clearable?: boolean
  disabled?: boolean
  /** Array of hours (0-23) to disable */
  disabledHours?: number[]
  /** Array of minutes (0-59) to disable */
  disabledMinutes?: number[]
  disablePopover?: boolean
  onClear?: () => void
  onNow?: () => void
  onTimeChange: (time: null | string) => void
  placeholder?: string
  showNowButton?: boolean
  time?: null | string
  timeWithSeconds?: boolean
  /** Control visibility of time picker columns */
  viewOptions?: TimePickerViewOptions
}

export type TimePickerProps = TimePickerInternalProps

export type TimePickerViewOptions = {
  ampm?: boolean
  hours?: boolean
  minutes?: boolean
  seconds?: boolean
}

export const TimePicker: React.FC<TimePickerProps> = ({
  className,
  clearable = true,
  disabled,
  disabledHours,
  disabledMinutes,
  disablePopover = false,
  onClear,
  onNow,
  onTimeChange,
  placeholder,
  showNowButton = true,
  time,
  timeWithSeconds = false,
  viewOptions
}) => {
  const t = useTranslations('components.form.timePicker')

  // Resolve view options with defaults
  const resolvedViewOptions: Required<TimePickerViewOptions> = {
    ampm: viewOptions?.ampm ?? true,
    hours: viewOptions?.hours ?? true,
    minutes: viewOptions?.minutes ?? true,
    seconds: viewOptions?.seconds ?? false
  }
  const resolvedPlaceholder = placeholder ?? t('placeholder')
  const [open, setOpen] = React.useState(false)

  const parsedTime = React.useMemo(() => {
    if (!time) return null
    const parts = time.split(':')
    if (parts.length < 2) return null
    const hours = Number.parseInt(parts[0] || '0', 10)
    const minutes = Number.parseInt(parts[1] || '0', 10)
    const seconds = Number.parseInt(parts[2] || '0', 10)
    if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(seconds))
      return null
    return { hours, minutes, seconds }
  }, [time])

  const { ampm, hours12 } = React.useMemo(() => {
    if (!parsedTime) return { ampm: 'AM' as const, hours12: 12 }
    return to12Hour(parsedTime.hours)
  }, [parsedTime])

  const minutes = parsedTime?.minutes || 0
  const seconds = parsedTime?.seconds || 0

  const display = React.useMemo(() => {
    if (!parsedTime) return resolvedPlaceholder
    return `${pad(hours12)}:${pad(minutes)}${timeWithSeconds ? `:${pad(seconds)}` : ''} ${ampm}`
  }, [
    parsedTime,
    hours12,
    minutes,
    seconds,
    ampm,
    timeWithSeconds,
    resolvedPlaceholder
  ])

  const handleCommit = (
    next: {
      ampm?: 'AM' | 'PM'
      hours12?: number
      minutes?: number
      seconds?: number
    },
    closePopover = false
  ) => {
    const baseHours = parsedTime?.hours || 0
    const baseMinutes = parsedTime?.minutes || 0
    const baseSeconds = parsedTime?.seconds || 0

    const { ampm: baseAmpm, hours12: baseHours12 } = to12Hour(baseHours)

    const hours12Value = next.hours12 ?? baseHours12
    const ampmValue = next.ampm ?? baseAmpm
    const minutesValue = next.minutes ?? baseMinutes
    const secondsValue = timeWithSeconds ? (next.seconds ?? baseSeconds) : 0

    const hours24 = to24Hour(hours12Value, ampmValue)

    const timeString = `${pad(hours24)}:${pad(minutesValue)}${timeWithSeconds ? `:${pad(secondsValue)}` : ':00'}`
    onTimeChange(timeString)

    if (closePopover && !disablePopover) {
      setOpen(false)
    }
  }

  const handleNow = () => {
    if (onNow) {
      onNow()
    } else {
      const now = new Date()
      const timeString = `${pad(now.getHours())}:${pad(now.getMinutes())}${timeWithSeconds ? `:${pad(now.getSeconds())}` : ':00'}`
      onTimeChange(timeString)
    }
    if (!disablePopover) {
      setOpen(false)
    }
  }

  const handleClear = () => {
    if (onClear) {
      onClear()
    } else {
      onTimeChange(null)
    }
    if (!disablePopover) {
      setOpen(false)
    }
  }

  const minuteOptions = MINUTES.map(pad)

  // Convert 24-hour disabled hours to 12-hour format for current AM/PM
  const disabled12Hours = React.useMemo(() => {
    if (!disabledHours || disabledHours.length === 0) return undefined

    const disabled12 = disabledHours
      .map((h24) => {
        const { ampm: hourAmpm, hours12: h12 } = to12Hour(h24)
        // Only include hours that match the current AM/PM selection
        return hourAmpm === ampm ? h12 : null
      })
      .filter((h): h is number => h !== null)

    return disabled12.length > 0 ? disabled12 : undefined
  }, [disabledHours, ampm])

  // Calculate grid columns based on visible options
  const visibleColumns = [
    resolvedViewOptions.hours,
    resolvedViewOptions.minutes,
    resolvedViewOptions.seconds && timeWithSeconds,
    resolvedViewOptions.ampm
  ].filter(Boolean).length

  // Map column count to Tailwind class (must be static for Tailwind to pick up)
  const gridColsClass: Record<number, string> = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  }

  const timePickerContent = (
    <>
      <div
        className={cn(
          'divide-border flex divide-x border-b',
          gridColsClass[visibleColumns] || 'grid-cols-3'
        )}
      >
        {resolvedViewOptions.hours && (
          <PickerColumn
            disabledValues={disabled12Hours}
            label={t('hours')}
            onSelect={(value) => handleCommit({ hours12: Number(value) })}
            options={HOURS_12.map(pad)}
            selected={pad(hours12)}
          />
        )}
        {resolvedViewOptions.minutes && (
          <PickerColumn
            disabledValues={disabledMinutes}
            label={t('minutes')}
            onSelect={(value) =>
              handleCommit({ minutes: Number(value) }, !timeWithSeconds)
            }
            options={minuteOptions}
            selected={pad(minutes)}
          />
        )}
        {resolvedViewOptions.seconds && timeWithSeconds && (
          <PickerColumn
            label={t('seconds')}
            onSelect={(value) => handleCommit({ seconds: Number(value) }, true)}
            options={MINUTES.map(pad)}
            selected={pad(seconds)}
          />
        )}
        {resolvedViewOptions.ampm && (
          <PickerColumn
            label={t('ampm')}
            onSelect={(value) =>
              handleCommit({ ampm: value as 'AM' | 'PM' }, !timeWithSeconds)
            }
            options={AMPM_OPTIONS}
            selected={ampm}
          />
        )}
      </div>

      {(clearable || showNowButton) && (
        <div className="flex items-center justify-end gap-2 px-3 py-2">
          {showNowButton && (
            <Button
              disabled={disabled}
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
              disabled={disabled}
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
    </>
  )

  if (disablePopover) {
    return (
      <div
        className={cn(
          'w-[320px] rounded-md border p-0',
          timeWithSeconds ? 'max-w-[480px]' : 'max-w-[384px]',
          className
        )}
      >
        {timePickerContent}
      </div>
    )
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'border-input placeholder:text-muted-foreground focus:ring-ring group ring-offset-background focus-visible:border-ring focus-visible:ring-ring bg-background text-accent-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 data-[state=open]:bg-accent h-input inline-flex w-full cursor-pointer items-center justify-between gap-1.5 rounded-md border px-3 py-2 text-sm leading-(--text-sm--line-height) font-thin whitespace-nowrap shadow-xs shadow-black/5 transition-[color,box-shadow] outline-none focus:ring-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
            className
          )}
          disabled={disabled}
          variant="outline"
        >
          <Clock className="size-4 shrink-0 opacity-60" />
          <span
            className={cn('min-w-0', !parsedTime && 'text-muted-foreground')}
          >
            {display}
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        className={cn(
          'w-[320px] p-0',
          timeWithSeconds ? 'max-w-[480px]' : 'max-w-[384px]'
        )}
      >
        {timePickerContent}
      </PopoverContent>
    </Popover>
  )
}
