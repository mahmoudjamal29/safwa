'use client'

import * as React from 'react'

import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/utils'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'

export type DateFilterProps = {
  disabled?: boolean
  label?: string
  locale?: string
  onChange: (value: null | string) => void
  placeholder?: string
  value: null | string
}

export const DateFilter: React.FC<DateFilterProps> = ({
  disabled,
  label,
  locale = 'en-US',
  onChange,
  placeholder,
  value
}) => {
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

  const displayText = React.useMemo(() => {
    if (!selectedDate) return placeholder || label || ''
    return format(selectedDate, 'MMM d, yyyy')
  }, [selectedDate, placeholder, label])

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      onChange(null)
      setOpen(false)
      return
    }
    // Format as YYYY-MM-DD
    const dateStr = format(date, 'yyyy-MM-dd')
    onChange(dateStr)
    setOpen(false)
  }

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild>
        <Button
          className="bg-card text-card-foreground max-w-fit border"
          disabled={disabled}
          variant="outline"
        >
          <span
            className={cn('min-w-0', !selectedDate && 'text-muted-foreground')}
          >
            {displayText}
          </span>
          <CalendarIcon className="ms-2 size-4 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-0">
        <Calendar
          captionLayout="dropdown"
          disabled={disabled}
          locale={locale as never}
          mode="single"
          onSelect={handleDateSelect}
          selected={selectedDate}
        />
      </PopoverContent>
    </Popover>
  )
}
