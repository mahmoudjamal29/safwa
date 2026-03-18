'use client'

import { useTranslations } from 'next-intl'

import { cn } from '@/utils'

import { Label } from '@/components/ui/label'

import { useFieldContext } from './form'
import { FieldInfo } from './info-field'

interface DaysOfWeekSelectorProps {
  className?: string
  label?: string
}

export const DaysOfWeekSelector = ({
  className,
  label
}: DaysOfWeekSelectorProps) => {
  const t = useTranslations('components.form.daysOfWeek')
  const field = useFieldContext<string[]>()
  const routineDays = [
    { label: t('sat'), value: '1' },
    { label: t('sun'), value: '2' },
    { label: t('mon'), value: '3' },
    { label: t('tue'), value: '4' },
    { label: t('wed'), value: '5' },
    { label: t('thu'), value: '6' },
    { label: t('fri'), value: '7' }
  ]

  const selectedDays = (field.state.value as string[]) ?? []

  const toggleDay = (dayValue: string) => {
    const currentDays = [...selectedDays]
    const dayIndex = currentDays.indexOf(dayValue)

    if (dayIndex > -1) {
      // Remove if already selected
      currentDays.splice(dayIndex, 1)
    } else {
      // Add if not selected
      currentDays.push(dayValue)
    }

    field.handleChange(currentDays)
  }

  return (
    <div className="flex flex-col gap-1 lg:flex-row lg:items-center">
      {label ? (
        <Label className="w-full shrink-0 lg:w-1/6" htmlFor={field.name}>
          {label}
        </Label>
      ) : null}
      <div className={cn('flex flex-1 flex-col gap-2', className)}>
        <div
          className="border-input bg-background/80 flex flex-wrap gap-2 p-2.5"
          id={field.name}
        >
          {routineDays.map((day) => {
            const isSelected = selectedDays.includes(day.value)
            return (
              <button
                className={cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  'hover:opacity-80 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none',
                  isSelected
                    ? 'bg-muted text-muted-foreground'
                    : 'border-input bg-background text-muted-foreground/80 border'
                )}
                key={day.value}
                onClick={() => toggleDay(day.value)}
                type="button"
              >
                {day.label}
              </button>
            )
          })}
        </div>
        <FieldInfo field={field} />
      </div>
    </div>
  )
}
