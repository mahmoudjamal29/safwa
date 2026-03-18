import { type MouseEvent, type ReactNode } from 'react'

import { CircleCheckIcon, CircleIcon } from 'lucide-react'

import { cn } from '@/utils'

import { Button as BaseButton } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

import { useFieldContext } from './form'
import { FieldInfo } from './info-field'

export type ButtonProps<Value = unknown> = Omit<
  React.ComponentProps<typeof BaseButton>,
  'value'
> & {
  isActive?: boolean
  value: Value
}

type ButtonGroupProps<T> = {
  buttonsWrapperClassName?: string
  className?: string
  innerClassName?: string
  label?: ReactNode
  labelClassName?: string
  multiSelect?: boolean
  optionLabelKey?: keyof T
  options: T[]
  optionValueKey?: keyof T
  required?: boolean
}

export function Button<Value = unknown>({
  className,
  isActive,
  onClick,
  type,
  value,
  variant,
  ...props
}: ButtonProps<Value>) {
  const field = useFieldContext<Value>()

  const active = isActive ?? Object.is(field.state.value, value)

  return (
    <BaseButton
      aria-pressed={active}
      className={cn(
        'border-default-200 hover:border-primary rounded-sm border px-4 py-2 text-sm transition-colors',
        active && 'border-primary bg-secondary',
        className
      )}
      data-state={active ? 'on' : 'off'}
      onBlur={() => field.handleBlur()}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        field.handleChange(value)
        onClick?.(event)
      }}
      type={type ?? 'button'}
      variant={variant ?? 'outline'}
      {...props}
    />
  )
}

export function ButtonGroup<Option>({
  buttonsWrapperClassName,
  className,
  innerClassName,
  label,
  labelClassName,
  multiSelect = false,
  optionLabelKey,
  options,
  optionValueKey,
  required
}: ButtonGroupProps<Option>) {
  const field = useFieldContext<unknown>()

  const fieldValue = field.state.value
  const selectedValues =
    multiSelect && Array.isArray(fieldValue) ? fieldValue : []

  return (
    <div
      className={cn(
        'flex flex-col gap-1 lg:flex-row lg:items-center',
        className
      )}
    >
      {label ? (
        <Label
          className={cn('w-full shrink-0 lg:w-1/6', labelClassName)}
          htmlFor={field.name}
        >
          {label}
          {required && <span className="ms-1 text-red-500">*</span>}
        </Label>
      ) : null}
      <div className={cn('flex flex-1 flex-col gap-2', innerClassName)}>
        <div className={cn('flex flex-wrap gap-2', buttonsWrapperClassName)}>
          {options.map((option) => {
            const optionValue = (
              optionValueKey ? option[optionValueKey as keyof Option] : option
            ) as unknown

            const isSelected = multiSelect
              ? selectedValues.some((value) => Object.is(value, optionValue))
              : Object.is(fieldValue, optionValue)

            const nextValue = multiSelect
              ? isSelected
                ? selectedValues.filter(
                    (value) => !Object.is(value, optionValue)
                  )
                : [...selectedValues, optionValue]
              : optionValue

            return (
              <Button
                className={cn(isSelected && 'border-primary text-primary')}
                isActive={isSelected}
                key={option[optionValueKey as keyof Option] as string}
                value={nextValue}
              >
                {option[optionLabelKey as keyof Option] as ReactNode}
                {isSelected ? (
                  <CircleCheckIcon className="size-4" />
                ) : (
                  <CircleIcon className="size-4" />
                )}
              </Button>
            )
          })}
        </div>
        <FieldInfo field={field} />
      </div>
    </div>
  )
}
