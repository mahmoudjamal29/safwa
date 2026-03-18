'use client'

import * as React from 'react'

import { addDays, isAfter, isBefore, startOfDay } from 'date-fns'
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/utils'
import { formatDate } from '@/utils/formatters'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { TimePicker } from '@/components/ui/time-picker'

import { DateInputBase } from '../form/date-input-base-field'

export type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

export type DateRangePickerBaseProps = {
  align?: 'center' | 'end' | 'start'
  classNames?: {
    button?: string
    wrapper?: string
  }
  compareDateRange?: DateRange
  disabled?: boolean
  enableTime?: boolean
  initialCompareFrom?: Date | string
  initialCompareTo?: Date | string
  initialDateFrom?: Date | string
  initialDateTo?: Date | string
  onUpdate?: (values: {
    compareFrom?: Date | undefined
    compareTo?: Date | undefined
    dateFrom: Date | undefined
    dateTo: Date | undefined
  }) => void
  placeholder?: string
  showCompare?: boolean
  timeClearable?: boolean
  timePlaceholder?: string
  timeShowNowButton?: boolean
  timeWithSeconds?: boolean
  value?: DateRange | null
}

export const DateRangePicker: React.FC<DateRangePickerBaseProps> = ({
  align = 'end',
  classNames,
  compareDateRange,
  disabled,
  enableTime = false,
  initialCompareFrom,
  initialCompareTo,
  initialDateFrom,
  initialDateTo,
  onUpdate,
  placeholder,
  showCompare = false,
  timeClearable = true,
  timePlaceholder,
  timeShowNowButton = true,
  timeWithSeconds = false,
  value
}) => {
  const t = useTranslations('components.ui.dateRangePicker')
  const resolvedPlaceholder = placeholder ?? t('placeholder')
  const resolvedTimePlaceholder = timePlaceholder ?? t('timePlaceholder')
  const presetRanges = React.useMemo(
    () => [
      {
        id: 'today',
        label: t('presets.today'),
        value: { from: startOfDay(new Date()), to: startOfDay(new Date()) }
      },
      {
        id: 'yesterday',
        label: t('presets.yesterday'),
        value: {
          from: startOfDay(addDays(new Date(), -1)),
          to: startOfDay(addDays(new Date(), -1))
        }
      },
      {
        id: 'last7Days',
        label: t('presets.last7Days'),
        value: {
          from: startOfDay(addDays(new Date(), -7)),
          to: startOfDay(new Date())
        }
      },
      {
        id: 'last30Days',
        label: t('presets.last30Days'),
        value: {
          from: startOfDay(addDays(new Date(), -30)),
          to: startOfDay(new Date())
        }
      },
      {
        id: 'thisMonth',
        label: t('presets.thisMonth'),
        value: {
          from: startOfDay(
            new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          ),
          to: startOfDay(new Date())
        }
      },
      {
        id: 'lastMonth',
        label: t('presets.lastMonth'),
        value: {
          from: startOfDay(
            new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
          ),
          to: startOfDay(
            new Date(new Date().getFullYear(), new Date().getMonth(), 0)
          )
        }
      }
    ],
    [t]
  )
  const [open, setOpen] = React.useState(false)
  const [dateRange, setDateRange] = React.useState<DateRange>(() => {
    if (value) return value
    return {
      from: initialDateFrom
        ? typeof initialDateFrom === 'string'
          ? new Date(initialDateFrom)
          : initialDateFrom
        : undefined,
      to: initialDateTo
        ? typeof initialDateTo === 'string'
          ? new Date(initialDateTo)
          : initialDateTo
        : undefined
    }
  })
  const [compareRange, setCompareRange] = React.useState<DateRange>(
    compareDateRange || {
      from: initialCompareFrom
        ? typeof initialCompareFrom === 'string'
          ? new Date(initialCompareFrom)
          : initialCompareFrom
        : undefined,
      to: initialCompareTo
        ? typeof initialCompareTo === 'string'
          ? new Date(initialCompareTo)
          : initialCompareTo
        : undefined
    }
  )

  // Helper to normalize time format (HH:mm:ss or HH:mm based on timeWithSeconds)
  const normalizeTimeFormat = (
    timeStr: string,
    includeSeconds: boolean
  ): string => {
    const parts = timeStr.split(':')
    if (includeSeconds) {
      // Ensure HH:mm:ss format
      if (parts.length === 2) return `${timeStr}:00`
      if (parts.length === 3) return timeStr
      return `${timeStr}:00:00` // Fallback for unexpected formats
    } else {
      // Ensure HH:mm format (no seconds)
      return parts.slice(0, 2).join(':')
    }
  }

  // Time state (HH:mm:ss format)
  const [fromTime, setFromTime] = React.useState<null | string>(() => {
    if (!enableTime || !dateRange.from) return null
    try {
      const formatted = formatDate(dateRange.from, {
        dateFormat: 'yyyy-MM-dd',
        disableRelativeFormatting: true,
        fallback: '-',
        formatTime: 'HH:mm:ss'
      })
      if (formatted.time === '-') return null
      return normalizeTimeFormat(formatted.time, timeWithSeconds)
    } catch {
      return null
    }
  })
  const [toTime, setToTime] = React.useState<null | string>(() => {
    if (!enableTime || !dateRange.to) return null
    try {
      const formatted = formatDate(dateRange.to, {
        dateFormat: 'yyyy-MM-dd',
        disableRelativeFormatting: true,
        fallback: '-',
        formatTime: 'HH:mm:ss'
      })
      if (formatted.time === '-') return null
      return normalizeTimeFormat(formatted.time, timeWithSeconds)
    } catch {
      return null
    }
  })

  React.useEffect(() => {
    if (value) {
      setDateRange(value)
      if (enableTime) {
        // Update time state from value
        if (value.from) {
          try {
            const formatted = formatDate(value.from, {
              dateFormat: 'yyyy-MM-dd',
              disableRelativeFormatting: true,
              fallback: '-',
              formatTime: 'HH:mm:ss'
            })
            if (formatted.time !== '-') {
              setFromTime(normalizeTimeFormat(formatted.time, timeWithSeconds))
            }
          } catch {
            // Ignore
          }
        }
        if (value.to) {
          try {
            const formatted = formatDate(value.to, {
              dateFormat: 'yyyy-MM-dd',
              disableRelativeFormatting: true,
              fallback: '-',
              formatTime: 'HH:mm:ss'
            })
            if (formatted.time !== '-') {
              setToTime(normalizeTimeFormat(formatted.time, timeWithSeconds))
            }
          } catch {
            // Ignore
          }
        }
      } else {
        // Reset time state when enableTime is false
        setFromTime(null)
        setToTime(null)
      }
    }
  }, [value, enableTime, timeWithSeconds])

  React.useEffect(() => {
    if (compareDateRange) {
      setCompareRange(compareDateRange)
    }
  }, [compareDateRange])

  const combineDateAndTime = (
    date: Date | undefined,
    time: null | string
  ): Date | undefined => {
    if (!date) return undefined
    const result = new Date(date)
    if (time) {
      const [hours, minutes, seconds = 0] = time.split(':').map(Number)
      result.setHours(hours, minutes, seconds || 0)
      result.setSeconds(seconds || 0)
    } else {
      result.setHours(0, 0, 0, 0)
    }
    return result
  }

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range)
    const dateFrom = enableTime
      ? combineDateAndTime(range.from, fromTime)
      : range.from
    const dateTo = enableTime ? combineDateAndTime(range.to, toTime) : range.to
    onUpdate?.({
      compareFrom: showCompare ? compareRange.from : undefined,
      compareTo: showCompare ? compareRange.to : undefined,
      dateFrom,
      dateTo
    })
  }

  const handleFromTimeChange = (time: null | string) => {
    setFromTime(time)
    const dateFrom = combineDateAndTime(dateRange.from, time)
    onUpdate?.({
      compareFrom: showCompare ? compareRange.from : undefined,
      compareTo: showCompare ? compareRange.to : undefined,
      dateFrom,
      dateTo: enableTime
        ? combineDateAndTime(dateRange.to, toTime)
        : dateRange.to
    })
  }

  const handleToTimeChange = (time: null | string) => {
    setToTime(time)
    const dateTo = combineDateAndTime(dateRange.to, time)
    onUpdate?.({
      compareFrom: showCompare ? compareRange.from : undefined,
      compareTo: showCompare ? compareRange.to : undefined,
      dateFrom: enableTime
        ? combineDateAndTime(dateRange.from, fromTime)
        : dateRange.from,
      dateTo
    })
  }

  const handleCompareRangeChange = (range: DateRange) => {
    setCompareRange(range)
    onUpdate?.({
      compareFrom: range.from,
      compareTo: range.to,
      dateFrom: dateRange.from,
      dateTo: dateRange.to
    })
  }

  const handlePresetSelect = (preset: (typeof presetRanges)[number]) => {
    handleDateRangeChange(preset.value)
  }

  const handleReset = () => {
    const emptyRange: DateRange = { from: undefined, to: undefined }
    setDateRange(emptyRange)
    if (enableTime) {
      setFromTime(null)
      setToTime(null)
    }
    if (showCompare) {
      setCompareRange(emptyRange)
    }
    onUpdate?.({
      compareFrom: showCompare ? undefined : undefined,
      compareTo: showCompare ? undefined : undefined,
      dateFrom: undefined,
      dateTo: undefined
    })
  }

  const hasValue = React.useMemo(() => {
    return (
      dateRange.from !== undefined ||
      dateRange.to !== undefined ||
      (showCompare &&
        (compareRange.from !== undefined || compareRange.to !== undefined))
    )
  }, [dateRange, compareRange, showCompare])

  const displayValue = React.useMemo(() => {
    if (!dateRange.from && !dateRange.to) return resolvedPlaceholder

    if (dateRange.from && dateRange.to) {
      const fromFormatted = formatDate(dateRange.from, {
        dateFormat: 'MMM d, yyyy',
        disableRelativeFormatting: true
      }).date
      const toFormatted = formatDate(dateRange.to, {
        dateFormat: 'MMM d, yyyy',
        disableRelativeFormatting: true
      }).date
      return `${fromFormatted} - ${toFormatted}`
    }

    if (dateRange.from) {
      const fromFormatted = formatDate(dateRange.from, {
        dateFormat: 'MMM d, yyyy',
        disableRelativeFormatting: true
      }).date
      return t('fromDate', { date: fromFormatted })
    }

    return resolvedPlaceholder
  }, [dateRange, resolvedPlaceholder, t])

  return (
    <div className={cn('flex flex-col gap-4', classNames?.wrapper)}>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              'border-input placeholder:text-muted-foreground focus:ring-ring group ring-offset-background focus-visible:border-ring aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive focus-visible:ring-ring bg-background text-accent-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 data-[state=open]:bg-accent h-input inline-flex w-full cursor-pointer items-center justify-between gap-1 rounded-md border px-3 py-2 text-sm leading-(--text-sm--line-height) font-thin whitespace-nowrap shadow-xs shadow-black/5 transition-[color,box-shadow] outline-none focus:ring-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
              classNames?.button
            )}
            disabled={disabled}
            variant="outline"
          >
            <CalendarIcon className="size-4 shrink-0 opacity-60" />
            <span
              className={cn(
                'min-w-0',
                !dateRange.from && !dateRange.to && 'text-muted-foreground'
              )}
            >
              {displayValue}
            </span>
            <ChevronDown className="size-4 shrink-0 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align={align} className="w-auto p-0">
          <div className="p-4">
            <div className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-3">
              <div className="mb-4 flex flex-col gap-2">
                <label className="text-muted-foreground text-xs font-medium">
                  {t('labels.presets')}
                </label>
                <Select
                  onValueChange={(value) => {
                    const preset = presetRanges.find((p) => p.id === value)
                    if (preset) {
                      handlePresetSelect(preset)
                    }
                  }}
                >
                  <SelectTrigger className="h-input rounded-md">
                    <SelectValue placeholder={t('selectPreset')} />
                  </SelectTrigger>
                  <SelectContent>
                    {presetRanges.map((preset) => (
                      <SelectItem key={preset.id} value={preset.id}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  className="h-input rounded-md"
                  disabled={!hasValue || disabled}
                  onClick={handleReset}
                  size="sm"
                  variant="outline"
                >
                  {t('reset')}
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-muted-foreground text-xs font-medium">
                  {t('labels.from')}
                </label>
                <DateInputBase
                  onChange={(date) => {
                    const newRange = { ...dateRange, from: date }
                    if (date && dateRange.to && isAfter(date, dateRange.to)) {
                      newRange.to = date
                    }
                    handleDateRangeChange(newRange)
                  }}
                  value={dateRange.from}
                />
                {enableTime && (
                  <TimePicker
                    clearable={timeClearable}
                    disabled={disabled}
                    onTimeChange={handleFromTimeChange}
                    placeholder={resolvedTimePlaceholder}
                    showNowButton={timeShowNowButton}
                    time={fromTime}
                    timeWithSeconds={timeWithSeconds}
                  />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-muted-foreground text-xs font-medium">
                  {t('labels.to')}
                </label>
                <DateInputBase
                  onChange={(date) => {
                    const newRange = { ...dateRange, to: date }
                    if (
                      date &&
                      dateRange.from &&
                      isBefore(date, dateRange.from)
                    ) {
                      newRange.from = date
                    }
                    handleDateRangeChange(newRange)
                  }}
                  value={dateRange.to}
                />
                {enableTime && (
                  <TimePicker
                    clearable={timeClearable}
                    disabled={disabled}
                    onTimeChange={handleToTimeChange}
                    placeholder={resolvedTimePlaceholder}
                    showNowButton={timeShowNowButton}
                    time={toTime}
                    timeWithSeconds={timeWithSeconds}
                  />
                )}
              </div>
            </div>

            <Calendar
              captionLayout="dropdown"
              defaultMonth={dateRange.from || new Date()}
              disabled={(date) => {
                if (disabled) return true
                if (dateRange.from && !dateRange.to) {
                  return isBefore(date, dateRange.from)
                }
                return false
              }}
              mode="range"
              numberOfMonths={2}
              onSelect={(range) => {
                if (range?.from && range?.to) {
                  handleDateRangeChange({ from: range.from, to: range.to })
                } else if (range?.from) {
                  setDateRange({ from: range.from, to: undefined })
                }
              }}
              selected={dateRange}
            />

            {showCompare && (
              <div className="mt-4 border-t pt-4">
                <div className="mb-2 text-sm font-medium">{t('compareTo')}</div>
                <div className="mb-4 flex gap-2">
                  <div className="flex flex-col gap-2">
                    <label className="text-muted-foreground text-xs font-medium">
                      {t('labels.from')}
                    </label>
                    <DateInputBase
                      onChange={(date) => {
                        const newRange = { ...compareRange, from: date }
                        if (
                          date &&
                          compareRange.to &&
                          isAfter(date, compareRange.to)
                        ) {
                          newRange.to = date
                        }
                        handleCompareRangeChange(newRange)
                      }}
                      value={compareRange.from}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-muted-foreground text-xs font-medium">
                      {t('labels.to')}
                    </label>
                    <DateInputBase
                      onChange={(date) => {
                        const newRange = { ...compareRange, to: date }
                        if (
                          date &&
                          compareRange.from &&
                          isBefore(date, compareRange.from)
                        ) {
                          newRange.from = date
                        }
                        handleCompareRangeChange(newRange)
                      }}
                      value={compareRange.to}
                    />
                  </div>
                </div>
                <Calendar
                  captionLayout="dropdown"
                  defaultMonth={compareRange.from || new Date()}
                  mode="range"
                  numberOfMonths={2}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      handleCompareRangeChange({
                        from: range.from,
                        to: range.to
                      })
                    } else if (range?.from) {
                      setCompareRange({ from: range.from, to: undefined })
                    }
                  }}
                  selected={compareRange}
                />
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
