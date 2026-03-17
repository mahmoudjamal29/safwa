'use client'

import * as React from 'react'

import { addDays, format, startOfDay } from 'date-fns'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'


export type DateRange = {
  from: Date | undefined
  to: Date | undefined
}

export type DateRangePickerProps = {
  align?: 'center' | 'end' | 'start'
  classNames?: {
    button?: string
    wrapper?: string
  }
  disabled?: boolean
  initialDateFrom?: Date | string
  initialDateTo?: Date | string
  onUpdate?: (values: {
    dateFrom: Date | undefined
    dateTo: Date | undefined
  }) => void
  placeholder?: string
  value?: DateRange | null
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  align = 'end',
  classNames,
  disabled,
  initialDateFrom,
  initialDateTo,
  onUpdate,
  placeholder,
  value
}) => {
  const t = useTranslations('components.ui.dateRangePicker')
  const resolvedPlaceholder = placeholder ?? t('placeholder')

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

  React.useEffect(() => {
    if (value) {
      setDateRange(value)
    }
  }, [value])

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range)
    onUpdate?.({ dateFrom: range.from, dateTo: range.to })
  }

  const handlePresetSelect = (preset: (typeof presetRanges)[number]) => {
    handleDateRangeChange(preset.value)
  }

  const handleReset = () => {
    const emptyRange: DateRange = { from: undefined, to: undefined }
    setDateRange(emptyRange)
    onUpdate?.({ dateFrom: undefined, dateTo: undefined })
  }

  const hasValue = dateRange.from !== undefined || dateRange.to !== undefined

  const displayValue = React.useMemo(() => {
    if (!dateRange.from && !dateRange.to) return resolvedPlaceholder

    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
    }

    if (dateRange.from) {
      return t('fromDate', { date: format(dateRange.from, 'MMM d, yyyy') })
    }

    return resolvedPlaceholder
  }, [dateRange, resolvedPlaceholder, t])

  return (
    <div className={cn('flex flex-col gap-4', classNames?.wrapper)}>
      <Popover onOpenChange={setOpen} open={open}>
        <PopoverTrigger asChild>
          <Button
            className={cn(
              'border-input placeholder:text-muted-foreground bg-background text-accent-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 data-[state=open]:bg-accent inline-flex w-full cursor-pointer items-center justify-between gap-1 rounded-md border px-3 py-2 text-sm font-thin whitespace-nowrap shadow-xs shadow-black/5 transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60',
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
            <div className="mb-4 flex items-center gap-2">
              <Select
                onValueChange={(value) => {
                  const preset = presetRanges.find((p) => p.id === value)
                  if (preset) {
                    handlePresetSelect(preset)
                  }
                }}
              >
                <SelectTrigger className="h-9 rounded-md">
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
                className="h-9 rounded-md"
                disabled={!hasValue || disabled}
                onClick={handleReset}
                size="sm"
                variant="outline"
              >
                {t('reset')}
              </Button>
            </div>

            <Calendar
              captionLayout="dropdown"
              defaultMonth={dateRange.from || new Date()}
              disabled={disabled}
              endMonth={new Date(new Date().getFullYear() + 2, 11)}
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
              startMonth={new Date(2020, 0)}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
