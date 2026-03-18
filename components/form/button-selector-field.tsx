'use client'

import { ReactNode } from 'react'

import { Check } from 'lucide-react'

import { cn } from '@/utils'

import { useFieldContext } from '@/components/form'
import {
  FieldWrapper,
  FieldWrapperClassNames
} from '@/components/form/field-wrapper'

export interface ButtonSelectorOption {
  icon?: ((selected: boolean) => ReactNode) | ReactNode
  label: string
  subtext?: string
  value: string
}

interface ButtonSelectorProps {
  classNames?: FieldWrapperClassNames & { buttonSelector?: string }
  disabled?: boolean
  error?: string
  id?: string
  label?: string
  multiple?: boolean
  onChange?: (value: string | string[]) => void
  options: ButtonSelectorOption[]
  required?: boolean
  value?: string | string[]
}

export function ButtonSelector({
  classNames,
  disabled = false,
  error,
  id,
  label,
  multiple = false,
  onChange: onChangeProp,
  options,
  required,
  value: valueProp
}: ButtonSelectorProps) {
  const field = useFieldContext<string | string[]>()
  const value = valueProp ?? field.state.value
  const onChange = onChangeProp ?? field.handleChange

  const isSelected = (optionValue: string) => {
    if (multiple && Array.isArray(value)) {
      return value.includes(optionValue)
    }
    return value === optionValue
  }

  const handleClick = (optionValue: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : []
      if (currentValues.includes(optionValue)) {
        // Remove if already selected
        const newValues = currentValues.filter((v) => v !== optionValue)
        onChange(newValues)
      } else {
        // Add if not selected
        onChange([...currentValues, optionValue])
      }
    } else {
      // Single selection
      onChange(optionValue)
    }
  }

  const labelId = id ? `${id}-label` : undefined
  const errorId = id ? `${id}-error` : undefined

  return (
    <FieldWrapper
      classNames={classNames}
      field={field}
      label={label}
      required={required}
    >
      <div
        aria-describedby={error ? errorId : undefined}
        aria-labelledby={labelId}
        className={cn(
          'flex w-full gap-4 border-none!',
          classNames?.buttonSelector
        )}
        role="group"
      >
        {options.map((option) => {
          const selected = isSelected(option.value)
          return (
            <button
              aria-pressed={selected}
              className={cn(
                'h-input flex flex-1 cursor-pointer items-center justify-between gap-3 rounded-lg border px-4 py-3 transition-colors',
                selected
                  ? 'border-secondary-foreground/60 bg-background border-2'
                  : 'border-border hover:border-muted-foreground'
              )}
              disabled={disabled}
              key={option.value}
              onClick={() => handleClick(option.value)}
              type="button"
            >
              <span className="flex items-center gap-2 text-sm font-medium">
                {typeof option.icon === 'function'
                  ? option.icon(selected)
                  : option.icon}
                {option.label}
              </span>
              <div className="flex items-center gap-2">
                {selected && !option.subtext && (
                  <Check className="text-secondary-foreground h-4 w-4" />
                )}
                {option.subtext && (
                  <span className="text-muted-foreground text-sm">
                    {option.subtext}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </FieldWrapper>
  )
}
