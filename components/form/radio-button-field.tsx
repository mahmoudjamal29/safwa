import { cn } from '@/utils'

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { useFieldContext } from './form'

export type RadioButtonProps = React.ComponentProps<typeof RadioGroupItem> & {
  danger?: boolean
  disabled?: boolean
  label?: string
  labelClassName?: string
  radioClassName?: string
  value: string
  wrapperClassName?: string
}

export const RadioButton = ({
  danger,
  label,
  radioClassName = '',
  value,
  wrapperClassName = '',
  ...props
}: RadioButtonProps) => {
  const field = useFieldContext<string | undefined>()

  return (
    <div className={cn('flex items-center gap-3', wrapperClassName)}>
      <RadioGroup
        className="grid gap-2"
        onValueChange={(val) => field.handleChange(val)}
        value={field.state.value}
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem
            aria-invalid={!field.state.meta.isValid || undefined}
            className={cn(
              radioClassName,
              danger && 'data-[state=checked]:bg-destructive'
            )}
            id={`${field.name}-${value}`}
            value={value}
            {...props}
          />
          {label && (
            <label
              className={cn('text-sm', props.labelClassName)}
              htmlFor={`${field.name}-${value}`}
            >
              {label}
            </label>
          )}
        </div>
      </RadioGroup>
    </div>
  )
}
