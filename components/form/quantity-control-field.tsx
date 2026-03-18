'use client'

import * as React from 'react'

import { MinusIcon, PlusIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn, isFieldInvalid } from '@/utils'

import {
  FieldWrapper,
  type FieldWrapperClassNames
} from '@/components/form/field-wrapper'
import { useFieldContext } from '@/components/form/form'
import { Button } from '@/components/ui/button'

export type QuantityControlProps = {
  classNames?: FieldWrapperClassNames
  compact?: boolean
  disabled?: boolean
  label?: string
  max?: number
  min?: number
  required?: boolean
}

export const QuantityControl: React.FC<QuantityControlProps> = ({
  classNames,
  compact = false,
  disabled = false,
  label,
  max,
  min = 1,
  required
}) => {
  const t = useTranslations('components.form.quantityControl')
  const field = useFieldContext<number | string>()
  const resolvedLabel = label || t('label')

  const currentValue = React.useMemo(() => {
    const value = field.state.value
    if (value === null || value === undefined || value === '') return min
    return typeof value === 'number' ? value : Number(value)
  }, [field.state.value, min])

  const handleDecrease = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      if (currentValue > min) {
        field.handleChange(currentValue - 1)
      }
    },
    [currentValue, field, min]
  )

  const handleIncrease = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      if (!max || currentValue < max) {
        field.handleChange(currentValue + 1)
      }
    },
    [currentValue, field, max]
  )

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (value === '') {
        field.handleChange(min)
        return
      }
      const numValue = Number(value)
      if (!isNaN(numValue) && numValue >= min && (!max || numValue <= max)) {
        field.handleChange(numValue)
      }
    },
    [field, min, max]
  )

  // Determine sizing based on compact mode
  const buttonHeight = compact ? 'h-7' : 'h-12'
  const buttonWidth = compact ? 'w-7' : 'w-12'
  const inputHeight = compact ? 'h-7' : 'h-12'
  const inputWidth = compact ? 'w-10' : 'w-16'
  const iconSize = compact ? 'h-3.5 w-3.5' : 'h-4 w-4'
  const fontSize = compact ? 'text-sm' : 'text-base'

  const controlContent = (
    <div className="flex items-center gap-2">
      <div className="bg-background flex items-center justify-between gap-1 rounded-md border">
        <Button
          className={cn(
            'hover:bg-muted shrink-0 rounded-r-none border-0 p-0',
            buttonHeight,
            buttonWidth
          )}
          disabled={disabled || currentValue <= min}
          onClick={handleDecrease}
          size="icon"
          type="button"
          variant="ghost"
        >
          <MinusIcon className={iconSize} />
        </Button>
        <input
          className={cn(
            'border-0 bg-transparent text-center focus:ring-0 focus:outline-none',
            inputHeight,
            inputWidth,
            fontSize,
            isFieldInvalid(field) && 'text-destructive'
          )}
          disabled={disabled}
          max={max}
          min={min}
          name={field.name}
          onBlur={field.handleBlur}
          onChange={handleChange}
          type="number"
          value={currentValue}
        />
        <Button
          className={cn(
            'hover:bg-muted shrink-0 rounded-l-none border-0 p-0',
            buttonHeight,
            buttonWidth
          )}
          disabled={disabled || (!!max && currentValue >= max)}
          onClick={handleIncrease}
          size="icon"
          type="button"
          variant="ghost"
        >
          <PlusIcon className={iconSize} />
        </Button>
      </div>
      {isFieldInvalid(field) && (
        <span className="text-destructive text-[10px] leading-none">
          {typeof field.state.meta.errors?.[0] === 'string'
            ? field.state.meta.errors[0]
            : typeof Object.values(field.state.meta.errorMap || {})[0] ===
                'string'
              ? (Object.values(field.state.meta.errorMap || {})[0] as string)
              : t('invalid')}
        </span>
      )}
    </div>
  )

  // If compact mode, render without wrapper
  if (compact) {
    return controlContent
  }

  // Otherwise, render with FieldWrapper for proper label and layout
  return (
    <FieldWrapper
      classNames={classNames}
      field={field}
      label={resolvedLabel}
      required={required}
    >
      {controlContent}
    </FieldWrapper>
  )
}
