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
import { TimePicker } from '@/components/ui/time-picker'

export type TimeRangePickerStandaloneProps = {
  className?: string
  disabled?: boolean
  onUpdate?: (value: null | { from: string; to: string }) => void
  timeClearable?: boolean
  timePlaceholder?: string
  timeShowNowButton?: boolean
  timeWithSeconds?: boolean
  value?: null | { from: string; to: string }
}

const formatTime = (time: null | string | undefined): string => {
  if (!time) return ''
  const [hours, minutes, seconds] = time.split(':')
  return seconds && seconds !== '00'
    ? `${hours}:${minutes}:${seconds}`
    : `${hours}:${minutes}`
}

export const TimeRangePicker: React.FC<TimeRangePickerStandaloneProps> = ({
  className,
  disabled,
  onUpdate,
  timeClearable = true,
  timePlaceholder,
  timeShowNowButton = true,
  timeWithSeconds = false,
  value
}) => {
  const tTime = useTranslations('components.form.timePicker')
  const tRange = useTranslations('components.form.timeRangePicker')
  const resolvedBasePlaceholder = timePlaceholder ?? tTime('placeholder')
  const [open, setOpen] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState<null | {
    from: string
    to: string
  }>(value || null)

  React.useEffect(() => {
    if (value) {
      setInternalValue(value)
    }
  }, [value])

  const displayValue = React.useMemo(() => {
    if (!internalValue?.from && !internalValue?.to) {
      return resolvedBasePlaceholder
    }

    if (internalValue.from && internalValue.to) {
      const fromTime = formatTime(internalValue.from)
      const toTime = formatTime(internalValue.to)
      return `${fromTime} - ${toTime}`
    }

    if (internalValue.from) {
      return tRange('fromTime', { time: formatTime(internalValue.from) })
    }

    if (internalValue.to) {
      return tRange('toTime', { time: formatTime(internalValue.to) })
    }

    return resolvedBasePlaceholder
  }, [internalValue, resolvedBasePlaceholder, tRange])

  const handleFromTimeChange = (time: null | string) => {
    const newValue = {
      from: time || '',
      to: internalValue?.to || ''
    }
    setInternalValue(newValue)
    onUpdate?.(newValue.from && newValue.to ? newValue : null)
  }

  const handleToTimeChange = (time: null | string) => {
    const newValue = {
      from: internalValue?.from || '',
      to: time || ''
    }
    setInternalValue(newValue)
    onUpdate?.(newValue.from && newValue.to ? newValue : null)
  }

  const handleClear = () => {
    setInternalValue(null)
    onUpdate?.(null)
  }

  const handleNow = () => {
    const pad = (value: number) => value.toString().padStart(2, '0')
    const now = new Date()
    const timeString = `${pad(now.getHours())}:${pad(now.getMinutes())}${timeWithSeconds ? `:${pad(now.getSeconds())}` : ':00'}`
    const newValue = {
      from: timeString,
      to: timeString
    }
    setInternalValue(newValue)
    onUpdate?.(newValue)
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            'border-input placeholder:text-muted-foreground focus:ring-ring group ring-offset-background focus-visible:border-ring focus-visible:ring-ring bg-background text-accent-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 data-[state=open]:bg-accent h-input inline-flex cursor-pointer items-center justify-between gap-1.5 rounded-xl border px-3 py-2 text-sm leading-(--text-sm--line-height) font-thin whitespace-nowrap shadow-xs shadow-black/5 transition-[color,box-shadow] outline-none focus:ring-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
            className || 'w-full'
          )}
          disabled={disabled}
          variant="outline"
        >
          <Clock className="size-4 shrink-0 opacity-60" />
          <span
            className={cn(
              'min-w-0',
              !internalValue?.from &&
                !internalValue?.to &&
                'text-muted-foreground'
            )}
          >
            {displayValue}
          </span>
          <ChevronDown className="size-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-4">
        <div className="flex gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-muted-foreground text-xs font-medium">
              {tRange('startLabel')}
            </label>
            <TimePicker
              clearable={timeClearable}
              disabled={disabled}
              disablePopover={true}
              onClear={handleClear}
              onNow={handleNow}
              onTimeChange={handleFromTimeChange}
              placeholder={tRange('startPlaceholder', {
                placeholder: resolvedBasePlaceholder
              })}
              showNowButton={timeShowNowButton}
              time={internalValue?.from || null}
              timeWithSeconds={timeWithSeconds}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-muted-foreground text-xs font-medium">
              {tRange('endLabel')}
            </label>
            <TimePicker
              clearable={timeClearable}
              disabled={disabled}
              disablePopover={true}
              onClear={handleClear}
              onNow={handleNow}
              onTimeChange={handleToTimeChange}
              placeholder={tRange('endPlaceholder', {
                placeholder: resolvedBasePlaceholder
              })}
              showNowButton={timeShowNowButton}
              time={internalValue?.to || null}
              timeWithSeconds={timeWithSeconds}
            />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
