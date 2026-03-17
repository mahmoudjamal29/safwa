import { useCallback, useMemo } from 'react'

import { cva, VariantProps } from 'class-variance-authority'
import { CheckIcon } from '@/lib/icons'

import { cn } from '@/utils'

import {
  FieldWrapper,
  FieldWrapperProps
} from '@/components/form/field-wrapper'

import { Checkbox as BaseCheckbox } from '../ui/checkbox'
import { useFieldContext } from './form'

const checkboxWrapperVariants = cva('flex-row', {
  compoundVariants: [
    {
      checked: true,
      class: ' text-foreground',
      variant: 'button'
    }
  ],
  defaultVariants: {
    variant: 'default'
  },
  variants: {
    checked: {
      false: '',
      true: ''
    },
    variant: {
      button:
        'border px-4 h-input flex items-center justify-between rounded-md flex-1 cursor-pointer text-sm',
      default: ''
    }
  }
})

export type CheckboxGroupOption = {
  checkAll?: boolean
  label: string
  value: string
}

export type CheckboxGroupProps = Pick<FieldWrapperProps, 'classNames'> &
  VariantProps<typeof checkboxWrapperVariants> & {
    label?: string
    options: CheckboxGroupOption[]
    orientation?: 'horizontal' | 'vertical'
  }

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  classNames,
  label,
  options,
  orientation = 'horizontal',
  variant = 'button'
}) => {
  const field = useFieldContext<string[]>()

  const currentValue = field.state.value || []
  const checkAllOption = useMemo(
    () => options.find((option) => option.checkAll),
    [options]
  )
  const checkAllValue = checkAllOption?.value
  const nonCheckAllValues = useMemo(
    () =>
      options
        .filter((option) => !option.checkAll)
        .map((option) => option.value),
    [options]
  )
  const areAllOptionsChecked =
    nonCheckAllValues.length > 0 &&
    nonCheckAllValues.every((value) => currentValue.includes(value))

  const handleOptionChange = useCallback(
    (option: CheckboxGroupOption, checked: boolean) => {
      const current = field.state.value || []
      const optionValue = option.value
      const isCheckAll = option.checkAll

      const isCurrentlyChecked = current.includes(optionValue)

      // Prevent unnecessary updates if state is already correct
      if (checked === isCurrentlyChecked) {
        return
      }

      const nextValues = (() => {
        if (isCheckAll) {
          if (checked) {
            const allValues = checkAllValue
              ? [...nonCheckAllValues, checkAllValue]
              : [...nonCheckAllValues]
            return Array.from(new Set(allValues))
          }

          return current.filter(
            (value) =>
              value !== checkAllValue && !nonCheckAllValues.includes(value)
          )
        }

        if (checked) {
          return Array.from(new Set([optionValue, ...current]))
        }

        return current.filter((value) => value !== optionValue)
      })()

      if (!checkAllValue) {
        field.handleChange(nextValues)
        return
      }

      const shouldCheckAll =
        nonCheckAllValues.length > 0 &&
        nonCheckAllValues.every((value) => nextValues.includes(value))

      if (shouldCheckAll) {
        field.handleChange(
          nextValues.includes(checkAllValue)
            ? nextValues
            : [...nextValues, checkAllValue]
        )
        return
      }

      if (nextValues.includes(checkAllValue)) {
        field.handleChange(
          nextValues.filter((value) => value !== checkAllValue)
        )
        return
      }

      field.handleChange(nextValues)
    },
    [checkAllValue, field, nonCheckAllValues]
  )

  return (
    <FieldWrapper
      classNames={{
        childrenWrapper: classNames?.childrenWrapper,
        label: classNames?.label,
        wrapper: classNames?.wrapper
      }}
      field={field}
      label={label}
    >
      <div
        className={cn(
          'flex gap-3 border-none',
          orientation === 'vertical' && 'flex-col',
          orientation === 'horizontal' && 'flex-row flex-wrap'
        )}
      >
        {options.map((option) => {
          const checked = option.checkAll
            ? areAllOptionsChecked
            : currentValue.includes(option.value)
          return (
            <div
              className={cn(
                checkboxWrapperVariants({
                  checked,
                  variant
                }),
                classNames?.wrapper,
                'max-w-60 min-w-50'
              )}
              key={option.value}
              onClick={
                variant === 'button'
                  ? (e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleOptionChange(option, !checked)
                    }
                  : undefined
              }
            >
              {option.label && (
                <span className="flex-1 cursor-pointer select-none">
                  {option.label}
                </span>
              )}
              {variant === 'button' ? (
                <div
                  className={cn(
                    'border-input bg-background flex size-5 shrink-0 items-center justify-center rounded-sm border',
                    checked &&
                      'bg-primary-foreground border-primary text-primary'
                  )}
                  data-slot="checkbox"
                >
                  {checked && <CheckIcon className="size-3.5" />}
                </div>
              ) : (
                <BaseCheckbox
                  checked={checked}
                  data-slot="checkbox"
                  name={`${field.name}-${option.value}`}
                  onCheckedChange={(newChecked) => {
                    handleOptionChange(option, newChecked === true)
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </FieldWrapper>
  )
}
