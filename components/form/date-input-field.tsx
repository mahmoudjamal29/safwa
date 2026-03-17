'use client'

import { useEffect, useMemo, useState } from 'react'

import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/utils'

import { FieldWrapper } from '@/components/form/field-wrapper'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger
} from '@/components/ui/select'

import { useFieldContext } from './form'
import { FieldInfo } from './info-field'

export interface DateInputProps {
  className?: string
  disabled?: boolean
  endYear?: number
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  label?: string
  required?: boolean
  startYear?: number
}

function formatToYMD(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export const DateInput: React.FC<DateInputProps> = ({
  className,
  disabled,
  endYear = 2100,
  icon,
  iconPosition = 'right',
  label,
  required,
  startYear = 1950
}) => {
  const field = useFieldContext<null | string | undefined>()

  const parsedDate = useMemo(() => {
    if (field.state.value) {
      // Handle YYYY-MM-DD format to avoid timezone issues
      if (
        typeof field.state.value === 'string' &&
        /^\d{4}-\d{2}-\d{2}$/.test(field.state.value)
      ) {
        const [year, month, day] = field.state.value.split('-').map(Number)
        const d = new Date(year, month - 1, day)
        if (!isNaN(d.getTime())) return d
      }
      // Fallback to standard Date parsing for other formats
      const d = new Date(field.state.value)
      if (!isNaN(d.getTime())) return d
    }
    return null
  }, [field.state.value])

  const [selected, setSelected] = useState<Date | null>(parsedDate)
  const [error, setError] = useState<null | string>(null)

  useEffect(() => {
    setSelected(parsedDate)
  }, [parsedDate])

  const months = [
    '01 - January',
    '02 - February',
    '03 - March',
    '04 - April',
    '05 - May',
    '06 - June',
    '07 - July',
    '08 - August',
    '09 - September',
    '10 - October',
    '11 - November',
    '12 - December'
  ]

  const years = useMemo(
    () =>
      Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
    [startYear, endYear]
  )

  // Calculate the number of days in the selected month/year
  const daysInMonth = useMemo(() => {
    if (!selected) {
      return 31 // Default to 31 if no date selected
    }
    const year = selected.getFullYear()
    const month = selected.getMonth()
    return new Date(year, month + 1, 0).getDate()
  }, [selected])

  const commit = (date: Date) => {
    setSelected(date)
    setError(null)
    field.handleChange(formatToYMD(date))
  }

  const handleDayChange = (day: string) => {
    if (!selected) {
      // If no date is selected, create a new date with current year/month and selected day
      const now = new Date()
      const newDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        parseInt(day, 10)
      )
      commit(newDate)
      return
    }

    const year = selected.getFullYear()
    const month = selected.getMonth()
    const newDate = new Date(year, month, parseInt(day, 10))
    commit(newDate)
  }

  const handleMonthChange = (monthIndexString: string) => {
    if (!selected) {
      // If no date is selected, create a new date with current year, selected month, and day 1
      const now = new Date()
      const monthIndex = parseInt(monthIndexString, 10)
      const newDate = new Date(now.getFullYear(), monthIndex, 1)
      commit(newDate)
      return
    }

    const year = selected.getFullYear()
    const day = selected.getDate()
    const monthIndex = parseInt(monthIndexString, 10)

    // Get max days in the new month
    const maxDaysInNewMonth = new Date(year, monthIndex + 1, 0).getDate()
    // Clamp day to max days in month to avoid invalid dates
    const clampedDay = Math.min(day, maxDaysInNewMonth)

    const newDate = new Date(year, monthIndex, clampedDay)
    commit(newDate)
  }

  const handleYearChange = (year: string) => {
    if (!selected) {
      // If no date is selected, create a new date with selected year, current month, and day 1
      const now = new Date()
      const y = parseInt(year, 10)
      const newDate = new Date(y, now.getMonth(), 1)
      commit(newDate)
      return
    }

    const month = selected.getMonth()
    const day = selected.getDate()
    const y = parseInt(year, 10)

    // Get max days in the month for the new year (handles leap years)
    const maxDaysInMonth = new Date(y, month + 1, 0).getDate()
    const clampedDay = Math.min(day, maxDaysInMonth)

    const newDate = new Date(y, month, clampedDay)
    commit(newDate)
  }

  const segmentTrigger =
    'bg-transparent border-0 shadow-none h-10 px-0 data-[state=open]:ring-0 data-[state=open]:ring-offset-0 focus:outline-0'

  return (
    <FieldWrapper field={field} label={label} required={required}>
      <div
        className={cn(
          'border-input bg-card h-input relative flex items-center justify-between rounded-xl border !px-3.5 !py-2 shadow-xs shadow-black/5',
          disabled && 'opacity-50'
        )}
      >
        <div className="flex items-center gap-2">
          {/* Day */}
          <Select
            disabled={disabled}
            onValueChange={handleDayChange}
            value={selected ? String(selected.getDate()) : ''}
          >
            <SelectTrigger className={segmentTrigger}>
              {selected ? String(selected.getDate()).padStart(2, '0') : 'DD'}
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-48">
                {Array.from({ length: daysInMonth }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
          <span className="text-muted-foreground/70">/</span>

          {/* Month */}
          <Select
            disabled={disabled}
            onValueChange={handleMonthChange}
            value={selected ? String(selected.getMonth()) : ''}
          >
            <SelectTrigger className={segmentTrigger}>
              {selected
                ? String(selected.getMonth() + 1).padStart(2, '0')
                : 'MM'}
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-48">
                {months.map((month, index) => (
                  <SelectItem key={index} value={String(index)}>
                    {month}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
          <span className="text-muted-foreground/70">/</span>

          {/* Year */}
          <Select
            disabled={disabled}
            onValueChange={handleYearChange}
            value={selected ? String(selected.getFullYear()) : ''}
          >
            <SelectTrigger className={segmentTrigger}>
              {selected ? selected.getFullYear() : 'YYYY'}
            </SelectTrigger>
            <SelectContent>
              <ScrollArea className="h-48">
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </ScrollArea>
            </SelectContent>
          </Select>
        </div>
        {icon ? (
          <div
            className={cn(
              'pointer-events-none absolute end-3 top-1/2 -translate-y-1/2'
            )}
          >
            {icon}
          </div>
        ) : (
          <CalendarIcon
            className={cn(
              'text-muted-foreground pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2'
            )}
          />
        )}
      </div>

      <FieldInfo field={field} />
    </FieldWrapper>
  )
}

export default DateInput
